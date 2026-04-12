import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/core/lib/utils";

export type EnrollmentCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** When false, skip `card-standard` (rare; e.g. inset-only panels). */
  variant?: "standard" | "plain";
};

/**
 * Card surface used across Figma Make enrollment — `card-standard` + optional layout classes.
 */
export function EnrollmentCard({
  children,
  className,
  variant = "standard",
  ...rest
}: EnrollmentCardProps) {
  return (
    <div
      className={cn(variant === "standard" && "card-standard", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
