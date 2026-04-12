import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/core/lib/utils";

export interface StepCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Padding: default matches Figma wizard inset (24px). */
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "p-0",
  sm: "p-md",
  md: "p-lg",
  lg: "p-xl",
} as const;

/**
 * Elevated enrollment surface — rounded shell, token border (Figma wizard card).
 * No business logic; compose with {@link ProgressHeader}, {@link WizardFormSection}, etc.
 */
export function StepCard({
  children,
  className,
  padding = "md",
  ...props
}: StepCardProps) {
  return (
    <div
      className={cn(
        "card-standard overflow-hidden text-card-foreground",
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
