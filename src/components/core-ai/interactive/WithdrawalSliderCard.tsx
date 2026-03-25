import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/Slider";
import type { CoreAIStructuredPayload, WithdrawalSliderPayload } from "@/core/ai/interactive/types";
import { getWithdrawalInsight } from "@/core/ai/insights";
import { InsightBox } from "./InsightBox";

const TAX_RATE = 0.1;

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export interface WithdrawalSliderCardProps {
  payload: WithdrawalSliderPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function WithdrawalSliderCard({ payload, onAction }: WithdrawalSliderCardProps) {
  const [value, setValue] = useState(payload.value);
  const tax = useMemo(() => Math.round(value * TAX_RATE), [value]);
  const net = value - tax;
  const { insight } = useMemo(() => getWithdrawalInsight(value), [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">
        Withdrawal amount
      </p>
      <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">Max: {money(payload.max)}</p>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-xs text-[var(--color-textSecondary)]">
          <span>{money(payload.min)}</span>
          <span className="font-medium text-[var(--color-text)]">{money(value)}</span>
        </div>
        <Slider
          value={[value]}
          onValueChange={(v) => setValue(Math.min(payload.max, Math.max(payload.min, v[0] ?? value)))}
          min={payload.min}
          max={payload.max}
          step={100}
        />
      </div>

      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Est. tax</dt>
          <dd className="font-medium text-[var(--color-text)]">{money(tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
          <dt className="text-[var(--color-textSecondary)]">Net</dt>
          <dd className="font-semibold text-[var(--color-success)]">{money(net)}</dd>
        </div>
      </dl>

      <InsightBox insight={insight} />

      <button
        type="button"
        onClick={() => onAction({ action: "withdrawal_amount_continue", value })}
        className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Continue
      </button>
    </motion.div>
  );
}
