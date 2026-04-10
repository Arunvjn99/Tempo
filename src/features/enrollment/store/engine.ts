// ─────────────────────────────────────────────
// Enrollment Flow — Navigation Engine
// Branching, loops, and step resolution
// ─────────────────────────────────────────────

import type { EnrollmentFlowState, EnrollmentStepId, WizardSubStep } from "./types";
import { MAIN_STEP_IDS, getNextMainStep, getPrevMainStep } from "./steps";
import { validateStep, validateWizardStep } from "./validation";

// ── canProceed ─────────────────────────────────
export function canProceed(state: EnrollmentFlowState): boolean {
  const { currentStep, wizardStep, enrollment, personalization } = state;

  if (currentStep === "wizard") {
    return validateWizardStep(wizardStep, personalization).valid;
  }
  return validateStep(currentStep, enrollment, personalization).valid;
}

// ── nextStep resolution ────────────────────────
// Returns the next step id given current state.
// Handles all branching logic.
export function resolveNextStep(state: EnrollmentFlowState): EnrollmentStepId | null {
  const { currentStep, wizardStep, enrollment } = state;

  switch (currentStep) {
    case "wizard": {
      if (wizardStep < 4) return "wizard"; // advance sub-step internally
      return "plan";
    }

    case "auto-increase": {
      // Branch: enable → setup, skip → skip-confirm
      return enrollment.autoIncrease ? "auto-increase-setup" : "auto-increase-skip";
    }

    case "auto-increase-setup":
    case "auto-increase-skip": {
      // Both branches converge to investment
      return "investment";
    }

    case "review":
      return "success";

    default: {
      return getNextMainStep(currentStep);
    }
  }
}

// ── prevStep resolution ────────────────────────
export function resolvePrevStep(state: EnrollmentFlowState): EnrollmentStepId | null {
  const { currentStep, history } = state;

  // Use history stack for branch-aware back navigation
  if (history.length > 0) {
    return history[history.length - 1] ?? null;
  }

  // Fallback: linear back
  if (currentStep === "wizard") return null;
  return getPrevMainStep(currentStep) ?? "wizard";
}

// ── wizard sub-step ────────────────────────────
export function resolveNextWizardSubStep(current: WizardSubStep): WizardSubStep | null {
  if (current >= 4) return null;
  return (current + 1) as WizardSubStep;
}

export function resolvePrevWizardSubStep(current: WizardSubStep): WizardSubStep | null {
  if (current <= 1) return null;
  return (current - 1) as WizardSubStep;
}

// ── Jump-to (for review edit loops) ───────────────
export function isValidJumpTarget(
  target: EnrollmentStepId,
  state: EnrollmentFlowState,
): boolean {
  // Can jump to any completed main step or wizard
  const mainIdx = MAIN_STEP_IDS.indexOf(target as (typeof MAIN_STEP_IDS)[number]);
  const currentIdx = MAIN_STEP_IDS.indexOf(
    state.currentStep as (typeof MAIN_STEP_IDS)[number],
  );
  // Allow jumping to any step at or before current (edit loops)
  return mainIdx <= currentIdx || target === "wizard";
}
