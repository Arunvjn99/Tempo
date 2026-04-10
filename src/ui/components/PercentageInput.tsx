import { Minus, Plus } from "lucide-react";
import { cn } from "@/core/lib/utils";

interface PercentageInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  error?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PercentageInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  error,
  className,
  size = "md",
}: PercentageInputProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const increment = () => onChange(clamp(value + step));
  const decrement = () => onChange(clamp(value - step));

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) onChange(clamp(parsed));
  };

  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-14 text-2xl font-bold",
  };

  const btnSizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };

  return (
    <div className={cn("space-y-xs", className)}>
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <div className="flex items-center gap-sm">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className={cn(
            "inline-flex items-center justify-center rounded-button border border-border bg-surface text-foreground transition-colors hover:bg-muted",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            btnSizeClasses[size],
          )}
          aria-label="Decrease"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="relative flex items-center">
          <input
            type="number"
            value={value}
            onChange={handleInput}
            min={min}
            max={max}
            step={step}
            className={cn(
              "w-24 rounded-input border border-border bg-background text-center text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              sizeClasses[size],
            )}
          />
          <span
            className={cn(
              "pointer-events-none absolute right-sm text-muted-foreground",
              size === "lg" ? "text-xl font-bold" : "text-sm",
            )}
          >
            %
          </span>
        </div>

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className={cn(
            "inline-flex items-center justify-center rounded-button border border-border bg-surface text-foreground transition-colors hover:bg-muted",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            btnSizeClasses[size],
          )}
          aria-label="Increase"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
