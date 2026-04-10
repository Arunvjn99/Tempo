import { cn } from "@/core/lib/utils";
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
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-lg">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Retirement Savings Projection</h2>
          <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[0.75rem] font-semibold text-success">
            {onTrack}% on track
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-1.5 rounded-full bg-success transition-all duration-500"
            style={{ width: `${onTrack}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Projected Total
          </p>
          <p className="mt-1 text-[1.8rem] font-black leading-none text-success">
            {formatCurrency(derived.projectedBalance)}
          </p>
          <p className="mt-1 text-[0.7rem] text-muted-foreground">by age {retirementAge}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly Impact
          </p>
          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between text-[0.8rem]">
              <span className="text-muted-foreground">You contribute</span>
              <span className="font-semibold text-foreground">{formatCurrency(derived.monthlyContribution)}</span>
            </div>
            <div className="flex justify-between text-[0.8rem]">
              <span className="text-muted-foreground">Employer adds</span>
              <span className="font-semibold text-success">+{formatCurrency(derived.monthlyEmployerMatch)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 to-transparent">
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
          <div className="flex justify-between text-[0.65rem] text-muted-foreground">
            <span>Now</span>
            <span>Age {retirementAge}</span>
          </div>
        </div>
        <div className="absolute right-4 top-4 rounded-lg bg-card/80 px-2.5 py-1.5 backdrop-blur-sm">
          <p className="text-[0.7rem] text-muted-foreground">Est. growth</p>
          <p className="text-sm font-bold text-primary">{formatCurrency(derived.projectedBalance)}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Compare Scenarios
          </p>
          <button
            type="button"
            onClick={onToggleCompare}
            className="text-[0.75rem] font-medium text-primary transition-colors hover:text-primary/80"
          >
            {showCompare ? "Hide" : "Show"}
          </button>
        </div>
        {showCompare && (
          <div className="mt-3 space-y-2">
            {COMPARE_SCENARIOS.map((s) => {
              const projHeight = Math.min(100, Math.round((s.pct / 15) * 100));
              return (
                <button
                  key={s.pct}
                  type="button"
                  onClick={() => onApplyPercent(s.pct)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    contributionPercent === s.pct
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/20 hover:border-primary/30",
                  )}
                >
                  <span className="w-8 text-[0.8rem] font-bold text-primary">{s.label}</span>
                  <div className="flex-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-1.5 rounded-full bg-primary/60"
                        style={{ width: `${projHeight}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
