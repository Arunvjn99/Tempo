// ─────────────────────────────────────────────
// AutoIncreasePage — Figma Make UI (verbatim); logic via EnrollmentProvider → Zustand
// ─────────────────────────────────────────────

import { AutoIncrease } from "../figma-make/components/auto-increase";
import { EnrollmentProvider } from "../figma-make/components/enrollment-context";

export function AutoIncreasePage() {
  return (
    <EnrollmentProvider>
      <AutoIncrease />
    </EnrollmentProvider>
  );
}
