import type { LoanData } from "./types";

export function recalcLoanPayments(loan: LoanData): LoanData {
  const updated = { ...loan };
  const principal = updated.amount;
  const rate = updated.interestRate / 12;
  const n = updated.term * 12;
  const monthly =
    rate === 0
      ? principal / n
      : (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
  updated.monthlyPayment = Math.round(monthly * 100) / 100;
  updated.totalPayback = Math.round(monthly * n * 100) / 100;
  updated.totalInterest = Math.round((monthly * n - principal) * 100) / 100;
  return updated;
}
