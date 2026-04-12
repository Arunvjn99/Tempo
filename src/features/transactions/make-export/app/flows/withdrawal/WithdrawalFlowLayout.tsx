import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FlowProgress } from "../../components/FlowProgress";
import { useState, createContext, useContext } from "react";
import { TransactionFlowPageFrame } from "@/features/transactions/ui/TransactionFlowPageFrame";

interface WithdrawalData {
  type?: string;
  amount?: number;
  sources?: { name: string; amount: number }[];
  paymentMethod?: string;
  address?: string;
  grossNetElection?: string;
  federalWithholding?: number;
  stateWithholding?: number;
}

interface WithdrawalFlowContextType {
  withdrawalData: WithdrawalData;
  updateWithdrawalData: (data: Partial<WithdrawalData>) => void;
}

const WithdrawalFlowContext = createContext<WithdrawalFlowContextType | undefined>(undefined);

export function useWithdrawalFlow() {
  const context = useContext(WithdrawalFlowContext);
  if (!context) {
    throw new Error("useWithdrawalFlow must be used within WithdrawalFlowLayout");
  }
  return context;
}

const steps = [
  { number: 1, label: "Eligibility", path: "/transactions/withdrawal" },
  { number: 2, label: "Type", path: "/transactions/withdrawal/type" },
  { number: 3, label: "Source", path: "/transactions/withdrawal/source" },
  { number: 4, label: "Fees", path: "/transactions/withdrawal/fees" },
  { number: 5, label: "Payment", path: "/transactions/withdrawal/payment" },
  { number: 6, label: "Review", path: "/transactions/withdrawal/review" },
];

export function WithdrawalFlowLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData>({});

  const updateWithdrawalData = (data: Partial<WithdrawalData>) => {
    setWithdrawalData((prev) => ({ ...prev, ...data }));
  };

  const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  const handleExit = () => {
    navigate("/transactions");
  };

  return (
    <WithdrawalFlowContext.Provider value={{ withdrawalData, updateWithdrawalData }}>
      <TransactionFlowPageFrame
        title="Withdrawal Request"
        currentStep={currentStep}
        totalSteps={steps.length}
        onExit={handleExit}
        progress={<FlowProgress steps={steps} currentStep={currentStep} />}
      >
        <Outlet />
      </TransactionFlowPageFrame>
    </WithdrawalFlowContext.Provider>
  );
}
