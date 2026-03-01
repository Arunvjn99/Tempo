/**
 * Central transaction service: CRUD, submit, cancel, list.
 * Uses in-memory store + state machine; simulates API for POC.
 */

import type { Transaction, TransactionType } from "../types/transactions";
import {
  getProgressFromStatus,
  canTransition,
  normalizeLifecycleStatus,
  isActiveTrackerStatus,
  type TransactionLifecycleStatus,
} from "../types/transactionLifecycle";
import { transactionStore } from "../data/transactionStore";

const DEFAULT_ETA_BY_STATUS: Record<string, string> = {
  submitted: "72h",
  under_review: "48h",
  verifying_documents: "24h",
  approved: "24h",
  funded: "0h",
};

function ensureLifecycleStatus(s: Transaction["status"]): TransactionLifecycleStatus {
  if (s === "active") return "submitted";
  return s as TransactionLifecycleStatus;
}

function applyProgressAndEta(t: Transaction): Transaction {
  const status = ensureLifecycleStatus(t.status);
  const progress = getProgressFromStatus(status);
  const eta = t.estimatedCompletion ?? DEFAULT_ETA_BY_STATUS[status] ?? "—";
  return {
    ...t,
    progressPercentage: progress,
    estimatedCompletion: eta,
  };
}

/** Create a draft transaction */
export function createTransaction(
  type: TransactionType,
  userId?: string,
  planId?: string
): Transaction {
  const draft = transactionStore.createDraft(type);
  const updates: Partial<Transaction> = {
    status: "draft",
    progressPercentage: 5,
    userId,
    planId,
  };
  const updated = transactionStore.updateTransaction(draft.id, updates) ?? draft;
  return applyProgressAndEta(updated);
}

/** Get one transaction */
export function getTransaction(id: string): Transaction | undefined {
  const t = transactionStore.getTransaction(id);
  return t ? applyProgressAndEta(t) : undefined;
}

/** List all transactions (optional filter by userId) */
export function listTransactions(userId?: string): Transaction[] {
  const all = transactionStore.getAllTransactions();
  const filtered = userId ? all.filter((t) => !t.userId || t.userId === userId) : all;
  return filtered.map(applyProgressAndEta);
}

/** List transactions that appear in Active Tracker (non-terminal, in progress) */
export function listActiveTrackerTransactions(userId?: string): Transaction[] {
  const all = listTransactions(userId);
  return all.filter((t) => isActiveTrackerStatus(t.status));
}

/** Update transaction (partial); enforces status transitions when status is updated */
export function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Transaction | undefined {
  const existing = transactionStore.getTransaction(id);
  if (!existing) return undefined;

  if (updates.status != null && updates.status !== existing.status) {
    const from = ensureLifecycleStatus(existing.status);
    const to = normalizeLifecycleStatus(updates.status) as TransactionLifecycleStatus;
    if (!canTransition(from, to)) return undefined;
  }

  const updated = transactionStore.updateTransaction(id, updates);
  return updated ? applyProgressAndEta(updated) : undefined;
}

/** Submit draft → submitted; sets submittedAt and progress */
export function submitTransaction(id: string): Transaction | undefined {
  const t = transactionStore.getTransaction(id);
  if (!t || t.status !== "draft") return undefined;

  const now = new Date().toISOString();
  return updateTransaction(id, {
    status: "submitted",
    submittedAt: now,
    progressPercentage: 20,
    estimatedCompletion: DEFAULT_ETA_BY_STATUS.submitted ?? "72h",
  });
}

/** Cancel transaction (draft or submitted) */
export function cancelTransaction(id: string): Transaction | undefined {
  const t = transactionStore.getTransaction(id);
  if (!t) return undefined;
  const from = ensureLifecycleStatus(t.status);
  if (!canTransition(from, "cancelled")) return undefined;
  return updateTransaction(id, { status: "cancelled", progressPercentage: 0 });
}

/** Delete transaction (e.g. draft only in real API) */
export function deleteTransaction(id: string): boolean {
  const t = transactionStore.getTransaction(id);
  if (!t) return false;
  if (t.status !== "draft") return false;
  return transactionStore.deleteTransaction(id);
}

/** Simulated API delay for POC */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
