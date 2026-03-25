import { AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export type InsightCardVariant = "urgent" | "insight";

export interface InsightCardProps {
  variant: InsightCardVariant;
  title: string;
  description: string;
  ctaLabel: string;
  onCtaClick?: () => void;
  className?: string;
}

export function InsightCard({ variant, title, description, ctaLabel, onCtaClick, className }: InsightCardProps) {
  const isUrgent = variant === "urgent";

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-full border border-[var(--border-subtle)] p-6 transition-transform duration-200 hover:-translate-y-0.5",
        isUrgent
          ? "bg-[color-mix(in_srgb,var(--color-error-container)_30%,transparent)]"
          : "bg-[var(--color-secondary-fixed)]",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            isUrgent
              ? "bg-[var(--color-error-container)] text-[var(--color-on-error-container)]"
              : "bg-[var(--color-on-secondary-fixed)] text-[var(--color-secondary-fixed)]",
          )}
        >
          {isUrgent ? <AlertTriangle className="h-6 w-6" strokeWidth={2} /> : <Lightbulb className="h-6 w-6" strokeWidth={2} />}
        </div>
        <div>
          <h3 className={cn("font-bold", isUrgent ? "text-[var(--color-on-error-container)]" : "text-[var(--text-primary)]")}>
            {title}
          </h3>
          <p
            className={cn(
              "text-sm",
              isUrgent
                ? "text-[color-mix(in_srgb,var(--color-on-error-container)_70%,transparent)]"
                : "text-[var(--text-muted)]",
            )}
          >
            {description}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onCtaClick}
        className={cn(
          "rounded-full px-6 py-2.5 text-sm font-bold transition-all active:scale-95",
          isUrgent
            ? "bg-[var(--color-error)] text-[var(--color-on-error)] hover:shadow-lg"
            : "bg-[var(--color-on-secondary-fixed)] text-[var(--color-on-colored-surface)] hover:shadow-lg",
        )}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
