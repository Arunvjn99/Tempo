import { motion } from "framer-motion";
import { Button } from "@/ui/components/Button";
import type { CoreAIStructuredPayload, WithdrawalReviewPayload } from "@/features/ai/store/interactiveTypes";
import { getWithdrawalInsight } from "@/features/ai/services/insights";
import { InsightBox } from "./InsightBox";

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export interface WithdrawalReviewCardProps {
  payload: WithdrawalReviewPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function WithdrawalReviewCard({ payload, onAction }: WithdrawalReviewCardProps) {
  const insight = payload.insight ?? getWithdrawalInsight(payload.amount).insight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">
        Review withdrawal
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Amount</dt>
          <dd className="font-medium text-[var(--color-text)]">{money(payload.amount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Est. tax/penalty</dt>
          <dd className="font-medium text-[var(--color-text)]">{money(payload.tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
          <dt className="text-[var(--color-textSecondary)]">Net</dt>
          <dd className="font-semibold text-[var(--color-success)]">{money(payload.net)}</dd>
        </div>
      </dl>
      <InsightBox insight={insight} />
      <Button
        type="button"
        variant="custom"
        size="custom"
        onClick={() => onAction({ action: "withdrawal_review_submit" })}
        className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Submit withdrawal
      </Button>
    </motion.div>
  );
}
