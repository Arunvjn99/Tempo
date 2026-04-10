import type { LoanData } from "@/features/transactions/store/types";

export interface LoanPagesProps {
  step: number;
  totalSteps: number;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  isLastStep: boolean;
  completedAt: string | null;
  onFinish: () => void;
}

export interface LoanStepCommonProps {
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
}

export type LoanStoreSlice = {
  loan: LoanData;
  updateLoan: (patch: Partial<LoanData>) => void;
  goToStep: (index: number) => void;
};
