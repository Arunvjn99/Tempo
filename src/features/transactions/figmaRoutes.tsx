import type { RouteObject } from "react-router-dom";
import { TransactionsFull } from "./pages/TransactionsFull";
import { LoanFlowLayout } from "./make-export/app/flows/loan/LoanFlowLayout";
import { LoanEligibility } from "./make-export/app/flows/loan/LoanEligibility";
import { LoanSimulator } from "./make-export/app/flows/loan/LoanSimulator";
import { LoanConfiguration } from "./make-export/app/flows/loan/LoanConfiguration";
import { LoanFees } from "./make-export/app/flows/loan/LoanFees";
import { LoanDocuments } from "./make-export/app/flows/loan/LoanDocuments";
import { LoanReview } from "./make-export/app/flows/loan/LoanReview";
import { WithdrawalFlowLayout } from "./make-export/app/flows/withdrawal/WithdrawalFlowLayout";
import { WithdrawalEligibility } from "./make-export/app/flows/withdrawal/WithdrawalEligibility";
import { WithdrawalType } from "./make-export/app/flows/withdrawal/WithdrawalType";
import { WithdrawalSource } from "./make-export/app/flows/withdrawal/WithdrawalSource";
import { WithdrawalFees } from "./make-export/app/flows/withdrawal/WithdrawalFees";
import { WithdrawalPayment } from "./make-export/app/flows/withdrawal/WithdrawalPayment";
import { WithdrawalReview } from "./make-export/app/flows/withdrawal/WithdrawalReview";
import { TransferFlowLayout } from "./make-export/app/flows/transfer/TransferFlowLayout";
import { TransferType } from "./make-export/app/flows/transfer/TransferType";
import { TransferSourceFunds } from "./make-export/app/flows/transfer/TransferSourceFunds";
import { TransferDestination } from "./make-export/app/flows/transfer/TransferDestination";
import { TransferAmount } from "./make-export/app/flows/transfer/TransferAmount";
import { TransferImpact } from "./make-export/app/flows/transfer/TransferImpact";
import { TransferReview } from "./make-export/app/flows/transfer/TransferReview";
import { RebalanceFlowLayout } from "./make-export/app/flows/rebalance/RebalanceFlowLayout";
import { RebalanceCurrentAllocation } from "./make-export/app/flows/rebalance/RebalanceCurrentAllocation";
import { RebalanceAdjustAllocation } from "./make-export/app/flows/rebalance/RebalanceAdjustAllocation";
import { RebalanceTradePreview } from "./make-export/app/flows/rebalance/RebalanceTradePreview";
import { RebalanceReview } from "./make-export/app/flows/rebalance/RebalanceReview";
import { RolloverFlowLayout } from "./make-export/app/flows/rollover/RolloverFlowLayout";
import { RolloverPlanDetails } from "./make-export/app/flows/rollover/RolloverPlanDetails";
import { RolloverValidation } from "./make-export/app/flows/rollover/RolloverValidation";
import { RolloverAllocation } from "./make-export/app/flows/rollover/RolloverAllocation";
import { RolloverDocuments } from "./make-export/app/flows/rollover/RolloverDocuments";
import { RolloverReview } from "./make-export/app/flows/rollover/RolloverReview";

/**
 * Figma Make transaction hub + all flows, nested under `/transactions`.
 * Mirrors export `make-export/app/routes.tsx` with `/transactions` prefix.
 */
export const transactionsFigmaRouteChildren: RouteObject[] = [
  { index: true, element: <TransactionsFull /> },
  {
    path: "loan",
    element: <LoanFlowLayout />,
    children: [
      { index: true, element: <LoanEligibility /> },
      { path: "simulator", element: <LoanSimulator /> },
      { path: "configuration", element: <LoanConfiguration /> },
      { path: "fees", element: <LoanFees /> },
      { path: "documents", element: <LoanDocuments /> },
      { path: "review", element: <LoanReview /> },
    ],
  },
  {
    path: "withdrawal",
    element: <WithdrawalFlowLayout />,
    children: [
      { index: true, element: <WithdrawalEligibility /> },
      { path: "type", element: <WithdrawalType /> },
      { path: "source", element: <WithdrawalSource /> },
      { path: "fees", element: <WithdrawalFees /> },
      { path: "payment", element: <WithdrawalPayment /> },
      { path: "review", element: <WithdrawalReview /> },
    ],
  },
  {
    path: "transfer",
    element: <TransferFlowLayout />,
    children: [
      { index: true, element: <TransferType /> },
      { path: "source", element: <TransferSourceFunds /> },
      { path: "destination", element: <TransferDestination /> },
      { path: "amount", element: <TransferAmount /> },
      { path: "impact", element: <TransferImpact /> },
      { path: "review", element: <TransferReview /> },
    ],
  },
  {
    path: "rebalance",
    element: <RebalanceFlowLayout />,
    children: [
      { index: true, element: <RebalanceCurrentAllocation /> },
      { path: "adjust", element: <RebalanceAdjustAllocation /> },
      { path: "trades", element: <RebalanceTradePreview /> },
      { path: "review", element: <RebalanceReview /> },
    ],
  },
  {
    path: "rollover",
    element: <RolloverFlowLayout />,
    children: [
      { index: true, element: <RolloverPlanDetails /> },
      { path: "validation", element: <RolloverValidation /> },
      { path: "allocation", element: <RolloverAllocation /> },
      { path: "documents", element: <RolloverDocuments /> },
      { path: "review", element: <RolloverReview /> },
    ],
  },
];
