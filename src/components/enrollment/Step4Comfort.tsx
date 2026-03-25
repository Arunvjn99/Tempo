import { AnimatePresence, motion } from "framer-motion";
import { BarChart2, Shield, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingStepCard, SuggestionCard, WizardGuideInsight } from "./onboarding";

export type InvestmentComfort = "conservative" | "balanced" | "growth" | "aggressive";

const COMFORT_INSIGHTS: Record<InvestmentComfort, string> = {
  conservative:
    "Conservative options prioritize stability — many near-retirees choose this to sleep better when markets swing.",
  balanced:
    "Balanced portfolios are chosen by about 60% of users — a middle path between growth and steadiness.",
  growth:
    "Growth-oriented mixes aim for higher long-term returns while accepting more ups and downs along the way.",
  aggressive:
    "Aggressive strategies chase maximum growth; they suit long time horizons and higher tolerance for volatility.",
};

const COMFORT_RETURNS_HINT: Record<InvestmentComfort, string> = {
  conservative: "Historically, conservative mixes have aimed for steadier, lower-volatility outcomes over long periods.",
  balanced: "A balanced approach has often targeted moderate long-term growth with managed swings.",
  growth: "Growth-oriented strategies typically seek higher long-term returns with more market movement.",
  aggressive: "Aggressive portfolios may offer higher return potential over decades, with deeper drawdowns possible.",
};

const OPTIONS: {
  key: InvestmentComfort;
  label: string;
  description: string;
  icon: typeof Shield;
  mostCommon?: boolean;
}[] = [
  {
    key: "conservative",
    label: "Conservative",
    description: "Lower risk, emphasis on preserving what you've built.",
    icon: Shield,
  },
  {
    key: "balanced",
    label: "Balanced",
    description: "Moderate growth with a mix of stocks and steadier assets.",
    icon: BarChart2,
    mostCommon: true,
  },
  {
    key: "growth",
    label: "Growth",
    description: "Higher growth potential with more market movement.",
    icon: TrendingUp,
  },
  {
    key: "aggressive",
    label: "Aggressive",
    description: "Maximum growth focus; expect sharper swings.",
    icon: Zap,
  },
];

export interface Step4ComfortProps {
  value: InvestmentComfort;
  onChange: (v: InvestmentComfort) => void;
}

/**
 * Pre-enrollment wizard Step 4 — risk comfort (guided card + suggestion + insight).
 */
export function Step4Comfort({ value, onChange }: Step4ComfortProps) {
  return (
    <>
      <OnboardingStepCard>
        <div>
          <h3 className="premium-wizard__question text-center">How comfortable are you with investment risk?</h3>
          <p className="mt-2 text-center text-sm leading-relaxed text-[var(--color-text-secondary)]">
            This helps us recommend a portfolio that matches your style.
          </p>
        </div>

        <p className="text-center text-sm text-[var(--color-text-tertiary,var(--color-text-secondary))]">
          I am comfortable with
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Investment risk comfort">
          {OPTIONS.map((level) => {
            const selected = value === level.key;
            const Icon = level.icon;
            return (
              <motion.button
                key={level.key}
                type="button"
                role="radio"
                aria-checked={selected}
                layout
                onClick={() => onChange(level.key)}
                whileHover={{ scale: selected ? 1.02 : 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative rounded-xl border-2 p-4 text-left transition-colors",
                  selected
                    ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] shadow-sm ring-2 ring-[color-mix(in_srgb,var(--color-primary)_30%,transparent)]"
                    : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[color-mix(in_srgb,var(--color-primary)_40%,var(--color-border))]",
                )}
              >
                {level.mostCommon ? (
                  <span className="absolute -top-2 right-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Most common
                  </span>
                ) : null}
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn("h-5 w-5 shrink-0", selected ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]")}
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="text-sm font-semibold text-[var(--color-text)]">{level.label}</span>
                </div>
                <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">{level.description}</p>
              </motion.button>
            );
          })}
        </div>

        <SuggestionCard
          title="Balanced is the most common choice"
          subtitle="Based on similar participants in your plan"
          badge="Popular"
          actionLabel="Apply"
          onAction={() => onChange("balanced")}
          disabled={value === "balanced"}
        />
      </OnboardingStepCard>

      <AnimatePresence mode="wait">
        <WizardGuideInsight key={value}>
          <span className="block font-medium text-[var(--color-text)]">{COMFORT_INSIGHTS[value]}</span>
          <span className="mt-2 block text-xs opacity-90">{COMFORT_RETURNS_HINT[value]}</span>
        </WizardGuideInsight>
      </AnimatePresence>
    </>
  );
}
