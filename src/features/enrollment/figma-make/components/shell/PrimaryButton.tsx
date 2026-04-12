import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/core/lib/utils";

export type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

/**
 * Primary CTA — matches enrollment full-width primary buttons (no visual change vs inline classes).
 */
export function PrimaryButton({ children, className, type = "button", ...rest }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-[var(--primary-foreground)] transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.98]",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
