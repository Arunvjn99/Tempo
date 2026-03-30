import { useMemo } from "react";
import type { RiskLevel } from "../store/useEnrollmentStore";

export const GROWTH: Record<RiskLevel, number> = {
  conservative: 0.045,
  balanced: 0.068,
  growth: 0.082,
  aggressive: 0.095,
};

export function useAutoIncreaseFinancialImpact(params: {
  currentPercent: number;
  increaseAmount: number;
  maxContribution: number;
  salary: number;
  growthRate: number;
  currentSavings: number;
  retirementAge: number;
  currentAge: number;
}) {
  const {
    currentPercent,
    increaseAmount,
    maxContribution,
    salary,
    growthRate,
    currentSavings,
    retirementAge,
    currentAge,
  } = params;

  return useMemo(() => {
    /* Whole years only; avoid fractional ages running wrong loop counts. */
    const yearsToRetirement = Math.max(0, Math.trunc(retirementAge - currentAge));
    /*
     * Model both scenarios from the same starting rate capped at the stop limit.
     * If current (e.g. 11%) is above max (10%), compare apples-to-apples at 10%
     * so “with vs without” isn’t distorted and 10%/10% shows matching columns.
     */
    const baselinePct = Math.min(currentPercent, maxContribution);

    let balanceFixed = currentSavings;
    for (let y = 0; y < yearsToRetirement; y++) {
      const contrib = (baselinePct / 100) * salary;
      const match = (Math.min(baselinePct, 6) / 100) * salary;
      balanceFixed = (balanceFixed + contrib + match) * (1 + growthRate);
    }
    let balanceAuto = currentSavings;
    let autoPct = baselinePct;
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
  }, [
    currentPercent,
    increaseAmount,
    maxContribution,
    salary,
    growthRate,
    currentSavings,
    retirementAge,
    currentAge,
  ]);
}

export function formatAutoIncreaseCurrency(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
  return `$${Math.round(val).toLocaleString()}`;
}
