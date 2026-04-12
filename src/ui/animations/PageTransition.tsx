import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import type { MotionDurationName, MotionEaseName } from "./motionTokens";

export type PageTransitionProps = {
  children: ReactNode;
  className?: string;
  /** Kept for API compatibility; route transitions no longer animate (avoids opacity/compositing bugs). */
  duration?: MotionDurationName;
  ease?: MotionEaseName;
};

/**
 * Route outlet wrapper. Intentionally static — do not wrap the full app in motion/opacity.
 * (Framer route transitions were leaving the tree at non‑1 opacity in some cases.)
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return <div className={cn("min-h-0 min-w-0 flex-1", className)}>{children}</div>;
}
