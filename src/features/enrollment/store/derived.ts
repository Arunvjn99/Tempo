// ─────────────────────────────────────────────
// Enrollment Flow — Derived / Computed Values
// ─────────────────────────────────────────────

import type { EnrollmentDerived, EnrollmentState, PersonalizationState, RiskLevel } from "./types";
import {
  SAFETY_WITHDRAWAL_ANNUAL_RATE,
  computeProjectedBalanceWithAutoIncrease,
  computeProjectedBalanceWithoutAutoIncrease,
  getGrowthRate,
} from "@/utils/retirementCalculations";

export { GROWTH_RATES, getGrowthRate } from "@/utils/retirementCalculations";

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

  const projectedBalance = computeProjectedBalanceWithAutoIncrease({
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

  const projectedBalanceNoAI = computeProjectedBalanceWithoutAutoIncrease({
    salary,
    contributionPercent,
    currentSavings,
    currentAge,
    retirementAge,
    growthRate,
  });

  const monthlyRetirementIncome = (projectedBalance * SAFETY_WITHDRAWAL_ANNUAL_RATE) / 12;

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
