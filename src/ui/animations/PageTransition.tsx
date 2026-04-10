import { AnimatePresence, motion, useReducedMotion } from "./framer";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/core/lib/utils";
import {
  motionOffset,
  motionTransition,
  type MotionDurationName,
  type MotionEaseName,
} from "./motionTokens";

export type PageTransitionProps = {
  children: ReactNode;
  className?: string;
  duration?: MotionDurationName;
  ease?: MotionEaseName;
};

/**
 * Route-aware enter/exit. Place around `<Outlet />` (or page child) inside the router layout.
 * Uses `location.pathname` as `key` and `mode="wait"` for clean handoff.
 */
export function PageTransition({
  children,
  className,
  duration = "normal",
  ease = "smooth",
}: PageTransitionProps) {
  const location = useLocation();
  const reduce = useReducedMotion();
  const yIn = motionOffset.pageY;
  const yOut = motionOffset.pageExitY;

  if (reduce) {
    return <div className={cn("min-h-0 min-w-0 flex-1", className)}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className={cn("min-h-0 min-w-0 flex-1", className)}
        initial={{ opacity: 0, y: yIn }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -yOut }}
        transition={motionTransition({ duration, ease })}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
