import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChevronDown, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  status: "Action Required" | "Processing" | "Completed";
  submittedDate: string;
  currentStep: "Submitted" | "Processing" | "Approved" | "Funds Sent";
  details?: {
    description: string;
    nextSteps?: string;
    estimatedCompletion?: string;
  };
}

const statusSteps = ["Submitted", "Processing", "Approved", "Funds Sent"];

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "Loan Request",
    amount: "$5,000",
    status: "Action Required",
    submittedDate: "March 6, 2026",
    currentStep: "Submitted",
    details: {
      description: "Additional documentation required",
      nextSteps: "Please upload proof of employment and recent pay stubs",
      estimatedCompletion: "2-3 days after documents received",
    },
  },
  {
    id: "2",
    type: "Hardship Withdrawal",
    amount: "$3,200",
    status: "Processing",
    submittedDate: "March 8, 2026",
    currentStep: "Processing",
    details: {
      description: "Your withdrawal request is being reviewed by the plan administrator",
      estimatedCompletion: "March 12, 2026",
    },
  },
  {
    id: "3",
    type: "Investment Rebalance",
    amount: "—",
    status: "Processing",
    submittedDate: "March 9, 2026",
    currentStep: "Approved",
    details: {
      description: "Rebalancing your portfolio according to your target allocation",
      estimatedCompletion: "Completes next trading day",
    },
  },
  {
    id: "4",
    type: "Fund Transfer",
    amount: "$1,500",
    status: "Completed",
    submittedDate: "March 5, 2026",
    currentStep: "Funds Sent",
    details: {
      description: "Transfer completed successfully",
      estimatedCompletion: "Completed on March 6, 2026",
    },
  },
];

export function ActiveTransactionsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sort transactions by priority
  const sortedTransactions = [...mockTransactions].sort((a, b) => {
    const priority = {
      "Action Required": 1,
      "Processing": 2,
      "Completed": 3,
    };
    return priority[a.status] - priority[b.status];
  });

  const getStatusBadgeClass = (status: Transaction["status"]) => {
    switch (status) {
      case "Action Required":
        return "bg-[color-mix(in_srgb,var(--color-danger)_12%,var(--surface-card))] text-[color-mix(in_srgb,var(--color-danger)_55%,var(--text-primary))] hover:bg-[color-mix(in_srgb,var(--color-danger)_12%,var(--surface-card))] border-[color-mix(in_srgb,var(--color-danger)_28%,var(--border-default))]";
      case "Processing":
        return "bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))] text-[color-mix(in_srgb,var(--color-primary)_50%,var(--text-primary))] hover:bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))] border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))]";
      case "Completed":
        return "bg-[color-mix(in_srgb,var(--color-success)_14%,var(--surface-card))] text-[color-mix(in_srgb,var(--color-success)_50%,var(--text-primary))] hover:bg-[color-mix(in_srgb,var(--color-success)_14%,var(--surface-card))] border-[color-mix(in_srgb,var(--color-success)_28%,var(--border-default))]";
    }
  };

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "Action Required":
        return <AlertCircle className="w-4 h-4" />;
      case "Processing":
        return <Clock className="w-4 h-4" />;
      case "Completed":
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStepProgress = (currentStep: Transaction["currentStep"]) => {
    return statusSteps.indexOf(currentStep);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-primary">Active Transactions</h2>
          <p className="text-sm text-secondary mt-1">
            {sortedTransactions.length} {sortedTransactions.length === 1 ? "transaction" : "transactions"} in progress
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {sortedTransactions.map((transaction) => {
          const isExpanded = expandedId === transaction.id;
          const currentStepIndex = getStepProgress(transaction.currentStep);
          const progressPercentage = ((currentStepIndex + 1) / statusSteps.length) * 100;

          return (
            <div
              key={transaction.id}
              className="border border-default rounded-lg overflow-hidden hover:border-default transition-colors"
            >
              {/* Transaction Row */}
              <button
                onClick={() => toggleExpand(transaction.id)}
                className="w-full px-4 py-3 flex items-center gap-4 hover:bg-primary/5 transition-colors"
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {getStatusIcon(transaction.status)}
                </div>

                {/* Transaction Info */}
                <div className="flex-1 grid grid-cols-4 gap-4 items-center text-left">
                  <div>
                    <p className="font-medium text-primary">{transaction.type}</p>
                    <p className="text-xs text-secondary mt-0.5">{transaction.submittedDate}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-primary">{transaction.amount}</p>
                  </div>

                  <div>
                    <Badge className={getStatusBadgeClass(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-secondary min-w-[60px]">
                      {transaction.currentStep}
                    </span>
                  </div>
                </div>

                {/* Expand Icon */}
                <ChevronDown
                  className={`w-5 h-5 text-secondary transition-transform flex-shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 py-4 border-t border-default bg-surface-card">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-primary mb-3">
                      Progress Details
                    </h4>
                    
                    {/* Detailed Progress Stepper */}
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        {statusSteps.map((step, index) => {
                          const isComplete = index <= currentStepIndex;
                          const isCurrent = index === currentStepIndex;
                          
                          return (
                            <div key={step} className="flex flex-col items-center flex-1">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                  isComplete
                                    ? "bg-[var(--color-primary)] text-primary-foreground"
                                    : "bg-border text-secondary"
                                } ${isCurrent ? "ring-4 ring-[color-mix(in_srgb,var(--color-primary)_18%,var(--surface-card))]" : ""}`}
                              >
                                {isComplete ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <span className="text-xs font-medium">{index + 1}</span>
                                )}
                              </div>
                              <p
                                className={`text-xs text-center ${
                                  isComplete ? "text-primary font-medium" : "text-secondary"
                                }`}
                              >
                                {step}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Connecting Lines */}
                      <div className="absolute top-4 left-0 right-0 h-0.5 bg-border -z-10">
                        <div
                          className="h-full bg-[var(--color-primary)] transition-all"
                          style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  {transaction.details && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-primary">
                            {transaction.details.description}
                          </p>
                          {transaction.details.nextSteps && (
                            <p className="text-sm text-[var(--color-primary)] font-medium mt-1">
                              {transaction.details.nextSteps}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {transaction.details.estimatedCompletion && (
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-secondary">
                            <span className="font-medium">Estimated completion:</span>{" "}
                            {transaction.details.estimatedCompletion}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sortedTransactions.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-3" />
          <p className="text-secondary">No active transactions</p>
          <p className="text-sm text-secondary mt-1">
            Your completed transactions appear in Recent Transactions below
          </p>
        </div>
      )}
    </Card>
  );
}
