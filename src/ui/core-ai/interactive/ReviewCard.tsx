import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/ui/components/Button";
import type { CoreAIStructuredPayload, ReviewCardPayload, SchedulePreviewRow } from "@/features/ai/store/interactiveTypes";

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function moneyCents(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export interface ReviewCardProps {
  payload: ReviewCardPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

function SchedulePreviewTable({ rows }: { rows: SchedulePreviewRow[] }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full min-w-[200px] text-left text-xs">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-tertiary)]/50">
            <th className="px-3 py-2 font-medium text-[var(--color-textSecondary)]">Payment</th>
            <th className="px-3 py-2 font-medium text-[var(--color-textSecondary)]">Due date</th>
            <th className="px-3 py-2 font-medium text-[var(--color-textSecondary)] text-right">Principal</th>
            <th className="px-3 py-2 font-medium text-[var(--color-textSecondary)] text-right">Interest</th>
            <th className="px-3 py-2 font-medium text-[var(--color-textSecondary)] text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.month} className="border-b border-[var(--color-border)]/50 last:border-0">
              <td className="px-3 py-2 text-[var(--color-text)]">{row.month}</td>
              <td className="px-3 py-2 text-[var(--color-text)]">{row.dueDateLabel}</td>
              <td className="px-3 py-2 text-right text-[var(--color-text)]">{moneyCents(row.principal)}</td>
              <td className="px-3 py-2 text-right text-[var(--color-text)]">{moneyCents(row.interest)}</td>
              <td className="px-3 py-2 text-right font-medium text-[var(--color-text)]">{moneyCents(row.payment)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReviewCard({ payload, onAction }: ReviewCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">{payload.title}</p>
      <p className="mt-2 text-sm text-[var(--color-text)]">
        You&apos;re ready to open <strong>loan configuration</strong> with these estimates:
      </p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Amount</dt>
          <dd className="font-medium text-[var(--color-text)]">{money(payload.amount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">EMI</dt>
          <dd className="font-medium text-[var(--color-text)]">{moneyCents(payload.monthlyPayment)}/mo</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Tenure</dt>
          <dd className="font-medium text-[var(--color-text)]">{payload.tenureMonths} mo</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Interest rate</dt>
          <dd className="font-medium text-[var(--color-text)]">{payload.annualRatePercent}% APR</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Disbursement</dt>
          <dd className="text-right font-medium text-[var(--color-text)]">{payload.disbursementLabel}</dd>
        </div>
        <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
          <dt className="text-[var(--color-textSecondary)]">Est. net (after fees)</dt>
          <dd className="font-semibold text-[var(--color-success)]">{moneyCents(payload.netAmount)}</dd>
        </div>
      </dl>

      {payload.schedulePreview && payload.schedulePreview.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-[var(--color-textSecondary)]">First 3 payments</p>
          <SchedulePreviewTable rows={payload.schedulePreview} />
        </div>
      )}

      <Button
        type="button"
        variant="custom"
        size="custom"
        onClick={() => onAction({ action: "SUBMIT_LOAN" })}
        className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Submit loan
      </Button>
    </motion.div>
  );
}
