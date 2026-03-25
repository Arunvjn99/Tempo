import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface WizardGuideInsightProps {
  children: ReactNode;
  className?: string;
}

const t = { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const };

/**
 * Centered neutral insight block below the main step card (guided experience).
 */
export function WizardGuideInsight({ children, className }: WizardGuideInsightProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={t}
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-muted/40 px-4 py-4 text-center text-sm leading-relaxed text-[var(--color-text-secondary)] dark:bg-muted/25",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
