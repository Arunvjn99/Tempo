/**
 * Figma Make enrollment flow state lives in React context:
 * `@/features/enrollment/figma-make/components/enrollment-context.tsx` (`useEnrollment`).
 *
 * This module documents the canonical step order (1–7) after the wizard and exposes
 * the same types for app-wide references without duplicating state.
 */

export const FIGMA_ENROLLMENT_MAIN_STEPS = [
  "plan",
  "contribution",
  "contribution-source",
  "auto-increase",
  "investment",
  "readiness",
  "review",
] as const;

export type FigmaEnrollmentMainStepId = (typeof FIGMA_ENROLLMENT_MAIN_STEPS)[number];
