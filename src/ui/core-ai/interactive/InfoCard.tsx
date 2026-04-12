import { motion } from "framer-motion";
import { Button } from "@/ui/components/Button";
import type { CoreAIStructuredPayload, InfoCardPayload } from "@/features/ai/store/interactiveTypes";
import { InsightBox } from "./InsightBox";

export interface InfoCardProps {
  payload: InfoCardPayload;
  onAction?: (payload: CoreAIStructuredPayload) => void;
}

export function InfoCard({ payload, onAction }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background-tertiary)]/50 p-4"
    >
      {payload.vestedPercent != null && (
        <p className="text-lg font-semibold text-[var(--color-text)] mb-2">
          {payload.vestedPercent}% vested
        </p>
      )}
      <p className="text-sm text-[var(--color-text)]">{payload.message}</p>
      {payload.insight && <InsightBox insight={payload.insight} />}
      {payload.suggestions && payload.suggestions.length > 0 && onAction && (
        <div className="flex flex-wrap gap-2 mt-3">
          {payload.suggestions.map((s) => (
            <Button
              key={s}
              type="button"
              variant="custom"
              size="custom"
              onClick={() => onAction({ action: "info_card_suggestion", suggestion: s })}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
            >
              {s}
            </Button>
          ))}
        </div>
      )}
      {payload.actionLabel && payload.action && onAction && (
        <Button
          type="button"
          variant="custom"
          size="custom"
          onClick={() => onAction(payload.action!)}
          className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {payload.actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
