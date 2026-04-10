// ─────────────────────────────────────────────
// PlanSelectionPage — store wiring only
// ─────────────────────────────────────────────

import { useState } from "react";
import { useEnrollmentStore } from "../store";
import { EnrollmentActionRow } from "@/ui/patterns/enrollment-router";
import { COMPARE_ROWS, PLAN_COPY } from "../planSelectionCopy";
import { PlanSelectionDualPlanView } from "@/ui/patterns/sections/enrollment/planSelection/PlanSelectionDualPlanView";
import { PlanSelectionSinglePlanView } from "@/ui/patterns/sections/enrollment/planSelection/PlanSelectionSinglePlanView";
import type { PlanType } from "../store/types";

export function PlanSelectionPage() {
  const enrollment = useEnrollmentStore((s) => s.enrollment);
  const updateEnrollment = useEnrollmentStore((s) => s.updateEnrollment);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);

  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(enrollment.plan);
  const hasTwoPlans = enrollment.companyPlans.length >= 2;

  const confirmPlan = (plan: PlanType) => {
    updateEnrollment({ plan });
    nextStep();
  };

  if (!hasTwoPlans) {
    const onlyPlan = enrollment.companyPlans[0] ?? "traditional";
    const copy = PLAN_COPY[onlyPlan];
    return (
      <PlanSelectionSinglePlanView plan={onlyPlan} copy={copy} onConfirm={confirmPlan} />
    );
  }

  return (
    <>
      <PlanSelectionDualPlanView
        planCopy={{ traditional: PLAN_COPY.traditional, roth: PLAN_COPY.roth }}
        compareRows={COMPARE_ROWS}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
        onContinueWithPlan={confirmPlan}
      />
      <EnrollmentActionRow
        onBack={prevStep}
        onNext={() => {
          const plan = enrollment.plan ?? selectedPlan;
          if (plan) confirmPlan(plan);
        }}
        nextDisabled={!enrollment.plan && !selectedPlan}
      />
    </>
  );
}
