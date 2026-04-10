// ─────────────────────────────────────────────
// Enrollment Flow — Zustand Store
// ─────────────────────────────────────────────

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  EnrollmentActions,
  EnrollmentFlowState,
  EnrollmentState,
  EnrollmentStepId,
  PersonalizationState,
  ReadinessSuggestion,
  SuggestionType,
  ValidationResult,
  WizardSubStep,
} from "./types";
import {
  canProceed,
  resolveNextStep,
  resolveNextWizardSubStep,
  resolvePrevStep,
  resolvePrevWizardSubStep,
} from "./engine";
import { validateStep, validateWizardStep } from "./validation";
import { buildDerived } from "./derived";

// ── Default State ──────────────────────────────
const DEFAULT_PERSONALIZATION: PersonalizationState = {
  retirementAge: 65,
  currentAge: 30,
  retirementLocation: "",
  currentSavings: 0,
  investmentComfort: "balanced",
  wizardCompleted: false,
};

const DEFAULT_ENROLLMENT: EnrollmentState = {
  plan: null,
  companyPlans: ["traditional", "roth"],
  contributionPercent: 6,
  salary: 85_000,
  supportsAfterTax: true,
  contributionSources: { preTax: 100, roth: 0, afterTax: 0 },
  autoIncrease: false,
  autoIncreaseResolved: false,
  autoIncreaseAmount: 1,
  autoIncreaseMax: 15,
  incrementCycle: "calendar",
  riskLevel: "balanced",
  useRecommendedPortfolio: true,
  customFunds: [],
  sameAllocationForAllSources: true,
  perSourceAllocations: [],
  readinessSuggestions: [],
  agreedToTerms: false,
};

const DEFAULT_FLOW_STATE: EnrollmentFlowState = {
  personalization: DEFAULT_PERSONALIZATION,
  enrollment: DEFAULT_ENROLLMENT,
  currentStep: "wizard",
  wizardStep: 1,
  history: [],
};

// ── Store Interface ────────────────────────────
type EnrollmentStore = EnrollmentFlowState & EnrollmentActions;

// ── Store ──────────────────────────────────────
export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_FLOW_STATE,

      // ── Personalization ──
      updatePersonalization: (patch) =>
        set((s) => ({
          personalization: { ...s.personalization, ...patch },
        })),

      // ── Enrollment ──
      updateEnrollment: (patch) =>
        set((s) => ({
          enrollment: { ...s.enrollment, ...patch },
        })),

      // ── Wizard sub-step ──
      setWizardStep: (step: WizardSubStep) => set({ wizardStep: step }),

      // ── Navigation: Next ──
      nextStep: () => {
        const state = get();
        const { currentStep, wizardStep } = state;

        if (currentStep === "wizard") {
          const nextSub = resolveNextWizardSubStep(wizardStep);
          if (nextSub) {
            set({ wizardStep: nextSub });
            return;
          }
          // Wizard complete — sync comfort → riskLevel
          set((s) => ({
            currentStep: "plan",
            history: [...s.history, "wizard"],
            enrollment: {
              ...s.enrollment,
              riskLevel: s.personalization.investmentComfort,
            },
            personalization: { ...s.personalization, wizardCompleted: true },
          }));
          return;
        }

        const nextId = resolveNextStep(state);
        if (!nextId) return;

        set((s) => ({
          currentStep: nextId,
          history: [...s.history, currentStep],
          // Reset auto-increase branch tracking when leaving step 4
          enrollment:
            currentStep === "auto-increase"
              ? { ...s.enrollment, autoIncreaseResolved: true }
              : s.enrollment,
        }));
      },

      // ── Navigation: Prev ──
      prevStep: () => {
        const state = get();
        const { currentStep, wizardStep } = state;

        if (currentStep === "wizard") {
          const prevSub = resolvePrevWizardSubStep(wizardStep);
          if (prevSub) {
            set({ wizardStep: prevSub });
          }
          return;
        }

        const prevId = resolvePrevStep(state);
        if (!prevId) return;

        set((s) => ({
          currentStep: prevId,
          history: s.history.slice(0, -1),
          // If going back to wizard, restore wizard to step 4
          wizardStep: prevId === "wizard" ? 4 : s.wizardStep,
        }));
      },

      // ── Navigation: Jump (edit loops) ──
      goToStep: (id: EnrollmentStepId) => {
        const state = get();
        set({
          currentStep: id,
          history: [...state.history, state.currentStep],
          // Reset wizard to beginning if jumping back
          wizardStep: id === "wizard" ? 1 : state.wizardStep,
        });
      },

      // ── canProceed ──
      canProceed: () => canProceed(get()),

      // ── validate ──
      validate: (): ValidationResult => {
        const { currentStep, wizardStep, enrollment, personalization } = get();
        if (currentStep === "wizard") {
          return validateWizardStep(wizardStep, personalization);
        }
        return validateStep(currentStep, enrollment, personalization);
      },

      // ── Readiness: apply suggestion ──
      applySuggestion: (type: SuggestionType) => {
        set((s) => {
          const e = s.enrollment;
          let patch: Partial<EnrollmentState> = {};

          switch (type) {
            case "boost-contribution":
              patch = { contributionPercent: Math.min(e.contributionPercent + 2, 25) };
              break;
            case "enable-auto-increase":
              patch = { autoIncrease: true };
              break;
            case "increase-risk":
              patch = {
                riskLevel:
                  e.riskLevel === "conservative"
                    ? "balanced"
                    : e.riskLevel === "balanced"
                      ? "growth"
                      : e.riskLevel === "growth"
                        ? "aggressive"
                        : "aggressive",
              };
              break;
            case "increase-savings":
              patch = { contributionPercent: Math.min(e.contributionPercent + 3, 25) };
              break;
          }

          const updated: EnrollmentState = { ...e, ...patch };
          const updatedSuggestions: ReadinessSuggestion[] = e.readinessSuggestions.map((s) =>
            s.type === type ? { ...s, applied: true } : s,
          );

          return {
            enrollment: { ...updated, readinessSuggestions: updatedSuggestions },
          };
        });
      },

      // ── Reset ──
      reset: () =>
        set({
          ...DEFAULT_FLOW_STATE,
          personalization: { ...DEFAULT_PERSONALIZATION },
          enrollment: { ...DEFAULT_ENROLLMENT },
        }),
    }),
    {
      name: "enrollment-v4-store",
      version: 1,
      partialize: (state) => ({
        personalization: state.personalization,
        enrollment: state.enrollment,
        currentStep: state.currentStep,
        wizardStep: state.wizardStep,
        history: state.history,
      }),
    },
  ),
);

// ── Selector: derived values (computed, not stored) ──
export function useEnrollmentDerived() {
  const enrollment = useEnrollmentStore((s) => s.enrollment);
  const personalization = useEnrollmentStore((s) => s.personalization);
  return buildDerived(enrollment, personalization);
}

// ── Selector: current step meta ──
export function useCurrentStepMeta() {
  return useEnrollmentStore((s) => s.currentStep);
}
