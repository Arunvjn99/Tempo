import { Fragment } from "react";
import { useTranslation } from "react-i18next";

export interface LoanFlowStepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

/**
 * Figma-style horizontal stepper: numbered circles, labels, dividers.
 * Uses design tokens for dark/light.
 */
export function LoanFlowStepper({
  currentStep,
  totalSteps,
  stepLabels,
}: LoanFlowStepperProps) {
  const { t } = useTranslation();
  const safeStep = Math.min(Math.max(currentStep, 0), totalSteps - 1);

  return (
    <div
      className="loan-flow-stepper"
      role="progressbar"
      aria-valuenow={safeStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={t("transactions.stepOf", {
        current: safeStep + 1,
        total: totalSteps,
      })}
    >
      {stepLabels.slice(0, totalSteps).map((labelKey, index) => {
        const isCompleted = index < safeStep;
        const isCurrent = index === safeStep;
        const isUpcoming = index > safeStep;
        const label = labelKey.startsWith("transactions.") ? t(labelKey) : labelKey;

        return (
          <Fragment key={index}>
            <div className="loan-flow-stepper__item">
              <div
                className={`loan-flow-stepper__circle ${
                  isCompleted
                    ? "loan-flow-stepper__circle--completed"
                    : isCurrent
                      ? "loan-flow-stepper__circle--current"
                      : "loan-flow-stepper__circle--upcoming"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`loan-flow-stepper__label ${
                  isCurrent
                    ? "loan-flow-stepper__label--current"
                    : isUpcoming
                      ? "loan-flow-stepper__label--upcoming"
                      : ""
                }`}
                style={{
                  color: isCurrent
                    ? "var(--color-primary)"
                    : isUpcoming
                      ? "var(--color-text-secondary)"
                      : "var(--color-text)",
                }}
              >
                {label}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div className="loan-flow-stepper__divider" aria-hidden />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
