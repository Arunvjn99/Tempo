import type { ReactNode } from "react";

interface EnrollmentPageContentProps {
  /** Page title (32px bold). Omit when using headerContent. */
  title?: string;
  /** Optional subtitle (16px secondary) */
  subtitle?: string;
  /** Optional badge above the title */
  badge?: ReactNode;
  /** When provided, replaces the default title/subtitle header entirely */
  headerContent?: ReactNode;
  children: ReactNode;
}

/**
 * Shared inner wrapper for all enrollment step pages.
 * Provides consistent max-width, spacing, heading scale, and page background
 * using the enrollment design tokens.
 *
 * NOTE: This does NOT replace the route-level EnrollmentLayout.
 * It wraps the page content inside each step page.
 */
export function EnrollmentPageContent({
  title,
  subtitle,
  badge,
  headerContent,
  children,
}: EnrollmentPageContentProps) {
  return (
    <div className="w-full min-h-0 pb-12" style={{ background: "var(--enroll-bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        {/* Same spacing as Choose Plan: stepper → pt-4 → H1 → mb-4 → content */}
        <header className="mb-4">
          {headerContent ? (
            headerContent
          ) : (
            <>
              {badge && <div className="mb-2">{badge}</div>}
              <h1
                className="text-xl md:text-2xl font-bold leading-tight"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className="mt-1 text-base leading-relaxed"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  {subtitle}
                </p>
              )}
            </>
          )}
        </header>

        {/* ── Page body ── */}
        {children}
      </div>
    </div>
  );
}
