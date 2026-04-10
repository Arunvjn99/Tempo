import { motion, useReducedMotion } from "./framer";
import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { motionScale, motionTransition, type MotionDurationName, type MotionEaseName } from "./motionTokens";

/** Subtle start scale — derived from press token for visual consistency */
const scaleInInitial = motionScale.press;

export type ScaleInProps = {
  children: ReactNode;
  className?: string;
  duration?: MotionDurationName;
  ease?: MotionEaseName;
  delay?: number;
};

/**
 * Soft scale + fade in (from press-adjacent scale to 1).
 */
export function ScaleIn({
  children,
  className,
  duration = "normal",
  ease = "snappy",
  delay = 0,
}: ScaleInProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, scale: scaleInInitial }}
      animate={{ opacity: 1, scale: 1 }}
      transition={motionTransition({ duration, ease, delay })}
    >
      {children}
    </motion.div>
  );
}
