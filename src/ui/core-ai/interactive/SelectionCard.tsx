import type { CoreAIStructuredPayload, SelectionCardPayload } from "@/features/ai/store/interactiveTypes";
import { Button } from "@/ui/components/Button";
import { InsightBox } from "./InsightBox";

export interface SelectionCardProps {
  payload: SelectionCardPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function SelectionCard({ payload, onAction }: SelectionCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm">
      <p className="text-sm font-semibold text-[var(--color-text)]">{payload.title}</p>
      {payload.subtitle && (
        <p className="mt-1 text-xs text-[var(--color-textSecondary)]">{payload.subtitle}</p>
      )}
      {payload.insight && <InsightBox insight={payload.insight} />}
      <div className="mt-4 flex flex-col gap-2">
        {payload.options.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant="custom"
            size="custom"
            onClick={() =>
              onAction({
                action: "selection_card_pick",
                value: opt.value,
                label: opt.label,
              })
            }
            className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-left text-sm font-medium text-[var(--color-text)] transition-colors hover:border-primary hover:bg-[var(--color-surface)]"
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
