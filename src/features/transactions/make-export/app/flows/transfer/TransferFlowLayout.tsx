import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FlowProgress } from "../../components/FlowProgress";
import { useState, createContext, useContext } from "react";
import { TransactionFlowPageFrame } from "@/features/transactions/ui/TransactionFlowPageFrame";

interface Fund {
  name: string;
  currentAllocation: number;
  newAllocation: number;
}

interface TransferData {
  transferType?: string;
  funds?: Fund[];
}

interface TransferFlowContextType {
  transferData: TransferData;
  updateTransferData: (data: Partial<TransferData>) => void;
}

const TransferFlowContext = createContext<TransferFlowContextType | undefined>(undefined);

export function useTransferFlow() {
  const context = useContext(TransferFlowContext);
  if (!context) {
    throw new Error("useTransferFlow must be used within TransferFlowLayout");
  }
  return context;
}

const steps = [
  { number: 1, label: "Type", path: "/transactions/transfer" },
  { number: 2, label: "Source", path: "/transactions/transfer/source" },
  { number: 3, label: "Destination", path: "/transactions/transfer/destination" },
  { number: 4, label: "Amount", path: "/transactions/transfer/amount" },
  { number: 5, label: "Impact", path: "/transactions/transfer/impact" },
  { number: 6, label: "Review", path: "/transactions/transfer/review" },
];

export function TransferFlowLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState<TransferData>({});

  const updateTransferData = (data: Partial<TransferData>) => {
    setTransferData((prev) => ({ ...prev, ...data }));
  };

  const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  return (
    <TransferFlowContext.Provider value={{ transferData, updateTransferData }}>
      <TransactionFlowPageFrame
        title="Transfer Funds"
        currentStep={currentStep}
        totalSteps={steps.length}
        onExit={() => navigate("/transactions")}
        progress={<FlowProgress steps={steps} currentStep={currentStep} />}
      >
        <Outlet />
      </TransactionFlowPageFrame>
    </TransferFlowContext.Provider>
  );
}
