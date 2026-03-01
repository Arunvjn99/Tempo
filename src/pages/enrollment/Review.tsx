import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { useInvestment } from "../../context/InvestmentContext";
import { getFundById } from "../../data/mockFunds";
import { EnrollmentFooter } from "../../components/enrollment/EnrollmentFooter";
import { EnrollmentPageContent } from "../../components/enrollment/EnrollmentPageContent";
import { AIAdvisorModal } from "../../components/enrollment/AIAdvisorModal";
import { SuccessEnrollmentModal } from "../../components/enrollment/SuccessEnrollmentModal";
import { FeedbackModal } from "../../components/feedback/FeedbackModal";
import type { SelectedPlanId } from "../../enrollment/context/EnrollmentContext";
import type { ContributionSource, IncrementCycle } from "../../enrollment/logic/types";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */

const PLAN_NAME_KEYS: Record<SelectedPlanId, string> = {
  traditional_401k: "enrollment.traditional401k",
  roth_401k: "enrollment.roth401k",
  roth_ira: "enrollment.rothIra",
  null: "",
};

const PLAN_TYPE_KEYS: Record<SelectedPlanId, string> = {
  traditional_401k: "enrollment.plan401k",
  roth_401k: "enrollment.plan401k",
  roth_ira: "enrollment.rothIra",
  null: "enrollment.plan401k",
};

const SOURCE_KEYS: Record<ContributionSource, string> = {
  preTax: "enrollment.preTax",
  roth: "enrollment.roth",
  afterTax: "enrollment.afterTax",
};

const INCREMENT_CYCLE_KEYS: Record<IncrementCycle, string> = {
  calendar_year: "enrollment.calendarYear",
  plan_enroll_date: "enrollment.planEnrollDate",
  plan_year: "enrollment.planYear",
};

/* ── Shared card style ── */
const cardStyle: React.CSSProperties = {
  background: "var(--enroll-card-bg)",
  border: "1px solid var(--enroll-card-border)",
  borderRadius: "var(--enroll-card-radius)",
  boxShadow: "var(--enroll-elevation-2)",
};

