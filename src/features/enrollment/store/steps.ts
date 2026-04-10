// ─────────────────────────────────────────────
// Enrollment Flow — Step Registry
// ─────────────────────────────────────────────

import type { EnrollmentStepId, EnrollmentStepMeta } from "./types";

// Ordered list of MAIN steps shown in the stepper (branches excluded)
export const MAIN_STEP_IDS: EnrollmentStepId[] = [
  "plan",
  "contribution",
  "contribution-source",
  "auto-increase",
  "investment",
  "readiness",
  "review",
];

// Full step registry
export const STEP_REGISTRY: Record<EnrollmentStepId, EnrollmentStepMeta> = {
  wizard: {
    id: "wizard",
    label: "Get Started",
    description: "Tell us about yourself",
    stepNumber: null,
    isOptional: false,
    isBranch: false,
  },
  plan: {
    id: "plan",
    label: "Choose Plan",
    description: "Select your 401(k) plan type",
    stepNumber: 1,
    isOptional: false,
    isBranch: false,
  },
  contribution: {
    id: "contribution",
    label: "Contribution",
    description: "Set your contribution rate",
    stepNumber: 2,
    isOptional: false,
    isBranch: false,
  },
  "contribution-source": {
    id: "contribution-source",
    label: "Tax Strategy",
    description: "Allocate pre-tax, Roth, and after-tax",
    stepNumber: 3,
    isOptional: false,
    isBranch: false,
  },
  "auto-increase": {
    id: "auto-increase",
    label: "Auto-Increase",
    description: "Grow contributions automatically",
    stepNumber: 4,
    isOptional: false,
    isBranch: false,
  },
  "auto-increase-setup": {
    id: "auto-increase-setup",
    label: "Auto-Increase Setup",
    description: "Configure increase rate and cap",
    stepNumber: 4,
    isOptional: false,
    isBranch: true,
  },
  "auto-increase-skip": {
    id: "auto-increase-skip",
    label: "Skip Auto-Increase",
    description: "Confirm skipping automatic increases",
    stepNumber: 4,
    isOptional: false,
    isBranch: true,
  },
  investment: {
    id: "investment",
    label: "Investments",
    description: "Choose your investment strategy",
    stepNumber: 5,
    isOptional: false,
    isBranch: false,
  },
  readiness: {
    id: "readiness",
    label: "Readiness",
    description: "Review your retirement readiness score",
    stepNumber: 6,
    isOptional: false,
    isBranch: false,
  },
  review: {
    id: "review",
    label: "Review",
    description: "Confirm your enrollment details",
    stepNumber: 7,
    isOptional: false,
    isBranch: false,
  },
  success: {
    id: "success",
    label: "Enrolled!",
    description: "Your enrollment is complete",
    stepNumber: null,
    isOptional: false,
    isBranch: false,
  },
};

// Given a step id, return the NEXT main step (skipping branches)
// Branching transitions are handled by the engine, not here.
export function getNextMainStep(current: EnrollmentStepId): EnrollmentStepId | null {
  const idx = MAIN_STEP_IDS.indexOf(current as typeof MAIN_STEP_IDS[number]);
  if (idx === -1 || idx === MAIN_STEP_IDS.length - 1) return null;
  return MAIN_STEP_IDS[idx + 1] ?? null;
}

export function getPrevMainStep(current: EnrollmentStepId): EnrollmentStepId | null {
  const idx = MAIN_STEP_IDS.indexOf(current as typeof MAIN_STEP_IDS[number]);
  if (idx <= 0) return "wizard";
  return MAIN_STEP_IDS[idx - 1] ?? null;
}

export function getStepProgress(current: EnrollmentStepId): { current: number; total: number } {
  const meta = STEP_REGISTRY[current];
  return {
    current: meta.stepNumber ?? 0,
    total: MAIN_STEP_IDS.length,
  };
}
