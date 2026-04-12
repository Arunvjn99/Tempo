// ─────────────────────────────────────────────
// PlanSelectionPage — Figma Make UI (verbatim); logic via EnrollmentProvider → Zustand
// ─────────────────────────────────────────────

import { PlanSelection } from "../figma-make/components/plan-selection";
import { EnrollmentProvider } from "../figma-make/components/enrollment-context";

export function PlanSelectionPage() {
  return (
    <EnrollmentProvider>
      <PlanSelection />
    </EnrollmentProvider>
  );
}
