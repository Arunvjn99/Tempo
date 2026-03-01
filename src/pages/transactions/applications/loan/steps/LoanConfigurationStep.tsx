import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Check, Info, BarChart2 } from "lucide-react";
import { ACCOUNT_OVERVIEW } from "../../../../../data/accountOverview";
import { DEFAULT_LOAN_PLAN_CONFIG } from "../../../../../config/loanPlanConfig";
import { calculateLoan } from "../../../../../services/loanCalculator";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const TERM_OPTIONS = [12, 36, 60] as const;
const PROJECTED_BALANCE_AGE_65 = 1_240_000;
const IMPACT_AMOUNT = 62_000;

export function LoanConfigurationStep({
  initialData,
  onDataChange,
  readOnly,
}: TransactionStepProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";
  const fmtCurrency = useCallback(
    (n: number, decimals = 0) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(n),
    [locale]
  );

  const minAmount = DEFAULT_LOAN_PLAN_CONFIG.minLoanAmount;
  const maxAmount = Math.min(
    DEFAULT_LOAN_PLAN_CONFIG.maxLoanAbsolute,
    ACCOUNT_OVERVIEW.vestedBalance * DEFAULT_LOAN_PLAN_CONFIG.maxLoanPctOfVested
  );
  const amount = Math.min(
    maxAmount,
    Math.max(minAmount, initialData?.amount ?? Math.min(25000, maxAmount))
  );
  const termMonths = (initialData?.termMonths ?? 36) as 12 | 36 | 60;

  const calc = useMemo(
    () =>
      calculateLoan(
        amount,
        DEFAULT_LOAN_PLAN_CONFIG.defaultAnnualRate,
        termMonths,
        PROJECTED_BALANCE_AGE_65
      ),
    [amount, termMonths]
  );

  const newProjection = PROJECTED_BALANCE_AGE_65 - IMPACT_AMOUNT;
  const impactBarPercent = Math.min(
    100,
    (calc.retirementImpactPercent / 100) * 100
  );

  const setAmount = useCallback(
    (v: number) => {
      const clamped = Math.min(maxAmount, Math.max(minAmount, v));
      onDataChange?.({ amount: clamped, termMonths, tenureYears: termMonths / 12 });
    },
    [maxAmount, minAmount, onDataChange, termMonths]
  );
  const setTerm = useCallback(
    (term: 12 | 36 | 60) =>
      onDataChange?.({ termMonths: term, tenureYears: term / 12 }),
    [onDataChange]
  );

  // Sync defaults into step data so Review has amount/term even if user doesn't change controls
  useEffect(() => {
    onDataChange?.({ amount, termMonths, tenureYears: termMonths / 12 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- intentional: run once on mount

  if (readOnly) {
    return (
      <div className="loan-config-step">
        <p style={{ color: "var(--color-text-secondary)" }}>
          {t("transactions.loan.loanAmountSummary", {
            amount: fmtCurrency(amount),
            years: termMonths / 12,
            purpose: "General",
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="loan-config-step">
      <div className="loan-config-step__grid">
        {/* Left card: Loan Configuration */}
        <div
          className="loan-config-step__card"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <div className="loan-config-step__card-header">
            <h3 className="loan-config-step__card-title">
              {t("transactions.loanFlow.loanConfiguration")}
            </h3>
            <span
              className="loan-config-step__badge"
              style={{
                background: "var(--color-success-light)",
                color: "var(--color-success)",
              }}
            >
              <Check className="loan-config-step__badge-icon" aria-hidden />
              {t("transactions.loanFlow.eligible")}
            </span>
          </div>

          <div className="loan-config-step__section">
            <label
              className="loan-config-step__label"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("transactions.loanFlow.loanAmount")}
            </label>
            <div className="loan-config-step__amount-row">
              <div
                className="loan-config-step__amount-input-wrap"
                style={{
                  background: "var(--color-background-secondary)",
                  borderColor: "var(--color-border)",
                }}
              >
                <span
                  className="loan-config-step__amount-prefix"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount.toLocaleString(locale)}
                  onChange={(e) => {
                    const v = parseInt(
                      e.target.value.replace(/\D/g, "").slice(0, 7),
                      10
                    );
                    if (!Number.isNaN(v)) setAmount(v);
                  }}
                  className="loan-config-step__amount-input"
                  style={{ color: "var(--color-primary)" }}
                  aria-label={t("transactions.loanFlow.loanAmount")}
                />
              </div>
            </div>
            <input
              type="range"
              min={minAmount}
              max={maxAmount}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="loan-config-step__slider"
              style={{
                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((amount - minAmount) / (maxAmount - minAmount)) * 100}%, var(--color-border) ${((amount - minAmount) / (maxAmount - minAmount)) * 100}%, var(--color-border) 100%)`,
              }}
              aria-label={t("transactions.loanFlow.loanAmount")}
            />
            <div
              className="loan-config-step__minmax"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <span>{t("transactions.loanFlow.minAmount")}</span>
              <span>{t("transactions.loanFlow.maxCapacity", { max: fmtCurrency(maxAmount) })}</span>
            </div>
          </div>

          <div className="loan-config-step__section">
            <label
              className="loan-config-step__label"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("transactions.loanFlow.repaymentTerm")}
            </label>
            <div className="loan-config-step__term-buttons">
              {TERM_OPTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setTerm(term)}
                  className="loan-config-step__term-btn"
                  style={{
                    borderColor:
                      termMonths === term
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                    background:
                      termMonths === term
                        ? "rgba(var(--color-primary-rgb, 59 130 246), 0.05)"
                        : "transparent",
                    color:
                      termMonths === term
                        ? "var(--color-primary)"
                        : "var(--color-text)",
                  }}
                >
                  <span className="loan-config-step__term-num">{term}</span>
                  <span
                    className="loan-config-step__term-label"
                    style={{
                      color:
                        termMonths === term
                          ? "var(--color-primary)"
                          : "var(--color-text-secondary)",
                    }}
                  >
                    {term === 12 && t("transactions.loanFlow.months12")}
                    {term === 36 && t("transactions.loanFlow.months36")}
                    {term === 60 && t("transactions.loanFlow.months60")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="loan-config-step__info-row"
            style={{
              background: "var(--color-background-secondary)",
              borderColor: "var(--color-border)",
            }}
          >
            <div>
              <div
                className="loan-config-step__info-label"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("transactions.loanFlow.currentInterestRate")}
              </div>
              <div style={{ color: "var(--color-text)" }}>
                {(DEFAULT_LOAN_PLAN_CONFIG.defaultAnnualRate * 100).toFixed(2)}%{" "}
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {t("transactions.loanFlow.primePlus")}
                </span>
              </div>
            </div>
            <div>
              <div
                className="loan-config-step__info-label"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("transactions.loanFlow.outstandingLoans")}
              </div>
              <div style={{ color: "var(--color-text)" }}>
                {fmtCurrency(ACCOUNT_OVERVIEW.outstandingLoan)}
              </div>
            </div>
          </div>
        </div>

        {/* Right card: Loan Preview */}
        <div
          className="loan-config-step__card"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <h4 className="loan-config-step__preview-title">
            {t("transactions.loanFlow.loanPreview")}
          </h4>
          <div className="loan-config-step__preview-row">
            <span style={{ color: "var(--color-text-secondary)" }}>
              {t("transactions.loanFlow.monthlyPayment")}
            </span>
            <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
              {fmtCurrency(calc.monthlyPayment, 2)}
            </span>
          </div>
          <div className="loan-config-step__preview-row">
            <span style={{ color: "var(--color-text-secondary)" }}>
              {t("transactions.loanFlow.totalInterest")}
            </span>
            <span>{fmtCurrency(calc.totalInterest, 2)}</span>
          </div>
          <div className="loan-config-step__impact">
            <div
              className="loan-config-step__impact-header"
              style={{ color: "var(--color-text)" }}
            >
              <BarChart2 size={14} aria-hidden />
              {t("transactions.loanFlow.retirementImpact")}
            </div>
            <div className="loan-config-step__impact-row">
              <span style={{ color: "var(--color-text-secondary)" }}>
                {t("transactions.loanFlow.projectedBalanceAge65")}
              </span>
              <span
                className="loan-config-step__strike"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {fmtCurrency(PROJECTED_BALANCE_AGE_65 / 1e6, 2)}M
              </span>
            </div>
            <div className="loan-config-step__impact-row">
              <span style={{ color: "var(--color-text)" }}>
                {t("transactions.loanFlow.newProjection")}
              </span>
              <span style={{ color: "var(--color-danger)" }}>
                {fmtCurrency(newProjection / 1e6, 2)}M
              </span>
            </div>
            <div
              className="loan-config-step__impact-bar-wrap"
              style={{ background: "var(--color-border)" }}
            >
              <div
                className="loan-config-step__impact-bar-fill"
                style={{
                  width: `${100 - impactBarPercent}%`,
                  background: "var(--color-primary)",
                }}
              />
              <div
                className="loan-config-step__impact-bar-danger"
                style={{
                  width: `${impactBarPercent}%`,
                  background: "var(--color-danger-light)",
                }}
              />
            </div>
            <p
              className="loan-config-step__impact-note"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("transactions.loanFlow.reducesCompounding", {
                amount: fmtCurrency(IMPACT_AMOUNT),
                years: 20,
              })}
            </p>
          </div>
          <div
            className="loan-config-step__callout"
            style={{
              background: "var(--color-primary-light, rgba(79, 70, 229, 0.06))",
              borderColor: "var(--color-primary)",
            }}
          >
            <Info size={20} aria-hidden style={{ color: "var(--color-primary)" }} />
            <p style={{ color: "var(--color-text)" }}>
              {t("transactions.loanFlow.payrollDeductionInfo")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
