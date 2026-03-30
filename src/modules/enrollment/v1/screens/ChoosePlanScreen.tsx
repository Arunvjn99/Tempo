import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import {
  ArrowRight,
  Check,
  HelpCircle,
  Landmark,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { pathForWizardStep } from "../flow/v1WizardPaths";
import type { SelectedPlanOption } from "../store/useEnrollmentStore";
import { useEnrollmentStore } from "../store/useEnrollmentStore";

const P = "enrollment.v1.plan.";

type CompareRow = { feature: string; traditional: string; roth: string };

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

function asCompareRows(v: unknown): CompareRow[] {
  if (!Array.isArray(v)) return [];
  return v.filter((r): r is CompareRow => r != null && typeof r === "object" && "feature" in r) as CompareRow[];
}

/** Soft lift for plan tiles (light + dark). */
const planShadowSubtle =
  "shadow-[0_1px_3px_rgba(15,23,42,0.05),0_6px_16px_-4px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.42)]";
const planShadowEmphasis =
  "shadow-[0_2px_6px_rgba(15,23,42,0.06),0_10px_22px_-6px_rgba(15,23,42,0.11)] dark:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.5)]";

const planCardCore =
  "flex min-w-0 flex-col gap-2 rounded-xl border bg-white p-3 text-left dark:bg-gray-900";

const planCardBase = `${planCardCore} border-gray-200 dark:border-gray-600 ${planShadowSubtle}`;

const planCardTraditional = `${planCardCore} border-gray-300 dark:border-gray-500 ${planShadowEmphasis}`;

const planCardRoth = `${planCardCore} border-gray-200 dark:border-gray-600 ${planShadowSubtle}`;

/** Selected tile: blue outline + lift (matches plan-picker spec). */
const planCardSelected = `${planCardCore} border-2 border-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.12),0_8px_24px_-6px_rgba(15,23,42,0.1)] dark:border-blue-400 dark:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.45)]`;

const ctaPrimary =
  "mt-auto flex h-10 w-full min-w-0 items-center justify-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700";

const ctaSecondary =
  "mt-auto flex h-10 w-full min-w-0 items-center justify-center gap-2 rounded-md border-2 border-blue-600 bg-white px-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700";

function ChoosePlanScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { updateField, nextStep } = useEnrollmentStore();
  const selectedPlan = useEnrollmentStore((s) => s.selectedPlan);

  const [showAI, setShowAI] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const traditionalBenefits = useMemo(
    () => asStringArray(t(`${P}traditionalBenefits`, { returnObjects: true })),
    [t],
  );
  const rothBenefits = useMemo(() => asStringArray(t(`${P}rothBenefits`, { returnObjects: true })), [t]);
  const compareRows = useMemo(() => asCompareRows(t(`${P}compareRows`, { returnObjects: true })), [t]);

  const companyPlans = useEnrollmentStore((s) => s.companyPlans);
  const hasTwoPlans = companyPlans.length >= 2;

  const goWithPlan = (plan: SelectedPlanOption) => {
    updateField("selectedPlan", plan);
    nextStep();
    navigate(pathForWizardStep(1));
  };

  const traditionalCardClass = selectedPlan === "traditional" ? planCardSelected : planCardTraditional;
  const rothCardClass = selectedPlan === "roth" ? planCardSelected : planCardRoth;

  const handleTraditionalCta = () => {
    if (selectedPlan === "traditional") goWithPlan("traditional");
    else updateField("selectedPlan", "traditional");
  };

  const handleRothCta = () => {
    if (selectedPlan === "roth") goWithPlan("roth");
    else updateField("selectedPlan", "roth");
  };

  if (!hasTwoPlans) {
    const onlyPlan = companyPlans[0] || "traditional";
    const planLabel =
      onlyPlan === "traditional" ? t(`${P}traditionalTitle`) : t(`${P}rothTitle`);

    return (
      <div className="min-w-0 w-full space-y-4">
        <div className={`${planCardBase} w-full min-w-0`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
            <Landmark className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold leading-tight text-gray-900 dark:text-gray-50">{t(`${P}singlePlanTitle`, { planLabel })}</h2>
            <p className="mt-1 text-sm leading-snug text-gray-600 dark:text-gray-300">
              {onlyPlan === "traditional" ? t(`${P}singleTraditionalExplainer`) : t(`${P}singleRothExplainer`)}
            </p>
          </div>

          <button type="button" onClick={() => goWithPlan(onlyPlan)} className={ctaPrimary}>
            {t(`${P}ctaContinueSingle`)} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full space-y-4">
      <div className="text-left">
        <h1 className="text-2xl font-semibold leading-tight text-gray-900 dark:text-gray-50">{t(`${P}title`)}</h1>
        <p className="mt-1 text-sm leading-snug text-gray-600 dark:text-gray-300">{t(`${P}subtitle`)}</p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <div className={traditionalCardClass}>
          <div
            className="flex min-w-0 cursor-pointer flex-col gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
            role="button"
            tabIndex={0}
            aria-label={t(`${P}selectPlanAria`, { plan: t(`${P}traditionalTitle`) })}
            onClick={() => updateField("selectedPlan", "traditional")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                updateField("selectedPlan", "traditional");
              }
            }}
          >
            <div className="relative min-w-0">
              <span
                className="inline-flex max-w-full min-w-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[0.7rem] font-semibold text-amber-700"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <span className="min-w-0 break-words">{t(`${P}badgeMostCommon`)}</span>
                <HelpCircle className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
              </span>
              {showTooltip ? (
                <div
                  className="absolute left-0 top-full z-10 mt-1 max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-xs leading-snug text-white shadow-lg"
                  role="tooltip"
                >
                  {t(`${P}badgeTooltip`)}
                  <div className="absolute left-6 top-0 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-900" />
                </div>
              ) : null}
            </div>

            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">{t(`${P}traditionalTitle`)}</h3>
            <p className="text-sm leading-snug text-gray-600 dark:text-gray-300">{t(`${P}traditionalDesc`)}</p>

            <ul className="flex min-w-0 flex-col gap-1.5">
              {traditionalBenefits.map((b) => (
                <li key={b} className="flex min-w-0 items-start gap-1.5 text-sm leading-snug text-gray-800 dark:text-gray-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden />
                  <span className="min-w-0">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={handleTraditionalCta}
            className={selectedPlan === "traditional" ? ctaPrimary : ctaSecondary}
            aria-pressed={selectedPlan === "traditional"}
          >
            {t(`${P}ctaTraditional`)}{" "}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        </div>

        <div className={rothCardClass}>
          <div
            className="flex min-w-0 cursor-pointer flex-col gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
            role="button"
            tabIndex={0}
            aria-label={t(`${P}selectPlanAria`, { plan: t(`${P}rothTitle`) })}
            onClick={() => updateField("selectedPlan", "roth")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                updateField("selectedPlan", "roth");
              }
            }}
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">{t(`${P}rothTitle`)}</h3>
            <p className="text-sm leading-snug text-gray-600 dark:text-gray-300">{t(`${P}rothDesc`)}</p>

            <ul className="flex min-w-0 flex-col gap-1.5">
              {rothBenefits.map((b) => (
                <li key={b} className="flex min-w-0 items-start gap-1.5 text-sm leading-snug text-gray-800 dark:text-gray-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden />
                  <span className="min-w-0">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={handleRothCta}
            className={selectedPlan === "roth" ? ctaPrimary : ctaSecondary}
            aria-pressed={selectedPlan === "roth"}
          >
            {t(`${P}ctaRoth`)}{" "}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-3 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_4px_14px_-4px_rgba(15,23,42,0.07)] dark:border-gray-600 dark:bg-gray-800/95 dark:shadow-[0_4px_18px_-6px_rgba(0,0,0,0.4)]">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{t(`${P}notSureTitle`)}</p>
          <p className="mt-1 text-sm leading-snug text-gray-800 dark:text-gray-200">{t(`${P}notSureSubtitle`)}</p>
          <div className="mt-2 flex min-w-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setShowAI(!showAI);
                setShowCompare(false);
              }}
              className={
                showAI
                  ? "flex h-9 items-center gap-2 rounded-md border border-violet-300/90 bg-violet-100/95 px-4 text-sm font-medium text-violet-900 shadow-sm dark:border-violet-700 dark:bg-violet-900/55 dark:text-violet-50"
                  : "flex h-9 items-center gap-2 rounded-md border border-violet-200/80 bg-violet-50/90 px-4 text-sm font-medium text-violet-800 hover:border-violet-300 hover:bg-violet-100/80 dark:border-violet-800/90 dark:bg-violet-950/45 dark:text-violet-200 dark:hover:border-violet-700 dark:hover:bg-violet-950/70"
              }
            >
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden /> {t(`${P}askAi`)}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCompare(!showCompare);
                setShowAI(false);
              }}
              className={
                showCompare
                  ? "flex h-9 items-center gap-2 rounded-lg bg-gray-200 px-3 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-gray-50"
                  : "flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-500 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
              }
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> {t(`${P}comparePlans`)}
            </button>
          </div>

          {showAI ? (
            <div className="mt-2 min-w-0 rounded-xl border border-purple-100 bg-purple-50 p-3 dark:border-purple-900/50 dark:bg-purple-950/35">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" aria-hidden />
                <div className="text-sm leading-snug">
                  <p className="font-semibold text-purple-900 dark:text-purple-100">{t(`${P}aiRecommendationTitle`)}</p>
                  <p className="mt-1 text-purple-800 dark:text-purple-200/95">
                    <Trans
                      i18nKey={`${P}aiRecommendationBody`}
                      components={{
                        trad: <strong />,
                        roth: <strong />,
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {showCompare ? (
            <div className="mt-2 min-w-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="py-2 text-left text-gray-500 dark:text-gray-400" style={{ fontWeight: 500 }}>
                      {t(`${P}compareColFeature`)}
                    </th>
                    <th className="py-2 text-left text-gray-900 dark:text-gray-50" style={{ fontWeight: 600 }}>
                      {t(`${P}compareColTraditional`)}
                    </th>
                    <th className="py-2 text-left text-gray-900 dark:text-gray-50" style={{ fontWeight: 600 }}>
                      {t(`${P}compareColRoth`)}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  {compareRows.map((row) => (
                    <tr key={row.feature} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 text-gray-500 dark:text-gray-400">{row.feature}</td>
                      <td className="py-2">{row.traditional}</td>
                      <td className="py-2">{row.roth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ChoosePlanScreen;
