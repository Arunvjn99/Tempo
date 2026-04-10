// ─────────────────────────────────────────────
// Transaction hub — pick a flow
// ─────────────────────────────────────────────

import { StepLayout , TransactionHubGridSection } from "@/ui/patterns";
import type { TransactionType } from "../store/types";
import { TRANSACTION_TYPE_LABELS } from "../store/steps";

const ORDER: TransactionType[] = ["loan", "withdrawal", "transfer", "rollover", "rebalance"];

const BLURB: Record<TransactionType, string> = {
  loan: "Borrow from your vested balance with structured repayment.",
  withdrawal: "Request a distribution from your account.",
  transfer: "Move money between investment options.",
  rollover: "Bring assets from a prior employer plan or IRA.",
  rebalance: "Adjust your allocation and preview resulting trades.",
};

export function TransactionHubPage() {
  return (
    <StepLayout
      title="Transactions"
      description="Choose a transaction to start. Progress is saved while you complete each flow."
    >
      <TransactionHubGridSection
        items={ORDER.map((type) => ({
          id: type,
          to: type,
          title: TRANSACTION_TYPE_LABELS[type],
          description: BLURB[type],
        }))}
      />
    </StepLayout>
  );
}
