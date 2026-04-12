import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";
import { formatCurrency } from "@/features/enrollment/store/derived";
import { COMPARE_SCENARIOS } from "@/features/enrollment/store/constants/contributionPageConstants";

export interface EnrollmentDerivedSnapshot {
  projectedBalance: number;
  monthlyContribution: number;
  monthlyEmployerMatch: number;
}

export interface ContributionProjectionRightPanelProps {
  retirementAge: number;
  contributionPercent: number;
  onTrack: number;
  derived: EnrollmentDerivedSnapshot;
  showCompare: boolean;
  onToggleCompare: () => void;
  onApplyPercent: (pct: number) => void;
}

export function ContributionProjectionRightPanel({
  retirementAge,
  contributionPercent,
  onTrack,
  derived,
  showCompare,
  onToggleCompare,
  onApplyPercent,
}: ContributionProjectionRightPanelProps) {
  return (
    <div className="card-standard space-y-5 p-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-primary">Retirement Savings Projection</h2>
          <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[0.75rem] font-semibold text-success">
            {onTrack}% on track
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-1.5 rounded-full bg-success transition-all duration-500"
            style={{ width: `${onTrack}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-default bg-surface-soft p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-secondary">
            Projected Total
          </p>
          <p className="mt-1 text-[1.8rem] font-black leading-none text-success">
            {formatCurrency(derived.projectedBalance)}
          </p>
          <p className="mt-1 text-[0.7rem] text-secondary">by age {retirementAge}</p>
        </div>
        <div className="rounded-xl border border-default bg-surface-soft p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-secondary">
            Monthly Impact
          </p>
          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between text-[0.8rem]">
              <span className="text-secondary">You contribute</span>
              <span className="font-semibold text-primary">{formatCurrency(derived.monthlyContribution)}</span>
            </div>
            <div className="flex justify-between text-[0.8rem]">
              <span className="text-secondary">Employer adds</span>
              <span className="font-semibold text-success">+{formatCurrency(derived.monthlyEmployerMatch)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-default/50 bg-surface-soft">
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-1 px-4 pb-4">
          {Array.from({ length: 10 }).map((_, i) => {
            const progress = (i + 1) / 10;
            const heightPct = 15 + progress * 75;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-primary/30 transition-all"
                style={{ height: `${heightPct}%` }}
              />
            );
          })}
        </div>
        <div className="absolute inset-x-0 bottom-4 px-5">
          <div className="flex justify-between text-[0.65rem] text-secondary">
            <span>Now</span>
            <span>Age {retirementAge}</span>
          </div>
        </div>
        <div className="absolute right-4 top-4 rounded-lg border border-default/40 bg-surface-section px-2.5 py-1.5">
          <p className="text-[0.7rem] text-secondary">Est. growth</p>
          <p className="text-sm font-bold text-brand">{formatCurrency(derived.projectedBalance)}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-secondary">
            Compare Scenarios
          </p>
          <Button
            type="button"
            variant="ghost"
            size="custom"
            onClick={onToggleCompare}
            className="h-auto min-h-0 px-0 py-0 text-[0.75rem] font-medium text-brand hover:bg-transparent hover:text-brand/80"
          >
            {showCompare ? "Hide" : "Show"}
          </Button>
        </div>
        {showCompare && (
          <div className="mt-3 space-y-2">
            {COMPARE_SCENARIOS.map((s) => {
              const projHeight = Math.min(100, Math.round((s.pct / 15) * 100));
              return (
                <Button
                  key={s.pct}
                  type="button"
                  variant="custom"
                  size="custom"
                  onClick={() => onApplyPercent(s.pct)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    contributionPercent === s.pct
                      ? "border-primary bg-primary/5"
                      : "border-default bg-surface-soft hover:border-primary/30",
                  )}
                >
                  <span className="w-8 text-[0.8rem] font-bold text-brand">{s.label}</span>
                  <div className="flex-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className="h-1.5 rounded-full bg-primary/60"
                        style={{ width: `${projHeight}%` }}
                      />
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
