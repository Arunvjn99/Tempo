import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/core/lib/utils";

export interface SelectionCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children: ReactNode;
  /** Visually selected (e.g. current plan). */
  selected?: boolean;
}

/**
 * Large tappable card for single-choice flows (plan, preset, etc.).
 * Parent owns selection state and onClick; this component is presentation only.
 */
export function SelectionCard({
  children,
  className,
  selected = false,
  disabled,
  onClick,
  ...props
}: SelectionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full min-w-0 flex-col rounded-card border bg-surface-card p-md text-left text-card-foreground",
        "transition-colors duration-150",
        "hover:bg-surface-soft ring-1 ring-border/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-page)]",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20"
          : "border-default hover:border-default",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
