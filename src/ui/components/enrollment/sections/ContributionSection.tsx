import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { WizardFormSection } from "@/ui/components/enrollment/WizardFormSection";

export interface ContributionSectionProps {
  /** Main column: contribution controls (sliders, inputs). */
  primaryColumn: ReactNode;
  /** Optional projection / chart column. */
  secondaryColumn?: ReactNode;
  /** Optional banner above the grid (e.g. AI insight). */
  topSlot?: ReactNode;
  headline?: ReactNode;
  description?: ReactNode;
  className?: string;
  /** Grid gap / column template — default two columns on large screens. */
  columnsClassName?: string;
}

/**
 * Layout block for the contribution step: optional insight row + headline + two-column grid.
 * No data fetching; parent passes ready-to-render nodes.
 */
export function ContributionSection({
  primaryColumn,
  secondaryColumn,
  topSlot,
  headline,
  description,
  className,
  columnsClassName,
}: ContributionSectionProps) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-lg", className)}>
      {topSlot ? <div className="w-full min-w-0">{topSlot}</div> : null}

      <WizardFormSection headline={headline} description={description} gap="normal">
        <div
          className={cn(
            "grid w-full min-w-0 gap-lg",
            secondaryColumn != null && "lg:grid-cols-2",
            columnsClassName,
          )}
        >
          <div className="min-w-0">{primaryColumn}</div>
          {secondaryColumn != null ? (
            <div className="min-w-0">{secondaryColumn}</div>
          ) : null}
        </div>
      </WizardFormSection>
    </div>
  );
}
