import { motion, useReducedMotion, type HTMLMotionProps } from "./framer";
import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { motionInteractionTransition, motionScale, motionTransition } from "./motionTokens";

export type AnimatedCardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  /** Run entrance animation when mounted (default true). */
  animateOnMount?: boolean;
  /** Hover lift + shadow (default true). */
  interactive?: boolean;
};

/**
 * Card surface with optional entrance motion and hover / tap micro-interactions.
 */
export function AnimatedCard({
  children,
  className,
  animateOnMount = true,
  interactive = true,
  ...motionProps
}: AnimatedCardProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={cn("rounded-3xl border border-border bg-card shadow-sm", className)}>{children}</div>
    );
  }

  return (
    <motion.div
      className={cn(
        "rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-200",
        interactive && "hover:shadow-md",
        className,
      )}
      initial={animateOnMount ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition({ duration: "normal", ease: "smooth" })}
      whileHover={interactive ? { y: -3, transition: motionInteractionTransition } : undefined}
      whileTap={interactive ? { scale: motionScale.press, transition: motionInteractionTransition } : undefined}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
