// ─────────────────────────────────────────────
// EnrollmentRangeSlider — Native range matching Figma (accent primary)
// ─────────────────────────────────────────────

interface EnrollmentRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  "aria-label"?: string;
}

export function EnrollmentRangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  "aria-label": ariaLabel,
}: EnrollmentRangeSliderProps) {
  return (
    <div className="px-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
      />
      <div className="mt-1 flex justify-between text-[0.7rem] text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
