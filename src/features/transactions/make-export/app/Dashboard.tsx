import {
  DollarSign,
  HandCoins,
  ArrowLeftRight,
  PieChart,
  RefreshCcw,
  Shield,
  AlertTriangle,
  ChartBar,
  Sparkles,
  FilePen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AttentionRequiredTimeline } from "./components/AttentionRequiredTimeline";
import { QuickActionButton } from "./components/QuickActionButton";
import { FinancialGuidanceCompact } from "./components/FinancialGuidanceCompact";
import { TransactionList } from "@/features/transactions/ui/TransactionList";
import { DraftTransactions } from "./components/DraftTransactions";
import { RetirementImpactWidget } from "./components/RetirementImpactWidget";
import svgPaths from "../imports/svg-tkw4rjnq7w";
import { motion } from "motion/react";
import { SummaryHeader } from "@/features/transactions/ui/SummaryHeader";
import { TransactionsHeader } from "@/features/transactions/ui/TransactionsHeader";

/* Inline SVG icons matching the Figma import */
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 15 18.34">
      <path
        d={svgPaths.p30439e00}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
      />
    </svg>
  );
}

function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 20 20">
      <path
        d={svgPaths.p284f7580}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
      />
      <path
        d="M7.833 14.167H15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
      />
      <path
        d="M7.833 10.833H18.333"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
      />
      <path
        d="M7.833 7.5H10.833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
      />
    </svg>
  );
}

export function Dashboard() {
  const navigate = useNavigate();

  const handleResolveIssue = () => {
    navigate("/transactions/loan");
  };

  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container-app max-w-app pb-[100px] pt-6 sm:pt-8">
        <TransactionsHeader />

        {/* ROW 1 - PLAN OVERVIEW */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-5 sm:mb-6"
        >
          <div className="overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.09] to-primary/[0.04] px-7 py-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-0">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-surface-card">
                  <ShieldIcon className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <p className="text-[10.5px] font-bold uppercase leading-[14px] tracking-[0.5px] text-secondary">
                    Plan Name
                  </p>
                  <p className="mt-0.5 text-[15px] font-extrabold leading-[22px] tracking-[-0.3px] text-primary">
                    401(k) Retirement Plan
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.5px] text-secondary">
                      Plan Balance :
                    </span>
                    <span className="text-sm font-extrabold tracking-[-0.3px] text-brand">$30,000</span>
                  </div>
                </div>
              </div>

              <div className="mx-10 hidden h-14 w-px shrink-0 bg-primary/35 sm:block lg:mx-14" />
              <div className="h-px w-full bg-primary/35 sm:hidden" />

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-surface-card">
                  <ChartBarIcon className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <p className="text-[10.5px] font-bold uppercase leading-[14px] tracking-[0.5px] text-secondary">
                    Vested Balance
                  </p>
                  <div className="mt-0.5 flex items-baseline gap-2.5">
                    <span className="text-[28px] font-extrabold leading-9 tracking-[-0.5px] text-primary">
                      $25,000
                    </span>
                    <span className="text-xs font-semibold text-secondary">83.3% vested</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ROW 2 - QUICK ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mb-5 sm:mb-6"
        >
          <SummaryHeader
            icon={<Sparkles className="h-4 w-4" />}
            title="Quick Actions"
            subtitle="Start a new transaction"
          />
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 lg:grid-cols-5">
            <QuickActionButton
              icon={<HandCoins className="h-4 w-4" />}
              title="Take a Loan"
              contextInfo="Borrow up to $10,000"
              additionalInfo="Typical approval: 1-3 days"
              onClick={() => navigate("/transactions/loan")}
            />
            <QuickActionButton
              icon={<DollarSign className="h-4 w-4" />}
              title="Withdraw Money"
              contextInfo="Available: $5,000"
              additionalInfo="Tax impact: 10-20%"
              onClick={() => navigate("/transactions/withdrawal")}
            />
            <QuickActionButton
              icon={<ArrowLeftRight className="h-4 w-4" />}
              title="Transfer Funds"
              contextInfo="Reallocate balance"
              additionalInfo="No fees or penalties"
              onClick={() => navigate("/transactions/transfer")}
            />
            <QuickActionButton
              icon={<PieChart className="h-4 w-4" />}
              title="Rebalance"
              contextInfo="Current: Moderate risk"
              additionalInfo="Last: 6 months ago"
              onClick={() => navigate("/transactions/rebalance")}
            />
            <QuickActionButton
              icon={<RefreshCcw className="h-4 w-4" />}
              title="Roll Over"
              contextInfo="Consolidate savings"
              additionalInfo="No tax penalty"
              onClick={() => navigate("/transactions/rollover")}
            />
          </div>
        </motion.div>

        {/* ROW 3 - ATTENTION + DRAFTS */}
        <div className="mb-5 flex flex-col gap-5 sm:mb-6 sm:gap-6 md:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
            className="w-full md:w-[60%]"
          >
            <SummaryHeader
              icon={<AlertTriangle className="h-4 w-4" />}
              title="Attention Required"
              badge={{
                text: "4 items",
                color: "bg-warning/15 text-warning",
              }}
            />
            <AttentionRequiredTimeline onResolve={handleResolveIssue} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.24 }}
            className="w-full md:w-[40%]"
          >
            <SummaryHeader
              icon={<FilePen className="h-4 w-4" />}
              title="Draft Transactions"
              badge={{
                text: "2 drafts",
                color: "bg-primary/10 text-brand",
              }}
              subtitle="Resume where you left off"
            />
            <div className="card-standard px-6 py-5">
              <DraftTransactions />
            </div>
          </motion.div>
        </div>

        {/* ROW 5 - RECENT + RETIREMENT */}
        <div className="mb-5 flex flex-col gap-5 sm:mb-6 sm:gap-6 md:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.32 }}
            className="w-full md:w-[60%]"
          >
            <SummaryHeader
              icon={<ChartBar className="h-4 w-4" />}
              title="Recent Transactions"
              subtitle="Last 90 days"
            />
            <div className="card-standard px-7 py-6">
              <TransactionList maxItems={4} />
            </div>
          </motion.div>

          <div className="w-full md:w-[40%]">
            <SummaryHeader
              icon={<ChartBar className="h-4 w-4" />}
              title="Retirement Outlook"
              subtitle="Projected growth"
            />
            <RetirementImpactWidget delay={0.36} />
          </div>
        </div>

        {/* ROW 6 - FINANCIAL GUIDANCE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <SummaryHeader
            icon={<Sparkles className="h-4 w-4" />}
            title="Financial Guidance"
            subtitle="Personalized insights"
            variant="ai"
            badge={{
              text: "AI Insights",
              color: "bg-[color-mix(in_srgb,var(--color-accent)_12%,transparent)] text-[var(--color-accent)] dark:text-[color-mix(in_srgb,var(--color-accent)_75%,var(--surface-card))]",
            }}
          />
          <FinancialGuidanceCompact />
        </motion.div>
      </div>
    </div>
  );
}
