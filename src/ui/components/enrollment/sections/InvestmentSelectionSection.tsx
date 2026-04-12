import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { SelectionCard } from "@/ui/components/enrollment/SelectionCard";
import { WizardFormSection } from "@/ui/components/enrollment/WizardFormSection";

export type InvestmentOptionPresentation = {
  id: string;
  label: string;
  description?: ReactNode;
  /** e.g. emoji or icon slot */
  leading?: ReactNode;
  /** e.g. growth rate chip */
  trailing?: ReactNode;
  /** Optional corner badge (e.g. “Most common”). */
  badge?: ReactNode;
};

export interface InvestmentSelectionSectionProps {
  headline?: ReactNode;
  description?: ReactNode;
  options: InvestmentOptionPresentation[];
  /** Which option appears selected (controlled by parent). */
  selectedId?: string | null;
  /** UI-only selection handler (not an API call). */
  onOptionSelect?: (id: string) => void;
  /** Allocation editor, fund list, or custom panel below the cards. */
  allocationSlot?: ReactNode;
  className?: string;
  /** Grid columns for option cards. */
  optionsGridClassName?: string;
}

/**
 * Risk / strategy cards + optional allocation area. Presentation only.
 */
export function InvestmentSelectionSection({
  headline,
  description,
  options,
  selectedId,
  onOptionSelect,
  allocationSlot,
  className,
  optionsGridClassName,
}: InvestmentSelectionSectionProps) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-lg", className)}>
      <WizardFormSection headline={headline} description={description} gap="relaxed">
        <div
          className={cn(
            "grid w-full min-w-0 grid-cols-1 gap-md sm:grid-cols-2",
            optionsGridClassName,
          )}
        >
          {options.map((opt) => (
            <SelectionCard
              key={opt.id}
              selected={selectedId === opt.id}
              onClick={() => onOptionSelect?.(opt.id)}
              className={cn("gap-sm p-lg", opt.badge != null && "relative")}
            >
              {opt.badge != null ? (
                <span className="pointer-events-none absolute right-2 top-2 z-[1]">{opt.badge}</span>
              ) : null}
              <div className="flex w-full items-start gap-sm">
                {opt.leading != null ? (
                  <span className="shrink-0 text-2xl leading-none" aria-hidden>
                    {opt.leading}
                  </span>
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col gap-0">
                  <span className="text-sm font-bold text-primary">{opt.label}</span>
                  {opt.description != null ? (
                    <div className="text-xs leading-5 text-secondary">{opt.description}</div>
                  ) : null}
                  {opt.trailing != null ? (
                    <span className="mt-1 text-xs font-medium text-brand">{opt.trailing}</span>
                  ) : null}
                </div>
              </div>
            </SelectionCard>
          ))}
        </div>

        {allocationSlot != null ? (
          <div className="w-full min-w-0 pt-md">{allocationSlot}</div>
        ) : null}
      </WizardFormSection>
    </div>
  );
}
