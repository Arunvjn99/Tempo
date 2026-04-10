import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/ui/components/Slider";
import type { CoreAIStructuredPayload, EnrollmentSetupPayload } from "@/features/ai/store/interactiveTypes";
import { getContributionInsight } from "@/features/ai/services/insights";
import { InsightBox } from "./InsightBox";

const INV_VALUE: Record<string, string> = {
  "Target Date Fund": "target",
  "Manual Allocation": "manual",
  "Advisor Recommended": "advisor",
};

export interface EnrollmentSetupCardProps {
  payload: EnrollmentSetupPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function EnrollmentSetupCard({ payload, onAction }: EnrollmentSetupCardProps) {
  const [plan, setPlan] = useState(payload.planOptions[1]?.value ?? "roth");
  const [contribution, setContribution] = useState(payload.contributionValue);
  const [investment, setInvestment] = useState("target");

  const { insight, suggestion } = useMemo(() => {
    const contrib = getContributionInsight(contribution);
    return { insight: contrib.insight, suggestion: contrib.suggestion };
  }, [contribution]);

  const handleContinue = () => {
    onAction({
      action: "enrollment_setup_continue",
      plan,
      contribution,
      investment,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">
        Enrollment setup
      </p>

      <p className="mt-2 text-sm font-medium text-[var(--color-text)]">Plan</p>
      <div className="mt-2 flex gap-2">
        {payload.planOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setPlan(opt.value)}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
              plan === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-[var(--color-border)] text-[var(--color-text)] hover:border-primary/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm font-medium text-[var(--color-text)]">
        Contribution: <strong>{contribution}%</strong>
      </p>
      <div className="mt-1">
        <Slider
          value={[contribution]}
          onValueChange={(v) => setContribution(v[0] ?? contribution)}
          min={payload.contributionMin}
          max={payload.contributionMax}
          step={1}
        />
      </div>

      <p className="mt-4 text-sm font-medium text-[var(--color-text)]">Investment</p>
      <div className="mt-2 flex flex-col gap-2">
        {payload.investmentOptions.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setInvestment(INV_VALUE[label] ?? label)}
            className={`rounded-xl border px-4 py-2 text-left text-sm font-medium transition-colors ${
              investment === (INV_VALUE[label] ?? label)
                ? "border-primary bg-primary/10 text-primary"
                : "border-[var(--color-border)] text-[var(--color-text)] hover:border-primary/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <InsightBox
        insight={insight}
        suggestion={
          suggestion && payload.contributionMin <= suggestion.value && suggestion.value <= payload.contributionMax
            ? { label: suggestion.label, onClick: () => setContribution(suggestion!.value) }
            : undefined
        }
      />

      <button
        type="button"
        onClick={handleContinue}
        className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Continue
      </button>
    </motion.div>
  );
}
