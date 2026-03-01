import type { FundAllocation, InvestmentAllocation, ContributionSources } from "../types/investment";
import type { Allocation } from "../types/investment";
import { MOCK_FUNDS, getFundById } from "../data/mockFunds";
import type { RiskTolerance } from "../enrollment/types/investmentProfile";

const DEFAULT_PLAN_ALLOCATIONS: Allocation[] = [
  { fundId: "fund-1", percentage: 40 },
  { fundId: "fund-5", percentage: 20 },
  { fundId: "fund-7", percentage: 30 },
  { fundId: "fund-9", percentage: 10 },
];

/** Investment style keys derived from wizard risk tolerance */
export type InvestmentStyleKey = "conservative" | "balanced" | "growth" | "aggressive";

/** Allocations per style (same as previous personality profiles) */
const STYLE_ALLOCATIONS: Record<InvestmentStyleKey, Record<string, number>> = {
  conservative: { "fund-7": 50, "fund-8": 20, "fund-1": 20, "fund-9": 10 },
  balanced: { "fund-1": 40, "fund-5": 20, "fund-7": 30, "fund-9": 10 },
  growth: { "fund-1": 45, "fund-3": 20, "fund-5": 25, "fund-7": 10 },
  aggressive: { "fund-1": 35, "fund-4": 25, "fund-6": 25, "fund-3": 15 },
};

/** Derive investment style from wizard risk tolerance (1–5) */
export function deriveStyleFromRiskScore(riskTolerance: RiskTolerance): InvestmentStyleKey {
  if (riskTolerance <= 1) return "conservative";
  if (riskTolerance <= 2) return "conservative";
  if (riskTolerance <= 3) return "balanced";
  if (riskTolerance <= 4) return "growth";
  return "aggressive";
}

/** Build InvestmentAllocation for all active sources using a given style */
export function buildAllocationFromStyle(
  styleKey: InvestmentStyleKey,
  sources: ContributionSources
): InvestmentAllocation {
  const allocations = STYLE_ALLOCATIONS[styleKey];
  const total = Object.values(allocations).reduce((s, p) => s + p, 0);
  if (total === 0) return buildInitialAllocation(sources);
  const asAllocations: Allocation[] = Object.entries(allocations).map(([fundId, pct]) => ({
    fundId,
    percentage: (pct / total) * 100,
  }));
  const funds = asAllocations.map((a) => allocationToFundAllocation(a));
  const result: InvestmentAllocation = {};
  if ((sources.preTax ?? 0) > 0) result.preTax = { funds: funds.map((f) => ({ ...f })) };
  if ((sources.roth ?? 0) > 0) result.roth = { funds: funds.map((f) => ({ ...f })) };
  if ((sources.afterTax ?? 0) > 0) result.afterTax = { funds: funds.map((f) => ({ ...f })) };
  return result;
}

/** Convert Allocation to FundAllocation using fund data */
export function allocationToFundAllocation(a: Allocation): FundAllocation {
  const fund = getFundById(a.fundId);
  if (!fund) {
    return {
      fundId: a.fundId,
      fundName: a.fundId,
      assetClass: "Unknown",
      expenseRatio: 0,
      riskScore: 0,
      allocationPercent: a.percentage,
    };
  }
  return {
    fundId: fund.id,
    fundName: fund.name,
    assetClass: fund.assetClass,
    expenseRatio: fund.expenseRatio,
    riskScore: fund.riskLevel,
    allocationPercent: a.percentage,
  };
}

/** Clone plan default and normalize to 100% */
export function cloneAndNormalizePlanDefault(): FundAllocation[] {
  const total = DEFAULT_PLAN_ALLOCATIONS.reduce((s, a) => s + a.percentage, 0);
  if (total === 0) return [];
  return DEFAULT_PLAN_ALLOCATIONS.map((a) =>
    allocationToFundAllocation({
      ...a,
      percentage: (a.percentage / total) * 100,
    })
  );
}

/** Build initial investment allocation from contribution sources */
export function buildInitialAllocation(
  sources: ContributionSources
): InvestmentAllocation {
  const result: InvestmentAllocation = {};
  const defaultFunds = cloneAndNormalizePlanDefault();

  if ((sources.preTax ?? 0) > 0) {
    result.preTax = { funds: defaultFunds.map((f) => ({ ...f })) };
  }
  if ((sources.roth ?? 0) > 0) {
    result.roth = { funds: defaultFunds.map((f) => ({ ...f })) };
  }
  if ((sources.afterTax ?? 0) > 0) {
    result.afterTax = { funds: defaultFunds.map((f) => ({ ...f })) };
  }
  return result;
}

