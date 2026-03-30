import type { ButtonHTMLAttributes, ReactNode } from "react";

export type V2ButtonVariant = "primary" | "secondary" | "ghost";

export interface V2ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: V2ButtonVariant;
  children: ReactNode;
}

export function V2Button({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...rest
}: V2ButtonProps) {
  return (
    <button type={type} className={`v2-btn v2-btn--${variant} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
