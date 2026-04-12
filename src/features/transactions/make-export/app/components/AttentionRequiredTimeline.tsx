import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface AttentionItem {
  id: string;
  title: string;
  description: string;
  amount?: string;
  currentStep: "Submitted" | "Processing" | "Approved" | "Funds Sent";
  actionLabel?: string;
  onAction?: () => void;
}

const statusSteps = ["Submitted", "Processing", "Approved", "Funds Sent"];

function InlineTimeline({
  currentStep,
}: {
  currentStep: string;
}) {
  const currentIndex = statusSteps.indexOf(currentStep);

  return (
    <div className="flex min-w-[200px] w-full items-center gap-0">
      {statusSteps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={step}
            className="flex min-w-0 flex-1 items-center justify-center text-[9px] font-semibold text-secondary"
          >
            <span
              className={
                isCompleted || isCurrent ? "text-brand" : "text-secondary/70"
              }
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface AttentionRequiredTimelineProps {
  onResolve?: () => void;
}

export function AttentionRequiredTimeline({
  onResolve,
}: AttentionRequiredTimelineProps) {
  const [items] = useState<AttentionItem[]>([
    {
      id: "1",
      title: "Loan Request - Action Required",
      description:
        "Upload required documents to continue processing your loan request.",
      amount: "$5,000",
      currentStep: "Processing",
      actionLabel: "Resolve Issue",
      onAction: onResolve,
    },
    {
      id: "2",
      title: "Loan Request - Action Required",
      description:
        "Upload required documents to continue processing your loan request.",
      amount: "$5,000",
      currentStep: "Processing",
      actionLabel: "Resolve Issue",
      onAction: onResolve,
    },
  ]);

  if (items.length === 0) {
    return (
      <div className="card-standard px-7 py-6">
        <div className="py-4 text-center">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-border" />
          <p className="text-[13px] font-medium text-secondary">No action required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-standard px-[18px] py-3.5">
      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className="rounded-xl border border-warning/35 bg-gradient-to-br from-warning/10 to-warning/5 px-4 py-2.5"
          >
            <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md bg-warning/15 text-warning">
                  <AlertCircle className="h-[13px] w-[13px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-warning" />
                    <p className="text-[12.5px] font-bold leading-tight tracking-[-0.3px] text-primary">
                      {item.title}
                    </p>
                    {item.amount ? (
                      <span className="text-[11px] font-medium text-secondary">
                        Amount: {item.amount}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0 truncate text-[11px] font-medium leading-tight text-primary/80">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="lg:w-[260px] lg:shrink-0">
                <InlineTimeline currentStep={item.currentStep} />
              </div>
            </div>

            {item.onAction && item.actionLabel ? (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={item.onAction}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  {item.actionLabel}
                </button>
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
