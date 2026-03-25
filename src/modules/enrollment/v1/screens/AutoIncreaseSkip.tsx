import { useNavigate } from "react-router-dom";
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
            Back
          </button>
          <h1 className="text-xl font-semibold text-foreground md:text-2xl">Skip automatic increases?</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Automatic increases help grow your retirement savings gradually over time without requiring large changes
            today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="auto-increase-card auto-increase-card--featured">
            <span className="badge-floating">Recommended</span>
            <div className="mb-3 mt-1 flex items-center gap-2">
              <div className="success-icon-soft">
                <TrendingUp className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-semibold text-foreground">With Auto Increase</h3>
            </div>
            <p className="text-sm text-muted-foreground">Gradually raise your rate each year up to your chosen cap.</p>
            <div className="mt-4 flex-1">
              <p className="auto-increase-eyebrow">Projected in 10 years</p>
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
              <h3 className="font-semibold text-muted-foreground">Without Auto Increase</h3>
            </div>
            <p className="text-sm text-muted-foreground">Your contribution stays at a fixed percentage over time.</p>
            <div className="mt-4 flex-1">
              <p className="auto-increase-eyebrow">Projected in 10 years</p>
              <p className="auto-increase-gate-projection">${WITHOUT_PROJECTION.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="enrollment-insight-banner enrollment-insight-banner--row">
          <p className="enrollment-insight-banner__body">
            Automatic increases could add approximately{" "}
            <span className="enrollment-insight-banner__emphasis">${DELTA.toLocaleString()}</span> to your savings.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={handleEnableAutoIncrease} className="btn-enroll-success sm:flex-1">
            Enable Auto Increase
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" onClick={handleSkipConfirmed} className="btn btn-outline sm:flex-1">
            Skip for now
          </button>
        </div>
      </div>
    </Shell>
  );
}
