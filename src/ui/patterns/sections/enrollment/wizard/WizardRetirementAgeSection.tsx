import { Sparkles } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

interface WizardRetirementAgeSectionProps {
  currentAge: number;
  retirementAge: number;
  retirementYear: number;
  yearsUntil: number;
  onRetirementAgeChange: (age: number) => void;
}

export function WizardRetirementAgeSection({
  currentAge,
  retirementAge,
  retirementYear,
  yearsUntil,
  onRetirementAgeChange,
}: WizardRetirementAgeSectionProps) {
  return (
    <div className="mt-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-primary sm:text-xl">When would you like to retire?</h2>
        <p className="mt-1 text-[0.875rem] text-secondary">You&apos;re currently {currentAge} years old.</p>
      </div>

      <div className="py-4 text-center">
        <p className="text-[3rem] font-bold leading-none text-brand">{retirementAge}</p>
        <p className="mt-1 text-[0.8rem] text-secondary">years old</p>
      </div>

      <input
        type="range"
        min={50}
        max={75}
        step={1}
        value={retirementAge}
        onChange={(e) => onRetirementAgeChange(Number(e.target.value))}
        className="w-full accent-primary"
        aria-label="Target retirement age"
      />
      <div className="flex justify-between text-[0.75rem] text-secondary">
        <span>50</span>
        <span>75</span>
      </div>

      <div className="flex justify-center gap-2">
        {[60, 65, 67].map((age) => (
          <Button
            key={age}
            type="button"
            variant="custom"
            size="custom"
            onClick={() => onRetirementAgeChange(age)}
            className={cn(
              "rounded-xl px-5 py-2.5 text-[0.9rem] font-medium transition-colors",
              retirementAge === age
                ? "bg-primary text-primary-foreground"
                : "border border-default bg-surface-card text-primary hover:bg-primary/5",
            )}
          >
            {age}
          </Button>
        ))}
      </div>

      <div className="rounded-xl bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-[0.75rem] text-brand/80">Now</p>
            <p className="text-[0.9rem] font-semibold text-brand">{new Date().getFullYear()}</p>
          </div>
          <div className="relative mx-4 flex-1 border-t-2 border-dashed border-primary/30">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-card px-2 text-[0.7rem] text-brand">
              {yearsUntil} years
            </span>
          </div>
          <div className="text-center">
            <p className="text-[0.75rem] text-brand/80">Retirement</p>
            <p className="text-[0.9rem] font-semibold text-brand">{retirementYear}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-[var(--color-warning)]" aria-hidden />
        <span className="text-[0.8rem] text-secondary">Most people retire at 65</span>
      </div>
    </div>
  );
}
