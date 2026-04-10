// ─────────────────────────────────────────────
// ContributionPage — Figma pixel-perfect rebuild
// ─────────────────────────────────────────────

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useEnrollmentStore, useEnrollmentDerived } from "../store";
import { ContributionPageHeader } from "@/ui/patterns/sections/enrollment/contribution/ContributionPageHeader";
import { ContributionProjectionRightPanel } from "@/ui/patterns/sections/enrollment/contribution/ContributionProjectionRightPanel";
import { ContributionSavingsLeftPanel } from "@/ui/patterns/sections/enrollment/contribution/ContributionSavingsLeftPanel";

export function ContributionPage() {
  const enrollment = useEnrollmentStore((s) => s.enrollment);
  const retirementAge = useEnrollmentStore((s) => s.personalization.retirementAge);
  const updateEnrollment = useEnrollmentStore((s) => s.updateEnrollment);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);
  const derived = useEnrollmentDerived();

  const { contributionPercent, salary } = enrollment;
  const [percentInput, setPercentInput] = useState(String(contributionPercent));
  const [dollarInput, setDollarInput] = useState(
    String(Math.round((salary * contributionPercent) / 100)),
  );
  const [showCompare, setShowCompare] = useState(false);

  const onTrack = useMemo(
    () => Math.min(100, Math.round((contributionPercent / 15) * 100)),
    [contributionPercent],
  );

  const adjustPercent = (delta: number) => {
    const next = Math.max(1, Math.min(25, contributionPercent + delta));
    updateEnrollment({ contributionPercent: next });
    setPercentInput(String(next));
    setDollarInput(String(Math.round((salary * next) / 100)));
  };

  const applyPercent = (p: number) => {
    updateEnrollment({ contributionPercent: p });
    setPercentInput(String(p));
    setDollarInput(String(Math.round((salary * p) / 100)));
  };

  const proTipAdd = Math.round((salary * 0.01) / 12);

  const handlePercentInputChange = (value: string) => {
    setPercentInput(value);
    const n = parseFloat(value);
    if (!Number.isNaN(n) && n >= 1 && n <= 25) applyPercent(Math.round(n * 2) / 2);
  };

  const handleDollarInputChange = (value: string) => {
    setDollarInput(value);
    const n = parseFloat(value.replace(/,/g, ""));
    if (!Number.isNaN(n)) {
      const pct = Math.round((n / salary) * 100);
      if (pct >= 1 && pct <= 25) applyPercent(pct);
    }
  };

  return (
    <div className="space-y-6">
      <ContributionPageHeader onBack={prevStep} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ContributionSavingsLeftPanel
          monthlyPaycheck={derived.monthlyPaycheck}
          contributionPercent={contributionPercent}
          percentInput={percentInput}
          dollarInput={dollarInput}
          onPercentInputChange={handlePercentInputChange}
          onDollarInputChange={handleDollarInputChange}
          adjustPercent={adjustPercent}
          applyPercent={applyPercent}
          proTipAdd={proTipAdd}
        />

        <ContributionProjectionRightPanel
          retirementAge={retirementAge}
          contributionPercent={contributionPercent}
          onTrack={onTrack}
          derived={{
            projectedBalance: derived.projectedBalance,
            monthlyContribution: derived.monthlyContribution,
            monthlyEmployerMatch: derived.monthlyEmployerMatch,
          }}
          showCompare={showCompare}
          onToggleCompare={() => setShowCompare((v) => !v)}
          onApplyPercent={applyPercent}
        />
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={nextStep}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[1rem] font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.99]"
        >
          Save &amp; Continue
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
        <p className="text-center text-[0.8rem] text-muted-foreground">You can adjust anytime</p>
      </div>
    </div>
  );
}
