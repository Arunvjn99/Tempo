// ─────────────────────────────────────────────
// InvestmentPage — Figma Make UI (verbatim); logic via EnrollmentProvider → Zustand
// ─────────────────────────────────────────────

import { InvestmentStrategy } from "../figma-make/components/investment-strategy";
import { EnrollmentProvider } from "../figma-make/components/enrollment-context";

export function InvestmentPage() {
  return (
    <EnrollmentProvider>
      <InvestmentStrategy />
    </EnrollmentProvider>
  );
}
