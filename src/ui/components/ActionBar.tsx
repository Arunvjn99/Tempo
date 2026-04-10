import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { motionWhileHover, motionWhileTap, motionInteractionTransition } from "@/ui/animations/motionTokens";

interface ActionBarProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  isLoading?: boolean;
  hideBack?: boolean;
  hideNext?: boolean;
  className?: string;
  /** Custom content between back and next */
  center?: ReactNode;
}

export function ActionBar({
  onNext,
  onBack,
  nextLabel = "Continue",
  backLabel = "Back",
  nextDisabled = false,
  backDisabled = false,
  isLoading = false,
  hideBack = false,
  hideNext = false,
  className,
  center,
}: ActionBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-md pt-lg",
        hideBack && "justify-end",
        className,
      )}
    >
      {!hideBack && (
        <motion.button
          type="button"
          onClick={onBack}
          disabled={backDisabled}
          whileHover={motionWhileHover}
          whileTap={motionWhileTap}
          transition={motionInteractionTransition}
          className={cn(
            "inline-flex items-center gap-sm rounded-button border border-border bg-surface px-md py-sm text-sm font-medium text-foreground transition-colors hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {backLabel}
        </motion.button>
      )}

      {center}

      {!hideNext && (
        <motion.button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || isLoading}
          whileHover={!nextDisabled ? motionWhileHover : undefined}
          whileTap={!nextDisabled ? motionWhileTap : undefined}
          transition={motionInteractionTransition}
          className={cn(
            "inline-flex items-center gap-sm rounded-button bg-primary px-lg py-sm text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Processing...
            </>
          ) : (
            <>
              {nextLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}
