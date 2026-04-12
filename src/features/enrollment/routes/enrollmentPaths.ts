import type { EnrollmentStepId } from "../store/types";
import { STEP_REGISTRY } from "../store/steps";

export function isEnrollmentStepPathSegment(s: string): s is EnrollmentStepId {
  return Object.prototype.hasOwnProperty.call(STEP_REGISTRY, s);
}

export function enrollmentPathForStep(step: EnrollmentStepId): string {
  return `/enrollment/${step}`;
}
