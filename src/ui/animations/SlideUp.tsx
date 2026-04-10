import { motion, useReducedMotion } from "./framer";
import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import {
  motionOffset,
  motionTransition,
  type MotionDurationName,
  type MotionEaseName,
} from "./motionTokens";

export type SlideUpProps = {
  children: ReactNode;
  className?: string;
  duration?: MotionDurationName;
  ease?: MotionEaseName;
  delay?: number;
};

/**
 * Fade + slight upward move. Offset from {@link motionOffset.slideUp}.
 */
export function SlideUp({
  children,
  className,
  duration = "normal",
  ease = "smooth",
  delay = 0,
}: SlideUpProps) {
  const reduce = useReducedMotion();
  const y = motionOffset.slideUp;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition({ duration, ease, delay })}
    >
      {children}
    </motion.div>
  );
}
