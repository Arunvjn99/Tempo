// ─────────────────────────────────────────────
// Transaction Flow — Core Type Definitions
// ─────────────────────────────────────────────

// ── Transaction Types ─────────────────────────
export type TransactionType = "loan" | "withdrawal" | "transfer" | "rollover" | "rebalance";

// ─────────────────────────────────────────────
// LOAN
// ─────────────────────────────────────────────
export type LoanType = "general" | "residential" | "refinance";
export type DisbursementMethod = "eft" | "check";
export type RepaymentFrequency = "weekly" | "biweekly" | "monthly";
export type RepaymentMethod = "payroll" | "ach" | "manual";

export interface LoanData {
  // Eligibility
  isEligible: boolean | null;
  eligibilityReason: string;

  // Simulator
  amount: number;  // 1000–50000
  term: number;    // 1–5 years

  // Configuration
  loanType: LoanType;
  reason: string;
  disbursementMethod: DisbursementMethod;
  repaymentFrequency: RepaymentFrequency;
  repaymentMethod: RepaymentMethod;

  // Calculated (from simulator)
  interestRate: number;  // 0.08 fixed
  monthlyPayment: number;
  totalInterest: number;
  totalPayback: number;

  // Documents
  documentsUploaded: string[];
  documentsComplete: boolean;
}

// ─────────────────────────────────────────────
// WITHDRAWAL
// ─────────────────────────────────────────────
export type WithdrawalType =
  | "hardship"
  | "in-service"
  | "termination"
  | "rmd"
  | "one-time"
  | "full-balance";

export type PaymentMethod = "ach" | "check";

export interface WithdrawalSources {
  preTax: number;
  roth: number;
  employer: number;
  afterTax: number;
}

export interface WithdrawalData {
  // Eligibility
  isEligible: boolean | null;
  eligibilityReason: string;
  availableSources: WithdrawalSources;

  // Type
  withdrawalType: WithdrawalType | null;

  // Source
  selectedSources: WithdrawalSources;
  totalAmount: number;

  // Fees
  taxWithholding: number;  // 0–0.45
  penaltyAmount: number;
  netAmount: number;

  // Payment
  paymentMethod: PaymentMethod | null;
  bankAccountLast4: string;
  mailingAddress: string;
}

// ─────────────────────────────────────────────
// TRANSFER
// ─────────────────────────────────────────────
export type TransferType = "existing" | "future";
export type TransferMode = "dollar" | "percent";

export interface TransferData {
  transferType: TransferType | null;
  sourceFundId: string;
  sourceFundName: string;
  destinationFundId: string;
  destinationFundName: string;
  amount: number;
  percentage: number;
  mode: TransferMode;
  // Impact preview
  impactCalculated: boolean;
  projectedNewAllocation: Record<string, number>;
}

// ─────────────────────────────────────────────
// ROLLOVER
// ─────────────────────────────────────────────
export type RolloverType = "traditional" | "roth" | "ira";
export type AllocationMethod = "match" | "target" | "custom";

export interface RolloverData {
  previousEmployer: string;
  planAdministrator: string;
  accountNumber: string;
  estimatedAmount: number;
  rolloverType: RolloverType;

  // Validation
  accountValidated: boolean | null;
  validationError: string;

  // Allocation
  allocationMethod: AllocationMethod;
  customAllocations: Record<string, number>; // fundId → pct

  // Documents
  documentsUploaded: string[];
  documentsComplete: boolean;
}

// ─────────────────────────────────────────────
// REBALANCE
// ─────────────────────────────────────────────
export interface RebalanceFund {
  id: string;
  name: string;
  ticker: string;
  currentAllocation: number;  // 0–100
  targetAllocation: number;   // 0–100, user-set
  currentBalance: number;
  color: string;
}

export interface RebalanceTrade {
  fundId: string;
  fundName: string;
  action: "buy" | "sell";
  amount: number;
  fromPct: number;
  toPct: number;
}

export interface RebalanceData {
  funds: RebalanceFund[];
  trades: RebalanceTrade[];
  isValid: boolean; // targets sum to 100
  totalTargetAllocation: number;
}

// ─────────────────────────────────────────────
// UNION
// ─────────────────────────────────────────────
export type TransactionFlowData =
  | { type: "loan"; data: LoanData }
  | { type: "withdrawal"; data: WithdrawalData }
  | { type: "transfer"; data: TransferData }
  | { type: "rollover"; data: RolloverData }
  | { type: "rebalance"; data: RebalanceData };

// ─────────────────────────────────────────────
// Step IDs per type
// ─────────────────────────────────────────────
export type LoanStepId =
  | "eligibility"
  | "simulator"
  | "configuration"
  | "fees"
  | "documents"
  | "review"
  | "confirmation";

export type WithdrawalStepId =
  | "eligibility"
  | "type"
  | "source"
  | "fees"
  | "payment"
  | "review"
  | "confirmation";

export type TransferStepId =
  | "type"
  | "source"
  | "destination"
  | "amount"
  | "impact"
  | "review"
  | "confirmation";

export type RolloverStepId =
  | "plan-details"
  | "validation"
  | "allocation"
  | "documents"
  | "review"
  | "confirmation";

export type RebalanceStepId =
  | "current-allocation"
  | "adjust-allocation"
  | "trade-preview"
  | "review";

export type AnyTransactionStepId =
  | LoanStepId
  | WithdrawalStepId
  | TransferStepId
  | RolloverStepId
  | RebalanceStepId;

// ─────────────────────────────────────────────
// Step Metadata
// ─────────────────────────────────────────────
export interface TransactionStepMeta {
  id: AnyTransactionStepId;
  label: string;
  description: string;
  stepIndex: number;
  isGated: boolean; // blocked until previous step complete
}

// ─────────────────────────────────────────────
// Flow State
// ─────────────────────────────────────────────
/** Pending handoff from Core AI before the loan flow mounts (single source vs legacy loan prefill store). */
export interface LoanAssistantPrefill {
  amount: number | null;
  purpose: string | null;
  loanType: string | null;
  /** 0-based `activeStep` after navigation (e.g. configuration step). */
  targetActiveStep: number;
}

export interface TransactionFlowState {
  activeType: TransactionType | null;
  activeStep: number;
  loanData: LoanData;
  withdrawalData: WithdrawalData;
  transferData: TransferData;
  rolloverData: RolloverData;
  rebalanceData: RebalanceData;
  completedAt: string | null;
  drafts: TransactionDraft[];
  loanAssistantPrefill: LoanAssistantPrefill | null;
  /** Shown after AI applies loan context until dismissed. */
  loanAssistantBanner: boolean;
}

export interface TransactionDraft {
  id: string;
  type: TransactionType;
  step: number;
  updatedAt: string;
  label: string;
}

// ─────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────
export interface TxValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// ─────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────
export interface TransactionActions {
  startFlow: (type: TransactionType) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  canProceed: () => boolean;
  validate: () => TxValidationResult;
  updateLoan: (patch: Partial<LoanData>) => void;
  updateWithdrawal: (patch: Partial<WithdrawalData>) => void;
  updateTransfer: (patch: Partial<TransferData>) => void;
  updateRollover: (patch: Partial<RolloverData>) => void;
  updateRebalance: (patch: Partial<RebalanceData>) => void;
  completeFlow: () => void;
  resetFlow: () => void;
  saveDraft: () => void;
  totalSteps: () => number;
  applyLoanAssistantPrefill: (data: Partial<LoanAssistantPrefill> & { targetActiveStep?: number }) => void;
  dismissLoanAssistantBanner: () => void;
}
