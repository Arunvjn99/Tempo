import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const insightTransition = { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const };

export interface InsightCardProps {
  children: React.ReactNode;
  className?: string;
  /** `success` uses global `--insight-success-*` tokens (auto-increase / Figma smart insight). Default: violet wizard tone. */
  tone?: "violet" | "success";
}

/**
 * Standardized wizard insight — default violet; `tone="success"` matches enrollment smart-insight gradient system.
 */
export const InsightCard = forwardRef<HTMLDivElement, InsightCardProps>(function InsightCard(
  { children, className, tone = "violet" },
  ref,
) {
  const isSuccess = tone === "success";
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={insightTransition}
      className={cn(
        "px-4 py-3.5",
        isSuccess
          ? "enrollment-insight-card--success"
          : "ai-insight shadow-sm",
        className,
      )}
    >
      <div className="flex gap-3">
        <Sparkles
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 stroke-[2]",
            isSuccess ? "enrollment-insight-card__icon" : "text-[var(--ai-primary)]",
          )}
          aria-hidden
        />
        <div
          className={cn(
            "min-w-0 flex-1 text-sm leading-relaxed",
            isSuccess ? "enrollment-insight-card__body" : "text-[var(--color-text-secondary)]",
          )}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
});
