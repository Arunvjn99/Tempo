// ─────────────────────────────────────────────
// ReviewPage — Figma Make UI (verbatim); logic via EnrollmentProvider → Zustand
// ─────────────────────────────────────────────

import { Review } from "../figma-make/components/review";
import { EnrollmentProvider } from "../figma-make/components/enrollment-context";

export function ReviewPage() {
  return (
    <EnrollmentProvider>
      <Review />
    </EnrollmentProvider>
  );
}
