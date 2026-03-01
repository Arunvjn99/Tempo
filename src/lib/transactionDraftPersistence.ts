/**
 * Persist transaction draft (step data + current step) to sessionStorage.
 * Restore when re-entering the flow so user doesn't lose progress on refresh/close.
 */

const KEY_PREFIX = "txn-draft:";

export interface DraftSnapshot {
  transactionId: string;
  transactionType: string;
  currentStep: number;
  stepData: Record<string, unknown>;
  savedAt: string;
}

export function saveDraftSnapshot(snapshot: DraftSnapshot): void {
  try {
    sessionStorage.setItem(KEY_PREFIX + snapshot.transactionId, JSON.stringify(snapshot));
  } catch {
    // ignore quota / private mode
  }
}

export function loadDraftSnapshot(transactionId: string): DraftSnapshot | null {
  try {
    const raw = sessionStorage.getItem(KEY_PREFIX + transactionId);
    if (!raw) return null;
    return JSON.parse(raw) as DraftSnapshot;
  } catch {
    return null;
  }
}

export function clearDraftSnapshot(transactionId: string): void {
  try {
    sessionStorage.removeItem(KEY_PREFIX + transactionId);
  } catch {
    // ignore
  }
}
