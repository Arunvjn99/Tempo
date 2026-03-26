import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
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
import { cn } from "@/lib/utils";
import { AIButton } from "@/components/ui/AIButton";

const P = "enrollment.v1.plan.";

type CompareRow = { feature: string; traditional: string; roth: string };

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

function asCompareRows(v: unknown): CompareRow[] {
  if (!Array.isArray(v)) return [];
  return v.filter((r): r is CompareRow => r != null && typeof r === "object" && "feature" in r) as CompareRow[];
}

export function ChoosePlan() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const nextStep = useEnrollmentStore((s) => s.nextStep);

  const [showAI, setShowAI] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlanOption | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const traditionalOptRef = useRef<HTMLDivElement>(null);
  const rothOptRef = useRef<HTMLDivElement>(null);

  const traditionalBenefits = useMemo(
    () => asStringArray(t(`${P}traditionalBenefits`, { returnObjects: true })),
    [t],
  );
  const rothBenefits = useMemo(() => asStringArray(t(`${P}rothBenefits`, { returnObjects: true })), [t]);
  const compareRows = useMemo(() => asCompareRows(t(`${P}compareRows`, { returnObjects: true })), [t]);

  useEffect(() => {
    setSelectedPlan(data.selectedPlan);
  }, [data.selectedPlan]);

  const companyPlans = data.companyPlans;
  const hasTwoPlans = companyPlans.length >= 2;

  const confirmPlan = (plan: SelectedPlanOption) => {
    updateField("selectedPlan", plan);
    nextStep();
    navigate(pathForWizardStep(1));
  };

  const handleCardClick = (plan: SelectedPlanOption) => {
    setSelectedPlan(plan);
  };

  const handleOptionKeyDown = (e: KeyboardEvent, plan: SelectedPlanOption) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(plan);
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      if (plan === "traditional") rothOptRef.current?.focus();
      else traditionalOptRef.current?.focus();
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      if (plan === "traditional") rothOptRef.current?.focus();
      else traditionalOptRef.current?.focus();
    }
  };

  if (!hasTwoPlans) {
    const onlyPlan = companyPlans[0] ?? "traditional";
    const planLabel =
      onlyPlan === "traditional" ? t(`${P}traditionalTitle`) : t(`${P}rothTitle`);

    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="card w-full max-w-md space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Landmark className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground md:text-xl">
              {t(`${P}singlePlanTitle`, { planLabel })}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {onlyPlan === "traditional" ? t(`${P}singleTraditionalExplainer`) : t(`${P}singleRothExplainer`)}
            </p>
          </div>

          <button type="button" onClick={() => confirmPlan(onlyPlan)} className="btn btn-primary w-full">
            {t("enrollment.continueToContributions")}
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center md:text-left">
        <h1 id="enrollment-plan-selection-heading" className="text-xl font-semibold text-foreground md:text-2xl">
          {t(`${P}title`)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">{t(`${P}subtitle`)}</p>
      </div>

      <div
        className="grid gap-4 md:grid-cols-2"
        role="listbox"
        aria-labelledby="enrollment-plan-selection-heading"
      >
        <div
          ref={traditionalOptRef}
          role="option"
          tabIndex={0}
          aria-selected={selectedPlan === "traditional"}
          onClick={() => handleCardClick("traditional")}
          onKeyDown={(e) => handleOptionKeyDown(e, "traditional")}
          className={cn(
            "plan-option-card",
            selectedPlan === "traditional" && "plan-option-card--selected",
          )}
        >
          <div className="relative mb-1">
            <span
              className="badge-pill badge-pill--warning"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {t(`${P}badgeMostCommon`)}
              <HelpCircle className="h-3 w-3 opacity-70" aria-hidden />
            </span>
            {showTooltip ? <div className="enroll-tooltip">{t(`${P}badgeTooltip`)}</div> : null}
          </div>

          <h3 className="font-semibold text-foreground">{t(`${P}traditionalTitle`)}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t(`${P}traditionalDesc`)}</p>

          <ul className="mt-4 flex-1 space-y-2">
            {traditionalBenefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="icon-check-success" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled={selectedPlan !== "traditional"}
            aria-disabled={selectedPlan !== "traditional"}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedPlan === "traditional") confirmPlan("traditional");
            }}
            className={cn(
              "btn mt-5 w-full",
              selectedPlan === "traditional" ? "btn-primary" : "btn-outline",
            )}
          >
            {t(`${P}ctaTraditional`)}
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </button>
        </div>

        <div
          ref={rothOptRef}
          role="option"
          tabIndex={0}
          aria-selected={selectedPlan === "roth"}
          onClick={() => handleCardClick("roth")}
          onKeyDown={(e) => handleOptionKeyDown(e, "roth")}
          className={cn("plan-option-card", selectedPlan === "roth" && "plan-option-card--selected")}
        >
          <h3 className="font-semibold text-foreground">{t(`${P}rothTitle`)}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t(`${P}rothDesc`)}</p>

          <ul className="mt-4 flex-1 space-y-2">
            {rothBenefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="icon-check-success" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled={selectedPlan !== "roth"}
            aria-disabled={selectedPlan !== "roth"}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedPlan === "roth") confirmPlan("roth");
            }}
            className={cn("btn mt-5 w-full", selectedPlan === "roth" ? "btn-primary" : "btn-outline")}
          >
            {t(`${P}ctaRoth`)}
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>

      <div className="card-soft space-y-3">
        <p className="font-medium text-foreground">{t(`${P}notSureTitle`)}</p>
        <p className="text-sm text-muted-foreground">{t(`${P}notSureSubtitle`)}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <AIButton
            type="button"
            label={t(`${P}askAi`)}
            pressed={showAI}
            aria-pressed={showAI}
            className="w-full sm:w-auto"
            onClick={() => {
              setShowAI(!showAI);
              setShowCompare(false);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setShowCompare(!showCompare);
              setShowAI(false);
            }}
            className={cn("btn btn-outline w-full sm:w-auto", showCompare && "btn--pressed")}
          >
            <MessageCircle className="size-4 shrink-0" aria-hidden />
            {t(`${P}comparePlans`)}
          </button>
        </div>

        {showAI ? (
          <div className="ai-insight mt-4 p-4">
            <div className="flex items-start gap-2">
              <span className="ai-insight__icon-wrap mt-0.5 shrink-0" aria-hidden>
                <Sparkles className="ai-insight__sparkle text-[var(--ai-primary)]" strokeWidth={2} />
              </span>
              <div className="text-sm">
                <p className="ai-insight__label">{t(`${P}aiRecommendationTitle`)}</p>
                <p className="mt-1 text-muted-foreground">
                  <Trans
                    i18nKey={`${P}aiRecommendationBody`}
                    components={{
                      trad: <strong className="text-foreground" />,
                      roth: <strong className="text-foreground" />,
                    }}
                  />
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {showCompare ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left font-medium text-muted-foreground">{t(`${P}compareColFeature`)}</th>
                  <th className="py-2 text-left font-semibold text-foreground">{t(`${P}compareColTraditional`)}</th>
                  <th className="py-2 text-left font-semibold text-foreground">{t(`${P}compareColRoth`)}</th>
                </tr>
              </thead>
              <tbody className="text-foreground/90">
                {compareRows.map((row) => (
                  <tr key={row.feature} className="border-b border-border/60 last:border-0">
                    <td className="py-2 text-muted-foreground">{row.feature}</td>
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
  );
}
