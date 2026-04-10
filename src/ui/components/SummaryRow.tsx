import { type ReactNode } from "react";
import { cn } from "@/core/lib/utils";

interface SummaryRowProps {
  label: string;
  value: ReactNode;
  variant?: "default" | "bold" | "highlight";
  className?: string;
}

export function SummaryRow({ label, value, variant = "default", className }: SummaryRowProps) {
  return (
    <div className={cn("flex justify-between text-sm", className)}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          variant === "highlight" && "text-lg font-bold text-primary",
          variant === "bold" && "font-semibold text-foreground",
          variant === "default" && "font-medium text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

interface SummaryListProps {
  children: ReactNode;
  className?: string;
  divider?: boolean;
}

export function SummaryList({ children, className, divider = false }: SummaryListProps) {
  return (
    <dl
      className={cn(
        "grid gap-sm text-sm",
        divider && "[&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-border [&>*:not(:last-child)]:pb-sm",
        className,
      )}
    >
      {children}
    </dl>
  );
}
