import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdvisorAssistanceCardProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  /** Defaults to Calendar */
  icon?: LucideIcon;
  className?: string;
  /** Larger layout for pre-enrollment assistance row */
  size?: "default" | "lg";
};

/**
 * Light advisor tile for the pre-enrollment “Need Assistance” row.
 * Matches {@link AICard} footprint (min/max height, radius, inner flex) for equal-height pairing.
 */
export function AdvisorAssistanceCard({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Calendar,
  className,
  size = "default",
}: AdvisorAssistanceCardProps) {
  return (
    <motion.div
      className={cn("dash-advisor-card group", size === "lg" && "dash-advisor-card--lg", className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dash-advisor-card__inner">
        <div className="dash-advisor-card__lead">
          <div className="dash-advisor-card__visual" aria-hidden>
            <div className="dash-advisor-card__icon-wrap">
              <Icon
                className={cn(
                  "text-[var(--color-primary)]",
                  size === "lg" ? "h-7 w-7" : "h-6 w-6",
                )}
                strokeWidth={2}
              />
            </div>
          </div>

          <div className="dash-advisor-card__body">
            <h3 className="dash-advisor-card__title">{title}</h3>
            <p className="dash-advisor-card__desc">{description}</p>
          </div>
        </div>

        <div className="dash-advisor-card__cta-wrap">
          <button type="button" className="dash-advisor-card__cta" onClick={onAction}>
            {actionLabel}
            <ArrowRight
              className={cn("dash-advisor-card__cta-arrow", size === "lg" ? "h-[1.125rem] w-[1.125rem]" : "h-4 w-4")}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
