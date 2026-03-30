import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { AlertTriangle, ArrowLeft, X } from "lucide-react";
import { saveAutoIncreasePreference } from "@/services/enrollmentService";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import {
  pathForWizardStep,
  V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH,
  V1_ENROLLMENT_AUTO_INCREASE_DECISION_PATH,
} from "../flow/v1WizardPaths";
import { ENROLLMENT_STEPS } from "../flow/steps";
import {
  computeProjectedBalancePure,
  getGrowthRate,
  projectBalanceWithAutoIncrease,
} from "../flow/readinessMetrics";

const INVESTMENT_STEP_INDEX = ENROLLMENT_STEPS.indexOf("investment");
const S = "enrollment.v1.autoIncreaseSkip.";
const AD = "enrollment.v1.autoIncreaseDecision.";

export type AutoIncreaseSkipPanelProps = {
  /** Full route step vs overlay inside decision */
  variant: "page" | "modal";
  /** Modal only: close overlay (stay on decision) */
  onDismiss?: () => void;
};

/**
 * Shared “skip auto-increase” confirmation — full page or modal over the decision step.
 * Vertical hierarchy: recommended path first, lighter alternative, compact impact note, CTAs.
 */
export function AutoIncreaseSkipPanel({ variant, onDismiss }: AutoIncreaseSkipPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const goToStep = useEnrollmentStore((s) => s.goToStep);

  const currentPercent = data.contribution;
  const growthRate = getGrowthRate(data.riskLevel);
  const yearsToRetirement = Math.max(0, data.retirementAge - data.currentAge);
  const stepPct = Math.max(data.autoIncreaseRate, 1);
  const maxCap = Math.min(Math.max(data.autoIncreaseMax, 10), 15);

  const withoutAutoProjection = data.projectedBalanceNoAutoIncrease;
  const withAutoProjection = Math.round(
    projectBalanceWithAutoIncrease(
      data.salary,
      data.currentSavings,
      currentPercent,
      yearsToRetirement,
      growthRate,
      stepPct,
      maxCap,
    ),
  );
  const missedSavings10y = useMemo(() => {
    const fixed10 = computeProjectedBalancePure(
      data.salary,
      data.currentSavings,
      currentPercent,
      10,
      growthRate,
    );
    const auto10 = projectBalanceWithAutoIncrease(
      data.salary,
      data.currentSavings,
      currentPercent,
      10,
      growthRate,
      stepPct,
      maxCap,
    );
    return Math.max(0, Math.round(auto10 - fixed10));
  }, [data.salary, data.currentSavings, currentPercent, growthRate, stepPct, maxCap]);

  const amountFormatted = `$${missedSavings10y.toLocaleString()}`;

  const goBackToDecision = () => {
    if (variant === "modal" && onDismiss) {
      onDismiss();
      return;
    }
    navigate(V1_ENROLLMENT_AUTO_INCREASE_DECISION_PATH);
  };

  const handleEnableAutoIncrease = () => {
    if (variant === "modal" && onDismiss) onDismiss();
    updateField("autoIncreaseStepResolved", false);
    const r = saveAutoIncreasePreference({ enabled: true, skipped: false });
    if (!r.ok && import.meta.env.DEV) console.warn("[AutoIncreaseSkipPanel] save preference (enable):", r.error);
    navigate(V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH);
  };

  const handleSkipConfirmed = () => {
    if (variant === "modal" && onDismiss) onDismiss();
    updateField("autoIncrease", false);
    updateField("autoIncreaseStepResolved", true);
    const r = saveAutoIncreasePreference({ enabled: false, skipped: true });
    if (!r.ok && import.meta.env.DEV) console.warn("[AutoIncreaseSkipPanel] save preference (skip):", r.error);
    goToStep(INVESTMENT_STEP_INDEX);
    navigate(pathForWizardStep(INVESTMENT_STEP_INDEX));
  };

  const TitleTag = variant === "modal" ? "h2" : "h1";

  return (
    <div className="flex flex-col gap-6">
      <header className="text-left">
        {variant === "page" ? (
          <>
            <button
              type="button"
              onClick={goBackToDecision}
              className="mb-3 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {t(`${S}back`)}
            </button>
            <div className="flex items-start gap-2.5">
              <AlertTriangle
                className="mt-0.5 h-6 w-6 shrink-0 text-amber-500 dark:text-amber-400"
                aria-hidden
              />
              <TitleTag className="min-w-0 flex-1 text-xl font-semibold leading-snug text-gray-900 dark:text-gray-50 sm:text-2xl">
                {t(`${S}title`)}
              </TitleTag>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{t(`${S}subtitle`)}</p>
          </>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2.5 pr-1">
                <AlertTriangle
                  className="mt-0.5 h-6 w-6 shrink-0 text-amber-500 dark:text-amber-400"
                  aria-hidden
                />
                <TitleTag
                  id="auto-increase-skip-popup-title"
                  className="min-w-0 flex-1 text-xl font-semibold leading-snug text-gray-900 dark:text-gray-50 sm:text-2xl"
                >
                  {t(`${S}title`)}
                </TitleTag>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{t(`${S}subtitle`)}</p>
            </div>
            <button
              type="button"
              onClick={goBackToDecision}
              className="-mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:outline-gray-600"
              aria-label={t(`${S}close`)}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
        )}
      </header>

      {/* Primary: recommended — full-width interactive card */}
      <button
        type="button"
        onClick={handleEnableAutoIncrease}
        className="group relative w-full rounded-xl border-2 border-green-500 bg-green-50/80 px-4 py-4 text-left shadow-sm transition-colors hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:border-green-500 dark:bg-green-950/30 dark:hover:bg-green-950/45"
      >
        <span className="absolute -top-2.5 left-4 inline-flex rounded-full bg-green-600 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white dark:bg-green-500">
          {t(`${S}recommended`)}
        </span>
        <div className="mt-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">{t(`${S}cardWithTitle`)}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t(`${S}cardWithDesc`)}</p>
          <div className="mt-4 border-t border-green-200/80 pt-3 dark:border-green-800/60">
            <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t(`${AD}projectedRetirement`)}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-green-700 dark:text-green-400">
              ${withAutoProjection.toLocaleString()}
            </p>
          </div>
        </div>
      </button>

      {/* Secondary: lighter, informational */}
      <div className="rounded-xl border border-gray-200/90 bg-gray-50/50 px-4 py-3.5 dark:border-gray-700 dark:bg-gray-900/40">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t(`${S}cardWithoutTitle`)}</h3>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">{t(`${S}cardWithoutDesc`)}</p>
        <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {t(`${AD}projectedRetirement`)}
        </p>
        <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-800 dark:text-gray-200">
          ${withoutAutoProjection.toLocaleString()}
        </p>
      </div>

      {/* Impact: subtle warning tone, amount emphasized */}
      <p className="text-center text-sm leading-snug text-rose-700/95 dark:text-rose-300/95">
        <Trans
          i18nKey={`${S}missedLine`}
          values={{ amount: amountFormatted }}
          components={{
            highlight: <strong className="font-semibold text-rose-800 dark:text-rose-200" />,
          }}
        />
      </p>

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
        <button
          type="button"
          onClick={handleEnableAutoIncrease}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:bg-green-600 dark:hover:bg-green-500"
        >
          {t(`${S}ctaEnable`)}
        </button>
        <button
          type="button"
          onClick={handleSkipConfirmed}
          className="w-full py-2 text-center text-sm font-medium text-gray-500 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-gray-700 dark:text-gray-400 dark:decoration-gray-600 dark:hover:text-gray-200"
        >
          {t(`${S}continueWithout`)}
        </button>
      </div>
    </div>
  );
}