/* ── Animated count-up ── */
function useAnimatedValue(target: number, duration = 600): number {
  const [current, setCurrent] = useState(target);
  const raf = useRef(0);
  const startRef = useRef(current);
  const startTime = useRef(0);

  useEffect(() => {
    startRef.current = current;
    startTime.current = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(startRef.current + (target - startRef.current) * eased);
      if (t < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return current;
}

/* ── Helpers ── */
const locale = () => i18n.language || "en-US";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat(locale(), { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number.isFinite(n) && n >= 0 ? n : 0);
}

function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat(locale(), { style: "percent", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Number.isFinite(value) ? value / 100 : 0);
}

const ASSET_CLASS_KEYS: Record<string, string> = {
  "Large Cap": "enrollment.assetClassLargeCap",
  "Mid Cap": "enrollment.assetClassMidCap",
  "Small Cap": "enrollment.assetClassSmallCap",
  International: "enrollment.assetClassInternational",
  Intl: "enrollment.assetClassIntl",
  Bond: "enrollment.assetClassBond",
  "Real Estate": "enrollment.assetClassRealEstate",
  REIT: "enrollment.assetClassReit",
  Cash: "enrollment.assetClassCash",
  Target: "enrollment.assetClassTarget",
};

function getAssetClassKey(ac: string): string {
  for (const [needle, key] of Object.entries(ASSET_CLASS_KEYS)) {
    if (ac.includes(needle)) return key;
  }
  return ac;
}

/* ═══════════════════════════════════════════════════════
   REVIEW PAGE
   ═══════════════════════════════════════════════════════ */
export const Review = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const enrollment = useEnrollment();
  const investment = useInvestment();

  const [acknowledgements, setAcknowledgements] = useState({ termsAccepted: false });
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEnrollmentFeedback, setShowEnrollmentFeedback] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!pendingFeedback || showSuccessModal) return;
    const timer = setTimeout(() => {
      setPendingFeedback(false);
      setShowEnrollmentFeedback(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [pendingFeedback, showSuccessModal]);

  const showFeedback = useCallback((msg: string) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setFeedbackMessage(msg);
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackMessage(null);
      feedbackTimeoutRef.current = null;
    }, 4000);
  }, []);

  /* ── Prerequisites ── */
  const prerequisites = useMemo(() => {
    if (!enrollment.state.isInitialized) return { hasPlan: false, hasContribution: false, hasInvestment: false, allMet: false, loading: true };
    const hasPlan = enrollment.state.selectedPlan !== null;
    const hasContribution = enrollment.state.contributionAmount > 0;
    const hasInvestment = investment.canConfirmAllocation;
    return { hasPlan, hasContribution, hasInvestment, allMet: hasPlan && hasContribution && hasInvestment, loading: false };
  }, [enrollment.state.isInitialized, enrollment.state.selectedPlan, enrollment.state.contributionAmount, investment.canConfirmAllocation]);

  if (prerequisites.loading) return null;
  if (!prerequisites.hasPlan) return <Navigate to="/enrollment/choose-plan" replace />;
  if (!prerequisites.hasContribution) return <Navigate to="/enrollment/contribution" replace />;

  /* ── Data ── */
  const selectedPlanName = enrollment.state.selectedPlan ? t(PLAN_NAME_KEYS[enrollment.state.selectedPlan]) : "";
  const { preTax = 0, roth = 0, afterTax = 0 } = enrollment.state.sourceAllocation ?? {};
  const contributionTotal = enrollment.state.contributionAmount ?? 0;

  const fundTableRows = useMemo(() => {
    return investment.chartAllocations
      .filter((a) => a.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .map(({ fundId, percentage }) => {
        const fund = getFundById(fundId);
        return fund ? { fund, percentage } : null;
      })
      .filter(Boolean) as { fund: NonNullable<ReturnType<typeof getFundById>>; percentage: number }[];
  }, [investment.chartAllocations]);

  const totalAllocation = fundTableRows.reduce((s, r) => s + r.percentage, 0);
  const weightedSummary = investment.weightedSummary;
  const isAllocationValid = weightedSummary.isValid;

  const projectedValue = useMemo(() => {
    const years = (enrollment.state.retirementAge ?? 67) - (enrollment.state.currentAge ?? 40);
    const annual = (enrollment.monthlyContribution?.employee ?? 0) * 12;
    const rate = (weightedSummary.expectedReturn ?? 7) / 100;
    let v = enrollment.state.currentBalance ?? 0;
    for (let i = 0; i < years; i++) v = v * (1 + rate) + annual;
    return v;
  }, [enrollment.state.retirementAge, enrollment.state.currentAge, enrollment.monthlyContribution?.employee, enrollment.state.currentBalance, weightedSummary.expectedReturn]);

  const yearsToRetirement = (enrollment.state.retirementAge ?? 67) - (enrollment.state.currentAge ?? 40);
  const annualReturn = weightedSummary.expectedReturn ?? 7;
  const feePercent = weightedSummary.totalFees ?? 0;

  /* Retirement readiness: same projected value; goal derived so we can show % and shortfall (e.g. 50% reached). */
  const readinessGoal = Math.max(projectedValue * 2, 1);
  const readinessPercent = Math.min(99, Math.round((projectedValue / readinessGoal) * 100));
  const shortfallAmount = Math.max(0, readinessGoal - projectedValue);

  const canEnroll = prerequisites.allMet && investment.canConfirmAllocation && acknowledgements.termsAccepted;

  const formatContributionPct = (pct: number) => (pct % 1 === 0 ? `${pct}%` : `${pct.toFixed(1)}%`);

  /* ── Handlers ── */
  const buildEnrollmentSummary = useCallback(() => {
    const lines: string[] = [
      t("enrollment.enrolmentSummary"),
      "==================",
      "",
      `Plan: ${selectedPlanName || t("enrollment.traditional401k")}`,
      `${t("enrollment.employerMatchLabel")}: ${enrollment.state.assumptions.employerMatchPercentage}%`,
      `Contribution: ${contributionTotal}% of paycheck`,
      `  Pre-tax: ${preTax > 0 ? ((preTax / 100) * contributionTotal).toFixed(1) + "%" : "—"}`,
      `  Roth: ${roth > 0 ? ((roth / 100) * contributionTotal).toFixed(1) + "%" : "—"}`,
      `  After-tax: ${afterTax > 0 ? ((afterTax / 100) * contributionTotal).toFixed(1) + "%" : "—"}`,
      "",
      t("enrollment.investmentElectionsHeading") + ":",
      ...fundTableRows.map((r) => `  ${r.fund.ticker} ${r.fund.name}: ${r.percentage.toFixed(1)}%`),
      "",
      `Total Allocation: ${totalAllocation.toFixed(1)}%`,
      `Expected Return: ${(weightedSummary.expectedReturn ?? 0).toFixed(1)}%`,
      `Estimated Fees: ${(weightedSummary.totalFees ?? 0).toFixed(2)}%`,
    ];
    return lines.join("\n");
  }, [t, selectedPlanName, enrollment.state.assumptions.employerMatchPercentage, contributionTotal, preTax, roth, afterTax, fundTableRows, totalAllocation, weightedSummary.expectedReturn, weightedSummary.totalFees]);

  const handleDownloadPDF = useCallback(() => {
    const summary = buildEnrollmentSummary();
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enrollment-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback(t("enrollment.summaryDownloaded"));
  }, [buildEnrollmentSummary, showFeedback]);

  const handleEmailSummary = useCallback(() => {
    const summary = buildEnrollmentSummary();
    const subject = encodeURIComponent(t("enrollment.emailSummarySubject"));
    const body = encodeURIComponent(summary);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    showFeedback(t("enrollment.openingEmail"));
  }, [t, buildEnrollmentSummary, showFeedback]);

  const handleApplySuggestion = useCallback(
    (suggestion: "contribution" | "investments") => {
      showFeedback(suggestion === "contribution" ? t("enrollment.goToContributions") : t("enrollment.goToInvestments"));
      setTimeout(() => navigate(suggestion === "contribution" ? "/enrollment/contribution" : "/enrollment/investments"), 800);
    },
    [navigate, showFeedback]
  );

  /* ── AI Insights data ── */
  const insights = [
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
      ),
      title: t("enrollment.insightIncreasePreTax"),
      description: t("enrollment.insightIncreasePreTaxDesc"),
      impact: t("enrollment.insightPreTaxImpact"),
      action: () => handleApplySuggestion("contribution"),
    },
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8l-4 4-4-4" /></svg>
      ),
      title: t("enrollment.insightTargetDate"),
      description: t("enrollment.insightTargetDateDesc"),
      impact: t("enrollment.insightTargetDateImpact"),
      action: () => handleApplySuggestion("investments"),
    },
  ];

  return (
    <>
      {/* Feedback toast */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            role="status"
            aria-live="polite"
            className="fixed left-1/2 top-6 z-[100] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium"
            style={{
              background: "var(--enroll-card-bg)",
              border: "1px solid rgb(var(--enroll-accent-rgb) / 0.3)",
              color: "var(--enroll-accent)",
              boxShadow: "var(--enroll-elevation-3)",
            }}
          >
            {feedbackMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <EnrollmentPageContent
        title={t("enrollment.reviewTitleInstitutional")}
        subtitle={t("enrollment.reviewSubtitleInstitutional")}
      >
        {/* Single containment: plan overview → 12-col grid → next steps → terms */}
        <div className="flex flex-col gap-10" data-figma-node="1184-1779">
          {/* 1. Plan Overview card (full width) */}
          <div
            className="rounded-2xl border p-4 sm:p-6 flex flex-wrap items-center justify-between gap-6 sm:gap-12"
            style={{
              borderColor: "var(--enroll-card-border)",
              background: "var(--enroll-plan-overview-bg)",
              boxShadow: "var(--enroll-elevation-1)",
            }}
          >
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--enroll-card-bg)", boxShadow: "var(--enroll-elevation-1)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--enroll-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.plan401kLabel")}</span>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full" style={{ background: "var(--enroll-active-badge-bg)", border: "1px solid var(--enroll-active-badge-border)", color: "var(--color-success)" }}>{t("enrollment.activeEnrollment")}</span>
                </div>
                <p className="text-sm mt-0.5" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.standardCorporateRetirement")}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 sm:gap-12">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.contributionStructure")}</p>
                <p className="text-sm mt-1" style={{ color: "var(--enroll-text-secondary)" }}>
                  {t("enrollment.preTax")} <span style={{ color: "var(--enroll-brand)" }}>{preTax > 0 ? formatContributionPct((preTax / 100) * contributionTotal) : "0%"}</span>
                  {" | "}{t("enrollment.roth")} <span style={{ color: "var(--enroll-brand)" }}>{roth > 0 ? formatContributionPct((roth / 100) * contributionTotal) : "0%"}</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.employerMatchLabel")}</p>
                <p className="text-sm mt-1" style={{ color: "var(--enroll-text-secondary)" }}>
                  {t("enrollment.employerMatchUpTo", { percent: enrollment.state.assumptions.employerMatchCap ?? 6 })}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Two-column grid: left 8 cols | right 4 cols */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="flex flex-col gap-8 xl:col-span-8">
              {/* Contribution Strategy card */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-8 rounded-2xl" style={cardStyle}>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.contributionStrategy")}</h2>
                    <p className="text-sm mt-1" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.automaticPayrollAllocation")}</p>
                  </div>
                  <button type="button" onClick={() => navigate("/enrollment/contribution")} className="text-sm font-semibold flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--enroll-brand)]" style={{ color: "var(--enroll-brand)" }} aria-label={t("enrollment.edit")}>{t("enrollment.edit")}</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.totalContribution")}</p>
                    <p className="text-4xl font-bold mt-2" style={{ color: "var(--enroll-text-primary)" }}>{contributionTotal}%</p>
                    <p className="text-sm mt-1" style={{ color: "var(--enroll-brand)" }}>{t("enrollment.combined")}</p>
                    <p className="text-xs mt-2" style={{ color: "var(--enroll-text-muted)" }}>{preTax > 0 && `${formatContributionPct((preTax / 100) * contributionTotal)} ${t("enrollment.preTax")}`}{preTax > 0 && roth > 0 && " / "}{roth > 0 && `${formatContributionPct((roth / 100) * contributionTotal)} ${t("enrollment.roth")}`}{(preTax > 0 || roth > 0) && afterTax > 0 && " "}{afterTax > 0 && `(${t("enrollment.afterTax")})`}</p>
                  </div>
                  <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "var(--enroll-success-tint-bg)", border: "1px solid var(--enroll-success-tint-border)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.employerMatchLabel")}</p>
                    <p className="text-4xl font-bold mt-2" style={{ color: "var(--color-success)" }}>{enrollment.state.assumptions.employerMatchCap ?? 6}%</p>
                    <p className="text-sm mt-1" style={{ color: "var(--color-success)", opacity: 0.8 }}>{t("enrollment.verified")}</p>
                    <p className="text-xs mt-2" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.maximizedBenefit")}</p>
                  </div>
                </div>
              </motion.div>

              {/* Investment Allocation card */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="rounded-2xl overflow-hidden" style={{ ...cardStyle, padding: 0 }}>
                <div className="border-b px-8 pt-6 pb-6 flex flex-wrap items-center justify-between gap-4" style={{ borderColor: "var(--enroll-card-border)" }}>
                  <div>
                    <h2 className="text-xl font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.investmentAllocation")}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.riskProfile")}</span>
                      <span className="text-[11px] font-semibold uppercase px-2.5 py-1 rounded" style={{ background: "var(--enroll-risk-badge-bg)", border: "1px solid var(--enroll-risk-badge-border)", color: "var(--enroll-brand)" }}>{t("enrollment.riskModerateAggressive")}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => navigate("/enrollment/investments")} className="text-sm font-semibold flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--enroll-brand)]" style={{ color: "var(--enroll-brand)" }} aria-label={t("enrollment.manageFunds")}>{t("enrollment.manageFunds")}</button>
                </div>
                {!isAllocationValid && (
                  <div className="flex items-center gap-2 mx-8 mt-4 p-3 rounded-xl" style={{ background: "rgb(var(--color-danger-rgb) / 0.06)", border: "1px solid rgb(var(--color-danger-rgb) / 0.15)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" aria-hidden="true"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span className="text-xs font-semibold" style={{ color: "var(--color-danger)" }}>{t("enrollment.allocationMustEqual", { percent: totalAllocation.toFixed(0) })}</span>
                  </div>
                )}
                <div className="flex flex-col xl:flex-row">
                  <div className="flex-1 min-w-0">
                    <div className="flex border-b text-xs font-bold uppercase tracking-wider px-8 py-3 gap-8" style={{ color: "var(--enroll-text-muted)", background: "var(--enroll-table-header-bg)", borderColor: "var(--enroll-card-border)" }}>
                      <span>{t("enrollment.fundBreakdown")}</span>
                      <span>{t("enrollment.performanceData")}</span>
                    </div>
                    <div className="overflow-x-auto min-w-0 -mx-4 sm:mx-0">
                      <table className="w-full text-sm" role="grid" aria-label={t("enrollment.fundBreakdown")}>
                        <thead>
                          <tr className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>
                            <th className="text-left px-6 py-5">{t("enrollment.assetDescription")}</th>
                            <th className="text-left px-4 py-5">{t("enrollment.class")}</th>
                            <th className="text-left px-4 py-5">{t("enrollment.fees")}</th>
                            <th className="text-right px-6 py-5">{t("enrollment.totalLabel")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fundTableRows.map(({ fund, percentage }) => (
                            <tr key={fund.id} className="border-t" style={{ borderColor: "var(--enroll-card-border)" }}>
                              <td className="px-6 py-4">
                                <p className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{fund.name}</p>
                                <p className="text-[10px] mt-0.5" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.riskScoreLabel", { level: fund.riskLevel })}</p>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-xs px-2 py-1 rounded" style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-text-secondary)" }}>{t(getAssetClassKey(fund.assetClass))}</span>
                              </td>
                              <td className="px-4 py-4" style={{ color: "var(--enroll-text-secondary)" }}>{(fund.expenseRatio ?? 0).toFixed(2)}%</td>
                              <td className="px-6 py-4 text-right">
                                <span className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{percentage.toFixed(0)}%</span>
                                <div className="mt-2 h-1.5 rounded-full w-24 ml-auto" style={{ background: "var(--enroll-soft-bg)" }}>
                                  <div className="h-full rounded-full" style={{ width: `${percentage}%`, background: "var(--enroll-brand)", maxWidth: "100%" }} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between px-6 py-4" style={{ background: "var(--enroll-table-header-bg)" }}>
                      <span className="text-sm font-semibold uppercase" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.totalAllocation")}</span>
                      <span className="text-2xl font-bold" style={{ color: isAllocationValid ? "var(--enroll-text-primary)" : "var(--color-danger)" }}>{totalAllocation.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="xl:border-t-0 xl:border-l border-t shrink-0 xl:max-w-[18rem] px-6 sm:px-8 py-6 sm:py-8 flex flex-col gap-6" style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-soft-bg)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-center" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.portfolioSnapshot")}</p>
                    <div className="flex flex-col items-center" role="img" aria-label={t("enrollment.portfolioSnapshot") + ": " + totalAllocation.toFixed(0) + "% " + t("enrollment.totalLabel")}>
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--enroll-card-bg)", boxShadow: "var(--enroll-elevation-2)" }} aria-hidden="true">
                        <span className="text-3xl font-bold" style={{ color: "var(--color-success)" }}>{totalAllocation.toFixed(0)}%</span>
                        <span className="absolute bottom-2 text-xs font-bold uppercase" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.totalLabel")}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full" style={{ background: "var(--color-success-light)", border: "1px solid var(--color-success)" }}>
                        <span className="text-[11px] font-bold" style={{ color: "var(--color-success)" }}>{t("enrollment.validAllocation")}</span>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between pb-3" style={{ borderBottom: "1px solid var(--enroll-card-border)" }}>
                        <span style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.returnEst")}</span>
                        <span style={{ color: "var(--color-success)" }}>{formatPercent(weightedSummary.expectedReturn ?? 7)} {t("enrollment.perAnnum")}</span>
                      </div>
                      <div className="flex justify-between pb-3" style={{ borderBottom: "1px solid var(--enroll-card-border)" }}>
                        <span style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.avgExpense")}</span>
                        <span style={{ color: "var(--enroll-text-primary)" }}>{formatPercent(weightedSummary.totalFees ?? 0, 2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.rebalance")}</span>
                        <span style={{ color: "var(--enroll-brand)" }}>{t("enrollment.autoOn")}</span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--enroll-brand)" }}>{t("enrollment.strategyOptimizedHorizon")}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="xl:col-span-4 xl:sticky xl:top-24 xl:self-start flex flex-col gap-6">
              {/* Retirement Readiness */}
              <div className="p-6 rounded-2xl" style={{ ...cardStyle, boxShadow: "var(--enroll-elevation-3)" }}>
                <h2 className="text-base font-bold mb-1" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.yourRetirementReadiness")}</h2>
                <p className="text-sm mb-6" style={{ color: "var(--enroll-text-secondary)" }}>{t("enrollment.readinessSubtext", { percent: readinessPercent })}</p>
                <div className="flex items-center gap-4 sm:gap-6 mb-6 flex-wrap">
                  <div
                    className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0"
                    role="img"
                    aria-label={t("enrollment.readinessSubtext", { percent: readinessPercent })}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--enroll-donut-track)" strokeWidth="8" />
                      <motion.circle cx="50" cy="50" r="42" fill="none" stroke="var(--enroll-donut-fill)" strokeWidth="8" strokeLinecap="round" strokeDasharray={263.9} initial={{ strokeDashoffset: 263.9 }} animate={{ strokeDashoffset: 263.9 * (1 - readinessPercent / 100) }} transition={{ duration: 0.8 }} transform="rotate(-90 50 50)" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl sm:text-2xl font-bold" style={{ color: "var(--enroll-donut-text)" }}>{readinessPercent}%</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.goalScore")}</p>
                    <p className="text-xl font-bold" style={{ color: "var(--enroll-text-primary)" }}>{readinessPercent}%</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider mt-3 mb-1" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.projectedValue")}</p>
                    <p className="text-lg font-bold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(projectedValue)}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider mt-3 mb-1" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.shortfall")}</p>
                    <p className="text-lg font-bold" style={{ color: "var(--color-danger)" }}>-{formatCurrency(shortfallAmount)}</p>
                  </div>
                </div>
                <button type="button" onClick={() => handleApplySuggestion("contribution")} className="w-full py-2.5 text-sm font-semibold rounded-xl border cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--enroll-brand)] hover:opacity-95" style={{ background: "var(--enroll-brand)", color: "var(--color-text-on-primary, white)", borderColor: "var(--enroll-brand)" }} aria-label={t("enrollment.optimizeStrategy")}>{t("enrollment.optimizeStrategy")}</button>
              </div>

              {/* Strategic Enhancements (AI insights) */}
              <div className="p-6 rounded-2xl" style={cardStyle}>
                <p className="text-sm font-bold mb-4" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.strategicEnhancements")}</p>
                <div className="space-y-4">
                  {insights.map((insight, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 p-4 rounded-xl" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{insight.title}</p>
                        <p className="text-xs mt-1" style={{ color: "var(--enroll-text-muted)" }}>{insight.description}</p>
                      </div>
                      <button type="button" onClick={insight.action} className="shrink-0 text-xs font-bold uppercase px-3 py-1.5 rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--enroll-brand)] hover:opacity-95" style={{ background: "var(--enroll-brand)", color: "var(--color-text-on-primary, white)" }} aria-label={`${t("enrollment.applySuggestion")}: ${insight.title}`}>{t("enrollment.applySuggestion")}</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key metrics */}
              <div className="p-6 rounded-2xl" style={cardStyle}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.yearsToRetirementShort")}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: "var(--enroll-text-primary)" }}>{yearsToRetirement}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.avgYield")}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: "var(--enroll-text-primary)" }}>{annualReturn}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.feeCap")}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: "var(--enroll-text-primary)" }}>{feePercent.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 3. Next Steps Toward Activation */}
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: "var(--enroll-next-steps-bg)", color: "var(--enroll-next-steps-text)" }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--enroll-next-steps-heading)" }}>{t("enrollment.nextStepsTowardActivation")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-3xl font-bold mb-2" style={{ color: "var(--enroll-brand)" }}>01</p>
                <p className="font-semibold mb-1" style={{ color: "var(--enroll-next-steps-heading)" }}>{t("enrollment.entityVerification")}</p>
                <p className="text-sm opacity-90">{t("enrollment.entityVerificationDesc")}</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2" style={{ color: "var(--enroll-brand)" }}>02</p>
                <p className="font-semibold mb-1" style={{ color: "var(--enroll-next-steps-heading)" }}>{t("enrollment.payrollIntegration")}</p>
                <p className="text-sm opacity-90">{t("enrollment.payrollIntegrationDesc")}</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2" style={{ color: "var(--enroll-brand)" }}>03</p>
                <p className="font-semibold mb-1" style={{ color: "var(--enroll-next-steps-heading)" }}>{t("enrollment.assetFunding")}</p>
                <p className="text-sm opacity-90">{t("enrollment.assetFundingDesc")}</p>
              </div>
            </div>
          </div>

          {/* 4. Terms confirmation (institutional) */}
          <div className="rounded-2xl p-6" style={{ ...cardStyle, background: "var(--enroll-soft-bg)" }}>
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="flex h-5 w-5 items-center justify-center rounded shrink-0 mt-0.5" style={{ background: acknowledgements.termsAccepted ? "var(--enroll-brand)" : "transparent", border: acknowledgements.termsAccepted ? "none" : "1.5px solid var(--enroll-card-border)" }}>
                {acknowledgements.termsAccepted && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-on-primary, white)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
              <input type="checkbox" checked={acknowledgements.termsAccepted} onChange={(e) => setAcknowledgements((p) => ({ ...p, termsAccepted: e.target.checked }))} className="sr-only" />
              <span className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.confirmReviewInstitutional")}</span>
            </label>
          </div>
        </div>

        <EnrollmentFooter
          step={4}
          primaryLabel={t("enrollment.enrollToPlan")}
          primaryDisabled={!canEnroll}
          onPrimary={() => { if (canEnroll) setShowSuccessModal(true); }}
          summaryText={!isAllocationValid ? t("enrollment.allocationMustTotal") : t("enrollment.readyToSubmit")}
          summaryError={!isAllocationValid}
          getDraftSnapshot={() => {
            const s = enrollment.state;
            const yearsToRetire = (s.retirementAge ?? 67) - (s.currentAge ?? 40);
            return {
              currentAge: s.currentAge ?? 30,
              retirementAge: s.retirementAge ?? 67,
              yearsToRetire,
              annualSalary: s.salary ?? 0,
              selectedPlanId: s.selectedPlan,
              selectedPlanDbId: s.selectedPlanDbId ?? null,
              contributionType: s.contributionType,
              contributionAmount: s.contributionAmount ?? 0,
              sourceAllocation: s.sourceAllocation ?? { preTax: 100, roth: 0, afterTax: 0 },
              autoIncrease: s.autoIncrease?.enabled
                ? {
                    enabled: true,
                    annualIncreasePct: s.autoIncrease.percentage ?? 2,
                    stopAtPct: s.autoIncrease.maxPercentage ?? 15,
                    minimumFloorPct: s.autoIncrease.minimumFloor,
                  }
                : undefined,
              investmentProfile: s.investmentProfile ?? undefined,
              investmentProfileCompleted: s.investmentProfileCompleted ?? false,
              investment: investment.getInvestmentSnapshot(),
            };
          }}
        />
      </EnrollmentPageContent>

      <AIAdvisorModal open={showAdvisorModal} onClose={() => setShowAdvisorModal(false)} />
      <SuccessEnrollmentModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          if (!sessionStorage.getItem("enrollment_feedback_shown")) {
            sessionStorage.setItem("enrollment_feedback_shown", "1");
            setPendingFeedback(true);
          } else {
            navigate("/dashboard/post-enrollment");
          }
        }}
        onViewPlanDetails={() => {
          setShowSuccessModal(false);
          if (!sessionStorage.getItem("enrollment_feedback_shown")) {
            sessionStorage.setItem("enrollment_feedback_shown", "1");
            setPendingFeedback(true);
          } else {
            navigate("/dashboard/post-enrollment");
          }
        }}
      />
      <FeedbackModal
        isOpen={showEnrollmentFeedback}
        onClose={() => {
          setShowEnrollmentFeedback(false);
          navigate("/dashboard/post-enrollment");
        }}
        workflowType="enrollment_flow"
      />
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function AnimatedCurrencyDisplay({ value }: { value: number }) {
  const animatedVal = useAnimatedValue(value, 800);
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-3xl md:text-4xl font-bold"
      style={{ color: "var(--enroll-text-primary)" }}
    >
      {formatCurrency(animatedVal)}
    </motion.p>
  );
}

function SectionHeader({ title, editLabel, onEdit, warning }: { title: string; editLabel: string; onEdit: () => void; warning?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>{title}</p>
      <button
        type="button"
        onClick={onEdit}
        className="text-[11px] font-semibold px-3 py-1 rounded-full border-none cursor-pointer transition-colors"
        style={{
          background: warning ? "rgb(var(--color-danger-rgb) / 0.08)" : "rgb(var(--enroll-brand-rgb) / 0.06)",
          color: warning ? "var(--color-danger)" : "var(--enroll-brand)",
        }}
      >
        {editLabel}
      </button>
    </div>
  );
}
