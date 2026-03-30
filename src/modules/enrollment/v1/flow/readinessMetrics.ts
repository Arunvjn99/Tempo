import type { RiskLevel } from "../store/useEnrollmentStore";

const GROWTH_RATES: Record<RiskLevel, number> = {
  conservative: 0.045,
  balanced: 0.068,
  growth: 0.082,
  aggressive: 0.095,
};

export function getGrowthRate(risk: RiskLevel | null): number {
  return GROWTH_RATES[risk ?? "balanced"] ?? 0.068;
}

export function computeProjectedBalancePure(
  salary: number,
  currentSavings: number,
  contribPct: number,
  years: number,
  rate: number,
): number {
  const annualEmp = Math.round((salary * contribPct) / 100);
  const matchCap = Math.min(contribPct, 6);
  const annualEr = Math.round((salary * matchCap) / 100);
  let balance = currentSavings;
  for (let i = 0; i < years; i++) {
    balance = (balance + annualEmp + annualEr) * (1 + rate);
  }
  return balance;
}

export function projectBalanceWithAutoIncrease(
  salary: number,
  currentSavings: number,
  startPct: number,
  years: number,
  baseRate: number,
  stepPct: number,
  maxPct: number,
): number {
  let balance = currentSavings;
  let pct = startPct;
  for (let y = 0; y < years; y++) {
    const annualEmp = Math.round((salary * pct) / 100);
    const matchCap = Math.min(pct, 6);
    const annualEr = Math.round((salary * matchCap) / 100);
    balance = (balance + annualEmp + annualEr) * (1 + baseRate);
    pct = Math.min(pct + stepPct, maxPct);
  }
  return balance;
}

export { GROWTH_RATES };
