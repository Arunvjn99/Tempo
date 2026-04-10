import { cn } from "@/core/lib/utils";
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
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          How comfortable are you with investment risk?
        </h2>
        <p className="mt-1 text-[0.875rem] text-muted-foreground">
          This helps us recommend a portfolio that matches your style.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {COMFORT_LEVELS.map((level) => (
          <button
            key={level.key}
            type="button"
            onClick={() => onSelectComfort(level.key)}
            className={cn(
              "relative rounded-xl border-2 p-4 text-left transition-all",
              personalization.investmentComfort === level.key
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/30",
            )}
          >
            {level.popular && (
              <span className="absolute -top-2.5 right-3 rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Most common
              </span>
            )}
            <div className="mb-1 flex items-center gap-2">
              <level.icon
                className={cn(
                  "h-4 w-4",
                  personalization.investmentComfort === level.key ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-[0.9rem] font-semibold",
                  personalization.investmentComfort === level.key ? "text-primary" : "text-foreground",
                )}
              >
                {level.label}
              </span>
            </div>
            <p className="text-[0.8rem] text-muted-foreground">{level.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
