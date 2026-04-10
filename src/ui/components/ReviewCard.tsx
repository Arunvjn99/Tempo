import { Pencil } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/core/lib/utils";

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
        "flex items-start justify-between gap-md rounded-card border border-border p-md",
        highlight ? "border-primary/30 bg-primary/5" : "bg-card",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-sm">
        {icon && <span className="mt-xs shrink-0 text-muted-foreground">{icon}</span>}
        <div className="min-w-0 space-y-xs">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <div className="text-sm font-semibold text-foreground">{value}</div>
          {subValue && <div className="text-xs text-muted-foreground">{subValue}</div>}
        </div>
      </div>

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-xs rounded-md border border-border px-sm py-xs text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Pencil className="h-3 w-3" aria-hidden />
          {editLabel}
        </button>
      )}
    </div>
  );
}

interface ReviewSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ReviewSection({ title, children, className }: ReviewSectionProps) {
  return (
    <div className={cn("space-y-sm", className)}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-sm">{children}</div>
    </div>
  );
}
