import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TransactionSuccessPanel } from "@/components/transactions/TransactionSuccessPanel";
import { TransactionCenterFigmaBody, type RecentListRow } from "@/components/transactions/center";
import { useVersionedTxNavigate } from "./lib/nav";
import { MOCK_PLAN_SUMMARY } from "./data/mockTransactionCenter";
import { listTransactions } from "@/services/transactionService";
import { getRoutingVersion, withVersion } from "@/core/version";
import type { Transaction } from "@/types/transactions";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function mapTxToRecentRow(tx: Transaction, translate: (k: string) => string): RecentListRow {
  const typeMap: Record<Transaction["type"], RecentListRow["type"]> = {
    loan: "Loan",
    withdrawal: "Withdrawal",
    distribution: "Withdrawal",
    transfer: "Transfer",
    rebalance: "Rebalance",
    rollover: "Rollover",
  };
  const status: RecentListRow["status"] =
    tx.status === "completed" || tx.status === "funded"
      ? "Completed"
      : tx.status === "rejected" || tx.status === "cancelled"
        ? "Cancelled"
        : "Processing";

  return {
    id: tx.id,
    type: typeMap[tx.type] ?? "Transfer",
    amount: tx.type === "rebalance" && !tx.amount ? "—" : formatMoney(tx.amount),
    status,
    date: tx.dateInitiated,
    description: tx.displayName ?? tx.type,
    transactionId: tx.id,
    statusDisplay: translate(
      status === "Completed"
        ? "transactions.center.statusCompleted"
        : status === "Cancelled"
          ? "transactions.center.statusCancelled"
          : "transactions.center.statusProcessing",
    ),
    typeDisplay: translate(
      {
        Loan: "transactions.center.typeLoan",
        Withdrawal: "transactions.center.typeWithdrawal",
        Transfer: "transactions.center.typeTransfer",
        Rebalance: "transactions.center.typeRebalance",
        Rollover: "transactions.center.typeRollover",
      }[typeMap[tx.type] ?? "Transfer"],
    ),
  };
}

/**
 * Transaction center — Figma “Implement Current Design (Copy)” layout + versioned flow routes.
 */
export function TransactionsPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const go = useVersionedTxNavigate();
  const navigate = useNavigate();
  const version = getRoutingVersion(location.pathname);
  const successState = (location.state as { success?: unknown } | null)?.success;
  const apiRecent = listTransactions().map((tx) => mapTxToRecentRow(tx, t));

  return (
    <DashboardLayout header={<DashboardHeader />}>
      {successState ? <TransactionSuccessPanel /> : null}
      <TransactionCenterFigmaBody
        planName={MOCK_PLAN_SUMMARY.planName}
        planBalanceLabel={formatMoney(MOCK_PLAN_SUMMARY.planBalance)}
        vestedBalanceLabel={formatMoney(MOCK_PLAN_SUMMARY.vestedBalance)}
        vestedPctLabel={t("transactions.center.vestedPct", { pct: MOCK_PLAN_SUMMARY.vestedPct })}
        onQuickLoan={() => go("loan/eligibility")}
        onQuickWithdraw={() => go("withdraw")}
        onQuickTransfer={() => go("transfer")}
        onQuickRebalance={() => go("rebalance")}
        onQuickRollover={() => go("rollover")}
        onResumeDraft={(relativePath) => go(relativePath)}
        onResolveAttention={() => go("loan/documents")}
        recentRows={apiRecent.length > 0 ? apiRecent : undefined}
        onRecentRowClick={(id) => navigate(withVersion(version, `/transactions/${id}`))}
      />
    </DashboardLayout>
  );
}

export default TransactionsPage;
