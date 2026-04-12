// ─────────────────────────────────────────────
// ContributionSourcePage — Figma Make UI (verbatim); logic via EnrollmentProvider → Zustand
// ─────────────────────────────────────────────

import { ContributionSource } from "../figma-make/components/contribution-source";
import { EnrollmentProvider } from "../figma-make/components/enrollment-context";

export function ContributionSourcePage() {
  return (
    <EnrollmentProvider>
      <ContributionSource />
    </EnrollmentProvider>
  );
}
