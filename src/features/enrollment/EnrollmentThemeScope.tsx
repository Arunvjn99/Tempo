import type { ReactNode } from "react";
import "./theme/enrollment-tokens.css";

type EnrollmentThemeScopeProps = {
  children: ReactNode;
};

/**
 * Applies `enrollment-theme` for CSS/token scoping.
 * Use only as the wrapper for the `/enrollment` route element — not on App shell, dashboard, or global layouts.
 */
export function EnrollmentThemeScope({ children }: EnrollmentThemeScopeProps) {
  return (
    <div className="enrollment-theme flex min-h-0 min-h-full w-full flex-1 flex-col">{children}</div>
  );
}
