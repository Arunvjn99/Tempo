import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

const insights = [
  {
    icon: <TrendingUp className="w-4 h-4" />,
    title: "Employer Match",
    description:
      "Contributing 4%. Increase to 6% to unlock $2,400 yearly in employer matches.",
    type: "opportunity" as const,
    cta: "Increase Contribution",
  },
  {
    icon: <AlertTriangle className="w-4 h-4" />,
    title: "Loan Impact",
    description:
      "Taking a loan may reduce retirement savings by up to $8,200 over 10 years.",
    type: "warning" as const,
    cta: "View Analysis",
  },
  {
    icon: <DollarSign className="w-4 h-4" />,
    title: "Next Payment",
    description:
      "Loan payment of $203 will be deducted on March 15, 2026.",
    type: "info" as const,
    cta: "Payment Schedule",
  },
];

const typeStyles = {
  opportunity: {
    tag: "Opportunity",
    tagBg: "color-mix(in srgb, var(--color-accent) 10%, var(--surface-card))",
    tagColor: "var(--color-accent)",
    tagBorder: "color-mix(in srgb, var(--color-accent) 24%, var(--border-default))",
  },
  warning: {
    tag: "Heads Up",
    tagBg: "color-mix(in srgb, var(--color-accent) 10%, var(--surface-card))",
    tagColor: "var(--color-accent)",
    tagBorder: "color-mix(in srgb, var(--color-accent) 24%, var(--border-default))",
  },
  info: {
    tag: "Upcoming",
    tagBg: "color-mix(in srgb, var(--color-accent) 10%, var(--surface-card))",
    tagColor: "var(--color-accent)",
    tagBorder: "color-mix(in srgb, var(--color-accent) 24%, var(--border-default))",
  },
};

export function FinancialGuidanceCompact() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
      {insights.map((insight, idx) => {
        const style = typeStyles[insight.type];
        return (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
            whileHover={{
              y: -2,
              boxShadow: "0 8px 24px rgba(139,92,246,0.12)",
            }}
            className="card-standard relative cursor-pointer overflow-hidden transition-all duration-200 group"
            style={{
              padding: "20px 24px",
            }}
          >
            {/* Subtle purple gradient overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,243,255,0.5) 0%, rgba(237,233,254,0.3) 100%)",
                borderRadius: 16,
              }}
            />

            {/* Subtle AI sparkle */}
            <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity duration-200">
              <Sparkles className="w-3 h-3" style={{ color: "var(--color-accent)" }} />
            </div>

            <div className="relative">
              <div className="flex items-start justify-between mb-3.5">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "color-mix(in srgb, var(--color-accent) 10%, var(--surface-card))",
                    color: "var(--color-accent)",
                    border: "1px solid color-mix(in srgb, var(--color-accent) 24%, var(--border-default))",
                  }}
                >
                  {insight.icon}
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 6,
                    background: style.tagBg,
                    color: style.tagColor,
                    border: `1px solid ${style.tagBorder}`,
                  }}
                >
                  {style.tag}
                </span>
              </div>

              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.3px",
                  marginBottom: 6,
                }}
              >
                {insight.title}
              </h4>
              <p
                className="leading-relaxed"
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  marginBottom: 16,
                }}
              >
                {insight.description}
              </p>

              <div
                className="flex items-center transition-colors duration-200 group-hover:opacity-90"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-accent)",
                }}
              >
                <span>{insight.cta}</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
