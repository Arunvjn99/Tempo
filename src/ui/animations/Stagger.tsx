import { motion, useReducedMotion, type HTMLMotionProps } from "./framer";
import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { motionTransition } from "./motionTokens";

const defaultItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: motionTransition({ duration: "normal", ease: "smooth" }),
  },
};

export type StaggerRootProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  /** Delay between children (seconds). */
  stagger?: number;
  delayChildren?: number;
};

/**
 * Parent for staggered children — pair with {@link StaggerItem}.
 */
export function StaggerRoot({
  children,
  className,
  stagger = 0.07,
  delayChildren = 0.04,
  ...props
}: StaggerRootProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} {...(props as object)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type StaggerItemProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
};

export function StaggerItem({ children, className, variants, ...props }: StaggerItemProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} {...(props as object)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div className={cn(className)} variants={variants ?? defaultItem} {...props}>
      {children}
    </motion.div>
  );
}
