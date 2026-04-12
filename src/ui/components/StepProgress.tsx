import { Check } from "lucide-react";
import { cn } from "@/core/lib/utils";

interface StepProgressProps {
  steps: { label: string }[];
  currentStep: number; // 0-indexed
  className?: string;
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center gap-0">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <li key={step.label} className="flex flex-1 items-center">
              {idx > 0 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors",
                    isCompleted ? "bg-[var(--color-primary)]" : "bg-border",
                  )}
                  aria-hidden
                />
              )}

              <div className="flex flex-col items-center gap-xs">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                    isCompleted &&
                      "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--primary-foreground)]",
                    isActive && "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--surface-card))] text-brand",
                    !isCompleted && !isActive && "border-default bg-surface-soft text-secondary",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted ? <Check className="h-4 w-4" aria-hidden /> : idx + 1}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    isActive ? "text-brand" : "text-secondary",
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
