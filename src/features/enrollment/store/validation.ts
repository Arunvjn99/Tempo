// ─────────────────────────────────────────────
// Enrollment Flow — Step-Level Validation
// ─────────────────────────────────────────────

import type {
  EnrollmentStepId,
  EnrollmentState,
  PersonalizationState,
  ValidationResult,
  WizardSubStep,
} from "./types";

function ok(): ValidationResult {
  return { valid: true, errors: {} };
}

function fail(errors: Record<string, string>): ValidationResult {
  return { valid: false, errors };
}

// ── Wizard sub-step validation ─────────────────
export function validateWizardStep(
  step: WizardSubStep,
  p: PersonalizationState,
): ValidationResult {
  switch (step) {
    case 1:
      if (p.retirementAge < 50 || p.retirementAge > 75) {
        return fail({ retirementAge: "Retirement age must be between 50 and 75." });
      }
      return ok();
    case 2:
      if (!p.retirementLocation.trim()) {
        return fail({ retirementLocation: "Please select a retirement location." });
      }
      return ok();
    case 3:
      if (p.currentSavings < 0) {
        return fail({ currentSavings: "Current savings cannot be negative." });
      }
      return ok();
    case 4:
      return ok(); // comfort level always valid
  }
}

// ── Main step validation ───────────────────────
export function validateStep(
  stepId: EnrollmentStepId,
  enrollment: EnrollmentState,
  _personalization: PersonalizationState,
): ValidationResult {
  switch (stepId) {
    case "wizard":
      return ok(); // wizard uses sub-step validation

    case "plan":
      if (!enrollment.plan) {
        return fail({ plan: "Please select a plan type." });
      }
      return ok();

    case "contribution": {
      const pct = enrollment.contributionPercent;
      if (pct < 1 || pct > 25) {
        return fail({ contributionPercent: "Contribution must be between 1% and 25%." });
      }
      return ok();
    }

    case "contribution-source": {
      const { preTax, roth, afterTax } = enrollment.contributionSources;
      const total = preTax + roth + afterTax;
      if (Math.round(total) !== 100) {
        return fail({ sources: `Allocations must sum to 100% (currently ${total}%).` });
      }
      return ok();
    }

    case "auto-increase":
      // Decision page — choosing either path is always valid
      return ok();

    case "auto-increase-setup": {
      const { autoIncreaseAmount, autoIncreaseMax, contributionPercent } = enrollment;
      const errors: Record<string, string> = {};
      if (autoIncreaseAmount <= 0 || autoIncreaseAmount > 5) {
        errors.autoIncreaseAmount = "Increase amount must be between 0.1% and 5%.";
      }
      if (autoIncreaseMax <= contributionPercent) {
        errors.autoIncreaseMax = "Maximum must be higher than your current contribution.";
      }
      if (autoIncreaseMax > 25) {
        errors.autoIncreaseMax = "Maximum cannot exceed 25%.";
      }
      return Object.keys(errors).length ? fail(errors) : ok();
    }

    case "auto-increase-skip":
      return ok();

    case "investment": {
      if (!enrollment.useRecommendedPortfolio) {
        // Custom funds must sum to 100 per source
        if (enrollment.sameAllocationForAllSources) {
          const total = enrollment.customFunds.reduce((s, f) => s + f.allocationPct, 0);
          if (Math.round(total) !== 100) {
            return fail({ funds: `Fund allocations must sum to 100% (currently ${total}%).` });
          }
        } else {
          for (const sa of enrollment.perSourceAllocations) {
            const total = sa.funds.reduce((s, f) => s + f.allocationPct, 0);
            if (Math.round(total) !== 100) {
              return fail({
                [sa.source]: `${sa.source} allocations must sum to 100% (currently ${total}%).`,
              });
            }
          }
        }
      }
      return ok();
    }

    case "readiness":
      return ok();

    case "review":
      if (!enrollment.agreedToTerms) {
        return fail({ agreedToTerms: "You must agree to the terms to enroll." });
      }
      return ok();

    case "success":
      return ok();

    default:
      return ok();
  }
}
