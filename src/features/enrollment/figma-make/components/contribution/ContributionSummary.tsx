/**
 * Right column — projection header, progress, and KPI banners (above the chart).
 */
export type ContributionSummaryProps = {
  progressPercentage: number;
  retirementAge: number;
  projectedTotal: number;
  monthlyRetirementIncome: number;
  monthlyContribution: number;
  monthlyMatch: number;
};

export function ContributionSummary({
  progressPercentage,
  retirementAge,
  projectedTotal,
  monthlyRetirementIncome,
  monthlyContribution,
  monthlyMatch,
}: ContributionSummaryProps) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Retirement Savings Projection
          </h3>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            Growth over 30 years at 7% annual return
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold text-[var(--color-primary)]">
            {Math.round(progressPercentage)}% on track
          </p>
          <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-primary)_18%,var(--surface-section))]">
            <div
              className="h-full rounded-full transition-all duration-300 [background:var(--gradient-progress-primary)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="fm-inset-panel rounded-xl border border-[var(--color-success-border)] p-4 [background:var(--color-success-bg)]">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            Projected at Age {retirementAge}
          </p>
          <p className="mt-1 text-center text-3xl font-extrabold leading-none text-[var(--color-primary)]">
            ${(projectedTotal / 1000000).toFixed(1)}M
          </p>
          <p className="mt-1.5 text-center text-xs font-medium text-[var(--color-primary)]">
            ≈ ${monthlyRetirementIncome.toLocaleString()}/mo
          </p>
        </div>

        <div className="fm-inset-panel space-y-2.5 rounded-xl border border-[var(--border-default)] bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--surface-card))] p-4">
          <p className="text-center text-xs font-bold uppercase tracking-wide text-[var(--text-primary)]">
            Monthly Impact
          </p>

          <div className="space-y-2">
            <div>
              <p className="text-center text-xs text-[var(--text-secondary)]">You contribute</p>
              <p className="mt-0.5 text-center text-base font-bold text-[var(--text-primary)]">
                ${monthlyContribution.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--surface-section))] p-2">
              <p className="text-center text-xs font-semibold text-[var(--color-primary)]">Employer adds</p>
              <p className="mt-0.5 text-center text-base font-bold text-[var(--color-primary)]">
                +${monthlyMatch.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
