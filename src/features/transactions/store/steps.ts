// ─────────────────────────────────────────────
// Transaction Flow — Step Registries
// ─────────────────────────────────────────────

import type {
  LoanStepId,
  RolloverStepId,
  TransactionStepMeta,
  TransactionType,
  TransferStepId,
  RebalanceStepId,
  WithdrawalStepId,
} from "./types";

export const LOAN_STEPS: TransactionStepMeta[] = [
  { id: "eligibility" as LoanStepId, label: "Eligibility", description: "Check loan eligibility", stepIndex: 0, isGated: false },
  { id: "simulator" as LoanStepId, label: "Simulator", description: "Configure amount & term", stepIndex: 1, isGated: true },
  { id: "configuration" as LoanStepId, label: "Configuration", description: "Loan type & disbursement", stepIndex: 2, isGated: true },
  { id: "fees" as LoanStepId, label: "Fees", description: "Review all fees", stepIndex: 3, isGated: true },
  { id: "documents" as LoanStepId, label: "Documents", description: "Upload required documents", stepIndex: 4, isGated: true },
  { id: "review" as LoanStepId, label: "Review", description: "Review loan terms", stepIndex: 5, isGated: true },
  { id: "confirmation" as LoanStepId, label: "Confirmation", description: "Submit loan request", stepIndex: 6, isGated: true },
];

export const WITHDRAWAL_STEPS: TransactionStepMeta[] = [
  { id: "eligibility" as WithdrawalStepId, label: "Eligibility", description: "Check withdrawal eligibility", stepIndex: 0, isGated: false },
  { id: "type" as WithdrawalStepId, label: "Type", description: "Select withdrawal type", stepIndex: 1, isGated: true },
  { id: "source" as WithdrawalStepId, label: "Source", description: "Choose fund sources", stepIndex: 2, isGated: true },
  { id: "fees" as WithdrawalStepId, label: "Fees & Tax", description: "Tax withholding & fees", stepIndex: 3, isGated: true },
  { id: "payment" as WithdrawalStepId, label: "Payment", description: "Disbursement method", stepIndex: 4, isGated: true },
  { id: "review" as WithdrawalStepId, label: "Review", description: "Review withdrawal details", stepIndex: 5, isGated: true },
  { id: "confirmation" as WithdrawalStepId, label: "Confirmation", description: "Submit withdrawal", stepIndex: 6, isGated: true },
];

export const TRANSFER_STEPS: TransactionStepMeta[] = [
  { id: "type" as TransferStepId, label: "Type", description: "Existing balance or future contributions", stepIndex: 0, isGated: false },
  { id: "source" as TransferStepId, label: "Source Fund", description: "Select source fund", stepIndex: 1, isGated: true },
  { id: "amount" as TransferStepId, label: "Amount", description: "Dollar or percent amount", stepIndex: 2, isGated: true },
  { id: "destination" as TransferStepId, label: "Destination", description: "Select destination fund", stepIndex: 3, isGated: true },
  { id: "impact" as TransferStepId, label: "Impact", description: "Preview allocation changes", stepIndex: 4, isGated: true },
  { id: "review" as TransferStepId, label: "Review", description: "Review transfer", stepIndex: 5, isGated: true },
  { id: "confirmation" as TransferStepId, label: "Confirmation", description: "Submit transfer", stepIndex: 6, isGated: true },
];

export const ROLLOVER_STEPS: TransactionStepMeta[] = [
  { id: "plan-details" as RolloverStepId, label: "Plan Details", description: "Previous employer info", stepIndex: 0, isGated: false },
  { id: "validation" as RolloverStepId, label: "Validation", description: "Verify account details", stepIndex: 1, isGated: true },
  { id: "documents" as RolloverStepId, label: "Documents", description: "Upload required documents", stepIndex: 2, isGated: true },
  { id: "allocation" as RolloverStepId, label: "Allocation", description: "Choose allocation method", stepIndex: 3, isGated: true },
  { id: "review" as RolloverStepId, label: "Review", description: "Review rollover details", stepIndex: 4, isGated: true },
  { id: "confirmation" as RolloverStepId, label: "Confirmation", description: "Submit rollover", stepIndex: 5, isGated: true },
];

export const REBALANCE_STEPS: TransactionStepMeta[] = [
  { id: "current-allocation" as RebalanceStepId, label: "Current", description: "View current allocations", stepIndex: 0, isGated: false },
  { id: "adjust-allocation" as RebalanceStepId, label: "Adjust", description: "Set target allocations", stepIndex: 1, isGated: false },
  { id: "trade-preview" as RebalanceStepId, label: "Trades", description: "Preview trades to execute", stepIndex: 2, isGated: true },
  { id: "review" as RebalanceStepId, label: "Review", description: "Confirm rebalance", stepIndex: 3, isGated: true },
];

export const STEP_REGISTRY: Record<TransactionType, TransactionStepMeta[]> = {
  loan: LOAN_STEPS,
  withdrawal: WITHDRAWAL_STEPS,
  transfer: TRANSFER_STEPS,
  rollover: ROLLOVER_STEPS,
  rebalance: REBALANCE_STEPS,
};

export function getStepsForType(type: TransactionType): TransactionStepMeta[] {
  return STEP_REGISTRY[type] ?? [];
}

export function getTotalSteps(type: TransactionType): number {
  return getStepsForType(type).length;
}

export function getStepMeta(
  type: TransactionType,
  stepIndex: number,
): TransactionStepMeta | null {
  return getStepsForType(type)[stepIndex] ?? null;
}

export function getStepLabel(type: TransactionType, stepIndex: number): string {
  return getStepMeta(type, stepIndex)?.label ?? `Step ${stepIndex + 1}`;
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  loan: "Loan",
  withdrawal: "Withdrawal",
  transfer: "Fund Transfer",
  rollover: "Rollover",
  rebalance: "Rebalance",
};
