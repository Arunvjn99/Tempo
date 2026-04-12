// ─────────────────────────────────────────────
// Enrollment Flow — Core Type Definitions
// ─────────────────────────────────────────────

// ── Plan ──────────────────────────────────────
export type PlanType = "traditional" | "roth";

export type CompanyPlans = PlanType[];

// ── Contribution Sources ───────────────────────
export interface ContributionSources {
  preTax: number;   // 0–100
  roth: number;     // 0–100
  afterTax: number; // 0–100
}

// ── Auto-Increase ──────────────────────────────
export type IncrementCycle = "calendar" | "participant" | "plan";

// ── Risk / Investment ──────────────────────────
export type RiskLevel = "conservative" | "balanced" | "growth" | "aggressive";

export interface FundAllocation {
  fundId: string;
  name: string;
  ticker: string;
  assetClass: string;
  expenseRatio: number;
  allocationPct: number; // 0–100
}

export interface SourceAllocation {
  source: "preTax" | "roth" | "afterTax";
  funds: FundAllocation[];
}

// ── Readiness Suggestion ───────────────────────
export type SuggestionType =
  | "boost-contribution"
  | "enable-auto-increase"
  | "increase-risk"
  | "increase-savings";

export interface ReadinessSuggestion {
  type: SuggestionType;
  label: string;
  description: string;
  scoreImpact: number;
  applied: boolean;
}

// ── Personalization (Wizard) ───────────────────
export interface PersonalizationState {
  retirementAge: number;       // 50–75, default 65
  currentAge: number;          // default 30
  retirementLocation: string;  // required gate
  currentSavings: number;      // default 0
  investmentComfort: RiskLevel;
  wizardCompleted: boolean;
}

// ── Enrollment Core State ──────────────────────
export interface EnrollmentState {
  // Plan
  plan: PlanType | null;
  companyPlans: CompanyPlans;

  // Contribution
  contributionPercent: number; // 1–25, default 6
  salary: number;              // default 85000
  supportsAfterTax: boolean;

  // Contribution Sources
  contributionSources: ContributionSources;

  // Auto-Increase
  autoIncrease: boolean;
  autoIncreaseResolved: boolean;
  autoIncreaseAmount: number;  // 0–5% per year, default 1
  autoIncreaseMax: number;     // 1–25%, default 15
  incrementCycle: IncrementCycle;

  // Investment
  riskLevel: RiskLevel;
  useRecommendedPortfolio: boolean;
  customFunds: FundAllocation[];
  sameAllocationForAllSources: boolean;
  perSourceAllocations: SourceAllocation[];

  // Readiness
  readinessSuggestions: ReadinessSuggestion[];

  // Review
  agreedToTerms: boolean;
}

// ── Full Flow State ────────────────────────────
export interface EnrollmentFlowState {
  personalization: PersonalizationState;
  enrollment: EnrollmentState;
  currentStep: EnrollmentStepId;
  wizardStep: WizardSubStep;
  history: EnrollmentStepId[];
}

// ── Step Identifiers ───────────────────────────
export type EnrollmentStepId =
  | "wizard"
  | "plan"
  | "contribution"
  | "contribution-source"
  | "auto-increase"
  | "auto-increase-setup"
  | "auto-increase-skip"
  | "investment"
  | "readiness"
  | "review"
  | "success";

export type WizardSubStep = 1 | 2 | 3 | 4;

// ── Step Metadata ──────────────────────────────
export interface EnrollmentStepMeta {
  id: EnrollmentStepId;
  label: string;
  description: string;
  stepNumber: number | null; // null = outside main stepper
  isOptional: boolean;
  isBranch: boolean; // not in linear step count
}

// ── Validation ────────────────────────────────
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// ── Actions ───────────────────────────────────
export interface EnrollmentActions {
  updatePersonalization: (patch: Partial<PersonalizationState>) => void;
  updateEnrollment: (patch: Partial<EnrollmentState>) => void;
  setWizardStep: (step: WizardSubStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (id: EnrollmentStepId) => void;
  /** Flow API aliases (non–URL-driven; same as nextStep/prevStep/goToStep). */
  next: () => void;
  back: () => void;
  goTo: (id: EnrollmentStepId) => void;
  /** Jump to a main stepper step by 0-based index (main flow steps only). */
  goToMainStepIndex: (index: number) => void;
  /** 0-based index into main flow, or -1 if current step is branch/wizard/success. */
  getMainFlowStepIndex: () => number;
  canProceed: () => boolean;
  validate: () => ValidationResult;
  applySuggestion: (type: SuggestionType) => void;
  reset: () => void;
}

// ── Derived / Computed ─────────────────────────
export interface EnrollmentDerived {
  monthlyPaycheck: number;
  monthlyContribution: number;
  monthlyEmployerMatch: number;
  projectedBalance: number;
  projectedBalanceNoAI: number;
  readinessScore: number;
  monthlyRetirementIncome: number;
  yearsToRetirement: number;
  growthRate: number;
}
