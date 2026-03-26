import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  DollarSign,
  HandCoins,
  ArrowLeftRight,
  RefreshCcw,
  Sparkles,
  FilePen,
  AlertTriangle,
  ChartBar,
} from "lucide-react";
import { motion } from "framer-motion";
import { TransactionCenterSectionHeader } from "./TransactionCenterSectionHeader";
import { TransactionCenterPlanOverview } from "./TransactionCenterPlanOverview";
import { QuickActionsAdvanced, type QuickActionAdvancedItem } from "./QuickActionsAdvanced";
import {
  TransactionCenterAttentionTimeline,
  type AttentionTimelineItem,
} from "./TransactionCenterAttentionTimeline";
import { TransactionCenterDraftList } from "./TransactionCenterDraftList";
import { TransactionCenterRecentList, type RecentListRow } from "./TransactionCenterRecentList";
import { TransactionCenterFinancialGuidance } from "./TransactionCenterFinancialGuidance";
import { TransactionCenterRetirementWidget } from "./TransactionCenterRetirementWidget";

export type TransactionCenterFigmaBodyProps = {
  planName: string;
  planBalanceLabel: string;
  vestedBalanceLabel: string;
  vestedPctLabel: string;
  onQuickLoan: () => void;
  onQuickWithdraw: () => void;
  onQuickTransfer: () => void;
  onQuickRebalance: () => void;
  onQuickRollover: () => void;
  onResumeDraft: (relativePath: string) => void;
  onResolveAttention?: () => void;
  recentRows?: RecentListRow[];
  onRecentRowClick?: (id: string) => void;
  attentionItems?: AttentionTimelineItem[];
  /** Show “Recommended” on loan card when user is eligible (default true for demo). */
  loanQuickActionRecommended?: boolean;
  /** Show “Most used” on withdraw card (default true for demo). */
  withdrawQuickActionMostUsed?: boolean;
};

/**
 * Figma dump “Transaction Center” main column — max-width 1100px per DS; sits inside app shell (DashboardLayout).
 */
