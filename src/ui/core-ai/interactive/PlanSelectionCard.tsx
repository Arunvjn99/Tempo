import { motion } from "framer-motion";
import type { CoreAIStructuredPayload, PlanSelectionPayload } from "@/features/ai/store/interactiveTypes";

export interface PlanSelectionCardProps {
  payload: PlanSelectionPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function PlanSelectionCard({ payload, onAction }: PlanSelectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm"
    >
      <p className="text-sm font-semibold text-[var(--color-text)]">{payload.title}</p>
      <div className="mt-4 flex flex-col gap-2">
        {payload.options.map((opt: { label: string; value: string }) => (
          <button
            key={opt.value}
            type="button"
            onClick={() =>
              onAction({
                action: "enrollment_plan_pick",
                value: opt.value,
                label: opt.label,
              })
            }
            className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-left text-sm font-medium text-[var(--color-text)] transition-colors hover:border-primary hover:bg-[var(--color-surface)]"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
