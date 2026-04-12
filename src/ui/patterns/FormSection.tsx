import { type ReactNode } from "react";
import { cn } from "@/core/lib/utils";

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "highlight" | "muted";
}

export function FormSection({
  title,
  description,
  children,
  className,
  variant = "default",
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-card border border-default p-lg",
        variant === "highlight" && "border-primary/30 bg-primary/5",
        variant === "muted" && "bg-surface",
        variant === "default" && "bg-surface-card",
        className,
      )}
    >
      {(title || description) && (
        <div className="mb-md space-y-xs">
          {title && <h2 className="text-base font-semibold text-primary">{title}</h2>}
          {description && <p className="text-sm text-secondary">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

interface FieldGroupProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}

export function FieldGroup({ label, error, hint, children, required }: FieldGroupProps) {
  return (
    <div className="space-y-xs">
      <label className="block text-sm font-medium text-primary">
        {label}
        {required && (
          <span className="ml-xs text-danger" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-secondary">{hint}</p>}
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
