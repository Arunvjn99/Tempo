// ─────────────────────────────────────────────
// AutoIncreaseSetupPage — Figma Make UI (verbatim); logic via EnrollmentProvider → Zustand
// ─────────────────────────────────────────────

import { AutoIncreaseSetup } from "../figma-make/components/auto-increase-setup";
import { EnrollmentProvider } from "../figma-make/components/enrollment-context";

export function AutoIncreaseSetupPage() {
  return (
    <EnrollmentProvider>
      <AutoIncreaseSetup />
    </EnrollmentProvider>
  );
}
