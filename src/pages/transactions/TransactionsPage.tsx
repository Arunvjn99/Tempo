import { memo, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { TransactionSuccessScreen } from "../../components/transactions/TransactionSuccessScreen";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { ProgressBar } from "../../components/dashboard/shared/ProgressBar";
import { StatusBadge } from "../../components/dashboard/shared/StatusBadge";
import { listActiveTrackerTransactions } from "../../services/transactionService";
import { getProgressFromStatus, normalizeLifecycleStatus } from "../../types/transactionLifecycle";
import type { Transaction } from "../../types/transactions";

const formatCurrency = (locale: string) => (n: number) =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const formatDate = (locale: string) => (d: string) =>
  new Date(d).toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" });

/** Mock active tracker items (Figma: 401(k) General Purpose Loan + Account Rebalance Request) */
const TRACKER_ITEM_1 = { id: "TXN-49201-B", status: "verifying" as const, progress: 65, eta: "24h", amount: 25000 };
const TRACKER_ITEM_2 = { id: "TXN-2026-0843", status: "queued" as const, progress: 10, eta: "72h", targetLabel: "Moderately Aggressive", targetRightKey: "transactionHub.figma.fullPortfolio" };

function getTrackerTypeLabelKey(type: Transaction["type"]): string {
  switch (type) {
    case "loan": return "transactionHub.figma.trackerLoanLabel";
    case "rebalance": return "transactionHub.figma.trackerRebalanceLabel";
    default: return "transactionHub.figma.trackerLoanLabel";
  }
}

function getStatusLabelKey(status: string): string {
  const s = normalizeLifecycleStatus(status);
  const keyMap: Record<string, string> = {
    draft: "transactionHub.figma.statusDraft",
    submitted: "transactionHub.figma.statusSubmitted",
    under_review: "transactionHub.figma.statusUnderReview",
    verifying_documents: "transactionHub.figma.statusVerifying",
    approved: "transactionHub.figma.statusApproved",
  };
  return keyMap[s] ?? "transactionHub.figma.queued";
}

/** Mock history rows — nameKey/accountKey for i18n */
const HISTORY_ROWS: { type: "deposit" | "rebalance" | "loan"; nameKey: string; accountKey: string; date: string; amount: number | null }[] = [
  { type: "deposit", nameKey: "transactionHub.figma.historyDirectDeposit", accountKey: "transactionHub.figma.accountTraditional401k", date: "2026-09-28", amount: 1250 },
  { type: "rebalance", nameKey: "transactionHub.figma.historyAutomaticRebalance", accountKey: "transactionHub.figma.accountRoth401k", date: "2026-09-25", amount: null },
  { type: "loan", nameKey: "transactionHub.figma.historyLoanPayment", accountKey: "transactionHub.figma.accountLoanAccount", date: "2026-09-15", amount: -415.5 },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.25, ease: "easeOut" },
  }),
};

const contentVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

/**
 * Transactions screen — Figma layout: Liquidity Snapshot, Quick Actions, Active Tracker, Insights, Loan Center, Smart History.
 * Uses design tokens and shared components only; i18n for all copy.
 */
