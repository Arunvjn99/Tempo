/**
 * Withdrawal eligibility and penalty rules.
 * If age < 59.5 → early withdrawal penalty applies; force acknowledgment in UX.
 */

const PENALTY_AGE_THRESHOLD = 59.5;

export function hasEarlyWithdrawalPenalty(ageYears: number): boolean {
  return ageYears < PENALTY_AGE_THRESHOLD;
}

export function getPenaltyAgeThreshold(): number {
  return PENALTY_AGE_THRESHOLD;
}

/** Estimated penalty (e.g. 10% for federal early distribution). POC only. */
export function estimateEarlyPenaltyPercent(): number {
  return 10;
}

export interface WithdrawalEligibilityResult {
  eligible: boolean;
  penaltyApplies: boolean;
  penaltyPercent: number;
  reasons: string[];
}

export function checkWithdrawalEligibility(
  ageYears: number,
  vestedBalance: number,
  requestedAmount: number
): WithdrawalEligibilityResult {
  const reasons: string[] = [];
  const penaltyApplies = hasEarlyWithdrawalPenalty(ageYears);
  const penaltyPercent = penaltyApplies ? estimateEarlyPenaltyPercent() : 0;

  if (vestedBalance <= 0) {
    reasons.push("No vested balance available for withdrawal.");
  }
  if (requestedAmount > vestedBalance) {
    reasons.push("Requested amount exceeds vested balance.");
  }
  if (penaltyApplies) {
    reasons.push(
      `You are under ${PENALTY_AGE_THRESHOLD}. Early distribution may be subject to a ${penaltyPercent}% federal penalty plus income tax.`
    );
  }

  const eligible = reasons.filter((r) => !r.includes("penalty")).length === 0 && requestedAmount <= vestedBalance && vestedBalance > 0;

  return {
    eligible: eligible && requestedAmount >= 0,
    penaltyApplies,
    penaltyPercent,
    reasons,
  };
}
