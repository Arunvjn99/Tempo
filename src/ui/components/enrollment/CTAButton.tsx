import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/core/lib/utils";

const variants = {
  /** Primary forward action — semantic `--color-primary` (theme + branding). */
  primary:
    "bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:opacity-95 active:opacity-90",
  /** Secondary / ghost bar action (Figma Save & Exit style). */
  secondary:
    "border border-default bg-transparent text-primary hover:bg-surface-soft ring-1 ring-border/70 active:bg-primary/5",
  /** Text-only / low emphasis. */
  ghost: "bg-transparent text-brand hover:bg-primary/10 active:bg-primary/15",
} as const;

export type CTAButtonVariant = keyof typeof variants;

export interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CTAButtonVariant;
  /** Full width in footers. */
  fullWidth?: boolean;
}

/**
 * Enrollment footer / hero CTAs — variants aligned with Figma.
 * Uses theme `primary`, `border`, `foreground`; supports dark mode via semantic colors.
 */
export const CTAButton = forwardRef<HTMLButtonElement, CTAButtonProps>(
  (
    {
      className,
      variant = "primary",
      fullWidth,
      type = "button",
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex min-h-10 items-center justify-center gap-sm rounded-xl px-lg py-sm text-sm font-semibold leading-5 transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-page)]",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);
CTAButton.displayName = "CTAButton";
