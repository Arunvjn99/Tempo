import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FlowProgress } from "../../components/FlowProgress";
import { useState, createContext, useContext } from "react";
import { TransactionFlowPageFrame } from "@/features/transactions/ui/TransactionFlowPageFrame";

interface RolloverData {
  previousEmployer?: string;
  planAdministrator?: string;
  accountNumber?: string;
  estimatedAmount?: number;
  rolloverType?: string;
  isCompatible?: boolean;
  allocation?: { fundName: string; percentage: number }[];
}

interface RolloverFlowContextType {
  rolloverData: RolloverData;
  updateRolloverData: (data: Partial<RolloverData>) => void;
}

const RolloverFlowContext = createContext<RolloverFlowContextType | undefined>(undefined);

export function useRolloverFlow() {
  const context = useContext(RolloverFlowContext);
  if (!context) {
    throw new Error("useRolloverFlow must be used within RolloverFlowLayout");
  }
  return context;
}

const steps = [
  { number: 1, label: "Plan Details", path: "/transactions/rollover" },
  { number: 2, label: "Validation", path: "/transactions/rollover/validation" },
  { number: 3, label: "Allocation", path: "/transactions/rollover/allocation" },
  { number: 4, label: "Documents", path: "/transactions/rollover/documents" },
  { number: 5, label: "Review", path: "/transactions/rollover/review" },
];

export function RolloverFlowLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rolloverData, setRolloverData] = useState<RolloverData>({});

  const updateRolloverData = (data: Partial<RolloverData>) => {
    setRolloverData((prev) => ({ ...prev, ...data }));
  };

  const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  const handleExit = () => {
    navigate("/transactions");
  };

  return (
    <RolloverFlowContext.Provider value={{ rolloverData, updateRolloverData }}>
      <TransactionFlowPageFrame
        title="Rollover Request"
        currentStep={currentStep}
        totalSteps={steps.length}
        onExit={handleExit}
        progress={<FlowProgress steps={steps} currentStep={currentStep} />}
      >
        <Outlet />
      </TransactionFlowPageFrame>
    </RolloverFlowContext.Provider>
  );
}
