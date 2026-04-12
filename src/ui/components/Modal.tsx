import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { motionTransition } from "@/ui/animations/motionTokens";
import { Button } from "@/ui/components/Button";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Ignored when `bare` is true (use `contentAriaLabel`). */
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Hide the built-in close control (still closes via overlay / Escape when applicable). */
  hideClose?: boolean;
  /** Children-only panel (e.g. multi-step flows); no title/description chrome. */
  bare?: boolean;
  /** Accessible name when `bare` is true. */
  contentAriaLabel?: string;
}

export function Modal({
  open,
  onOpenChange,
  title = "",
  description,
  children,
  className,
  hideClose = false,
  bare = false,
  contentAriaLabel = "Dialog",
}: ModalProps) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={bare ? contentAriaLabel : undefined}
      aria-labelledby={bare ? undefined : titleId}
      aria-describedby={bare || !description ? undefined : descriptionId}
    >
      <motion.button
        type="button"
        className="absolute inset-0 z-0 bg-[var(--modal-overlay)]"
        aria-label="Close dialog"
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={motionTransition({ duration: "fast", ease: "smooth" })}
        onClick={() => onOpenChange(false)}
      />
      <motion.div
        className={cn(
          "absolute left-1/2 top-1/2 z-10 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-card border border-default bg-[var(--surface-card)] text-primary shadow-lg outline-none",
          bare ? "max-h-[min(90vh,880px)] max-w-2xl overflow-hidden p-0" : "max-w-lg p-lg",
          className,
        )}
        initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={motionTransition({ duration: "normal", ease: "snappy" })}
      >
        {bare ? (
          <div className="relative max-h-[min(90vh,880px)] overflow-y-auto p-6 sm:p-8">
            {!hideClose && (
              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                className="absolute right-3 top-3 z-20 rounded-md text-secondary hover:text-primary"
                aria-label="Close"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {children}
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-md">
              <div className="min-w-0 space-y-xs pr-md">
                <h2 id={titleId} className="text-lg font-semibold text-primary">
                  {title}
                </h2>
                {description ? (
                  <p id={descriptionId} className="text-sm text-secondary">
                    {description}
                  </p>
                ) : null}
              </div>
              {!hideClose && (
                <Button
                  type="button"
                  variant="ghost"
                  size="iconSm"
                  className="shrink-0 rounded-md text-secondary hover:text-primary"
                  aria-label="Close"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mt-md">{children}</div>
          </>
        )}
      </motion.div>
    </div>,
    document.body,
  );
}
