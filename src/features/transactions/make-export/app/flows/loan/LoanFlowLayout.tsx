import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FlowProgress } from "../../components/FlowProgress";
import { useState, createContext, useContext } from "react";
import { TransactionFlowPageFrame } from "@/features/transactions/ui/TransactionFlowPageFrame";

interface LoanData {
  amount?: number;
  tenure?: number;
  loanType?: string;
  reason?: string;
  disbursementMethod?: string;
  bankAccount?: string;
  repaymentFrequency?: string;
  repaymentStartDate?: string;
  repaymentMethod?: string;
  bankAccountNumber?: string;
  routingNumber?: string;
  accountType?: string;
}

interface LoanFlowContextType {
  loanData: LoanData;
  updateLoanData: (data: Partial<LoanData>) => void;
}

const LoanFlowContext = createContext<LoanFlowContextType | undefined>(undefined);

export function useLoanFlow() {
  const context = useContext(LoanFlowContext);
  if (!context) {
    return {
      loanData: {} as LoanData,
      updateLoanData: (_data: Partial<LoanData>) => {},
    };
  }
  return context;
}

const steps = [
  { number: 1, label: "Eligibility", path: "/transactions/loan" },
  { number: 2, label: "Simulator", path: "/transactions/loan/simulator" },
  { number: 3, label: "Configuration", path: "/transactions/loan/configuration" },
  { number: 4, label: "Fees", path: "/transactions/loan/fees" },
  { number: 5, label: "Documents", path: "/transactions/loan/documents" },
  { number: 6, label: "Review", path: "/transactions/loan/review" },
];

export function LoanFlowLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loanData, setLoanData] = useState<LoanData>({});

  const updateLoanData = (data: Partial<LoanData>) => {
    setLoanData((prev) => ({ ...prev, ...data }));
  };

  const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  const handleExit = () => {
    navigate("/transactions");
  };

  return (
    <LoanFlowContext.Provider value={{ loanData, updateLoanData }}>
      <TransactionFlowPageFrame
        title="Loan Request"
        currentStep={currentStep}
        totalSteps={steps.length}
        onExit={handleExit}
        progress={<FlowProgress steps={steps} currentStep={currentStep} />}
        contentClassName="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-4"
      >
        <Outlet />
      </TransactionFlowPageFrame>
    </LoanFlowContext.Provider>
  );
}
