import { motion } from "framer-motion";
import { Button } from "@/ui/components/Button";
import type { CoreAIStructuredPayload, InvestmentCardPayload } from "@/features/ai/store/interactiveTypes";

const OPTION_VALUES: Record<string, string> = {
  "Target Date Fund": "target",
  "Manual Allocation": "manual",
  "Advisor Recommended": "advisor",
};

export interface InvestmentCardProps {
  payload: InvestmentCardPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function InvestmentCard({ payload, onAction }: InvestmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">
        Investment choice
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {payload.options.map((label: string) => (
          <Button
            key={label}
            type="button"
            variant="custom"
            size="custom"
            onClick={() =>
              onAction({
                action: "enrollment_investment_pick",
                value: OPTION_VALUES[label] ?? label.toLowerCase().replace(/\s+/g, "_"),
                label,
              })
            }
            className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-left text-sm font-medium text-[var(--color-text)] transition-colors hover:border-primary hover:bg-[var(--color-surface)]"
          >
            {label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
