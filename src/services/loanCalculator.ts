/**
 * Loan payment and impact calculations.
 * Formula: Monthly Payment = P × r / (1 - (1 + r)^-n)
 * P = principal, r = monthly rate, n = number of months
 */

/**
 * Monthly payment (amortization)
 * @param principal Loan amount
 * @param annualRate Annual interest rate (e.g. 0.085 for 8.5%)
 * @param termMonths Number of months (12, 36, 60)
 */
export function monthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = annualRate / 12;
  if (r <= 0) return principal / termMonths;
  const factor = Math.pow(1 + r, termMonths);
  return (principal * r * factor) / (factor - 1);
}

/**
 * Total interest over the life of the loan
 */
export function totalInterest(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const pmt = monthlyPayment(principal, annualRate, termMonths);
  const totalPaid = pmt * termMonths;
  return Math.max(0, totalPaid - principal);
}

/**
 * Simple retirement impact: estimated % reduction in projected balance.
 * POC: approximate as (loan amount / projected balance) * factor.
 * factor ~ 1.5 to approximate lost compounding over time.
 */
export function retirementImpactPercent(
  loanAmount: number,
  projectedRetirementBalance: number,
  factor: number = 1.5
): number {
  if (projectedRetirementBalance <= 0) return 0;
  const raw = (loanAmount / projectedRetirementBalance) * factor * 100;
  return Math.min(100, Math.round(raw * 10) / 10);
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  retirementImpactPercent: number;
}

export function calculateLoan(
  principal: number,
  annualRate: number,
  termMonths: number,
  projectedRetirementBalance?: number
): LoanCalculationResult {
  const pmt = monthlyPayment(principal, annualRate, termMonths);
  const interest = totalInterest(principal, annualRate, termMonths);
  const impact =
    projectedRetirementBalance != null
      ? retirementImpactPercent(principal, projectedRetirementBalance)
      : 0;
  return {
    monthlyPayment: pmt,
    totalInterest: interest,
    totalRepayment: principal + interest,
    retirementImpactPercent: impact,
  };
}
