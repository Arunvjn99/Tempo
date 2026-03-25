import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/Slider";
import type { CoreAIStructuredPayload, ContributionSliderPayload } from "@/core/ai/interactive/types";

export interface ContributionSliderCardProps {
  payload: ContributionSliderPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function ContributionSliderCard({ payload, onAction }: ContributionSliderCardProps) {
  const [value, setValue] = useState(payload.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">
        Contribution rate
      </p>
      <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">
        You are contributing <strong>{value}%</strong> of your salary
      </p>
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-xs text-[var(--color-textSecondary)]">
          <span>{payload.min}%</span>
          <span className="font-medium text-[var(--color-text)]">{value}%</span>
        </div>
        <Slider
          value={[value]}
          onValueChange={(v) => setValue(v[0] ?? value)}
          min={payload.min}
          max={payload.max}
          step={1}
        />
      </div>
      <button
        type="button"
        onClick={() => onAction({ action: "enrollment_contribution_continue", value })}
        className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Continue
      </button>
    </motion.div>
  );
}
