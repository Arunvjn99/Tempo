import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildEnrollmentDerived, type EnrollmentState } from "../flow/enrollmentDerivedEngine";
import { getGrowthRate } from "../flow/readinessMetrics";
import {
  ENROLLMENT_STEP_COUNT,
  ENROLLMENT_STEPS,
} from "../flow/steps";

export type SelectedPlanOption = "traditional" | "roth";

/** Matches figma `EnrollmentData.riskLevel` / personalization comfort. */
export type RiskLevel = "conservative" | "balanced" | "growth" | "aggressive";

export type ContributionSources = {
  preTax: number;
  roth: number;
  afterTax: number;
};

export type IncrementCycle = "calendar" | "participant" | "plan";

export type EnrollmentV1Snapshot = {
  currentStep: number;
  selectedPlan: SelectedPlanOption | null;
  /** Deferral % of salary (figma uses 1–25). */
  contribution: number;
  salary: number;
  /** Gross monthly pay; kept in sync with `salary` (salary = monthlyPaycheck × 12). */
  monthlyPaycheck: number;
  monthlyContribution: number;
  employerMatch: number;
  projectedBalance: number;
  projectedBalanceNoAutoIncrease: number;
  readinessScore: number;
  contributionSources: ContributionSources;
  supportsAfterTax: boolean;
  companyPlans: SelectedPlanOption[];
  autoIncrease: boolean;
  /** True after user completes this step (Skip or Save setup). */
  autoIncreaseStepResolved: boolean;
  /** Per-year step increase (% points), figma slider 0–3. */
  autoIncreaseRate: number;
  /** Cap when auto increases stop (10–15 in figma setup). */
  autoIncreaseMax: number;
  incrementCycle: IncrementCycle;
  riskLevel: RiskLevel | null;
  useRecommendedPortfolio: boolean;
  agreedToTerms: boolean;
  retirementAge: number;
  currentAge: number;
  currentSavings: number;
  retirementProjection: {
    estimatedValue: number;
    monthlyIncome: number;
  };
};

export type { EnrollmentState };

export function selectEnrollmentState(s: EnrollmentV1Snapshot): EnrollmentState {
  return {
    planType: s.selectedPlan,
    contributionPercent: s.contribution,
    contributionAmount: s.monthlyContribution,
    monthlyPaycheck: s.monthlyPaycheck,
    preTaxPercent: s.contributionSources.preTax,
    rothPercent: s.contributionSources.roth,
    autoIncreaseEnabled: s.autoIncrease,
    investmentStrategy: s.useRecommendedPortfolio ? "default" : "custom",
    projectedBalance: s.projectedBalance,
    monthlyContribution: s.monthlyContribution,
    employerMatch: s.employerMatch,
    readinessScore: s.readinessScore,
  };
}

type EnrollmentV1Actions = {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  updateField: <K extends keyof EnrollmentV1Snapshot>(
    key: K,
    value: EnrollmentV1Snapshot[K],
  ) => void;
};

type EnrollmentV1StoreBase = EnrollmentV1Snapshot & EnrollmentV1Actions;

function toSnapshot(s: EnrollmentV1StoreBase): EnrollmentV1Snapshot {
  return {
    currentStep: s.currentStep,
    selectedPlan: s.selectedPlan,
    contribution: s.contribution,
    salary: s.salary,
    monthlyPaycheck: s.monthlyPaycheck,
    monthlyContribution: s.monthlyContribution,
    employerMatch: s.employerMatch,
    projectedBalance: s.projectedBalance,
    projectedBalanceNoAutoIncrease: s.projectedBalanceNoAutoIncrease,
    readinessScore: s.readinessScore,
    contributionSources: s.contributionSources,
    supportsAfterTax: s.supportsAfterTax,
    companyPlans: s.companyPlans,
    autoIncrease: s.autoIncrease,
    autoIncreaseStepResolved: s.autoIncreaseStepResolved,
    autoIncreaseRate: s.autoIncreaseRate,
    autoIncreaseMax: s.autoIncreaseMax,
    incrementCycle: s.incrementCycle,
    riskLevel: s.riskLevel,
    useRecommendedPortfolio: s.useRecommendedPortfolio,
    agreedToTerms: s.agreedToTerms,
    retirementAge: s.retirementAge,
    currentAge: s.currentAge,
    currentSavings: s.currentSavings,
    retirementProjection: s.retirementProjection,
  };
}

