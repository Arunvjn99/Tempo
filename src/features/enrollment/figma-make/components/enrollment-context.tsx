import { createContext, useContext, useState, type ReactNode } from "react";
import { useEnrollmentStore } from "../../store";
import { MAIN_STEP_IDS, STEP_REGISTRY } from "../../store/steps";
import type { EnrollmentState, EnrollmentStepId } from "../../store/types";

export interface PersonalizationData {
  retirementAge: number;
  currentAge: number;
  retirementLocation: string;
  currentSavings: number;
  investmentComfort: "conservative" | "balanced" | "growth" | "aggressive";
  wizardCompleted: boolean;
}

export interface EnrollmentData {
  plan: "traditional" | "roth" | null;
  contributionPercent: number;
  contributionSources: {
    preTax: number;
    roth: number;
    afterTax: number;
  };
  autoIncrease: boolean;
  autoIncreaseAmount: number;
  autoIncreaseMax: number;
  riskLevel: "conservative" | "balanced" | "growth" | "aggressive";
  useRecommendedPortfolio: boolean;
  agreedToTerms: boolean;
  salary: number;
  companyPlans: ("traditional" | "roth")[];
  supportsAfterTax: boolean;
}

interface EnrollmentContextType {
  data: EnrollmentData;
  updateData: (updates: Partial<EnrollmentData>) => void;
  personalization: PersonalizationData;
  updatePersonalization: (updates: Partial<PersonalizationData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const defaultPersonalization: PersonalizationData = {
  retirementAge: 65,
  currentAge: 30,
  retirementLocation: "",
  currentSavings: 0,
  investmentComfort: "balanced",
  wizardCompleted: false,
};

const defaultData: EnrollmentData = {
  plan: null,
  contributionPercent: 6,
  contributionSources: {
    preTax: 100,
    roth: 0,
    afterTax: 0,
  },
  autoIncrease: false,
  autoIncreaseAmount: 1,
  autoIncreaseMax: 15,
  riskLevel: "balanced",
  useRecommendedPortfolio: true,
  agreedToTerms: false,
  salary: 85000,
  companyPlans: ["traditional", "roth"],
  supportsAfterTax: true,
};

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

function buildInitialFromZustand(): {
  data: EnrollmentData;
  personalization: PersonalizationData;
  currentStep: number;
} {
  const z = useEnrollmentStore.getState();
  const e = z.enrollment;
  const data: EnrollmentData = {
    ...defaultData,
    plan: e.plan,
    contributionPercent: e.contributionPercent,
    contributionSources: { ...e.contributionSources },
    autoIncrease: e.autoIncrease,
    autoIncreaseAmount: e.autoIncreaseAmount,
    autoIncreaseMax: e.autoIncreaseMax,
    riskLevel: e.riskLevel,
    useRecommendedPortfolio: e.useRecommendedPortfolio,
    agreedToTerms: e.agreedToTerms,
    salary: e.salary,
    companyPlans: e.companyPlans?.length ? [...e.companyPlans] : defaultData.companyPlans,
    supportsAfterTax: e.supportsAfterTax,
  };
  const personalization: PersonalizationData = {
    ...defaultPersonalization,
    ...z.personalization,
  };
  const id = z.currentStep as EnrollmentStepId;
  const stepNumber = STEP_REGISTRY[id]?.stepNumber ?? 1;
  const currentStep = id === "wizard" || id === "success" ? 1 : stepNumber;
  return { data, personalization, currentStep };
}

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [bundle] = useState(() => buildInitialFromZustand());
  const [data, setData] = useState<EnrollmentData>(bundle.data);
  const [personalization, setPersonalization] = useState<PersonalizationData>(bundle.personalization);
  const [flowStepNumber, setFlowStepNumber] = useState(bundle.currentStep);

  const updateData = (updates: Partial<EnrollmentData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    useEnrollmentStore.getState().updateEnrollment(updates as Partial<EnrollmentState>);
  };

  const updatePersonalization = (updates: Partial<PersonalizationData>) => {
    setPersonalization((prev) => ({ ...prev, ...updates }));
    useEnrollmentStore.getState().updatePersonalization(updates);
  };

  /** Figma Make: 1–7 maps to {@link MAIN_STEP_IDS} (plan → review). Also syncs Zustand for URL/persist parity. */
  const setCurrentStep = (step: number) => {
    setFlowStepNumber(step);
    const id = MAIN_STEP_IDS[step - 1];
    if (id) {
      useEnrollmentStore.getState().goToStep(id);
    }
  };

  return (
    <EnrollmentContext.Provider
      value={{
        data,
        updateData,
        personalization,
        updatePersonalization,
        currentStep: flowStepNumber,
        setCurrentStep,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext);
  if (!context) throw new Error("useEnrollment must be used within EnrollmentProvider");
  return context;
}