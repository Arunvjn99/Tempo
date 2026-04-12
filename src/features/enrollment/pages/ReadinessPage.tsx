// ─────────────────────────────────────────────
// ReadinessPage — Figma Make UI (verbatim); logic via EnrollmentProvider → Zustand
// ─────────────────────────────────────────────

import { RetirementReadiness } from "../figma-make/components/retirement-readiness";
import { EnrollmentProvider } from "../figma-make/components/enrollment-context";

export function ReadinessPage() {
  return (
    <EnrollmentProvider>
      <RetirementReadiness />
    </EnrollmentProvider>
  );
}
