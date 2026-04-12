import { DollarSign, Sparkles } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

const SAVINGS_PRESETS = [
  { label: "$0", value: 0 },
  { label: "$5K", value: 5000 },
  { label: "$10K", value: 10000 },
  { label: "$50K+", value: 50000 },
] as const;

interface WizardSavingsSectionProps {
  currentSavings: number | undefined;
  onSavingsChange: (amount: number) => void;
}

export function WizardSavingsSection({ currentSavings, onSavingsChange }: WizardSavingsSectionProps) {
  return (
    <div className="mt-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-primary sm:text-xl">What are your current personal savings?</h2>
        <p className="mt-1 text-[0.875rem] text-secondary">
          Include personal savings or investments outside your employer plan.
        </p>
      </div>

      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary" />
        <input
          type="number"
          value={currentSavings ?? ""}
          onChange={(e) => onSavingsChange(Math.max(0, parseFloat(e.target.value) || 0))}
          className="w-full rounded-xl border border-default bg-background py-4 pl-10 pr-4 text-[1.5rem] font-semibold text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="0"
          min={0}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {SAVINGS_PRESETS.map((opt) => (
          <Button
            key={opt.label}
            type="button"
            variant="custom"
            size="custom"
            onClick={() => onSavingsChange(opt.value)}
            className={cn(
              "rounded-xl px-4 py-2.5 text-[0.85rem] font-medium transition-colors",
              currentSavings === opt.value
                ? "bg-primary text-primary-foreground"
                : "border border-default bg-surface-card text-primary hover:bg-primary/5",
            )}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[color-mix(in_srgb,var(--color-success)_28%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))] p-4 dark:border-[color-mix(in_srgb,var(--color-success)_35%,var(--border-default))] dark:bg-[color-mix(in_srgb,var(--color-success)_18%,var(--surface-page))]">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-success)] dark:text-[color-mix(in_srgb,var(--color-success)_75%,var(--surface-card))]" aria-hidden />
        <p className="text-[0.85rem] text-[color-mix(in_srgb,var(--color-success)_55%,var(--text-primary))] dark:text-[color-mix(in_srgb,var(--color-success)_75%,var(--surface-card))]">
          Every dollar saved today grows through compound interest. Starting early is the most powerful advantage you
          have.
        </p>
      </div>
    </div>
  );
}
