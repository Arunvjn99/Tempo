import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Minus, TrendingUp } from "lucide-react";
import { saveAutoIncreasePreference } from "@/services/enrollmentService";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import {
  pathForWizardStep,
  V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH,
  V1_ENROLLMENT_AUTO_INCREASE_DECISION_PATH,
} from "../flow/v1WizardPaths";
import { ENROLLMENT_STEPS } from "../flow/steps";

const INVESTMENT_STEP_INDEX = ENROLLMENT_STEPS.indexOf("investment");
const S = "enrollment.v1.autoIncreaseSkip.";

const WITH_PROJECTION = 185_943;
const WITHOUT_PROJECTION = 124_621;
const DELTA = WITH_PROJECTION - WITHOUT_PROJECTION;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="enrollment-flow-popup enrollment-flow-popup--flat">
      <div className="enrollment-flow-popup__card">{children}</div>
    </div>
  );
}

/**
 * Confirmation when leaving auto-increase without enabling (Figma: auto-increase-skip).
 */
export function AutoIncreaseSkip() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const goToStep = useEnrollmentStore((s) => s.goToStep);

  const goBackToDecision = () => {
    navigate(V1_ENROLLMENT_AUTO_INCREASE_DECISION_PATH);
  };

  const handleEnableAutoIncrease = () => {
    updateField("autoIncreaseStepResolved", false);
    const r = saveAutoIncreasePreference({ enabled: true, skipped: false });
    if (!r.ok && import.meta.env.DEV) console.warn("[AutoIncreaseSkip] save preference (enable):", r.error);
    navigate(V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH);
  };

  const handleSkipConfirmed = () => {
    updateField("autoIncrease", false);
    updateField("autoIncreaseStepResolved", true);
    const r = saveAutoIncreasePreference({ enabled: false, skipped: true });
    if (!r.ok && import.meta.env.DEV) console.warn("[AutoIncreaseSkip] save preference (skip):", r.error);
    goToStep(INVESTMENT_STEP_INDEX);
    navigate(pathForWizardStep(INVESTMENT_STEP_INDEX));
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <button type="button" onClick={goBackToDecision} className="enrollment-auto-increase-back">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {t(`${S}back`)}
          </button>
          <h1 className="text-xl font-semibold text-foreground md:text-2xl">{t(`${S}title`)}</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{t(`${S}subtitle`)}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="auto-increase-card auto-increase-card--featured">
            <span className="badge-floating">{t(`${S}recommended`)}</span>
            <div className="mb-3 mt-1 flex items-center gap-2">
              <div className="success-icon-soft">
                <TrendingUp className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-semibold text-foreground">{t(`${S}cardWithTitle`)}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t(`${S}cardWithDesc`)}</p>
            <div className="mt-4 flex-1">
              <p className="auto-increase-eyebrow">{t(`${S}projected10y`)}</p>
              <p className="auto-increase-gate-projection auto-increase-gate-projection--success">
                ${WITH_PROJECTION.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="auto-increase-card auto-increase-card--dim">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Minus className="h-5 w-5 text-muted-foreground" aria-hidden />
              </div>
              <h3 className="font-semibold text-muted-foreground">{t(`${S}cardWithoutTitle`)}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t(`${S}cardWithoutDesc`)}</p>
            <div className="mt-4 flex-1">
              <p className="auto-increase-eyebrow">{t(`${S}projected10y`)}</p>
              <p className="auto-increase-gate-projection">${WITHOUT_PROJECTION.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="enrollment-insight-banner enrollment-insight-banner--row">
          <p className="enrollment-insight-banner__body">
            {t(`${S}insightBefore`)}
            <span className="enrollment-insight-banner__emphasis">${DELTA.toLocaleString()}</span>
            {t(`${S}insightAfter`)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={handleEnableAutoIncrease} className="btn-enroll-success sm:flex-1">
            {t(`${S}ctaEnable`)}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" onClick={handleSkipConfirmed} className="btn btn-outline sm:flex-1">
            {t(`${S}ctaSkip`)}
          </button>
        </div>
      </div>
    </Shell>
  );
}
