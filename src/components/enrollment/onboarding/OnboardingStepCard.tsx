import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface OnboardingStepCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * White / surface card wrapping step-specific controls (guided decision pattern).
 */
export function OnboardingStepCard({ children, className }: OnboardingStepCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-sm dark:bg-[var(--color-surface)]",
        className,
      )}
    >
      <div className="flex flex-col space-y-6">{children}</div>
    </div>
  );
}
