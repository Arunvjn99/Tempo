/**
 * Loan eligibility: max = min(50% vested, 50k) − outstanding loans.
 * Second loan: if outstanding > 0, max is reduced; plan can prohibit second loan via config.
 */

import type {
  LoanEligibilityResult,
  LoanUserContext,
  LoanAccountContext,
} from "../types/loan";

export interface LoanEligibilityConfig {
  /** Allow second loan when one is outstanding (default false for strict POC) */
  allowSecondLoan?: boolean;
}

const DEFAULT_ELIGIBILITY_CONFIG: LoanEligibilityConfig = { allowSecondLoan: true };

export function checkLoanEligibility(
  user: LoanUserContext,
  plan: LoanAccountContext,
  configOverride?: LoanEligibilityConfig
): LoanEligibilityResult {
  const reasons: string[] = [];
  const { config } = plan;
  const opts = { ...DEFAULT_ELIGIBILITY_CONFIG, ...configOverride };

  if (!user.isEnrolled) {
    reasons.push("You must be enrolled in the 401(k) plan to request a loan.");
  }

  if (user.vestedBalance <= 0) {
    reasons.push("You need a vested balance to request a loan.");
  }

  // Max = min(50% vested, plan cap) − outstanding
  const maxFromVested = user.vestedBalance * config.maxLoanPctOfVested;
  const capBeforeOutstanding = Math.min(maxFromVested, config.maxLoanAbsolute);
  const maxLoanAmount = Math.max(0, capBeforeOutstanding - user.outstandingLoanBalance);
  const minLoanAmount = config.minLoanAmount;

  if (user.outstandingLoanBalance > 0 && !opts.allowSecondLoan) {
    reasons.push("You already have an outstanding loan. Repay it before requesting another.");
  }

  if (maxLoanAmount < minLoanAmount) {
    reasons.push(
      `Your available borrowing capacity ($${maxLoanAmount.toLocaleString()}) is below the minimum loan amount ($${minLoanAmount.toLocaleString()}).`
    );
  }

  const eligible =
    reasons.length === 0 &&
    user.isEnrolled &&
    user.vestedBalance > 0 &&
    maxLoanAmount >= minLoanAmount;

  return {
    eligible,
    reasons,
    maxLoanAmount: round2(maxLoanAmount),
    minLoanAmount,
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
