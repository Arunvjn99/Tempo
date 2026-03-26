import { useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function TransactionCenterFinancialGuidance() {
  const { t } = useTranslation();
  const TC = "transactions.center.";

  const insights = useMemo(
    () =>
      [
        {
          icon: <TrendingUp className="w-4 h-4" />,
          title: t(`${TC}guidanceMatchTitle`),
          description: t(`${TC}guidanceMatchDesc`),
          type: "opportunity" as const,
          cta: t(`${TC}guidanceMatchCta`),
        },
        {
          icon: <AlertTriangle className="w-4 h-4" />,
          title: t(`${TC}guidanceLoanTitle`),
          description: t(`${TC}guidanceLoanDesc`),
          type: "warning" as const,
          cta: t(`${TC}guidanceLoanCta`),
        },
        {
          icon: <DollarSign className="w-4 h-4" />,
          title: t(`${TC}guidancePayTitle`),
          description: t(`${TC}guidancePayDesc`),
          type: "info" as const,
          cta: t(`${TC}guidancePayCta`),
        },
      ] as const,
    [t],
  );

  const typeStyles = useMemo(
    () =>
      ({
        opportunity: { tag: t(`${TC}guidanceTagOpportunity`) },
        warning: { tag: t(`${TC}guidanceTagWarning`) },
        info: { tag: t(`${TC}guidanceTagInfo`) },
      }) as const,
    [t],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
            className="relative overflow-hidden cursor-pointer group transition-all duration-200"
            style={{
              background: "var(--card-bg)",
              borderRadius: 12,
              border: "1px solid var(--border)",
              padding: "16px",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 12%, transparent) 0%, color-mix(in srgb, var(--color-primary) 6%, transparent) 100%)",
              }}
            />

            <div className="pointer-events-none absolute right-4 top-4 opacity-30 transition-opacity duration-200 group-hover:opacity-60">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>

            <div className="relative">
              <div className="flex items-start justify-between mb-3.5">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-[10px] border",
                    "border-primary/25 bg-primary/10 text-primary",
                  )}
                >
                  {insight.icon}
                </div>
                <span
                  className={cn(
                    "rounded-md border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10.5px] font-bold text-primary",
                  )}
                >
                  {style.tag}
                </span>
              </div>

              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--foreground)",
                  letterSpacing: "-0.3px",
                  marginBottom: 6,
                }}
              >
                {insight.title}
              </h4>
              <p className="leading-relaxed" style={{ fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: 16 }}>
                {insight.description}
              </p>

              <div className="flex items-center text-sm font-semibold text-primary transition-colors duration-200 group-hover:opacity-90">
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
