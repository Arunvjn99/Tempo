/**
 * Shared retirement / enrollment projection math — single source of truth for growth, tax assumptions, and balance loops.
 */

import type { RiskLevel } from "@/features/enrollment/store/types";

// ── Assumptions (centralized; was scattered as 1.07, 0.78, inline rates) ──

/** Compound annual return used only by the contribution setup chart (30-year curve). */
export const CONTRIBUTION_CHART_ANNUAL_RETURN = 0.07;

/** Marginal tax assumption for “take-home impact” of pre-tax contributions (22%). */
export const TAX_ASSUMPTION_RATE = 0.22;

/** Portion of contribution felt in net pay after tax (~78%). */
export const NET_PAY_IMPACT_MULTIPLIER = 1 - TAX_ASSUMPTION_RATE;

/** Long-term expected return by risk level (annual, decimal). */
export const GROWTH_RATES: Record<RiskLevel, number> = {
  conservative: 0.045,
  balanced: 0.068,
  growth: 0.082,
  aggressive: 0.095,
};

/** Short marketing horizon for auto-increase comparison cards (years). */
export const AUTO_INCREASE_PROJECTION_HORIZON_YEARS = 10;

const DEFAULT_AUTO_STEP_PERCENT = 1;
const DEFAULT_AUTO_MAX_PERCENT = 15;

export function getGrowthRate(risk: RiskLevel): number {
  return GROWTH_RATES[risk];
}

/** Rough retirement income target as fraction of current salary (readiness heuristic). */
export const RETIREMENT_INCOME_TARGET_RATIO = 0.8;

/** Annual withdrawal rate for estimated retirement income (4% rule). */
export const SAFETY_WITHDRAWAL_ANNUAL_RATE = 0.04;

/**
 * Project balance year-by-year with constant employee + employer annual amounts and flat growth rate.
 * Used by review, readiness suggestions, and auto-increase setup comparisons.
 */
export function projectBalanceConstantAnnualContributions(
  startingBalance: number,
  annualEmployee: number,
  annualEmployer: number,
  years: number,
  growthRate: number,
): number {
  let balance = startingBalance;
  const y = Math.max(0, Math.floor(years));
  for (let i = 0; i < y; i++) {
    balance = (balance + annualEmployee + annualEmployer) * (1 + growthRate);
  }
  return balance;
}

/**
 * Same as {@link projectBalanceConstantAnnualContributions} but with a single combined annual total (review hero).
 */
export function projectBalanceConstantTotalAnnual(
  startingBalance: number,
  totalAnnualContribution: number,
  years: number,
  growthRate: number,
): number {
  let balance = startingBalance;
  const y = Math.max(0, Math.floor(years));
  for (let i = 0; i < y; i++) {
    balance = (balance + totalAnnualContribution) * (1 + growthRate);
  }
  return balance;
}

/**
 * Rows for the contribution step area chart: fixed 7% annual portfolio growth, employer match capped at 6%.
 */
export function generateContributionChartProjectionSeries(
  percent: number,
  salary: number,
  maxYears = 30,
  annualReturn = CONTRIBUTION_CHART_ANNUAL_RETURN,
): Array<{
  year: string;
  value: number;
  contributions: number;
  marketGain: number;
}> {
  const annual = salary * (percent / 100);
  const matchPercent = Math.min(percent, 6);
  const matchAnnual = salary * (matchPercent / 100);
  const data: Array<{
    year: string;
    value: number;
    contributions: number;
    marketGain: number;
  }> = [];
  let total = 0;
  let contributions = 0;
  for (let year = 0; year <= maxYears; year++) {
    const yearlyContribution = annual + matchAnnual;
    contributions += yearlyContribution;
    total = (total + yearlyContribution) * (1 + annualReturn);
    data.push({
      year: `${year}yr`,
      value: Math.round(total),
      contributions: Math.round(contributions),
      marketGain: Math.round(total - contributions),
    });
  }
  return data;
}

/** Estimated monthly paycheck impact after tax (pre-tax contribution reduction). */
export function monthlyTakeHomeImpactFromPreTaxContribution(monthlyContribution: number): number {
  return Math.round(monthlyContribution * NET_PAY_IMPACT_MULTIPLIER);
}

/**
 * Fixed contribution % for every year over a short horizon (auto-increase “skip” card).
 */
