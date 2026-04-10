import type { SelectedPlanId } from "./planTypes";
import type { ContributionType } from "./contributionTypes";
import type { InvestmentAllocation } from "../types/investment";
import type { InvestmentProfile } from "./investmentProfile";

/**
 * Investment draft snapshot for persistence
 */
export interface InvestmentDraftSnapshot {
  /** Per-source allocation; only keys with active sources present */
  sourceAllocation: InvestmentAllocation;
  /** Edit toggle: when OFF, use plan default; when ON, user edits apply */
  editAllocationEnabled: boolean;
}

/**
 * Enrollment draft - single source of truth for wizard data.
 * Persisted to sessionStorage for reuse across wizard → plans flow.
 */
export interface EnrollmentDraft {
  currentAge: number;
  /** ISO date (YYYY-MM-DD); when present, currentAge is derived from this */
  dateOfBirth?: string;
  retirementAge: number;
  yearsToRetire: number;
  annualSalary: number;
  retirementLocation: string;
  /** Pre-enrollment wizard Step 4 — investment risk comfort */
  investmentComfort?: "conservative" | "balanced" | "growth" | "aggressive";
  otherSavings?: {
    type: string | null;
    amount: number | null;
  };
  /** Selected plan on plans page - persisted on Save & Exit */
  selectedPlanId?: SelectedPlanId | null;
  /** When plans from API: UUID of selected plan; saved to enrollments table on Continue */
  selectedPlanDbId?: string | null;
  /** Contribution settings - persisted on Save & Exit from Contribution step */
  contributionType?: ContributionType;
  contributionAmount?: number;
  /** Source allocation (preTax + roth + afterTax = 100) - drives Investment accordions */
  sourceAllocation?: { preTax: number; roth: number; afterTax: number };
  /** AI Investment Profile - completed before Investments step */
  investmentProfile?: InvestmentProfile;
  investmentProfileCompleted?: boolean;
  /** Investment elections - persisted on Save & Exit from Investments step */
  investment?: InvestmentDraftSnapshot;
  /** Auto increase - persisted on Continue from Future Contributions step */
  autoIncrease?: {
    enabled: boolean;
    annualIncreasePct: number;
    stopAtPct: number;
    minimumFloorPct?: number;
  };
  /**
   * Explicit auto-increase step decision (enable vs skip).
   * `enabled: null` means the user has not committed a choice yet.
   */
  autoIncreasePreference?: {
    enabled: boolean | null;
    skipped: boolean;
  };
}

const STORAGE_KEY = "enrollment-draft";

/** Used by Save & Exit to trigger toast on Dashboard */
export const ENROLLMENT_SAVED_TOAST_KEY = "enrollment-saved-toast";

export function loadEnrollmentDraft(): EnrollmentDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EnrollmentDraft;
  } catch (err) {
    if (import.meta.env.DEV) console.error("[enrollmentDraftStore] loadEnrollmentDraft parse failed:", err);
    return null;
  }
}

export function saveEnrollmentDraft(draft: EnrollmentDraft): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearEnrollmentDraft(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
