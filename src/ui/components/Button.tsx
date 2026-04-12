import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/core/lib/utils";

const variants = {
  primary:
    "bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]",
  secondary:
    "border border-default bg-surface text-primary hover:bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--surface-card))] hover:shadow-sm",
  ghost:
    "text-primary hover:bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--surface-card))]",
  danger: "bg-danger text-primary-foreground hover:brightness-95",
  /** Visual styles supplied entirely via `className` (focus ring + layout base still applied). */
  custom: "",
} as const;

const sizes = {
  sm: "h-8 px-sm text-sm",
  md: "h-10 px-md text-sm",
  /** Figma enrollment primary actions — fixed padding, no ad-hoc py */
  lg: "h-12 px-6 text-base rounded-xl",
  /** Square icon controls — pair with `secondary` or `ghost` for toolbar affordances. */
  iconSm: "h-8 w-8 min-w-8 shrink-0 gap-0 p-0 [&_svg]:shrink-0",
  iconMd: "h-9 w-9 min-w-9 shrink-0 gap-0 p-0 [&_svg]:shrink-0",
  iconLg: "h-10 w-10 min-w-10 shrink-0 gap-0 p-0 [&_svg]:shrink-0",
  /** Height/padding supplied via `className` (e.g. choice cards, menus). */
  custom: "",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-sm rounded-button font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-page)]",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
