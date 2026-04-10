// ─────────────────────────────────────────────
// AutoIncreasePage — Figma pixel-perfect rebuild
// ─────────────────────────────────────────────

import { ArrowLeft, ArrowRight, TrendingUp, Minus } from "lucide-react";
import { useEnrollmentStore, useEnrollmentDerived } from "../store";
import { formatCurrency } from "../store/derived";
import { Button } from "@/ui/components/Button";

export function AutoIncreasePage() {
  const enrollment = useEnrollmentStore((s) => s.enrollment);
  const updateEnrollment = useEnrollmentStore((s) => s.updateEnrollment);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);
  const derived = useEnrollmentDerived();

  const withAI = derived.projectedBalance;
  const withoutAI = derived.projectedBalanceNoAI;
  const difference = withAI - withoutAI;

  const handleSelect = (autoIncrease: boolean) => {
    updateEnrollment({ autoIncrease });
    nextStep();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          type="button"
          variant="ghost"
          size="custom"
          onClick={prevStep}
          className="mb-3 inline-flex h-auto items-center gap-1 px-0 text-[0.85rem] text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Increase your savings automatically</h1>
        <p className="mt-1 text-[0.9rem] text-muted-foreground">
          Small increases today can grow your retirement savings over time.
        </p>
      </div>

      {/* Two-col option cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Fixed card */}
        <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Minus className="h-5 w-5 text-muted-foreground" aria-hidden />
          </div>
          <h3 className="mt-3 text-base font-semibold text-foreground">Keep Contributions Fixed</h3>
          <p className="mt-1.5 text-[0.85rem] text-muted-foreground">
            Your contribution stays at {enrollment.contributionPercent}% throughout.
          </p>
          <div className="mt-4 flex-1">
            <p className="text-[0.75rem] text-muted-foreground">Projected in 10 years</p>
            <p className="mt-0.5 text-[2rem] font-bold text-foreground">
              {formatCurrency(withoutAI)}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="custom"
            onClick={() => handleSelect(false)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[0.9rem] font-medium transition-all hover:bg-muted active:scale-[0.98]"
          >
            Skip Auto Increase
          </Button>
        </div>

        {/* Recommended card */}
        <div className="relative flex flex-col rounded-2xl border-2 border-success bg-card p-5 shadow-sm">
          <span className="absolute -top-3 left-4 rounded-full bg-success px-3 py-0.5 text-[0.75rem] font-semibold text-white">
            Recommended
          </span>
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
            <TrendingUp className="h-5 w-5 text-success" aria-hidden />
          </div>
          <h3 className="mt-3 text-base font-semibold text-foreground">Enable Auto Increase</h3>
          <p className="mt-1.5 text-[0.85rem] text-muted-foreground">
            Increase by 1% each year up to {enrollment.autoIncreaseMax}%.
          </p>
          <div className="mt-4 flex-1">
            <p className="text-[0.75rem] text-muted-foreground">Projected in 10 years</p>
            <p className="mt-0.5 text-[2rem] font-bold text-success">
              {formatCurrency(withAI)}
            </p>
          </div>
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={() => handleSelect(true)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-success py-3 text-[0.9rem] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Enable Auto Increase
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>

      {/* Impact banner */}
      {difference > 0 && (
        <div className="rounded-xl border border-success/20 bg-success/10 p-4 text-center">
          <p className="text-[0.9rem] font-medium text-success">
            Automatic increases could add{" "}
            <span className="font-bold">+{formatCurrency(difference)}</span> over 10 years.
          </p>
        </div>
      )}

      {/* Navigation row */}
      <div className="flex items-center">
        <Button
          type="button"
          variant="secondary"
          size="custom"
          onClick={prevStep}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[0.875rem] font-medium transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Button>
      </div>
    </div>
  );
}
