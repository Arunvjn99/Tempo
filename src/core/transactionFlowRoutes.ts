import type { TransactionType } from "@/core/types/transactions";

/** Version-agnostic paths; prefix with `withVersion` when navigating. */
export const TRANSACTION_FLOW_ENTRY: Record<TransactionType, string> = {
  loan: "/transactions/loan",
  withdrawal: "/transactions/withdrawal",
  distribution: "/transactions/withdrawal",
  transfer: "/transactions/transfer",
  rebalance: "/transactions/rebalance",
  rollover: "/transactions/rollover",
};
