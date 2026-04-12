import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { cn } from "@/core/lib/utils";

export interface SelectableCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
}

/**
 * Figma-aligned selectable surface: primary ring + tint when selected;
 * subtle border + hover when not.
 * Uses a focusable `div` (not `<button>`) so inner action buttons remain valid HTML.
 */
export function SelectableCard({
  children,
  className,
  selected = false,
  disabled,
  onClick,
  onKeyDown,
  tabIndex,
  ...props
}: SelectableCardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : tabIndex ?? 0}
      aria-pressed={selected}
      aria-disabled={disabled ?? false}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex w-full min-w-0 cursor-pointer flex-col rounded-xl border border-default bg-surface-card text-left text-card-foreground shadow-card transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-page)]",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        selected
          ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--surface-card))] ring-2 ring-[var(--color-primary)]/25"
          : "hover:border-[var(--color-primary)]/35 hover:bg-surface-soft",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
