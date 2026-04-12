// ─────────────────────────────────────────────
// ContributionPage — Figma Make UI (verbatim); logic via EnrollmentProvider → Zustand
// ─────────────────────────────────────────────

import { ContributionSetup } from "../figma-make/components/contribution-setup";
import { EnrollmentProvider } from "../figma-make/components/enrollment-context";

export function ContributionPage() {
  return (
    <EnrollmentProvider>
      <ContributionSetup />
    </EnrollmentProvider>
  );
}
