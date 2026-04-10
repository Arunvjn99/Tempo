import { motion } from "framer-motion";
import type { BalanceCardPayload } from "@/features/ai/store/interactiveTypes";
import { getVestedInsight } from "@/features/ai/services/insights";
import { InsightBox } from "./InsightBox";

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export interface BalanceCardProps {
  payload: BalanceCardPayload;
}

export function BalanceCard({ payload }: BalanceCardProps) {
  const percent =
    payload.total > 0 ? Math.round((payload.vested / payload.total) * 100) : 0;
  const insight =
    payload.insight ??
    getVestedInsight({
      total: payload.total,
      vested: payload.vested,
      unvested: payload.unvested,
      percent,
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">
        Your balance
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Total</dt>
          <dd className="font-medium text-[var(--color-text)]">{money(payload.total)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Vested</dt>
          <dd className="font-semibold text-[var(--color-success)]">{money(payload.vested)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Unvested</dt>
          <dd className="font-medium text-[var(--color-text)]">{money(payload.unvested)}</dd>
        </div>
      </dl>
      <InsightBox insight={insight} />
    </motion.div>
  );
}
