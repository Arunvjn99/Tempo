import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/core/lib/utils";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Visually associate label; does not change behavior. */
  labelClassName?: string;
}

/**
 * Enrollment-styled text input: 44px min height, token radii, focus ring on primary.
 * Stateless — validation lives in parent forms.
 */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { className, label, error, hint, id, labelClassName, disabled, ...props },
    ref,
  ) => {
    const genId = useId();
    const inputId = id ?? genId;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint && !error ? `${inputId}-hint` : undefined;

    return (
      <div className="flex w-full flex-col gap-xs">
        {label ? (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-5 text-primary",
              disabled && "opacity-60",
              labelClassName,
            )}
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
          className={cn(
            "min-h-11 w-full rounded-xl border border-default bg-surface-card px-md py-sm text-sm text-primary",
            "placeholder:text-secondary",
            "transition-colors",
            "hover:border-default",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-card)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger focus-visible:ring-danger",
            className,
          )}
          {...props}
        />
        {hint && !error ? (
          <p id={hintId} className="text-xs leading-4 text-secondary">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-xs leading-4 text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
InputField.displayName = "InputField";
