// ─────────────────────────────────────────────
// EnrollmentWizardShell — Centered rounded-3xl card (Figma wizard)
// ─────────────────────────────────────────────

import { type ReactNode } from "react";

export function EnrollmentWizardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[65vh] items-center justify-center py-4 sm:py-6">
      <div className="card-standard w-full max-w-lg p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
