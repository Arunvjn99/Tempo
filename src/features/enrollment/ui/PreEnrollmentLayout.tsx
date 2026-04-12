import type { ReactNode } from "react";

export type PreEnrollmentLayoutProps = {
  children: ReactNode;
};

/** Shell for RetireWise pre-enrollment marketing pages (background layers + scroll). */
export function PreEnrollmentLayout({ children }: PreEnrollmentLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--surface-page)] font-sans text-[var(--text-primary)] opacity-100 antialiased selection:bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] selection:text-[var(--text-primary)]">
      {children}
    </div>
  );
}
