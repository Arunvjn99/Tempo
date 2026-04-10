// ─────────────────────────────────────────────
// Enrollment Flow — Derived / Computed Values
// ─────────────────────────────────────────────

import type { EnrollmentDerived, EnrollmentState, PersonalizationState, RiskLevel } from "./types";

export const GROWTH_RATES: Record<RiskLevel, number> = {
  conservative: 0.045,
  balanced: 0.068,
  growth: 0.082,
  aggressive: 0.095,
};

export function getGrowthRate(risk: RiskLevel): number {
  return GROWTH_RATES[risk];
}

export function computeProjectedBalance(params: {
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

export function computeReadinessScore(params: {
  contributionPercent: number;
  autoIncrease: boolean;
  yearsToRetirement: number;
  currentSavings: number;
  riskLevel: RiskLevel;
}): number {
  const { contributionPercent, autoIncrease, yearsToRetirement, currentSavings, riskLevel } =
    params;

  let score = 0;
  score += contributionPercent * 5;
  score += autoIncrease ? 12 : 0;
  score += Math.min(yearsToRetirement * 0.8, 20);
  score += Math.min(currentSavings / 10_000, 10);
  score += riskLevel === "growth" ? 3 : riskLevel === "aggressive" ? 5 : 0;

  return Math.min(100, Math.round(score));
}

export function buildDerived(
  enrollment: EnrollmentState,
  personalization: PersonalizationState,
): EnrollmentDerived {
  const {
    salary,
    contributionPercent,
    autoIncrease,
    autoIncreaseAmount,
    autoIncreaseMax,
    riskLevel,
  } = enrollment;
  const { currentAge, retirementAge, currentSavings } = personalization;

  const monthlyPaycheck = salary / 12;
  const monthlyContribution = (salary * contributionPercent) / 100 / 12;
  const monthlyEmployerMatch = (salary * Math.min(contributionPercent, 6)) / 100 / 12;
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const growthRate = getGrowthRate(riskLevel);

  const projectedBalance = computeProjectedBalance({
    salary,
    contributionPercent,
    currentSavings,
    currentAge,
    retirementAge,
    growthRate,
    autoIncrease,
    autoIncreaseAmount,
    autoIncreaseMax,
  });

  const projectedBalanceNoAI = computeProjectedBalance({
    salary,
    contributionPercent,
    currentSavings,
    currentAge,
    retirementAge,
    growthRate,
    autoIncrease: false,
    autoIncreaseAmount: 0,
    autoIncreaseMax: 0,
  });

  const monthlyRetirementIncome = (projectedBalance * 0.04) / 12;

  const readinessScore = computeReadinessScore({
    contributionPercent,
    autoIncrease,
    yearsToRetirement,
    currentSavings,
    riskLevel,
  });

  return {
    monthlyPaycheck,
    monthlyContribution,
    monthlyEmployerMatch,
    projectedBalance,
    projectedBalanceNoAI,
    readinessScore,
    monthlyRetirementIncome,
    yearsToRetirement,
    growthRate,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}
