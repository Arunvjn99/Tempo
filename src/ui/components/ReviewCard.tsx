import { Pencil } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

interface ReviewCardProps {
  label: string;
  value: ReactNode;
  subValue?: ReactNode;
  onEdit?: () => void;
  editLabel?: string;
  icon?: ReactNode;
  className?: string;
  highlight?: boolean;
}

export function ReviewCard({
  label,
  value,
  subValue,
  onEdit,
  editLabel = "Edit",
  icon,
  className,
  highlight = false,
}: ReviewCardProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-md rounded-card border border-default p-md",
        highlight ? "border-primary/30 bg-primary/5" : "bg-surface-card",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-sm">
        {icon && <span className="mt-xs shrink-0 text-secondary">{icon}</span>}
        <div className="min-w-0 space-y-xs">
          <p className="text-xs font-medium uppercase tracking-wider text-secondary">{label}</p>
          <div className="text-sm font-semibold text-primary">{value}</div>
          {subValue && <div className="text-xs text-secondary">{subValue}</div>}
        </div>
      </div>

      {onEdit && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onEdit}
          className="inline-flex shrink-0 gap-xs rounded-md px-sm py-xs text-xs font-medium text-secondary hover:border-primary hover:text-brand"
        >
          <Pencil className="h-3 w-3" aria-hidden />
          {editLabel}
        </Button>
      )}
    </div>
  );
}

interface CardReviewSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/** Grouped review block with heading (transactions / rollover flows). */
export function CardReviewSection({ title, children, className }: CardReviewSectionProps) {
  return (
    <div className={cn("space-y-sm", className)}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">{title}</h3>
      <div className="space-y-sm">{children}</div>
    </div>
  );
}
