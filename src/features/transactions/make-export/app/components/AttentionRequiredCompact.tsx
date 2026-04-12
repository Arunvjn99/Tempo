import { Button } from "./ui/button";
import { AlertCircle, ArrowRight, FileWarning } from "lucide-react";
import { motion } from "motion/react";

interface AttentionRequiredCompactProps {
  transactionType: string;
  amount: string;
  message: string;
  onResolve: () => void;
}

export function AttentionRequiredCompact({
  transactionType,
  amount,
  message,
  onResolve,
}: AttentionRequiredCompactProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-warning)_28%,var(--border-default))]/70"
      style={{
        background:
          "linear-gradient(145deg, color-mix(in srgb, var(--color-warning) 10%, var(--surface-card)) 0%, var(--color-warning-light) 40%, color-mix(in srgb, var(--color-warning) 8%, var(--surface-card)) 100%)",
        boxShadow:
          "0 4px 24px rgba(245,158,11,0.08), 0 1px 3px rgba(245,158,11,0.06)",
      }}
    >
      {/* Decorative glow circles */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-[color-mix(in_srgb,var(--color-warning)_18%,var(--surface-card))]/15 rounded-full blur-2xl" />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] rounded-full blur-2xl" />

      <div className="relative p-5">
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="p-2.5 rounded-xl bg-gradient-to-br from-[color-mix(in_srgb,var(--color-warning)_14%,var(--surface-card))] to-[color-mix(in_srgb,var(--color-warning)_18%,var(--surface-card))]/60 flex-shrink-0"
            style={{ boxShadow: "0 2px 10px rgba(245,158,11,0.12)" }}
          >
            <AlertCircle className="w-5 h-5 text-[var(--color-warning)]" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary text-sm mb-1.5">
              {transactionType}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-secondary">Amount: {amount}</span>
              <span className="px-2 py-0.5 bg-[color-mix(in_srgb,var(--color-warning)_18%,var(--surface-card))]/60 text-[color-mix(in_srgb,var(--color-warning)_55%,var(--text-primary))] text-[10px] font-semibold rounded-full border border-[color-mix(in_srgb,var(--color-warning)_32%,var(--border-default))]/40">
                Action Required
              </span>
            </div>
          </div>
        </div>

        {/* Issue description */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-background/50 border border-[color-mix(in_srgb,var(--color-warning)_22%,var(--border-default))]/60 mb-4">
          <FileWarning className="w-3.5 h-3.5 text-[var(--color-warning)] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-primary leading-relaxed">{message}</p>
        </div>

        <Button
          onClick={onResolve}
          size="sm"
          className="w-full bg-gradient-to-r from-[var(--color-warning)] to-[var(--color-warning)] hover:from-[var(--color-warning)] hover:to-[color-mix(in_srgb,var(--color-warning)_75%,var(--text-primary))] text-primary-foreground border-0 rounded-xl h-10 transition-all duration-200 group cursor-pointer"
          style={{ boxShadow: "0 2px 10px rgba(245,158,11,0.25)" }}
        >
          Resolve Issue
          <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
