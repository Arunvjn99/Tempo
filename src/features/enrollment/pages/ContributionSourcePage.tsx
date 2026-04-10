// ─────────────────────────────────────────────
// ContributionSourcePage — Pre-Tax / Roth / After-Tax split
// ─────────────────────────────────────────────

import { useEnrollmentStore, useEnrollmentDerived } from "../store";
import { validateStep } from "../store/validation";
import { AllocationEditor, type AllocationSlice } from "@/ui/components";
import { FormSection } from "@/ui/patterns";
import { EnrollmentActionRow } from "@/ui/patterns/enrollment-router";
import { ArrowLeft } from "lucide-react";
import { formatCurrency } from "../store/derived";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

const SOURCE_COLORS = {
  preTax: "var(--chart-1)",
  roth: "var(--chart-5)",
  afterTax: "var(--chart-2)",
};

const QUICK_PRESETS = [
  {
    label: "Plan Default",
    description: "60% pre-tax, 40% Roth",
    values: { preTax: 60, roth: 40, afterTax: 0 },
  },
  {
    label: "Recommended",
    description: "40% pre-tax, 60% Roth",
    values: { preTax: 40, roth: 60, afterTax: 0 },
  },
  {
    label: "All Pre-Tax",
    description: "Maximum tax break today",
    values: { preTax: 100, roth: 0, afterTax: 0 },
  },
  {
    label: "All Roth",
    description: "Tax-free withdrawals",
    values: { preTax: 0, roth: 100, afterTax: 0 },
  },
];

export function ContributionSourcePage() {
  const enrollment = useEnrollmentStore((s) => s.enrollment);
  const personalization = useEnrollmentStore((s) => s.personalization);
  const updateEnrollment = useEnrollmentStore((s) => s.updateEnrollment);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);
  const derived = useEnrollmentDerived();

  const { contributionSources, supportsAfterTax } = enrollment;
  const validation = validateStep("contribution-source", enrollment, personalization);

  const slices: AllocationSlice[] = [
    { key: "preTax", label: "Pre-Tax", color: SOURCE_COLORS.preTax, value: contributionSources.preTax },
    { key: "roth", label: "Roth", color: SOURCE_COLORS.roth, value: contributionSources.roth },
    ...(supportsAfterTax
      ? [{ key: "afterTax", label: "After-Tax", color: SOURCE_COLORS.afterTax, value: contributionSources.afterTax }]
      : []),
  ];

  const handleSlicesChange = (newSlices: AllocationSlice[]) => {
    const updated = {
      preTax: newSlices.find((s) => s.key === "preTax")?.value ?? 0,
      roth: newSlices.find((s) => s.key === "roth")?.value ?? 0,
      afterTax: newSlices.find((s) => s.key === "afterTax")?.value ?? 0,
    };
    updateEnrollment({ contributionSources: updated });
  };

  const applyPreset = (values: typeof QUICK_PRESETS[0]["values"]) => {
    updateEnrollment({ contributionSources: values });
  };

  const monthlyTotal = derived.monthlyContribution;

  return (
    <div className="space-y-6">
      <div>
        <Button
          type="button"
          variant="ghost"
          size="custom"
          onClick={prevStep}
          className="mb-3 inline-flex h-auto items-center gap-1 px-0 text-[0.85rem] text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Button>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Tax strategy</h1>
        <p className="mt-1 text-[0.9rem] text-muted-foreground">
          How do you want to split your contributions across tax treatments?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Left: Editor ── */}
        <div className="space-y-lg">
          <FormSection title="Your allocation">
            <AllocationEditor
              slices={slices}
              onChange={handleSlicesChange}
              error={validation.errors.sources}
            />
          </FormSection>

          {/* Monthly breakdown */}
          <FormSection variant="muted">
            <p className="mb-sm text-sm font-semibold text-foreground">Monthly breakdown</p>
            <div className="space-y-sm">
              {slices.map((s) => (
                <div key={s.key} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-sm text-muted-foreground">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                      aria-hidden
                    />
                    {s.label}
                  </span>
                  <span className="font-medium text-foreground">
                    {formatCurrency((monthlyTotal * s.value) / 100)}
                  </span>
                </div>
              ))}
            </div>
          </FormSection>
        </div>

        {/* ── Right: Presets ── */}
        <div className="space-y-lg">
          <FormSection title="Quick presets">
            <div className="space-y-sm">
              {QUICK_PRESETS.filter(
                (p) => supportsAfterTax || p.values.afterTax === 0,
              ).map((preset) => {
                const isActive =
                  Math.round(contributionSources.preTax) === preset.values.preTax &&
                  Math.round(contributionSources.roth) === preset.values.roth &&
                  Math.round(contributionSources.afterTax) === preset.values.afterTax;

                return (
                  <Button
                    key={preset.label}
                    type="button"
                    variant="custom"
                    size="custom"
                    onClick={() => applyPreset(preset.values)}
                    className={cn(
                      "h-auto w-full justify-start rounded-xl border p-4 text-left font-normal transition-colors",
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border bg-surface hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{preset.label}</span>
                      <div className="flex gap-xs">
                        {preset.values.preTax > 0 && (
                          <span className="rounded-full bg-primary/10 px-xs py-0.5 text-xs font-medium text-primary">
                            {preset.values.preTax}% Pre-Tax
                          </span>
                        )}
                        {preset.values.roth > 0 && (
                          <span className="rounded-full bg-primary/10 px-xs py-0.5 text-xs font-medium text-primary">
                            {preset.values.roth}% Roth
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-xs text-xs text-muted-foreground">{preset.description}</p>
                  </Button>
                );
              })}
            </div>
          </FormSection>

          {/* Dynamic tip */}
          <FormSection variant="highlight">
            <p className="text-sm font-medium text-foreground">
              {contributionSources.roth > contributionSources.preTax
                ? "📈 More Roth allocation = more tax-free income in retirement"
                : "💰 More pre-tax allocation = more take-home pay today"}
            </p>
          </FormSection>
        </div>
      </div>

      <EnrollmentActionRow hideBack onNext={nextStep} nextDisabled={!validation.valid} />
    </div>
  );
}
