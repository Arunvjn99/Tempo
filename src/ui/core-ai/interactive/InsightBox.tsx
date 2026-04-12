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
    <div className="mt-3 rounded-xl border border-[color-mix(in_srgb,var(--color-warning)_28%,var(--border-default))]/60 bg-[color-mix(in_srgb,var(--color-warning)_10%,var(--surface-card))]/80 dark:border-[color-mix(in_srgb,var(--color-warning)_45%,var(--border-default))] dark:bg-[color-mix(in_srgb,var(--color-warning)_18%,var(--surface-page))] px-3 py-2">
      <div className="flex gap-2">
        <span className="shrink-0 text-[var(--color-warning)] dark:text-[color-mix(in_srgb,var(--color-warning)_80%,var(--surface-card))]" aria-hidden>
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
              className="mt-1.5 inline-flex h-auto min-h-0 justify-start rounded-none p-0 text-xs font-medium text-[color-mix(in_srgb,var(--color-warning)_65%,var(--text-primary))] underline decoration-[color-mix(in_srgb,var(--color-warning)_55%,var(--border-default))] hover:decoration-[color-mix(in_srgb,var(--color-warning)_65%,var(--border-default))] dark:text-[color-mix(in_srgb,var(--color-warning)_80%,var(--surface-card))] dark:decoration-[color-mix(in_srgb,var(--color-warning)_50%,var(--border-default))] dark:hover:decoration-[color-mix(in_srgb,var(--color-warning)_60%,var(--border-default))]"
            >
              {suggestion.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
