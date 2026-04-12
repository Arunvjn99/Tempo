export type ContributionCompareScenariosProps = {
  percent: number;
  comparePercent: number;
  compareMode: boolean;
  setCompareMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  setComparePercent: (n: number) => void;
  difference: number;
};

/**
 * Compare scenarios toggle + delta (bottom of right column).
 */
export function ContributionCompareScenarios({
  percent,
  comparePercent,
  compareMode,
  setCompareMode,
  setComparePercent,
  difference,
}: ContributionCompareScenariosProps) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-primary)]">
          Compare Scenarios
        </p>
        <button
          type="button"
          onClick={() => setCompareMode(!compareMode)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            compareMode
              ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] "
              : "border border-[var(--border-default)] bg-[var(--surface-section)] text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-section))]"
          }`}
        >
          {compareMode ? "Hide" : "Show"}
        </button>
      </div>

      {compareMode && (
        <div className="space-y-3 border-t border-[var(--border-default)]/50 pt-2">
          <div className="flex gap-2">
            {[10, 12, 15].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setComparePercent(val)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  comparePercent === val
                    ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] "
                    : "border border-[var(--border-default)] bg-[var(--surface-section)] text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-section))]"
                }`}
              >
                {val}%
              </button>
            ))}
          </div>

          <div
            className={`rounded-lg border p-3 ${
              difference < 0
                ? "border-[color-mix(in_srgb,var(--text-secondary)_28%,var(--border-default))] bg-[color-mix(in_srgb,var(--text-secondary)_12%,var(--surface-card))]"
                : "border-[color-mix(in_srgb,var(--color-primary)_28%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-section))]"
            }`}
          >
            <p
              className={
                difference < 0
                  ? "text-sm font-bold text-[var(--text-primary)]"
                  : "text-sm font-bold text-[var(--color-primary)]"
              }
            >
              {difference >= 0 ? "+" : ""}${Math.abs(difference).toLocaleString()}
            </p>
            <p
              className={
                difference < 0 ? "text-xs text-[var(--text-primary)]" : "text-xs text-[var(--color-primary)]"
              }
            >
              {difference >= 0 ? "more" : "less"} with {comparePercent}% vs {percent}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
