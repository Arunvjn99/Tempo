import { motion, useReducedMotion } from "./framer";
import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { motionTransition, type MotionDurationName, type MotionEaseName } from "./motionTokens";

export type FadeInProps = {
  children: ReactNode;
  className?: string;
  duration?: MotionDurationName;
  ease?: MotionEaseName;
  delay?: number;
};

/**
 * Opacity fade-in. Respects reduced motion.
 */
export function FadeIn({
  children,
  className,
  duration = "normal",
  ease = "smooth",
  delay = 0,
}: FadeInProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={motionTransition({ duration, ease, delay })}
    >
      {children}
    </motion.div>
  );
}
