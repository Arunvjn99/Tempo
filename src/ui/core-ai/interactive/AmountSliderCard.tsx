import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/ui/components/Button";
import { Slider } from "@/ui/components/Slider";
import type { CoreAIStructuredPayload, AmountSliderPayload } from "@/features/ai/store/interactiveTypes";

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export interface AmountSliderCardProps {
  payload: AmountSliderPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function AmountSliderCard({ payload, onAction }: AmountSliderCardProps) {
  const [value, setValue] = useState(payload.value);

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
      <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">
        {money(value)}
      </p>
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-xs text-[var(--color-textSecondary)]">
          <span>{money(payload.min)}</span>
          <span className="font-medium text-[var(--color-text)]">{money(value)}</span>
        </div>
        <Slider
          value={[value]}
          onValueChange={(v) => setValue(v[0] ?? value)}
          min={payload.min}
          max={payload.max}
          step={100}
        />
      </div>
      <Button
        type="button"
        variant="custom"
        size="custom"
        onClick={() => onAction({ action: "withdrawal_amount_continue", value })}
        className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        Continue
      </Button>
    </motion.div>
  );
}
