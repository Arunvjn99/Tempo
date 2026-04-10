import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, X, Zap } from "lucide-react";
import { motionTransition } from "@/ui/animations/motionTokens";
import { Button } from "@/ui/components/Button";
import { formatCurrency } from "@/features/enrollment/store/derived";
import type { ReadinessSuggestionView } from "@/features/enrollment/store/readinessSuggestions";

export interface ReadinessSuggestionConfirmModalProps {
  isOpen: boolean;
  suggestion: ReadinessSuggestionView | null;
  currentScore: number;
  currentBalance: number;
  onCancel: () => void;
  onApply: () => void;
}

export function ReadinessSuggestionConfirmModal({
  isOpen,
  suggestion,
  currentScore,
  currentBalance,
  onCancel,
  onApply,
}: ReadinessSuggestionConfirmModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !suggestion) return null;

  const scoreDiff = suggestion.newScore - currentScore;
  const balanceDiff = suggestion.projectedBalance - currentBalance;

  return (
    <motion.div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      initial={{ opacity: reduce ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={motionTransition({ duration: "fast", ease: "smooth" })}
      onClick={(e) => {
        if (e.target === backdropRef.current) onCancel();
      }}
    >
      <motion.div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={motionTransition({ duration: "normal", ease: "snappy" })}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-[1rem] font-semibold text-foreground">Confirm Change</p>
            <p className="mt-0.5 text-[0.75rem] text-muted-foreground">Review the impact before applying.</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="iconSm"
            onClick={onCancel}
            className="rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-wide text-muted-foreground">
              What&apos;s changing
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-xl bg-muted p-3 text-center">
                <p className="text-[0.68rem] font-medium text-muted-foreground">{suggestion.currentLabel}</p>
                <p className="mt-0.5 text-[1.1rem] font-bold text-foreground">{suggestion.currentValue}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 rounded-xl border border-primary/30 bg-primary/5 p-3 text-center">
                <p className="text-[0.68rem] font-medium text-primary">{suggestion.newLabel}</p>
                <p className="mt-0.5 text-[1.1rem] font-bold text-primary">{suggestion.newValue}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-wide text-muted-foreground">Impact</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                <span className="text-[0.82rem] text-foreground">Readiness score</span>
                <div className="flex items-center gap-2">
                  <span className="text-[0.9rem] font-semibold text-muted-foreground tabular-nums">{currentScore}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[0.9rem] font-bold text-success tabular-nums">{suggestion.newScore}</span>
                  <span className="flex items-center gap-0.5 rounded bg-success/10 px-1.5 py-0.5 text-[0.68rem] font-semibold text-success">
                    <ArrowUpRight className="h-2.5 w-2.5" />+{scoreDiff}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                <span className="text-[0.82rem] text-foreground">Additional annual savings</span>
                <span className="text-[0.9rem] font-bold text-success tabular-nums">
                  +{formatCurrency(suggestion.additionalAnnualSavings)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                <span className="text-[0.82rem] text-foreground">Projected retirement balance</span>
                <div className="flex items-center gap-2">
                  <span className="text-[0.82rem] text-muted-foreground tabular-nums">
                    {formatCurrency(currentBalance)}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[0.9rem] font-bold text-foreground tabular-nums">
                    {formatCurrency(suggestion.projectedBalance)}
                  </span>
                </div>
              </div>

              {balanceDiff > 0 && (
                <div className="rounded-xl border border-success/20 bg-success/5 px-4 py-2.5 text-center">
                  <span className="text-[0.82rem] font-semibold text-success">
                    +{formatCurrency(balanceDiff)} more at retirement
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={onCancel}
            className="rounded-xl border border-border px-5 py-2.5 text-[0.85rem] font-medium text-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={onApply}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[0.85rem] font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Zap className="h-3.5 w-3.5" /> Apply Change
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
