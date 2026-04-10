import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";
import type { ChatAction } from "./messageBubbleTypes";

export function MessageBubbleContentCard({
  dataSnippet,
  content,
  disclaimer,
  primaryAction,
  secondaryAction,
  suggestions,
  onAction,
  onSuggestion,
  className,
  suggestionHoverClass = "hover:bg-[var(--color-surface)]",
}: {
  dataSnippet?: string;
  content: string;
  disclaimer?: string;
  primaryAction?: ChatAction;
  secondaryAction?: ChatAction;
  suggestions?: string[];
  onAction: (route: string) => void;
  onSuggestion?: (text: string) => void;
  className?: string;
  /** Tailwind hover class for suggestion chips (interactive vs text bubbles differ slightly in original). */
  suggestionHoverClass?: string;
}) {
  return (
    <div className={cn("rounded-2xl rounded-tl-md bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-3", className)}>
      {dataSnippet && (
        <p className="text-sm font-semibold text-[var(--color-success)] mb-1">{dataSnippet}</p>
      )}
      <p className="text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-wrap">{content}</p>
      {disclaimer && (
        <p className="mt-2 text-[11px] italic text-[var(--color-textSecondary)]">{disclaimer}</p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {primaryAction && (
            <Button
              type="button"
              variant="custom"
              size="custom"
              onClick={() => onAction(primaryAction.route)}
              className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors"
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              type="button"
              variant="custom"
              size="custom"
              onClick={() => onAction(secondaryAction.route)}
              className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-textSecondary)] text-xs font-medium hover:bg-[var(--color-background)] transition-colors"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
      {suggestions && suggestions.length > 0 && onSuggestion && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--color-border)]">
          {suggestions.map((s) => (
            <Button
              key={s}
              type="button"
              variant="custom"
              size="custom"
              onClick={() => onSuggestion(s)}
              className={cn(
                "rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] px-2.5 py-1.5 text-[11px] text-[var(--color-text)] transition-colors",
                suggestionHoverClass,
              )}
            >
              {s}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