function patchDerived(s: EnrollmentV1Snapshot): Partial<EnrollmentV1Snapshot> {
  const d = buildEnrollmentDerived({
    monthlyPaycheck: s.monthlyPaycheck ?? 0,
    salaryAnnual: s.salary ?? 0,
    contributionPercent: s.contribution,
    currentSavings: s.currentSavings,
    currentAge: s.currentAge,
    retirementAge: s.retirementAge,
    growthRateAnnual: getGrowthRate(s.riskLevel),
    autoIncreaseEnabled: s.autoIncrease,
    autoIncreaseRate: s.autoIncreaseRate,
    autoIncreaseMax: s.autoIncreaseMax,
  });
  return {
    monthlyPaycheck: d.monthlyPaycheck,
    salary: d.salaryAnnual,
    monthlyContribution: d.monthlyContribution,
    employerMatch: d.employerMatch,
    projectedBalance: d.projectedBalance,
    projectedBalanceNoAutoIncrease: d.projectedBalanceNoAutoIncrease,
    readinessScore: d.readinessScore,
    retirementProjection: d.retirementProjection,
  };
}

const initialSnapshot: EnrollmentV1Snapshot = {
  currentStep: 0,
  selectedPlan: null,
  contribution: 6,
  salary: 85000,
  monthlyPaycheck: 0,
  monthlyContribution: 0,
  employerMatch: 0,
  projectedBalance: 0,
  projectedBalanceNoAutoIncrease: 0,
  readinessScore: 0,
  contributionSources: { preTax: 60, roth: 40, afterTax: 0 },
  supportsAfterTax: true,
  companyPlans: ["traditional", "roth"],
  autoIncrease: false,
  autoIncreaseStepResolved: false,
  autoIncreaseRate: 1,
  autoIncreaseMax: 15,
  incrementCycle: "participant",
  riskLevel: null,
  useRecommendedPortfolio: true,
  agreedToTerms: false,
  retirementAge: 65,
  currentAge: 30,
  currentSavings: 0,
  retirementProjection: {
    estimatedValue: 0,
    monthlyIncome: 0,
  },
};

const seededSnapshot: EnrollmentV1Snapshot = {
  ...initialSnapshot,
  ...patchDerived(initialSnapshot),
};

export type EnrollmentV1Store = EnrollmentV1Snapshot & EnrollmentV1Actions;

const maxIndex = ENROLLMENT_STEP_COUNT - 1;

export const useEnrollmentStore = create<EnrollmentV1Store>()(
  persist(
    (set, get) => ({
      ...seededSnapshot,

      nextStep: () => {
        const { currentStep } = get();
        set({
          currentStep: Math.min(currentStep + 1, maxIndex),
        });
      },

      prevStep: () => {
        const { currentStep } = get();
        set({
          currentStep: Math.max(currentStep - 1, 0),
        });
      },

      goToStep: (stepIndex: number) => {
        if (stepIndex < 0 || stepIndex > maxIndex) return;
        set({ currentStep: stepIndex });
      },

      updateField: (key, value) => {
        set((state) => {
          const next = { ...state, [key]: value } as EnrollmentV1Snapshot;
          if (key === "monthlyPaycheck") {
            next.salary = Math.round(Number(value) * 12);
          }
          return { ...next, ...patchDerived(next) };
        });
      },
    }),
    {
      name: "enrollment-v1-engine",
      merge: (persisted, current) => {
        const c = current as EnrollmentV1StoreBase;
        const p = (persisted ?? {}) as Partial<EnrollmentV1Snapshot>;
        const mergedSnap: EnrollmentV1Snapshot = {
          ...initialSnapshot,
          ...toSnapshot(c),
          ...p,
        };
        const derived = patchDerived(mergedSnap);
        return { ...c, ...mergedSnap, ...derived };
      },
      partialize: (s) => ({
        currentStep: s.currentStep,
        selectedPlan: s.selectedPlan,
        contribution: s.contribution,
        salary: s.salary,
        monthlyPaycheck: s.monthlyPaycheck,
        contributionSources: s.contributionSources,
        supportsAfterTax: s.supportsAfterTax,
        companyPlans: s.companyPlans,
        autoIncrease: s.autoIncrease,
        autoIncreaseStepResolved: s.autoIncreaseStepResolved,
        autoIncreaseRate: s.autoIncreaseRate,
        autoIncreaseMax: s.autoIncreaseMax,
        incrementCycle: s.incrementCycle,
        riskLevel: s.riskLevel,
        useRecommendedPortfolio: s.useRecommendedPortfolio,
        agreedToTerms: s.agreedToTerms,
        retirementAge: s.retirementAge,
        currentAge: s.currentAge,
        currentSavings: s.currentSavings,
        retirementProjection: s.retirementProjection,
      }),
    },
  ),
);

export function enrollmentStepIdAt(index: number) {
  return ENROLLMENT_STEPS[index];
}
