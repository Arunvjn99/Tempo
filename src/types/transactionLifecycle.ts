/**
 * Transaction lifecycle: types, state machine, and progress mapping.
 * Drives Active Tracker and validation rules.
 */

import type { TransactionType } from "./transactions";

/** Full lifecycle status for every transaction (replaces simple draft|active|completed|cancelled for display logic) */
export type TransactionLifecycleStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "verifying_documents"
  | "approved"
  | "rejected"
  | "funded"
  | "cancelled"
  | "completed";

/** Progress percentage by status (drives Active Tracker progress bar) */
export const STATUS_TO_PROGRESS: Record<TransactionLifecycleStatus, number> = {
  draft: 5,
  submitted: 20,
  under_review: 40,
  verifying_documents: 60,
  approved: 80,
  rejected: 80,
  funded: 100,
  cancelled: 0,
  completed: 100,
};

export function getProgressFromStatus(status: TransactionLifecycleStatus | string): number {
  if (status in STATUS_TO_PROGRESS) return STATUS_TO_PROGRESS[status as TransactionLifecycleStatus];
  // Legacy: map old "active" to submitted
  if (status === "active") return STATUS_TO_PROGRESS.submitted;
  return 0;
}

/** Valid status transitions (from -> to[]) */
const TRANSITIONS: Record<TransactionLifecycleStatus, TransactionLifecycleStatus[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["under_review", "cancelled"],
  under_review: ["verifying_documents", "approved", "rejected", "cancelled"],
  verifying_documents: ["approved", "rejected", "under_review"],
  approved: ["funded", "cancelled"],
  rejected: [],
  funded: ["completed"],
  cancelled: [],
  completed: [],
};

export function canTransition(
  from: TransactionLifecycleStatus | string,
  to: TransactionLifecycleStatus
): boolean {
  const fromKey = from === "active" ? "submitted" : (from as TransactionLifecycleStatus);
  if (!(fromKey in TRANSITIONS)) return false;
  return (TRANSITIONS[fromKey as TransactionLifecycleStatus] as TransactionLifecycleStatus[]).includes(to);
}

/** Terminal statuses (no further transitions) */
export const TERMINAL_STATUSES: TransactionLifecycleStatus[] = [
  "rejected",
  "cancelled",
  "completed",
];

export function isTerminalStatus(status: TransactionLifecycleStatus | string): boolean {
  const s = status === "active" ? "submitted" : status;
  return TERMINAL_STATUSES.includes(s as TransactionLifecycleStatus);
}

/** Statuses that show in Active Tracker (in progress) */
export const ACTIVE_TRACKER_STATUSES: TransactionLifecycleStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "verifying_documents",
  "approved",
];

export function isActiveTrackerStatus(status: TransactionLifecycleStatus | string): boolean {
  const s = status === "active" ? "submitted" : status;
  return ACTIVE_TRACKER_STATUSES.includes(s as TransactionLifecycleStatus);
}

/** Normalize legacy "active" to "submitted" for display */
export function normalizeLifecycleStatus(
  status: TransactionLifecycleStatus | string
): TransactionLifecycleStatus {
  if (status === "active") return "submitted";
  if (status in STATUS_TO_PROGRESS) return status as TransactionLifecycleStatus;
  return "draft";
}

// --- Transaction record (full data model) ---

export interface RequiredDocument {
  id: string;
  type: string;
  label: string;
  uploaded: boolean;
  uploadedAt?: string;
}

export interface EligibilitySnapshot {
  eligible: boolean;
  maxAmount?: number;
  minAmount?: number;
  reasons: string[];
  checkedAt: string;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  planId: string;
  type: TransactionType;
  amount: number;
  status: TransactionLifecycleStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  fundedAt?: string;
  completedAt?: string;
  estimatedCompletion?: string;
  requiredDocuments: RequiredDocument[];
  progressPercentage: number;
  eligibilitySnapshot?: EligibilitySnapshot;
  impactOnBalance?: number;
  notes?: string;
  /** Loan-specific */
  repaymentTermMonths?: number;
  interestRate?: number;
  monthlyPayment?: number;
  nextPaymentDate?: string;
  /** Withdrawal-specific */
  taxWithholdingPercent?: number;
  penaltyApplied?: boolean;
  /** Optional display / legacy */
  displayName?: string;
  accountType?: string;
}
