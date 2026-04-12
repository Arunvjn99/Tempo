// ─────────────────────────────────────────────
// SegmentedStepProgress — Figma Make horizontal segments + labels
// (Final _Satish Implement User Flow)
// ─────────────────────────────────────────────

import { cn } from "@/core/lib/utils";

export const ENROLLMENT_MAIN_STEP_LABELS = [
  "Plan",
  "Contribution",
  "Source",
  "Auto Increase",
  "Investment",
  "Readiness",
  "Review",
] as const;

export const WIZARD_STEP_LABELS = ["Age", "Location", "Savings", "Comfort"] as const;

interface SegmentedStepProgressProps {
  /** 1-based current step index */
  currentStep: number;
  labels: readonly string[];
  className?: string;
}

export function SegmentedStepProgress({
  currentStep,
  labels,
  className,
}: SegmentedStepProgressProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} role="list">
      {labels.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        return (
          <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5" role="listitem">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "h-2 w-full rounded-full transition-all",
                  isCompleted && "bg-primary",
                  isCurrent && !isCompleted && "h-3 bg-[color:var(--color-accent)] ring-2 ring-[color:var(--color-accent)]/35",
                  !isCompleted && !isCurrent && "bg-border",
                )}
                aria-hidden
              />
            </div>
            <span
              className={cn(
                "hidden text-center text-[0.7rem] transition-colors md:block",
                isCurrent && "font-semibold text-[color:var(--color-accent)]",
                isCompleted && !isCurrent && "text-primary",
                !isCompleted && !isCurrent && "text-secondary",
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface WizardSegmentedProgressProps {
  wizardStep: number;
  className?: string;
}

export function WizardSegmentedProgress({ wizardStep, className }: WizardSegmentedProgressProps) {
  return (
    <div className={cn("mb-6", className)}>
      <p className="mb-2 text-[0.75rem] text-secondary">
        Step {wizardStep} of {WIZARD_STEP_LABELS.length}
      </p>
      <SegmentedStepProgress currentStep={wizardStep} labels={WIZARD_STEP_LABELS} />
    </div>
  );
}
