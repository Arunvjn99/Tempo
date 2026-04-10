/**
 * Transaction types and status definitions
 */

export type TransactionType = "loan" | "withdrawal" | "distribution" | "rollover" | "transfer" | "rebalance";

/** Includes full lifecycle; "active" is legacy alias for "submitted" */
export type TransactionStatus =
  | "draft"
  | "active"
  | "submitted"
  | "under_review"
  | "verifying_documents"
  | "approved"
  | "rejected"
  | "funded"
  | "cancelled"
  | "completed";

export type RetirementImpactLevel = "low" | "medium" | "high";

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  grossAmount?: number;
  netAmount?: number;
  fees?: number;
  taxWithholding?: number;
  dateInitiated: string;
  dateCompleted?: string;
  processingTime?: string;
  repaymentInfo?: {
    monthlyPayment: number;
    termMonths: number;
    interestRate: number;
  };
  milestones?: {
    submitted?: string;
    processing?: string;
    completed?: string;
  };
  retirementImpact: {
    level: RetirementImpactLevel;
    rationale: string;
  };
  isIrreversible: boolean;
  legalConfirmations: string[];
  /** Optional display name for activity list (e.g. "Loan Repayment", "Dividend Credit") */
  displayName?: string;
  /** Optional account label (e.g. "Traditional 401(k)") */
  accountType?: string;
  /** When true, amount is shown as negative in activity list */
  amountNegative?: boolean;
  /** Plan ID for multi-plan filtering (e.g. "current", "previous", "ira") */
  planId?: string;
  /** Lifecycle: submitted/approved/funded timestamps */
  submittedAt?: string;
  approvedAt?: string;
  fundedAt?: string;
  /** ETA for completion (e.g. "24h", "72h") */
  estimatedCompletion?: string;
  /** Progress 0–100 for Active Tracker */
  progressPercentage?: number;
  /** Required document types and upload state */
  requiredDocuments?: { id: string; type: string; label: string; uploaded: boolean; uploadedAt?: string }[];
  /** Eligibility at time of request */
  eligibilitySnapshot?: { eligible: boolean; maxAmount?: number; minAmount?: number; reasons: string[]; checkedAt: string };
  /** Estimated impact on balance (e.g. negative for loan) */
  impactOnBalance?: number;
  notes?: string;
  userId?: string;
}
