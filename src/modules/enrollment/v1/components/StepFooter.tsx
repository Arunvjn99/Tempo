import type { ReactNode } from "react";
import { ChevronRight, Save } from "lucide-react";
import { cn } from "@/lib/utils";

type StepFooterProps = {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  finishLabel?: string;
  nextDisabled?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  className?: string;
  /** Optional center slot (e.g. Core AI FAB). Hidden on narrow viewports. */
  center?: ReactNode;
  /** First step: leave wizard (e.g. dashboard). Enables left action when would otherwise be disabled. */
  onSaveAndExit?: () => void;
  /** Figma-style primary CTA glow + chevron. */
  wizardChrome?: boolean;
  /** Hide primary continue (e.g. plan step uses in-content CTAs only). */
  hideNext?: boolean;
};

export function StepFooter({
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  finishLabel = "Finish",
  nextDisabled = false,
  isFirstStep = false,
  isLastStep = false,
  className,
  center,
  onSaveAndExit,
  wizardChrome = false,
  hideNext = false,
}: StepFooterProps) {
  const saveExit = isFirstStep && onSaveAndExit != null;
  const leftDisabled = isFirstStep && !saveExit;

  return (
    <footer
      className={cn("footer-actions--triple", hideNext && "footer-actions--hide-next", className)}
    >
      <div className="footer-actions__left">
        <button
          type="button"
          onClick={saveExit ? onSaveAndExit : onBack}
          disabled={leftDisabled}
          className={cn(
            "btn h-10 min-h-10 min-w-[5.5rem] rounded-md px-4 text-sm sm:min-w-0",
            wizardChrome && saveExit
              ? "btn-ghost text-[var(--enroll-text-secondary)] hover:bg-[var(--enroll-soft-bg)] dark:text-foreground dark:hover:bg-[var(--enroll-soft-bg)]"
              : "btn-outline",
          )}
        >
          {wizardChrome && saveExit ? (
            <Save className="size-4 shrink-0 opacity-80" aria-hidden />
          ) : null}
          {backLabel}
        </button>
      </div>
      <div className="footer-actions__center">{center ?? null}</div>
      <div className="footer-actions__right">
        {hideNext ? null : (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className={cn(
              "btn btn-primary h-10 min-h-10 min-w-[5.5rem] rounded-md px-4 text-sm sm:min-w-0",
              wizardChrome && "btn-enrollment-wizard-continue",
            )}
          >
            {isLastStep ? finishLabel : nextLabel}
            {wizardChrome && !isLastStep ? (
              <ChevronRight className="size-5 shrink-0 opacity-95" aria-hidden />
            ) : null}
          </button>
        )}
      </div>
    </footer>
  );
}
