import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/core/lib/utils";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--slider-track-unfilled)]">
        <SliderPrimitive.Range className="absolute h-full bg-[var(--color-primary)]" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-5 w-5 cursor-grab rounded-full border-2 border-[var(--color-primary)] bg-surface-card shadow-md transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-card)]",
          "disabled:pointer-events-none disabled:opacity-50 active:cursor-grabbing",
        )}
        aria-label="Slider value"
      />
    </SliderPrimitive.Root>
  );
}