export function TransactionCenterFigmaBody({
  planName,
  planBalanceLabel,
  vestedBalanceLabel,
  vestedPctLabel,
  onQuickLoan,
  onQuickWithdraw,
  onQuickTransfer,
  onQuickRebalance: _onQuickRebalance,
  onQuickRollover,
  onResumeDraft,
  onResolveAttention,
  recentRows,
  onRecentRowClick,
  attentionItems,
  loanQuickActionRecommended = true,
  withdrawQuickActionMostUsed = true,
}: TransactionCenterFigmaBodyProps) {
  const { t } = useTranslation();
  const TC = "transactions.center.";

  const quickActionItems = useMemo<QuickActionAdvancedItem[]>(
    () => [
      {
        id: "loan",
        icon: <HandCoins className="h-5 w-5" strokeWidth={2} aria-hidden />,
        title: t(`${TC}qaLoanTitle`),
        keyValue: t(`${TC}qaLoanKey`),
        supporting: t(`${TC}qaLoanSupporting`),
        onClick: onQuickLoan,
        badge: loanQuickActionRecommended ? "recommended" : undefined,
      },
      {
        id: "withdraw",
        icon: <DollarSign className="h-5 w-5" strokeWidth={2} aria-hidden />,
        title: t(`${TC}qaWithdrawTitle`),
        keyValue: t(`${TC}qaWithdrawKey`),
        supporting: t(`${TC}qaWithdrawSupporting`),
        onClick: onQuickWithdraw,
        badge: withdrawQuickActionMostUsed ? "most_used" : undefined,
      },
      {
        id: "transfer",
        icon: <ArrowLeftRight className="h-5 w-5" strokeWidth={2} aria-hidden />,
        title: t(`${TC}qaTransferTitle`),
        keyValue: t(`${TC}qaTransferKey`),
        supporting: t(`${TC}qaTransferSupporting`),
        onClick: onQuickTransfer,
      },
      {
        id: "rollover",
        icon: <RefreshCcw className="h-5 w-5" strokeWidth={2} aria-hidden />,
        title: t(`${TC}qaRolloverTitle`),
        keyValue: t(`${TC}qaRolloverKey`),
        supporting: t(`${TC}qaRolloverSupporting`),
        onClick: onQuickRollover,
      },
    ],
    [
      t,
      onQuickLoan,
      onQuickWithdraw,
      onQuickTransfer,
      onQuickRollover,
      loanQuickActionRecommended,
      withdrawQuickActionMostUsed,
    ],
  );

  const attention = useMemo(() => {
    if (attentionItems) return attentionItems;
    const base: AttentionTimelineItem[] = [
      {
        id: "1",
        title: t(`${TC}attn1Title`),
        description: t(`${TC}attn1Desc`),
        amount: "$5,000",
        actionLabel: t(`${TC}resolveIssue`),
        onAction: onResolveAttention,
      },
      {
        id: "2",
        title: t(`${TC}attn2Title`),
        description: t(`${TC}attn2Desc`),
        amount: "$1,200",
        actionLabel: t(`${TC}resolveIssue`),
        onAction: onResolveAttention,
      },
      {
        id: "3",
        title: t(`${TC}attn3Title`),
        description: t(`${TC}attn3Desc`),
        amount: "$18,500",
        actionLabel: t(`${TC}resolveIssue`),
        onAction: onResolveAttention,
      },
      {
        id: "4",
        title: t(`${TC}attn4Title`),
        description: t(`${TC}attn4Desc`),
        amount: "$4,000",
        actionLabel: t(`${TC}resolveIssue`),
        onAction: onResolveAttention,
      },
    ];
    return base;
  }, [attentionItems, onResolveAttention, t]);

  const attentionCount = attention.length;

  return (
    <div className="tx-center-figma-root">
      <div
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-6 pb-12"
        style={{ boxSizing: "border-box" }}
      >
        <TransactionCenterPlanOverview
          planName={planName}
          planBalanceLabel={planBalanceLabel}
          vestedBalanceLabel={vestedBalanceLabel}
          vestedPctLabel={vestedPctLabel}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mb-4 sm:mb-5"
        >
          <TransactionCenterSectionHeader
            icon={<Sparkles className="w-4 h-4" />}
            title={t(`${TC}quickActionsTitle`)}
            subtitle={t(`${TC}quickActionsSubtitle`)}
          />
          <QuickActionsAdvanced items={quickActionItems} />
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-5 mb-4 sm:mb-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
            className="w-full md:w-[60%]"
          >
            <TransactionCenterSectionHeader
              icon={<AlertTriangle className="w-4 h-4" />}
              title={t(`${TC}attentionTitle`)}
              badge={{
                text: t(`${TC}attentionBadge`, { count: attentionCount }),
                color: "bg-amber-500/15 text-amber-900 dark:bg-amber-950/50 dark:text-amber-100",
              }}
            />
            <TransactionCenterAttentionTimeline items={attention} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.24 }}
            className="w-full md:w-[40%]"
          >
            <TransactionCenterSectionHeader
              icon={<FilePen className="w-4 h-4" />}
              title={t(`${TC}draftsTitle`)}
              badge={{
                text: t(`${TC}draftsBadge`),
                color: "bg-[color-mix(in srgb, var(--color-primary) 14%, var(--background))] text-[var(--color-primary)]",
              }}
              subtitle={t(`${TC}draftsSubtitle`)}
            />
            <div
              style={{
                background: "var(--card-bg)",
                borderRadius: 12,
                border: "1px solid var(--border)",
                padding: "16px",
              }}
            >
              <TransactionCenterDraftList onResume={onResumeDraft} />
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-5 mb-4 sm:mb-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.32 }}
            className="w-full md:w-[60%]"
          >
            <TransactionCenterSectionHeader
              icon={<ChartBar className="w-4 h-4" />}
              title={t(`${TC}recentTitle`)}
              subtitle={t(`${TC}recentSubtitle`)}
            />
            <div
              style={{
                background: "var(--card-bg)",
                borderRadius: 12,
                border: "1px solid var(--border)",
                padding: "16px",
              }}
            >
              <TransactionCenterRecentList rows={recentRows} maxItems={4} onRowClick={onRecentRowClick} />
            </div>
          </motion.div>

          <div className="w-full md:w-[40%]">
            <TransactionCenterSectionHeader
              icon={<ChartBar className="w-4 h-4" />}
              title={t(`${TC}outlookTitle`)}
              subtitle={t(`${TC}outlookSubtitle`)}
            />
            <TransactionCenterRetirementWidget delay={0.36} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="mb-4 sm:mb-6"
        >
          <TransactionCenterSectionHeader
            icon={<Sparkles className="w-4 h-4" />}
            title={t(`${TC}guidanceTitle`)}
            subtitle={t(`${TC}guidanceSubtitle`)}
            variant="ai"
            badge={{
              text: t(`${TC}guidanceAiBadge`),
              color: "bg-violet-500/15 text-violet-700 dark:bg-violet-950/50 dark:text-violet-200",
            }}
          />
          <TransactionCenterFinancialGuidance />
        </motion.div>
      </div>
    </div>
  );
}
