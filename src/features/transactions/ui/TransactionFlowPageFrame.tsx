import type { ReactNode } from "react";
import { X } from "lucide-react";

/**
 * Flow chrome below the global header: title, step indicator, exit, progress strip, outlet.
 * Sticky rows use `top-16` to sit under the app header (`h-16`).
 */
export function TransactionFlowPageFrame({
  title,
  currentStep,
  totalSteps,
  onExit,
  progress,
  children,
  contentClassName = "mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10",
}: {
  title: string;
  currentStep: number;
  totalSteps: number;
  onExit: () => void;
  progress: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="sticky top-16 z-40 border-b border-default bg-[var(--surface-card)]">
        <div className="container-app flex h-14 items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-[-0.3px] text-primary">{title}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.5px] text-secondary">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-default bg-surface-card text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Exit to Transaction Center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="border-b border-default bg-surface-card">
        <div className="container-app">{progress}</div>
      </div>

      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
}
