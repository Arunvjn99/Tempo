import type { StoreApi } from "zustand";
import type { TransactionActions, TransactionDraft, TransactionFlowState } from "./types";

type TxStore = TransactionFlowState & TransactionActions;
type SetState = StoreApi<TxStore>["setState"];

export function transactionDataSlice(set: SetState): Pick<
  TransactionActions,
  "updateLoan" | "updateWithdrawal" | "updateTransfer" | "updateRollover" | "updateRebalance" | "completeFlow" | "resetFlow" | "saveDraft"
> {
  return {
    updateLoan: (patch) =>
      set((s) => {
        const updated = { ...s.loanData, ...patch };
        if ("amount" in patch || "term" in patch) {
          const principal = updated.amount;
          const rate = updated.interestRate / 12;
          const n = updated.term * 12;
          const monthly =
            rate === 0
              ? principal / n
              : (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
          updated.monthlyPayment = Math.round(monthly * 100) / 100;
          updated.totalPayback = Math.round(monthly * n * 100) / 100;
          updated.totalInterest = Math.round((monthly * n - principal) * 100) / 100;
        }
        return { loanData: updated };
      }),

    updateWithdrawal: (patch) =>
      set((s) => {
        const updated = { ...s.withdrawalData, ...patch };
        const total =
          updated.selectedSources.preTax +
          updated.selectedSources.roth +
          updated.selectedSources.employer +
          updated.selectedSources.afterTax;
        updated.totalAmount = total;
        const penalty = updated.withdrawalType === "hardship" ? total * 0.1 : 0;
        updated.penaltyAmount = penalty;
        updated.netAmount = total * (1 - updated.taxWithholding) - penalty;
        return { withdrawalData: updated };
      }),

    updateTransfer: (patch) =>
      set((s) => ({ transferData: { ...s.transferData, ...patch } })),

    updateRollover: (patch) =>
      set((s) => ({ rolloverData: { ...s.rolloverData, ...patch } })),

    updateRebalance: (patch) =>
      set((s) => {
        const updated = { ...s.rebalanceData, ...patch };
        if ("funds" in patch) {
          const total = updated.funds.reduce((sum, f) => sum + f.targetAllocation, 0);
          updated.totalTargetAllocation = total;
          updated.isValid = Math.round(total) === 100;
          const totalBalance = updated.funds.reduce((sum, f) => sum + f.currentBalance, 0);
          updated.trades = updated.funds
            .filter((f) => Math.abs(f.targetAllocation - f.currentAllocation) > 0.5)
            .map((f) => {
              const targetValue = totalBalance * (f.targetAllocation / 100);
              const currentValue = totalBalance * (f.currentAllocation / 100);
              const diff = targetValue - currentValue;
              return {
                fundId: f.id,
                fundName: f.name,
                action: diff > 0 ? "buy" : "sell",
                amount: Math.abs(Math.round(diff)),
                fromPct: f.currentAllocation,
                toPct: f.targetAllocation,
              };
            });
        }
        return { rebalanceData: updated };
      }),

    completeFlow: () =>
      set({ completedAt: new Date().toISOString() }),

    resetFlow: () =>
      set({
        activeType: null,
        activeStep: 0,
        completedAt: null,
        loanAssistantPrefill: null,
        loanAssistantBanner: false,
      }),

    saveDraft: () =>
      set((s) => {
        if (!s.activeType) return s;
        const draft: TransactionDraft = {
          id: `${s.activeType}-${Date.now()}`,
          type: s.activeType,
          step: s.activeStep,
          updatedAt: new Date().toISOString(),
          label: `${s.activeType} - Step ${s.activeStep + 1}`,
        };
        return { drafts: [...s.drafts.filter((d) => d.type !== s.activeType), draft] };
      }),
  };
}
