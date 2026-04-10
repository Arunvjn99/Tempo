import { cn } from "@/core/lib/utils";
import { Slider } from "./Slider";

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (v: number) => string;
  hint?: string;
  error?: string;
  className?: string;
  showMinMax?: boolean;
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  formatValue,
  hint,
  error,
  className,
  showMinMax = true,
}: SliderInputProps) {
  const display = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div className={cn("space-y-sm", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="rounded-md bg-primary/10 px-sm py-xs text-sm font-bold text-primary">{display}</span>
      </div>

      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v ?? min)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />

      {showMinMax && (
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground">
            {formatValue ? formatValue(min) : `${min}${unit}`}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatValue ? formatValue(max) : `${max}${unit}`}
          </span>
        </div>
      )}

      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
