import { cn } from "@/lib/utils";

export interface SuggestionCardProps {
  title: string;
  subtitle?: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
  /** e.g. "Popular" */
  badge?: string;
  className?: string;
}

/**
 * “Suggested / popular” row — same pattern on every onboarding step.
 */
export function SuggestionCard({
  title,
  subtitle,
  actionLabel,
  onAction,
  disabled,
  badge,
  className,
}: SuggestionCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-violet-200/90 bg-violet-50/90 p-4 dark:border-violet-500/35 dark:bg-violet-950/40 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
          {badge ? (
            <span className="rounded-full bg-violet-200/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-900 dark:bg-violet-500/30 dark:text-violet-100">
              {badge}
            </span>
          ) : null}
        </div>
        {subtitle ? (
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">{subtitle}</p>
        ) : null}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onAction}
        className={cn(
          "shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:self-center",
          disabled
            ? "cursor-not-allowed bg-[var(--color-border)] text-[var(--color-text-secondary)] opacity-60"
            : "bg-[var(--color-primary)] text-[var(--color-text-on-primary)] hover:opacity-95",
        )}
      >
        {actionLabel}
      </button>
    </div>
  );
}
