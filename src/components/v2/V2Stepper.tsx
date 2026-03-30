import { Fragment } from "react";
import { Check } from "lucide-react";

export interface V2StepperProps {
  /** 1-based current step index */
  currentStep: number;
  labels: readonly string[];
}

/**
 * Horizontal stepper from figma-dump `retirement-age-planner.tsx` (circles + connectors + sm: labels).
 */
export function V2Stepper({ currentStep, labels }: V2StepperProps) {
  const max = labels.length;

  return (
    <nav
      className="v2-stepper-nav"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={max}
      aria-label="Enrollment progress"
    >
      {labels.map((label, i) => {
        const stepNum = i + 1;
        const isDone = currentStep > stepNum;
        const isActive = currentStep === stepNum;
        const circleClass = [
          "v2-stepper-circle",
          isDone && "v2-stepper-circle--done",
          !isDone && isActive && "v2-stepper-circle--active",
          !isDone && !isActive && "v2-stepper-circle--upcoming",
        ]
          .filter(Boolean)
          .join(" ");

        const labelClass = [
          "v2-stepper-label",
          currentStep >= stepNum ? "v2-stepper-label--strong" : "v2-stepper-label--muted",
        ].join(" ");

        return (
          <Fragment key={label}>
            <div className="v2-stepper-seg">
              <div
                className={circleClass}
                aria-label={`Step ${stepNum}: ${label}`}
                aria-current={isActive ? "step" : undefined}
              >
                {isDone ? <Check className="v2-stepper-check" size={20} strokeWidth={2.5} aria-hidden /> : stepNum}
              </div>
              <span className={labelClass}>{label}</span>
            </div>
            {i < labels.length - 1 ? (
              <div
                className={["v2-stepper-connector", currentStep > i + 1 ? "v2-stepper-connector--done" : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden
              />
            ) : null}
          </Fragment>
        );
      })}
    </nav>
  );
}
