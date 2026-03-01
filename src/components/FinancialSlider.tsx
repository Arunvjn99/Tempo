/**
 * Reusable financial slider for contribution/source allocation.
 * Uses design tokens only; no hardcoded colors or dimensions.
 * Ensures track padding so thumb does not overlap container edges at 0% / 100%.
 */
import type { InputHTMLAttributes } from "react";

export interface FinancialSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Current value (0–100 for allocation split) */
  value: number;
  /** Min value */
  min?: number;
  /** Max value */
  max?: number;
  /** Step */
  step?: number;
  /** Fill width as percentage (0–100) for track highlight */
  fillPercent: number;
  /** Optional min label (e.g. "0%") */
  minLabel?: string;
  /** Optional max label (e.g. "100%") */
  maxLabel?: string;
  /** Disabled state */
  disabled?: boolean;
  /** aria-label for accessibility */
  "aria-label": string;
  /** className for the wrapper (track + labels) */
  className?: string;
}

export function FinancialSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  fillPercent,
  minLabel,
  maxLabel,
  disabled = false,
  className = "",
  ...inputProps
}: FinancialSliderProps) {
  const clampedFill = Math.min(100, Math.max(0, fillPercent));

  return (
    <div className={`financial-slider ${className}`.trim()} style={{ ["--fill-pct" as string]: clampedFill }}>
      <div className="financial-slider__track-wrap">
        <div className="financial-slider__track-bg" aria-hidden />
        <div
          className="financial-slider__track-fill"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          className="financial-slider__input"
          {...inputProps}
        />
      </div>
      {(minLabel != null || maxLabel != null) && (
        <div className="financial-slider__labels">
          {minLabel != null && <span className="financial-slider__label-min">{minLabel}</span>}
          {maxLabel != null && <span className="financial-slider__label-max">{maxLabel}</span>}
        </div>
      )}
    </div>
  );
}
