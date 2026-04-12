import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FlowProgress } from "../../components/FlowProgress";
import { useState, createContext, useContext } from "react";
import { TransactionFlowPageFrame } from "@/features/transactions/ui/TransactionFlowPageFrame";

interface Fund {
  name: string;
  ticker: string;
  currentAllocation: number;
  targetAllocation: number;
  currentValue: number;
}

interface RebalanceData {
  funds?: Fund[];
}

interface RebalanceFlowContextType {
  rebalanceData: RebalanceData;
  updateRebalanceData: (data: Partial<RebalanceData>) => void;
}

const RebalanceFlowContext = createContext<RebalanceFlowContextType | undefined>(undefined);

export function useRebalanceFlow() {
  const context = useContext(RebalanceFlowContext);
  if (!context) {
    throw new Error("useRebalanceFlow must be used within RebalanceFlowLayout");
  }
  return context;
}

const steps = [
  { number: 1, label: "Current", path: "/transactions/rebalance" },
  { number: 2, label: "Target", path: "/transactions/rebalance/adjust" },
  { number: 3, label: "Trades", path: "/transactions/rebalance/trades" },
  { number: 4, label: "Review", path: "/transactions/rebalance/review" },
];

export function RebalanceFlowLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rebalanceData, setRebalanceData] = useState<RebalanceData>({});

  const updateRebalanceData = (data: Partial<RebalanceData>) => {
    setRebalanceData((prev) => ({ ...prev, ...data }));
  };

  const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  return (
    <RebalanceFlowContext.Provider value={{ rebalanceData, updateRebalanceData }}>
      <TransactionFlowPageFrame
        title="Rebalance Portfolio"
        currentStep={currentStep}
        totalSteps={steps.length}
        onExit={() => navigate("/transactions")}
        progress={<FlowProgress steps={steps} currentStep={currentStep} />}
      >
        <Outlet />
      </TransactionFlowPageFrame>
    </RebalanceFlowContext.Provider>
  );
}
