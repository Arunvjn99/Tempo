import { motion } from "framer-motion";
import type { ChartCardPayload } from "@/core/ai/interactive/types";

export interface ChartCardProps {
  payload: ChartCardPayload;
}

export function ChartCard({ payload }: ChartCardProps) {
  const total = payload.vested + payload.unvested;
  const vestedPct = total > 0 ? Math.round((payload.vested / total) * 100) : 0;
  const unvestedPct = total > 0 ? Math.round((payload.unvested / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">
        Breakdown
      </p>
      <div className="mt-4 flex h-8 w-full overflow-hidden rounded-lg bg-[var(--color-background-tertiary)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${vestedPct}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="bg-[var(--color-success)]"
          title={`Vested ${vestedPct}%`}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${unvestedPct}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="bg-[var(--color-border)]"
          title={`Unvested ${unvestedPct}%`}
        />
      </div>
      <div className="mt-2 flex gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
          Vested {vestedPct}%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--color-border)]" />
          Unvested {unvestedPct}%
        </span>
      </div>
    </motion.div>
  );
}
