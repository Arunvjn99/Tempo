import { Badge } from "./ui/badge";
import {
  CheckCircle2,
  Circle,
  Clock,
  HandCoins,
  RefreshCcw,
  DollarSign,
} from "lucide-react";
import { motion } from "motion/react";

interface Transaction {
  id: string;
  type: string;
  typeIcon: "withdrawal" | "rebalance" | "loan";
  amount: string;
  submittedDate: string;
  status: "Processing" | "Completed";
  currentStep: "Submitted" | "Processing" | "Approved" | "Funds Sent";
  estimatedCompletion?: string;
}

interface ActiveTransactionsCompactProps {
  excludeId?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "2",
    type: "Hardship Withdrawal",
    typeIcon: "withdrawal",
    amount: "$3,200",
    status: "Processing",
    submittedDate: "March 8, 2026",
    currentStep: "Processing",
    estimatedCompletion: "March 12, 2026",
  },
  {
    id: "3",
    type: "Investment Rebalance",
    typeIcon: "rebalance",
    amount: "—",
    status: "Processing",
    submittedDate: "March 9, 2026",
    currentStep: "Approved",
    estimatedCompletion: "Next trading day",
  },
];

const statusSteps = ["Submitted", "Processing", "Approved", "Funds Sent"];

const typeIconMap = {
  withdrawal: <DollarSign className="w-4 h-4" />,
  rebalance: <RefreshCcw className="w-4 h-4" />,
  loan: <HandCoins className="w-4 h-4" />,
};

const typeColorMap = {
  withdrawal: "from-[color-mix(in_srgb,var(--color-danger)_8%,var(--surface-card))] to-[color-mix(in_srgb,var(--color-danger)_14%,var(--surface-card))]/60 text-[var(--color-danger)]",
  rebalance: "from-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))] to-[color-mix(in_srgb,var(--color-success)_14%,var(--surface-card))]/60 text-[var(--color-success)]",
  loan: "from-[color-mix(in_srgb,var(--color-accent)_10%,var(--surface-card))] to-[color-mix(in_srgb,var(--color-accent)_14%,var(--surface-card))]/60 text-[var(--color-accent)]",
};

