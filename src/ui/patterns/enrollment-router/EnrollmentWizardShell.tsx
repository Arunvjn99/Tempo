// ─────────────────────────────────────────────
// EnrollmentWizardShell — Centered rounded-3xl card (Figma wizard)
// ─────────────────────────────────────────────

import { type ReactNode } from "react";

export function EnrollmentWizardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[65vh] items-center justify-center py-4 sm:py-6">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-elevation-md sm:p-8">
        {children}
      </div>
    </div>
  );
}
