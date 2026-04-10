import type { StoreApi } from "zustand";
import type {
  LoanData,
  LoanType,
  TransactionActions,
  TransactionFlowState,
  TransactionType,
  TxValidationResult,
} from "./types";
import {
  DEFAULT_LOAN_DATA,
  DEFAULT_REBALANCE_DATA,
  DEFAULT_ROLLOVER_DATA,
  DEFAULT_TRANSFER_DATA,
  DEFAULT_WITHDRAWAL_DATA,
} from "./defaults";
import { recalcLoanPayments } from "./loanMath";
import { getTotalSteps } from "./steps";
import { validateTransactionStep } from "./validation";

type TxStore = TransactionFlowState & TransactionActions;
type SetState = StoreApi<TxStore>["setState"];
type GetState = StoreApi<TxStore>["getState"];

export function transactionFlowSlice(
  set: SetState,
  get: GetState,
): Pick<
  TransactionActions,
  | "startFlow"
  | "applyLoanAssistantPrefill"
  | "dismissLoanAssistantBanner"
  | "nextStep"
  | "prevStep"
  | "goToStep"
  | "canProceed"
  | "validate"
  | "totalSteps"
> {
  return {
    startFlow: (type: TransactionType) => {
      const handoff = get().loanAssistantPrefill;
      if (type === "loan" && handoff) {
        let loanData: LoanData = {
          ...DEFAULT_LOAN_DATA,
          amount: handoff.amount ?? DEFAULT_LOAN_DATA.amount,
          reason: handoff.purpose ?? "",
          loanType: (handoff.loanType as LoanType) || "general",
        };
        loanData = recalcLoanPayments(loanData);
        const maxStep = getTotalSteps("loan") - 1;
        const activeStep = Math.max(0, Math.min(handoff.targetActiveStep, maxStep));
        const showBanner = handoff.amount != null;
        set({
          activeType: "loan",
          activeStep,
          completedAt: null,
          loanData,
          loanAssistantPrefill: null,
          loanAssistantBanner: showBanner,
        });
        return;
      }
      set({
        activeType: type,
        activeStep: 0,
        completedAt: null,
        loanAssistantPrefill: null,
        loanAssistantBanner: false,
        ...(type === "loan" ? { loanData: { ...DEFAULT_LOAN_DATA } } : {}),
        ...(type === "withdrawal" ? { withdrawalData: { ...DEFAULT_WITHDRAWAL_DATA } } : {}),
        ...(type === "transfer" ? { transferData: { ...DEFAULT_TRANSFER_DATA } } : {}),
        ...(type === "rollover" ? { rolloverData: { ...DEFAULT_ROLLOVER_DATA } } : {}),
        ...(type === "rebalance" ? { rebalanceData: { ...DEFAULT_REBALANCE_DATA } } : {}),
      });
    },

    applyLoanAssistantPrefill: (data) =>
      set({
        loanAssistantPrefill: {
          amount: data.amount ?? null,
          purpose: data.purpose ?? null,
          loanType: data.loanType ?? "general",
          targetActiveStep: data.targetActiveStep ?? 2,
        },
      }),

    dismissLoanAssistantBanner: () => set({ loanAssistantBanner: false }),

    nextStep: () =>
      set((s) => {
        const total = s.activeType ? getTotalSteps(s.activeType) : 1;
        return { activeStep: Math.min(s.activeStep + 1, total - 1) };
      }),

    prevStep: () =>
      set((s) => ({ activeStep: Math.max(s.activeStep - 1, 0) })),

    goToStep: (step: number) =>
      set((s) => {
        const total = s.activeType ? getTotalSteps(s.activeType) : 1;
        return { activeStep: Math.max(0, Math.min(step, total - 1)) };
      }),

    canProceed: () => {
      const s = get();
      if (!s.activeType) return false;
      return validateTransactionStep(s.activeType, s.activeStep, s).valid;
    },

    validate: (): TxValidationResult => {
      const s = get();
      if (!s.activeType) return { valid: false, errors: { type: "No active transaction type." } };
      return validateTransactionStep(s.activeType, s.activeStep, s);
    },

    totalSteps: () => {
      const { activeType } = get();
      return activeType ? getTotalSteps(activeType) : 0;
    },
  };
}
