import { ENROLLMENT_STEPS } from "./steps";

/**
 * URL segments for the Zustand V1 wizard under `/v1/enrollment/<segment>`.
 * Order matches `ENROLLMENT_STEPS` in steps.ts.
 */
export const V1_WIZARD_SEGMENTS = [
  "choose-plan",
  "contribution",
  "source",
  "auto-increase",
  "investments",
  "readiness",
  "review",
] as const;

export type V1WizardSegment = (typeof V1_WIZARD_SEGMENTS)[number];

export function isV1WizardSegment(s: string): s is V1WizardSegment {
  return (V1_WIZARD_SEGMENTS as readonly string[]).includes(s);
}

/** Full path under `/v1/enrollment/` (no leading slash). */
export function wizardStepIndexFromSegment(
  pathAfterV1Enrollment: string | undefined,
): number | null {
  if (pathAfterV1Enrollment == null || pathAfterV1Enrollment === "") return null;
  const normalized = pathAfterV1Enrollment.replace(/^\/+/, "").split("?")[0];
  if (normalized === "auto-increase/config" || normalized === "auto-increase/skip") {
    return ENROLLMENT_STEPS.indexOf("autoIncrease");
  }
  const first = normalized.split("/")[0];
  const i = (V1_WIZARD_SEGMENTS as readonly string[]).indexOf(first);
  return i >= 0 ? i : null;
}

/** Canonical URLs (also reachable via `/enrollment/...` legacy redirect). */
export const V1_ENROLLMENT_AUTO_INCREASE_DECISION_PATH = "/v1/enrollment/auto-increase";
export const V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH = "/v1/enrollment/auto-increase/config";
export const V1_ENROLLMENT_AUTO_INCREASE_SKIP_PATH = "/v1/enrollment/auto-increase/skip";

export function segmentForWizardStep(stepIndex: number): V1WizardSegment {
  return (
    V1_WIZARD_SEGMENTS[stepIndex] ?? V1_WIZARD_SEGMENTS[0]
  );
}

export function pathForWizardStep(stepIndex: number): string {
  return `/v1/enrollment/${segmentForWizardStep(stepIndex)}`;
}
