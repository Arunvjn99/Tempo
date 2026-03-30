import {
  computeProjectedBalancePure,
  projectBalanceWithAutoIncrease,
} from "./readinessMetrics";

export type EnrollmentPlanType = "traditional" | "roth";

/** Canonical enrollment shape for selectors / external consumers. */
export type EnrollmentState = {
  planType: EnrollmentPlanType | null;
  contributionPercent: number;
  contributionAmount: number;
  monthlyPaycheck: number;
  preTaxPercent: number;
  rothPercent: number;
  autoIncreaseEnabled: boolean;
  investmentStrategy: "default" | "custom";
  projectedBalance: number;
  monthlyContribution: number;
  employerMatch: number;
  readinessScore: number;
};

export function computeReadinessScoreLinear(
  contributionPercent: number,
  yearsToRetirement: number,
  projectedBalance: number,
): number {
  const raw =
    contributionPercent * 5 +
    yearsToRetirement * 1.2 +
    projectedBalance / 100_000;
  return Math.min(100, Math.max(0, Math.round(raw)));
}

export type BuildEnrollmentDerivedInput = {
  monthlyPaycheck: number;
  salaryAnnual: number;
  contributionPercent: number;
  currentSavings: number;
  currentAge: number;
  retirementAge: number;
  growthRateAnnual: number;
  autoIncreaseEnabled: boolean;
  autoIncreaseRate: number;
  autoIncreaseMax: number;
};

export type BuildEnrollmentDerivedResult = {
  monthlyPaycheck: number;
  salaryAnnual: number;
  monthlyContribution: number;
  employerMatch: number;
  projectedBalance: number;
  projectedBalanceNoAutoIncrease: number;
  readinessScore: number;
  retirementProjection: { estimatedValue: number; monthlyIncome: number };
};

export function buildEnrollmentDerived(input: BuildEnrollmentDerivedInput): BuildEnrollmentDerivedResult {
  let salaryAnnual = Math.max(0, Math.round(input.salaryAnnual));
  let monthlyPaycheck = Math.max(0, Math.round(input.monthlyPaycheck));

  if (salaryAnnual > 0 && monthlyPaycheck <= 0) {
    monthlyPaycheck = Math.round(salaryAnnual / 12);
  } else if (monthlyPaycheck > 0 && salaryAnnual <= 0) {
    salaryAnnual = monthlyPaycheck * 12;
  } else if (salaryAnnual > 0 && monthlyPaycheck > 0) {
    monthlyPaycheck = Math.round(salaryAnnual / 12);
  }

  const pct = input.contributionPercent;
  const monthlyContribution = (monthlyPaycheck * pct) / 100;
  const employerMatch = (monthlyPaycheck * Math.min(pct, 6)) / 100;

  const years = Math.max(0, input.retirementAge - input.currentAge);

  const pbNoAuto = computeProjectedBalancePure(
    salaryAnnual,
    input.currentSavings,
    pct,
    years,
    input.growthRateAnnual,
  );
  const pb = input.autoIncreaseEnabled
    ? projectBalanceWithAutoIncrease(
        salaryAnnual,
        input.currentSavings,
        pct,
        years,
        input.growthRateAnnual,
        input.autoIncreaseRate,
        input.autoIncreaseMax,
      )
    : pbNoAuto;

  const readinessScore = computeReadinessScoreLinear(pct, years, pb);
  const projectedBalance = Math.round(pb);
  const projectedBalanceNoAutoIncrease = Math.round(pbNoAuto);

  return {
    monthlyPaycheck,
    salaryAnnual,
    monthlyContribution: Math.round(monthlyContribution),
    employerMatch: Math.round(employerMatch),
    projectedBalance,
    projectedBalanceNoAutoIncrease,
    readinessScore,
    retirementProjection: {
      estimatedValue: projectedBalance,
      monthlyIncome: Math.round((projectedBalance * 0.04) / 12),
    },
  };
}

export function computeSourceSplitMonthly(
  monthlyEmployeeContribution: number,
  sources: { preTax: number; roth: number; afterTax: number },
): { monthlyPreTax: number; monthlyRoth: number; monthlyAfterTax: number } {
  return {
    monthlyPreTax: Math.round((monthlyEmployeeContribution * sources.preTax) / 100),
    monthlyRoth: Math.round((monthlyEmployeeContribution * sources.roth) / 100),
    monthlyAfterTax: Math.round((monthlyEmployeeContribution * sources.afterTax) / 100),
  };
}

/** Balance after a fixed horizon (e.g. 10-year card on auto-increase decision). */
export function computeProjectedBalanceAtHorizon(
  salaryAnnual: number,
  currentSavings: number,
  contributionPercent: number,
  horizonYears: number,
  growthRateAnnual: number,
  auto: null | { stepPct: number; maxPct: number },
): number {
  const y = Math.max(0, horizonYears);
  if (y === 0) return Math.round(currentSavings);
  if (auto) {
    return Math.round(
      projectBalanceWithAutoIncrease(
        salaryAnnual,
        currentSavings,
        contributionPercent,
        y,
        growthRateAnnual,
        auto.stepPct,
        auto.maxPct,
      ),
    );
  }
  return Math.round(
    computeProjectedBalancePure(salaryAnnual, currentSavings, contributionPercent, y, growthRateAnnual),
  );
}
