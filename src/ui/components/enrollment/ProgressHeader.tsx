import { Fragment, type HTMLAttributes } from "react";
import { cn } from "@/core/lib/utils";

export type ProgressStepState = "complete" | "current" | "upcoming";

export interface ProgressHeaderStep {
  id: string;
  label: string;
  state: ProgressStepState;
}

export interface ProgressHeaderProps extends HTMLAttributes<HTMLDivElement> {
  steps: ProgressHeaderStep[];
  /** Accessible label for the nav landmark. */
  ariaLabel?: string;
}

/**
 * Horizontal segmented stepper (Figma: numbered circles + labels + connectors).
 * Parent computes each step’s `state`; no routing or validation here.
 */
export function ProgressHeader({
  steps,
  className,
  ariaLabel = "Enrollment progress",
  ...props
}: ProgressHeaderProps) {
  return (
    <nav
      role="navigation"
      aria-label={ariaLabel}
      className={cn(
        "flex w-full min-w-0 flex-nowrap items-center justify-center gap-0 overflow-x-auto pb-xs",
        className,
      )}
      {...props}
    >
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          <div className="flex min-w-0 shrink-0 items-center gap-sm">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold leading-5 transition-colors",
                step.state === "current" || step.state === "complete"
                  ? "bg-primary text-primary-foreground"
                  : "border border-default bg-surface-card text-secondary",
              )}
              aria-hidden
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "max-w-[7rem] truncate text-sm font-medium leading-5 sm:max-w-none",
                step.state === "upcoming" ? "text-secondary" : "text-primary",
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 ? (
            <span
              className="mx-md hidden h-0.5 w-12 shrink-0 bg-border sm:block"
              aria-hidden
            />
          ) : null}
        </Fragment>
      ))}
    </nav>
  );
}