export const TransactionsPage = memo(function TransactionsPage() {
  const { t, i18n } = useTranslation("translation");
  const navigate = useNavigate();
  const reduced = !!useReducedMotion();
  const location = useLocation();
  const successState = (location.state as { success?: { type: string; amount?: number } } | null)?.success;
  const locale = i18n.language || "en";
  const fmtCurrency = formatCurrency(locale);
  const fmtDate = formatDate(locale);
  const activeTrackerList = useMemo(() => listActiveTrackerTransactions(), []);
  const useLiveTracker = activeTrackerList.length > 0;

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reduced ? 0 : 0.3 } },
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      {successState && (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <TransactionSuccessScreen />
        </div>
      )}
      {!successState && (
        <motion.div
          className="transactions-figma"
          initial="hidden"
          animate="visible"
          variants={pageVariants}
        >
          {/* Liquidity Snapshot — 4 cards */}
          <motion.section className="transactions-figma__snapshot" variants={sectionVariants} custom={reduced}>
            <div className="transactions-figma__snapshot-card">
              <div className="transactions-figma__snapshot-label">{t("transactionHub.figma.totalBalance")}</div>
              <div className="transactions-figma__snapshot-value">{fmtCurrency(1428500)}</div>
              <div className="transactions-figma__snapshot-meta" style={{ color: "var(--color-success)" }}>+2.4% {t("transactionHub.figma.vsLastMonth")}</div>
            </div>
            <div className="transactions-figma__snapshot-card">
              <div className="transactions-figma__snapshot-label">{t("transactionHub.figma.availableLoanLimit")}</div>
              <div className="transactions-figma__snapshot-value">{fmtCurrency(50000)}</div>
              <div className="mt-2">
                <ProgressBar value={76} height={6} barColor="var(--color-primary)" />
              </div>
            </div>
            <div className="transactions-figma__snapshot-card">
              <div className="transactions-figma__snapshot-label">{t("transactionHub.figma.outstandingLoan")}</div>
              <div className="transactions-figma__snapshot-value">{fmtCurrency(12400)}</div>
              <div className="transactions-figma__snapshot-meta">{t("transactionHub.figma.nextPaymentDue", { date: "Oct 15, 2026" })}</div>
            </div>
            <div className="transactions-figma__snapshot-card transactions-figma__snapshot-card--accent">
              <div className="transactions-figma__snapshot-label">{t("transactionHub.figma.eligibilityStatus")}</div>
              <div className="transactions-figma__snapshot-value">{t("transactionHub.figma.loanEligible")}</div>
              <div className="transactions-figma__snapshot-meta" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("transactionHub.figma.catchUpActive")}</div>
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section variants={sectionVariants} custom={reduced}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("transactionHub.figma.quickActionsTitle")}</h2>
            <div className="transactions-figma__quick-actions">
              <button type="button" className="transactions-figma__quick-action" onClick={() => navigate("/transactions/loan/start")}>
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{t("transactionHub.figma.startLoan")}</span>
              </button>
              <button type="button" className="transactions-figma__quick-action" onClick={() => navigate("/transactions/transfer/start")}>
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg>
                <span>{t("transactionHub.figma.transferFunds")}</span>
              </button>
              <button type="button" className="transactions-figma__quick-action" onClick={() => navigate("/transactions/transfer/start")}>
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span>{t("transactionHub.figma.rebalance")}</span>
              </button>
              <button type="button" className="transactions-figma__quick-action" onClick={() => navigate("/transactions/withdrawal/start")}>
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                <span>{t("transactionHub.figma.withdrawal")}</span>
              </button>
              <button type="button" className="transactions-figma__quick-action" onClick={() => navigate("/transactions/rollover/start")}>
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span>{t("transactionHub.figma.rollover")}</span>
              </button>
            </div>
          </motion.section>

          {/* Main: Left column (Active Tracker + Loan Center + Calculator) | Right column (Contextual Insights) */}
          <motion.div className="transactions-figma__main" variants={sectionVariants} custom={reduced}>
            <div className="flex flex-col gap-6 min-w-0">
              <div className="transactions-figma__card">
                <div className="transactions-figma__tracker-header">
                  <h2 className="transactions-figma__card-title">{t("transactionHub.figma.activeTrackerTitle")}</h2>
                  <Link to="/transactions" className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                    {t("transactionHub.figma.viewAll")}
                  </Link>
                </div>
                <ul>
                  {useLiveTracker
                    ? activeTrackerList.map((txn) => {
                        const progress = txn.progressPercentage ?? getProgressFromStatus(txn.status);
                        const eta = txn.estimatedCompletion ?? "—";
                        return (
                          <li key={txn.id} className="transactions-figma__tracker-item">
                            <div className="transactions-figma__tracker-row">
                              <div className="min-w-0">
                                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{t(getTrackerTypeLabelKey(txn.type))}</p>
                                <p className="transactions-figma__tracker-meta">{t("transactionHub.figma.transactionId", { id: txn.id })}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{fmtCurrency(txn.amount)}</span>
                                <StatusBadge label={t(getStatusLabelKey(txn.status))} variant={txn.status === "draft" ? "neutral" : "primary"} />
                              </div>
                            </div>
                            <div className="flex justify-between text-[10px] uppercase tracking-tight mt-1" style={{ color: "var(--color-text-secondary)" }}>
                              <span>{t("transactionHub.figma.progress", { percent: progress })}</span>
                              <span>{t("transactionHub.figma.estCompletion", { eta })}</span>
                            </div>
                            <div className="mt-1">
                              <ProgressBar value={progress} height={6} barColor="var(--color-primary)" />
                            </div>
                            <div className="flex gap-2 mt-3 flex-wrap">
                              <Link to={`/transactions/${txn.type}/${txn.id}`} className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                                {t("transactionHub.figma.details")}
                              </Link>
                              <button type="button" className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                                {t("transactionHub.figma.cancel")}
                              </button>
                            </div>
                          </li>
                        );
                      })
                    : (
                      <>
                        <li className="transactions-figma__tracker-item">
                          <div className="transactions-figma__tracker-row">
                            <div className="min-w-0">
                              <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{t("transactionHub.figma.trackerLoanLabel")}</p>
                              <p className="transactions-figma__tracker-meta">{t("transactionHub.figma.transactionId", { id: TRACKER_ITEM_1.id })}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{fmtCurrency(TRACKER_ITEM_1.amount)}</span>
                              <StatusBadge label={t("transactionHub.figma.verifying")} variant="primary" />
                            </div>
                          </div>
                          <div className="flex justify-between text-[10px] uppercase tracking-tight mt-1" style={{ color: "var(--color-text-secondary)" }}>
                            <span>{t("transactionHub.figma.progress", { percent: TRACKER_ITEM_1.progress })}</span>
                            <span>{t("transactionHub.figma.estCompletion", { eta: TRACKER_ITEM_1.eta })}</span>
                          </div>
                          <div className="mt-1">
                            <ProgressBar value={TRACKER_ITEM_1.progress} height={6} barColor="var(--color-primary)" />
                          </div>
                          <div className="flex gap-2 mt-3 flex-wrap">
                            <button type="button" className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                              {t("transactionHub.figma.details")}
                            </button>
                            <button type="button" className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                              {t("transactionHub.figma.cancel")}
                            </button>
                          </div>
                        </li>
                        <li className="transactions-figma__tracker-item">
                          <div className="transactions-figma__tracker-row">
                            <div className="min-w-0">
                              <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{t("transactionHub.figma.trackerRebalanceLabel")}</p>
                              <p className="transactions-figma__tracker-meta">{t("transactionHub.figma.target", { label: TRACKER_ITEM_2.targetLabel })}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{t(TRACKER_ITEM_2.targetRightKey)}</span>
                              <StatusBadge label={t("transactionHub.figma.queued")} variant="neutral" />
                            </div>
                          </div>
                          <div className="flex justify-between text-[10px] uppercase tracking-tight mt-1" style={{ color: "var(--color-text-secondary)" }}>
                            <span>{t("transactionHub.figma.progress", { percent: TRACKER_ITEM_2.progress })}</span>
                            <span>{t("transactionHub.figma.estCompletion", { eta: TRACKER_ITEM_2.eta })}</span>
                          </div>
                          <div className="mt-1">
                            <ProgressBar value={TRACKER_ITEM_2.progress} height={6} barColor="var(--color-primary)" />
                          </div>
                          <div className="flex gap-2 mt-3 flex-wrap">
                            <button type="button" className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                              {t("transactionHub.figma.details")}
                            </button>
                            <button type="button" className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                              {t("transactionHub.figma.cancel")}
                            </button>
                          </div>
                        </li>
                      </>
                    )}
                </ul>
              </div>
              <div className="transactions-figma__card">
                <h2 className="transactions-figma__card-title">{t("transactionHub.figma.loanCenterTitle")}</h2>
                <div className="space-y-4">
                  <div>
                    <div className="transactions-figma__loan-stat-label">{t("transactionHub.figma.maxBorrowingCapacity")}</div>
                    <div className="transactions-figma__loan-stat-value">{fmtCurrency(50000)}</div>
                  </div>
                  <div>
                    <div className="transactions-figma__loan-stat-label">{t("transactionHub.figma.currentInterestRate")}</div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="transactions-figma__loan-stat-value">6.25%</span>
                      <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{t("transactionHub.figma.primePlus")}</span>
                    </div>
                  </div>
                  <div>
                    <div className="transactions-figma__loan-stat-label">{t("transactionHub.figma.currentOutstanding")}</div>
                    <div className="transactions-figma__loan-stat-value">{fmtCurrency(12400)}</div>
                  </div>
                  <div className="transactions-figma__loan-stat-divider">
                    <div className="transactions-figma__loan-stat-label">{t("transactionHub.figma.nextAutoPayment")}</div>
                    <div className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>{fmtCurrency(415.5)}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>{t("transactionHub.figma.dueDate", { date: "Oct 15, 2026" })}</div>
                  </div>
                </div>
              </div>
              <div className="transactions-figma__card">
                <h2 className="transactions-figma__card-title">{t("transactionHub.figma.calculatorTitle")}</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm" style={{ color: "var(--color-text)" }}>{t("transactionHub.figma.borrowAmount")}</span>
                      <span className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>{fmtCurrency(20000)}</span>
                    </div>
                    <input type="range" min={1000} max={50000} defaultValue={20000} className="w-full h-2 rounded-full appearance-none" style={{ background: "var(--color-border)" }} aria-label={t("transactionHub.figma.borrowAmount")} />
                    <div className="flex justify-between text-[10px] uppercase mt-1" style={{ color: "var(--color-text-secondary)" }}>
                      <span>{t("transactionHub.figma.sliderMin")}</span>
                      <span>{t("transactionHub.figma.sliderMax")}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: "var(--color-text)" }}>{t("transactionHub.figma.repaymentTerm")}</label>
                    <div className="flex gap-2 flex-wrap">
                      <button type="button" className="rounded-full border-2 px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--color-primary)", background: "rgba(var(--enroll-brand-rgb, 55, 19, 236), 0.05)", color: "var(--color-primary)" }}>{t("transactionHub.figma.months12")}</button>
                      <button type="button" className="rounded-full border-2 px-4 py-2 text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>{t("transactionHub.figma.months36")}</button>
                      <button type="button" className="rounded-full border-2 px-4 py-2 text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>{t("transactionHub.figma.months60")}</button>
                    </div>
                  </div>
                  <div className="rounded-xl p-6 flex items-center justify-between flex-wrap gap-4" style={{ background: "var(--color-primary)", color: "var(--color-text-on-primary, #fff)" }}>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest opacity-80">{t("transactionHub.figma.monthlyPayment")}</div>
                      <div className="text-2xl font-semibold">$1,723.15</div>
                    </div>
                    <button type="button" className="rounded-full bg-white px-5 py-3 text-sm font-medium shadow-sm" style={{ color: "var(--color-primary)" }} onClick={() => navigate("/transactions/loan/start")}>
                      {t("transactionHub.figma.applyNow")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="transactions-figma__card min-w-0">
              <h2 className="transactions-figma__card-title">{t("transactionHub.figma.contextualInsightsTitle")}</h2>
              <div className="transactions-figma__insight">
                <p className="transactions-figma__insight-text">{t("transactionHub.figma.belowMatchThreshold")}</p>
                <Link to="/dashboard" className="transactions-figma__insight-link">{t("transactionHub.figma.adjustNow")}</Link>
              </div>
              <div className="transactions-figma__insight">
                <p className="transactions-figma__insight-text">{t("transactionHub.figma.upcomingPayment")}</p>
              </div>
              <div className="transactions-figma__insight">
                <p className="transactions-figma__insight-text">{t("transactionHub.figma.taxPenaltyWarning")}</p>
                <Link to="/transactions" className="transactions-figma__insight-link">{t("transactionHub.figma.runSimulation")}</Link>
              </div>
            </div>
          </motion.div>

          {/* Smart Transaction History — full width */}
          <motion.section className="w-full min-w-0" variants={sectionVariants} custom={reduced}>
            <div className="transactions-figma__card w-full">
              <div className="transactions-figma__history-header">
                <h2 className="transactions-figma__card-title">{t("transactionHub.figma.smartHistoryTitle")}</h2>
                <div className="transactions-figma__history-actions">
                  <button type="button" className="rounded-full border p-2" style={{ borderColor: "var(--color-border)", background: "var(--color-background-secondary)" }} aria-label={t("transactionHub.figma.filter")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 6h16M4 12h10M4 18h6" /></svg>
                  </button>
                  <button type="button" className="rounded-full border p-2" style={{ borderColor: "var(--color-border)", background: "var(--color-background-secondary)" }} aria-label={t("transactionHub.figma.download")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="transactions-figma__history-table">
                  <thead>
                    <tr>
                      <th className="transactions-figma__history-th w-12">{t("transactionHub.figma.colType")}</th>
                      <th className="transactions-figma__history-th">{t("transactionHub.figma.colTransactionName")}</th>
                      <th className="transactions-figma__history-th">{t("transactionHub.figma.colDate")}</th>
                      <th className="transactions-figma__history-th">{t("transactionHub.figma.colAccount")}</th>
                      <th className="transactions-figma__history-th transactions-figma__history-th--amount">{t("transactionHub.figma.colAmount")}</th>
                      <th className="transactions-figma__history-th transactions-figma__history-th--status">{t("transactionHub.figma.colStatus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HISTORY_ROWS.map((row, i) => (
                      <tr key={i}>
                        <td className="transactions-figma__history-td">
                          <span className={`transactions-figma__icon-wrap ${row.type === "deposit" ? "" : "transactions-figma__icon-wrap--primary"}`}>
                            {row.type === "deposit" ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            ) : row.type === "rebalance" ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M3 6h18M3 12h18M3 18h18" /></svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                          </span>
                        </td>
                        <td className="transactions-figma__history-td">{t(row.nameKey)}</td>
                        <td className="transactions-figma__history-td transactions-figma__history-td--muted">{fmtDate(row.date)}</td>
                        <td className="transactions-figma__history-td transactions-figma__history-td--muted">{t(row.accountKey)}</td>
                        <td className={`transactions-figma__history-td transactions-figma__history-td--amount ${row.amount != null && row.amount < 0 ? "transactions-figma__history-td--negative" : ""}`}>
                          {row.amount != null ? (row.amount >= 0 ? `+${fmtCurrency(row.amount)}` : fmtCurrency(row.amount)) : "—"}
                        </td>
                        <td className="transactions-figma__history-td transactions-figma__history-td--status">
                          <span className="transactions-figma__history-status-pill">{t("transactionHub.figma.settled")}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </DashboardLayout>
  );
});
