import type { ReactNode } from "react";
import { Edit3, Pencil } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";
import { WizardFormSection } from "@/ui/components/enrollment/WizardFormSection";

export type ReviewRowPresentation = {
  id: string;
  label: ReactNode;
  value: ReactNode;
};

export interface ReviewSectionProps {
  headline?: ReactNode;
  description?: ReactNode;
  rows: ReviewRowPresentation[];
  /** Called when user taps edit on a row (parent navigates or opens modal). */
  onEditRow?: (id: string) => void;
  editLabel?: string;
  /** Optional confidence / summary block below the list. */
  summarySlot?: ReactNode;
  className?: string;
  rowClassName?: string;
  /**
   * `list` — bordered rows (default).
   * `card-grid` — Figma-style small cards in a responsive grid (review step).
   */
  layout?: "list" | "card-grid";
  /** Applied to the grid when `layout` is `card-grid`. */
  cardGridClassName?: string;
}

/**
 * Read-only summary rows with optional per-row edit affordance. No API.
 */
export function ReviewSection({
  headline,
  description,
  rows,
  onEditRow,
  editLabel = "Edit",
  summarySlot,
  className,
  rowClassName,
  layout = "list",
  cardGridClassName,
}: ReviewSectionProps) {
  const showEdit = typeof onEditRow === "function";

  const showWizardHeader = layout === "list" && (headline != null || description != null);

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-lg", className)}>
      <WizardFormSection
        headline={showWizardHeader ? headline : undefined}
        description={showWizardHeader ? description : undefined}
        gap="normal"
      >
        {layout === "card-grid" && headline != null ? (
          <p className="mb-3 text-enroll-subtitle font-semibold text-primary">{headline}</p>
        ) : null}
        {layout === "card-grid" && description != null ? (
          <p className="mb-3 text-enroll-body-md text-secondary">{description}</p>
        ) : null}
        {layout === "card-grid" ? (
          <div
            className={cn("grid grid-cols-2 gap-2.5 md:grid-cols-3", cardGridClassName)}
            role="list"
          >
            {rows.map((row) => (
              <div
                key={row.id}
                role="listitem"
                className={cn(
                  "flex flex-col justify-between rounded-xl border border-default bg-surface-card px-4 py-3.5",
                  rowClassName,
                )}
              >
                <div>
                  <p className="text-enroll-label font-semibold uppercase tracking-enroll-label text-secondary">
                    {row.label}
                  </p>
                  <p className="mt-1 text-enroll-body-sm font-medium text-primary">{row.value}</p>
                </div>
                {showEdit ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="custom"
                    onClick={() => onEditRow(row.id)}
                    className="mt-2.5 inline-flex h-auto items-center gap-1 self-start px-0 text-enroll-link font-medium text-brand transition-colors hover:bg-transparent hover:opacity-70"
                  >
                    <Edit3 className="h-3 w-3" aria-hidden />
                    {editLabel}
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="divide-y divide-border overflow-hidden rounded-card border border-default bg-surface-card text-card-foreground shadow-sm"
            role="list"
          >
            {rows.map((row) => (
              <div
                key={row.id}
                role="listitem"
                className={cn(
                  "flex flex-wrap items-start gap-md px-lg py-md sm:items-center sm:justify-between",
                  rowClassName,
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-enroll-label font-medium uppercase tracking-enroll-label text-secondary">
                    {row.label}
                  </p>
                  <div className="mt-xs text-enroll-body font-medium text-primary sm:text-base">
                    {row.value}
                  </div>
                </div>
                {showEdit ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 gap-xs text-secondary hover:text-primary"
                    onClick={() => onEditRow(row.id)}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                    {editLabel}
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {summarySlot != null ? (
          <div className="w-full min-w-0 pt-md">{summarySlot}</div>
        ) : null}
      </WizardFormSection>
    </div>
  );
}
