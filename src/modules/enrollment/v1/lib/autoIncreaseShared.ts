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
    const yearsToRetirement = retirementAge - currentAge;
    let balanceFixed = currentSavings;
    for (let y = 0; y < yearsToRetirement; y++) {
      const contrib = (currentPercent / 100) * salary;
      const match = (Math.min(currentPercent, 6) / 100) * salary;
      balanceFixed = (balanceFixed + contrib + match) * (1 + growthRate);
    }
    let balanceAuto = currentSavings;
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