export function ActiveTransactionsCompact({
  excludeId,
}: ActiveTransactionsCompactProps) {
  const filteredTransactions = excludeId
    ? mockTransactions.filter((t) => t.id !== excludeId)
    : mockTransactions;

  const getStatusBadgeClass = (status: Transaction["status"]) => {
    switch (status) {
      case "Processing":
        return "bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))]/50";
      case "Completed":
        return "bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))] text-[var(--color-success)] hover:bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))] border-[color-mix(in_srgb,var(--color-success)_28%,var(--border-default))]/50";
    }
  };

  const getStepStatus = (
    stepIndex: number,
    currentStep: Transaction["currentStep"]
  ) => {
    const currentIndex = statusSteps.indexOf(currentStep);
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {filteredTransactions.map((transaction, idx) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
          className="p-4 sm:p-5 border border-default rounded-2xl hover:border-default/80 transition-all duration-300 bg-gradient-to-br from-[var(--surface-card)] to-[color-mix(in_srgb,var(--surface-soft)_70%,transparent)] group"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Transaction Header */}
          <div className="flex items-start justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className={`p-1.5 sm:p-2 rounded-xl bg-gradient-to-br ${typeColorMap[transaction.typeIcon]} flex-shrink-0`}
              >
                {typeIconMap[transaction.typeIcon]}
              </div>
              <div>
                <h3 className="font-semibold text-primary text-[13px] sm:text-sm">
                  {transaction.type}
                </h3>
                <div className="flex items-center gap-2 sm:gap-2.5 mt-0.5 sm:mt-1">
                  <span className="text-[11px] sm:text-xs text-secondary">
                    {transaction.amount}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-[10px] sm:text-xs text-secondary">
                    {transaction.submittedDate}
                  </span>
                </div>
              </div>
            </div>
            <Badge
              className={`${getStatusBadgeClass(transaction.status)} text-[10px] sm:text-[11px] rounded-full px-2 sm:px-3 py-0.5`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mr-1 sm:mr-1.5 animate-pulse" />
              {transaction.status}
            </Badge>
          </div>

          {/* Visual Timeline - Mobile: compact progress bar */}
          <div className="sm:hidden mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium text-primary">
                {transaction.currentStep}
              </span>
              <span className="text-[10px] text-secondary">
                {statusSteps.indexOf(transaction.currentStep) + 1}/
                {statusSteps.length}
              </span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                initial={{ width: 0 }}
                animate={{
                  width: `${((statusSteps.indexOf(transaction.currentStep) + 1) / statusSteps.length) * 100}%`,
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
            {/* Step labels */}
            <div className="flex justify-between mt-1.5">
              {statusSteps.map((step, index) => {
                const stepStatus = getStepStatus(
                  index,
                  transaction.currentStep
                );
                return (
                  <span
                    key={step}
                    className={`text-[8px] ${
                      stepStatus === "completed" || stepStatus === "current"
                        ? "text-primary font-medium"
                        : "text-secondary"
                    }`}
                  >
                    {step}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Visual Timeline - Desktop: full circles */}
          <div className="hidden sm:block relative mb-2 px-2">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const stepStatus = getStepStatus(
                  index,
                  transaction.currentStep
                );

                return (
                  <div
                    key={step}
                    className="flex flex-col items-center flex-1 relative"
                  >
                    {/* Step Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 z-10 transition-all duration-500 ${
                        stepStatus === "completed"
                          ? "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)] text-primary-foreground"
                          : stepStatus === "current"
                            ? "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-primary-foreground ring-[3px] ring-[color-mix(in_srgb,var(--color-primary)_18%,var(--surface-card))]"
                            : "bg-surface-card text-secondary border-2 border-default"
                      }`}
                      style={
                        stepStatus === "current"
                          ? {
                              boxShadow:
                                "0 0 0 4px color-mix(in srgb, var(--color-primary) 8%, transparent), 0 0 16px color-mix(in srgb, var(--color-primary) 20%, transparent)",
                            }
                          : stepStatus === "completed"
                            ? {
                                boxShadow:
                                  "0 2px 6px color-mix(in srgb, var(--color-primary) 15%, transparent)",
                              }
                            : undefined
                      }
                    >
                      {stepStatus === "completed" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : stepStatus === "current" ? (
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Circle className="w-3 h-3 fill-current" />
                        </motion.div>
                      ) : (
                        <Circle className="w-3 h-3" />
                      )}
                    </div>

                    {/* Step Label */}
                    <p
                      className={`text-[10px] text-center ${
                        stepStatus === "completed" || stepStatus === "current"
                          ? "text-primary font-medium"
                          : "text-secondary"
                      }`}
                    >
                      {step}
                    </p>

                    {/* Connecting Line */}
                    {index < statusSteps.length - 1 && (
                      <div
                        className="absolute top-4 left-1/2 w-full h-[2px] -z-10 rounded-full"
                        style={{
                          width: "calc(100% - 32px)",
                          marginLeft: "16px",
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            background:
                              stepStatus === "completed"
                                ? "linear-gradient(to right, var(--color-primary), var(--color-accent))"
                                : "var(--color-border)",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estimated Completion */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-secondary mt-3 sm:mt-4 pt-3 sm:pt-3.5 border-t border-default/80">
            <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span>
              Estimated completion: {transaction.estimatedCompletion}
            </span>
          </div>
        </motion.div>
      ))}

      {filteredTransactions.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle2 className="w-10 h-10 text-secondary mx-auto mb-2" />
          <p className="text-sm text-secondary">No active transactions</p>
        </div>
      )}
    </div>
  );
}
