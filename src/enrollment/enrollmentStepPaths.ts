/**
 * Single source of truth for enrollment wizard step paths and pathname → step index.
 * Used by EnrollmentLayout (stepper), EnrollmentFooter (Back), and any guards.
 */

export const ENROLLMENT_STEP_PATHS = [
  "/enrollment/choose-plan",
  "/enrollment/contribution",
  "/enrollment/future-contributions",
  "/enrollment/investments",
  "/enrollment/review",
] as const;

export type EnrollmentStepPath = (typeof ENROLLMENT_STEP_PATHS)[number];

/** 0-based step index from pathname; 0 if pathname is not a step path. */
export function pathToStep(pathname: string): number {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const i = ENROLLMENT_STEP_PATHS.indexOf(normalized as EnrollmentStepPath);
  return i >= 0 ? i : 0;
}

export function isEnrollmentStepPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return ENROLLMENT_STEP_PATHS.some(
    (p) => normalized === p || normalized.startsWith(p + "/")
  );
}
