// ─────────────────────────────────────────────
// EnrollmentActionRow — Figma footer: text Back + rounded-xl Continue
// ─────────────────────────────────────────────

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/core/lib/utils";

interface EnrollmentActionRowProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideBack?: boolean;
  className?: string;
}

export function EnrollmentActionRow({
  onNext,
  onBack,
  nextLabel = "Continue",
  nextDisabled = false,
  hideBack = false,
  className,
}: EnrollmentActionRowProps) {
  return (
    <div className={cn("mt-8 flex items-center justify-between gap-4", className)}>
      {!hideBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </button>
      ) : (
        <span aria-hidden className="w-px" />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[0.9rem] font-medium transition-all active:scale-[0.98]",
          nextDisabled
            ? "cursor-not-allowed bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground hover:opacity-90",
        )}
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
