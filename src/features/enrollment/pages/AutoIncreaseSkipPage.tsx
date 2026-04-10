// ─────────────────────────────────────────────
// AutoIncreaseSkipPage — Warning + side-by-side comparison (Figma rebuild)
// ─────────────────────────────────────────────

import { AlertTriangle, TrendingUp, Minus, ArrowRight } from "lucide-react";
import { useEnrollmentStore, useEnrollmentDerived } from "../store";
import { formatCurrency } from "../store/derived";

export function AutoIncreaseSkipPage() {
  const enrollment = useEnrollmentStore((s) => s.enrollment);
  const updateEnrollment = useEnrollmentStore((s) => s.updateEnrollment);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);
  const derived = useEnrollmentDerived();

  const difference = derived.projectedBalance - derived.projectedBalanceNoAI;

  const handleEnable = () => {
    updateEnrollment({ autoIncrease: true });
    prevStep();
  };

  const handleSkip = () => {
    updateEnrollment({ autoIncrease: false });
    nextStep();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            Skip automatic increases?
          </h1>
        </div>
        <p className="mt-1 text-[0.9rem] text-muted-foreground">
          Automatic increases help grow your retirement savings gradually over time without requiring
          large changes today.
        </p>
        <p className="mt-2 text-[0.82rem] text-muted-foreground">
          Automatic increases usually align with salary raises, so your take-home pay typically
          remains comfortable.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">You may be leaving money behind</p>
          <p className="text-sm text-muted-foreground">
            Even a 1% annual increase can add significantly to your retirement balance over time.
            Most participants set auto-increases to align with annual salary raises.
          </p>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* With Auto-Increase — highlighted */}
        <div className="relative flex flex-col rounded-2xl border-2 border-success bg-card p-5 shadow-sm">
          <span className="absolute -top-3 left-4 rounded-full bg-success px-3 py-0.5 text-[0.75rem] font-semibold text-primary-foreground">
            Recommended
          </span>
          <div className="mt-1 mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-base font-semibold text-foreground">With Auto-Increase</h3>
          </div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Estimated retirement balance
          </p>
          <p className="mt-1 text-[2rem] font-bold text-success">
            {formatCurrency(derived.projectedBalance)}
          </p>
          {difference > 0 && (
            <p className="mt-2 text-sm font-medium text-success">
              +{formatCurrency(difference)} more than without
            </p>
          )}
        </div>

        {/* Without Auto-Increase — dimmed */}
        <div className="flex flex-col rounded-2xl border border-border bg-muted/40 p-5 opacity-80">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Minus className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-muted-foreground">Without Auto-Increase</h3>
          </div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Estimated retirement balance
          </p>
          <p className="mt-1 text-[2rem] font-bold text-foreground">
            {formatCurrency(derived.projectedBalanceNoAI)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Staying at {enrollment.contributionPercent}% indefinitely
          </p>
        </div>
      </div>

      {/* Impact Summary Banner */}
      {difference > 0 && (
        <div className="rounded-xl border border-success/20 bg-success/5 p-4 text-center">
          <p className="text-[0.9rem] font-medium text-foreground">
            Automatic increases could add approximately{" "}
            <span className="font-bold text-success">{formatCurrency(difference)}</span> to your
            savings.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleEnable}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-success py-3.5 text-[0.9rem] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          Enable Auto-Increase <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3.5 text-[0.9rem] font-medium text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}
