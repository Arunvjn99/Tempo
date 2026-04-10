/**
 * Reusable insight display — below main content, styled as info box with 💡 icon.
 * Max 2 lines, never blocking.
 */

import { Button } from "@/ui/components/Button";

export interface InsightBoxProps {
  insight: string;
  /** Optional clickable suggestion (e.g. "Try increasing to 8%") */
  suggestion?: { label: string; onClick: () => void };
}

export function InsightBox({ insight, suggestion }: InsightBoxProps) {
  return (
    <div className="mt-3 rounded-xl border border-amber-200/60 bg-amber-50/80 dark:border-amber-600/40 dark:bg-amber-950/30 px-3 py-2">
      <div className="flex gap-2">
        <span className="shrink-0 text-amber-600 dark:text-amber-400" aria-hidden>
          💡
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs leading-snug text-[var(--color-text)]">{insight}</p>
          {suggestion && (
            <Button
              type="button"
              variant="custom"
              size="custom"
              onClick={suggestion.onClick}
              className="mt-1.5 inline-flex h-auto min-h-0 justify-start rounded-none p-0 text-xs font-medium text-amber-700 underline decoration-amber-500/60 hover:decoration-amber-600 dark:text-amber-400 dark:decoration-amber-500/50 dark:hover:decoration-amber-400"
            >
              {suggestion.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
