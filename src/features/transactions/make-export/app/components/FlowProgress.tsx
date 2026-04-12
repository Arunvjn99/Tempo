import { Check } from "lucide-react";
import { motion } from "motion/react";

interface Step {
  number: number;
  label: string;
  path: string;
}

interface FlowProgressProps {
  steps: Step[];
  currentStep: number;
}

export function FlowProgress({ steps, currentStep }: FlowProgressProps) {
  return (
    <div className="w-full py-4 sm:py-8">
      <div className="mx-auto max-w-4xl">
        {/* Mobile: compact horizontal stepper */}
        <div className="sm:hidden">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-xs font-bold text-primary">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-xs font-medium text-secondary">
              {steps[currentStep - 1]?.label}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-sm bg-border">
            <motion.div
              className="h-full rounded-sm bg-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${(currentStep / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between px-0.5">
            {steps.map((step) => {
              const isComplete = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              return (
                <div
                  key={step.number}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: 8,
                    height: 8,
                    background: isComplete || isCurrent ? "var(--color-primary)" : "var(--border-default)",
                    boxShadow: isCurrent ? "0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent)" : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Desktop: full stepper */}
        <div className="relative hidden sm:block">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-border">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep - 1) / Math.max(steps.length - 1, 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isComplete = step.number < currentStep;
              const isCurrent = step.number === currentStep;

              return (
                <div key={step.number} className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="mb-2 flex items-center justify-center transition-all duration-200"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      background: isComplete || isCurrent ? "var(--color-primary)" : "var(--color-card)",
                      color: isComplete || isCurrent ? "var(--primary-foreground)" : "var(--color-text-muted)",
                      border:
                        !isComplete && !isCurrent ? "2px solid var(--border-default)" : "none",
                      boxShadow:
                        isCurrent
                          ? "0 0 0 4px color-mix(in srgb, var(--color-primary) 12%, transparent), 0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)"
                          : isComplete
                            ? "0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)"
                            : undefined,
                    }}
                  >
                    {isComplete ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-bold">{step.number}</span>
                    )}
                  </motion.div>
                  <p
                    className={`max-w-[120px] text-center text-xs ${
                      isCurrent
                        ? "font-bold text-primary"
                        : isComplete
                          ? "font-semibold text-primary/90"
                          : "font-medium text-secondary"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
