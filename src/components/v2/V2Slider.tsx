import type { CSSProperties, InputHTMLAttributes } from "react";

export interface V2SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "style"> {
  min: number;
  max: number;
  value: number;
  percentFill: number;
}

export function V2Slider({ min, max, value, percentFill, className = "", disabled, ...rest }: V2SliderProps) {
  return (
    <div className={`v2-slider-wrap ${className}`.trim()}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        className="v2-slider"
        style={{ "--v2-slider-pct": `${percentFill}%` } as CSSProperties}
        {...rest}
      />
    </div>
  );
}