/** Get active source keys */
export function getActiveSources(
  sources: ContributionSources
): ("preTax" | "roth" | "afterTax")[] {
  return (["preTax", "roth", "afterTax"] as const).filter(
    (k) => (sources[k] ?? 0) > 0
  );
}

/** Total allocation percent for a source */
export function getSourceTotal(funds: FundAllocation[]): number {
  return funds.reduce((s, f) => s + f.allocationPercent, 0);
}

/** Validate source allocation = 100% */
export function isSourceValid(funds: FundAllocation[]): boolean {
  const total = getSourceTotal(funds);
  return Math.abs(total - 100) < 0.01;
}

/** Normalize allocation to 100% */
export function normalizeFundAllocations(
  funds: FundAllocation[]
): FundAllocation[] {
  const total = getSourceTotal(funds);
  if (total === 0) return funds;
  return funds.map((f) => ({
    ...f,
    allocationPercent: (f.allocationPercent / total) * 100,
  }));
}

/** Redistribute allocation proportionally when removing a fund */
export function redistributeOnRemove(
  funds: FundAllocation[],
  removeFundId: string
): FundAllocation[] {
  const removed = funds.find((f) => f.fundId === removeFundId);
  const rest = funds.filter((f) => f.fundId !== removeFundId);
  if (!removed || rest.length === 0) return rest;
  const removedPct = removed.allocationPercent;
  const extraPer = removedPct / rest.length;
  return rest.map((f) => ({
    ...f,
    allocationPercent: f.allocationPercent + extraPer,
  }));
}

/** FundAllocation[] → Allocation[] for chart (fundId, percentage) */
export function fundAllocationsToChartFormat(
  funds: FundAllocation[]
): { fundId: string; percentage: number }[] {
  return funds.map((f) => ({
    fundId: f.fundId,
    percentage: f.allocationPercent,
  }));
}

/** Weighted allocation across all sources for summary */
export function computeWeightedAllocation(
  allocation: InvestmentAllocation,
  sources: ContributionSources
): {
  funds: FundAllocation[];
  expectedReturn: number;
  totalFees: number;
  riskLevel: number;
  isValid: boolean;
} {
  const activeKeys = getActiveSources(sources);
  const totalSourcePct = activeKeys.reduce(
    (s, k) => s + (sources[k] ?? 0),
    0
  );
  if (totalSourcePct === 0) {
    return {
      funds: [],
      expectedReturn: 0,
      totalFees: 0,
      riskLevel: 0,
      isValid: true,
    };
  }

  const byFundId = new Map<string, FundAllocation>();
  let isValid = true;

  for (const key of activeKeys) {
    const source = allocation[key as keyof InvestmentAllocation];
    if (!source?.funds) continue;
    const sourcePct = (sources[key] ?? 0) / 100;
    if (!isSourceValid(source.funds)) isValid = false;
    for (const f of source.funds) {
      if (f.allocationPercent <= 0) continue;
      const weight = (f.allocationPercent / 100) * sourcePct;
      const existing = byFundId.get(f.fundId);
      if (existing) {
        byFundId.set(f.fundId, {
          ...existing,
          allocationPercent: existing.allocationPercent + weight * 100,
        });
      } else {
        byFundId.set(f.fundId, { ...f, allocationPercent: weight * 100 });
      }
    }
  }

  const aggregated = Array.from(byFundId.values());
  const totalWeight = aggregated.reduce((s, f) => s + f.allocationPercent, 0);
  const norm = totalWeight > 0 ? 100 / totalWeight : 1;
  const normalized = aggregated.map((f) => ({
    ...f,
    allocationPercent: f.allocationPercent * norm,
  }));

  let expectedReturn = 0;
  let totalFees = 0;
  let riskLevel = 0;
  let weightSum = 0;

  for (const f of normalized) {
    if (f.allocationPercent > 0) {
      const fund = MOCK_FUNDS.find((m) => m.id === f.fundId);
      if (fund) {
        const w = f.allocationPercent / 100;
        expectedReturn += w * fund.expectedReturn;
        totalFees += w * fund.expenseRatio;
        riskLevel += w * fund.riskLevel;
        weightSum += w;
      }
    }
  }
  if (weightSum > 0) {
    riskLevel /= weightSum;
  }

  return {
    funds: normalized,
    expectedReturn,
    totalFees,
    riskLevel,
    isValid,
  };
}
