// ─────────────────────────────────────────────
// EnrollmentActionRow — Figma footer: text Back + rounded-xl Continue
// ─────────────────────────────────────────────

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

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
    <div
      className={cn(
        "mt-8 flex items-center justify-between gap-4 border-t border-default bg-background/95 pt-6",
        className,
      )}
    >
      {!hideBack && onBack ? (
        <Button
          type="button"
          variant="ghost"
          size="custom"
          onClick={onBack}
          className="inline-flex h-auto min-h-0 items-center gap-1 px-0 py-0 text-enroll-back font-semibold text-secondary hover:bg-transparent hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Button>
      ) : (
        <span aria-hidden className="w-px" />
      )}
      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(
          "inline-flex min-w-[8rem] items-center gap-2 font-semibold transition-all active:scale-[0.98]",
          nextDisabled && "cursor-not-allowed border border-default bg-surface-card text-secondary hover:opacity-100",
        )}
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}
