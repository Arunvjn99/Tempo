import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { motionTransition } from "@/ui/animations/motionTokens";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Hide the built-in close control (still closes via overlay / Escape when applicable). */
  hideClose?: boolean;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  hideClose = false,
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
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <motion.button
        type="button"
        className="absolute inset-0 z-0 bg-black/50"
        aria-label="Close dialog"
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={motionTransition({ duration: "fast", ease: "smooth" })}
        onClick={() => onOpenChange(false)}
      />
      <motion.div
        className={cn(
          "absolute left-1/2 top-1/2 z-10 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-card border border-border bg-card p-lg shadow-lg outline-none",
          className,
        )}
        initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={motionTransition({ duration: "normal", ease: "snappy" })}
      >
        <div className="flex items-start justify-between gap-md">
          <div className="min-w-0 space-y-xs pr-md">
            <h2 id={titleId} className="text-lg font-semibold text-foreground">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {!hideClose && (
            <button
              type="button"
              className="shrink-0 rounded-md p-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-md">{children}</div>
      </motion.div>
    </div>,
    document.body,
  );
}
