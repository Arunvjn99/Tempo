import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIToastProps {
  message: string;
  actionLabel?: string;
  onActionClick?: () => void;
  onDismiss?: () => void;
  visible?: boolean;
  className?: string;
}

export function AIToast({
  message,
  actionLabel,
  onActionClick,
  onDismiss,
  visible = true,
  className,
}: AIToastProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-4 rounded-full border px-6 py-4 shadow-2xl",
        "border-[var(--border-subtle)]",
        "bg-[color-mix(in_srgb,var(--color-primary)_78%,var(--color-bg))] text-[var(--color-on-colored-surface)] backdrop-blur-xl",
        className,
      )}
      role="status"
    >
      <div className="ai-glow flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-on-tertiary-container)]">
        <Sparkles className="h-4 w-4 text-[var(--color-on-colored-surface)]" strokeWidth={2} />
      </div>
      <p className="max-w-md text-sm font-medium text-[var(--color-on-colored-surface)]">
        {message}{" "}
        {actionLabel ? (
          <button
            type="button"
            onClick={onActionClick}
            className="ml-1 font-bold underline transition-opacity hover:opacity-80"
          >
            {actionLabel}
          </button>
        ) : null}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-[color-mix(in_srgb,var(--color-on-colored-surface)_45%,transparent)] transition-colors hover:text-[var(--color-on-colored-surface)]"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>
    </div>
  );
}
