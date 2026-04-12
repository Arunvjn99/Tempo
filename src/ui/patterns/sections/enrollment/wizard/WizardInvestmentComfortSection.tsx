import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";
import type { PersonalizationState } from "@/features/enrollment/store/types";
import { COMFORT_LEVELS } from "./wizardConstants";

interface WizardInvestmentComfortSectionProps {
  personalization: PersonalizationState;
  onSelectComfort: (key: PersonalizationState["investmentComfort"]) => void;
}

export function WizardInvestmentComfortSection({
  personalization,
  onSelectComfort,
}: WizardInvestmentComfortSectionProps) {
  return (
    <div className="mt-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-primary sm:text-xl">
          How comfortable are you with investment risk?
        </h2>
        <p className="mt-1 text-[0.875rem] text-secondary">
          This helps us recommend a portfolio that matches your style.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {COMFORT_LEVELS.map((level) => (
          <Button
            key={level.key}
            type="button"
            variant="custom"
            size="custom"
            onClick={() => onSelectComfort(level.key)}
            className={cn(
              "relative rounded-xl border-2 p-4 text-left transition-all",
              personalization.investmentComfort === level.key
                ? "border-primary bg-primary/5"
                : "border-default bg-surface-card hover:border-primary/30",
            )}
          >
            {level.popular && (
              <span className="absolute -top-2.5 right-3 rounded-full bg-[color-mix(in_srgb,var(--color-warning)_14%,var(--surface-card))] px-2 py-0.5 text-[0.65rem] font-semibold text-[color-mix(in_srgb,var(--color-warning)_65%,var(--text-primary))] dark:bg-[color-mix(in_srgb,var(--color-warning)_22%,var(--surface-page))] dark:text-[color-mix(in_srgb,var(--color-warning)_85%,var(--surface-card))]">
                Most common
              </span>
            )}
            <div className="mb-1 flex items-center gap-2">
              <level.icon
                className={cn(
                  "h-4 w-4",
                  personalization.investmentComfort === level.key ? "text-brand" : "text-secondary",
                )}
              />
              <span
                className={cn(
                  "text-[0.9rem] font-semibold",
                  personalization.investmentComfort === level.key ? "text-brand" : "text-primary",
                )}
              >
                {level.label}
              </span>
            </div>
            <p className="text-[0.8rem] text-secondary">{level.desc}</p>
          </Button>
        ))}
      </div>
    </div>
  );
}
