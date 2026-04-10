// ─────────────────────────────────────────────
// Transaction Flow — Zustand Store
// ─────────────────────────────────────────────

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TransactionFlowState, TransactionActions } from "./types";
import { DEFAULT_FLOW_STATE } from "./defaults";
import { createTransactionActions } from "./createTransactionActions";

type TxStore = TransactionFlowState & TransactionActions;

export const useTransactionStore = create<TxStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_FLOW_STATE,
      ...createTransactionActions(set, get),
    }),
    {
      name: "transaction-v4-store",
      version: 2,
      migrate: (persisted, version) => {
        const p = persisted as Record<string, unknown>;
        if (version < 2) {
          return { ...p, loanAssistantPrefill: null, loanAssistantBanner: false };
        }
        return persisted;
      },
      partialize: (s) => ({
        activeType: s.activeType,
        activeStep: s.activeStep,
        loanData: s.loanData,
        withdrawalData: s.withdrawalData,
        transferData: s.transferData,
        rolloverData: s.rolloverData,
        rebalanceData: s.rebalanceData,
        drafts: s.drafts,
      }),
    },
  ),
);