export function projectBalanceShortHorizonFixedPercent(
  salary: number,
  contributionPercent: number,
  growthRate: number,
  horizonYears: number,
  startingBalance = 0,
): number {
  let balance = startingBalance;
  const pct = contributionPercent;
  for (let y = 0; y < horizonYears; y++) {
    const contrib = salary * (pct / 100);
    const match = salary * (Math.min(pct, 6) / 100);
    balance = (balance + contrib + match) * (1 + growthRate);
  }
  return Math.round(balance);
}

/**
 * Contribution % increases by `stepPercent` each year up to `maxPercent` (auto-increase “enable” card).
 */
export function projectBalanceShortHorizonWithSteppedPercent(
  salary: number,
  startContributionPercent: number,
  growthRate: number,
  horizonYears: number,
  options?: {
    stepPercent?: number;
    maxPercent?: number;
    startingBalance?: number;
  },
): number {
  const stepPercent = options?.stepPercent ?? DEFAULT_AUTO_STEP_PERCENT;
  const maxPercent = options?.maxPercent ?? DEFAULT_AUTO_MAX_PERCENT;
  let balance = options?.startingBalance ?? 0;
  let pct = startContributionPercent;
  for (let y = 0; y < horizonYears; y++) {
    const contrib = salary * (pct / 100);
    const match = salary * (Math.min(pct, 6) / 100);
    balance = (balance + contrib + match) * (1 + growthRate);
    pct = Math.min(pct + stepPercent, maxPercent);
  }
  return Math.round(balance);
}

/**
 * Full retirement horizon projection with optional per-year auto-increase of contribution %.
 * (Formerly only in `store/derived.ts`.)
 */
export function computeProjectedBalanceWithAutoIncrease(params: {
  salary: number;
  contributionPercent: number;
  currentSavings: number;
  currentAge: number;
  retirementAge: number;
  growthRate: number;
  autoIncrease: boolean;
  autoIncreaseAmount: number;
  autoIncreaseMax: number;
}): number {
  const {
    salary,
    contributionPercent,
    currentSavings,
    currentAge,
    retirementAge,
    growthRate,
    autoIncrease,
    autoIncreaseAmount,
    autoIncreaseMax,
  } = params;

  const years = Math.max(0, retirementAge - currentAge);
  let balance = currentSavings;
  let currentPct = contributionPercent;

  for (let y = 0; y < years; y++) {
    const annualContribution = salary * (currentPct / 100);
    const employerMatch = salary * (Math.min(currentPct, 6) / 100);
    balance = (balance + annualContribution + employerMatch) * (1 + growthRate);

    if (autoIncrease && currentPct < autoIncreaseMax) {
      currentPct = Math.min(currentPct + autoIncreaseAmount, autoIncreaseMax);
    }
  }

  return Math.round(balance);
}

/**
 * Same as {@link computeProjectedBalanceWithAutoIncrease} but with auto-increase forced off (derived “no AI” path).
 */
export function computeProjectedBalanceWithoutAutoIncrease(params: {
  salary: number;
  contributionPercent: number;
  currentSavings: number;
  currentAge: number;
  retirementAge: number;
  growthRate: number;
}): number {
  return computeProjectedBalanceWithAutoIncrease({
    ...params,
    autoIncrease: false,
    autoIncreaseAmount: 0,
    autoIncreaseMax: 0,
  });
}

/** Auto-increase setup: compare balances through retirement with vs without stepped increases. */
export function compareBalancesWithAndWithoutAutoStep(
  salary: number,
  currentPercent: number,
  increaseAmount: number,
  maxContribution: number,
  yearsToRetirement: number,
  growthRate: number,
  startingBalance: number,
): { withoutIncrease: number; withIncrease: number; difference: number } {
  let balanceFixed = startingBalance;
  for (let y = 0; y < yearsToRetirement; y++) {
    const contrib = (currentPercent / 100) * salary;
    const match = (Math.min(currentPercent, 6) / 100) * salary;
    balanceFixed = (balanceFixed + contrib + match) * (1 + growthRate);
  }

  let balanceAuto = startingBalance;
  let autoPct = currentPercent;
  for (let y = 0; y < yearsToRetirement; y++) {
    const contrib = (autoPct / 100) * salary;
    const match = (Math.min(autoPct, 6) / 100) * salary;
    balanceAuto = (balanceAuto + contrib + match) * (1 + growthRate);
    autoPct = Math.min(autoPct + increaseAmount, maxContribution);
  }

  return {
    withoutIncrease: balanceFixed,
    withIncrease: balanceAuto,
    difference: balanceAuto - balanceFixed,
  };
}
