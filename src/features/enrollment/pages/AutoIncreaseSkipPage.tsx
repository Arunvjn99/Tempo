// ─────────────────────────────────────────────
// AutoIncreaseSkipPage — Figma Make UI (verbatim); logic via EnrollmentProvider → Zustand
// ─────────────────────────────────────────────

import { AutoIncreaseSkip } from "../figma-make/components/auto-increase-skip";
import { EnrollmentProvider } from "../figma-make/components/enrollment-context";

export function AutoIncreaseSkipPage() {
  return (
    <EnrollmentProvider>
      <AutoIncreaseSkip />
    </EnrollmentProvider>
  );
}
