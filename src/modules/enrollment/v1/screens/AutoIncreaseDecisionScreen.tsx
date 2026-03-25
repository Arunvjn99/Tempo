import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Minus, TrendingUp } from "lucide-react";
import { saveAutoIncreasePreference } from "@/services/enrollmentService";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import {
  pathForWizardStep,
  V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH,
  V1_ENROLLMENT_AUTO_INCREASE_SKIP_PATH,
} from "../flow/v1WizardPaths";
import { ENROLLMENT_STEPS } from "../flow/steps";
import { GROWTH, useAutoIncreaseFinancialImpact, formatAutoIncreaseCurrency } from "../lib/autoIncreaseShared";

const AUTO_INCREASE_STEP_INDEX = ENROLLMENT_STEPS.indexOf("autoIncrease");

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="enrollment-flow-popup enrollment-flow-popup--flat">
      <div className="enrollment-flow-popup__card">{children}</div>
    </div>
  );
}

/** Decision-only: two comparison cards + bottom CTAs (no merged config UI). */
export function AutoIncreaseDecisionScreen() {
  const navigate = useNavigate();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const prevStep = useEnrollmentStore((s) => s.prevStep);

  const currentPercent = data.contribution;
  const risk = data.riskLevel ?? "balanced";
  const growthRate = GROWTH[risk] ?? 0.068;

  const fixedProjection = 124621;
  const autoProjection = 185943;

  const financialImpact = useAutoIncreaseFinancialImpact({
    currentPercent,
    increaseAmount: Math.max(data.autoIncreaseRate, 1),
    maxContribution: Math.min(Math.max(data.autoIncreaseMax, 10), 15),
    salary: data.salary,
    growthRate,
    currentSavings: data.currentSavings,
    retirementAge: data.retirementAge,
    currentAge: data.currentAge,
  });

  const goPreviousEnrollmentStep = () => {
    if (AUTO_INCREASE_STEP_INDEX <= 0) return;
    prevStep();
    navigate(pathForWizardStep(AUTO_INCREASE_STEP_INDEX - 1));
  };

  const handleEnableAutoIncrease = () => {
    updateField("autoIncreaseStepResolved", false);
    const r = saveAutoIncreasePreference({ enabled: true, skipped: false });
    if (!r.ok && import.meta.env.DEV) console.warn("[AutoIncreaseDecision] save preference (enable):", r.error);
    navigate(V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH);
  };

  const handleSkipForNow = () => {
    navigate(V1_ENROLLMENT_AUTO_INCREASE_SKIP_PATH);
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <button type="button" onClick={goPreviousEnrollmentStep} className="enrollment-auto-increase-back">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
          <h1 className="text-xl font-semibold text-foreground md:text-2xl">Increase your savings automatically</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Small increases today can grow your retirement savings over time.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="auto-increase-card">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Minus className="h-5 w-5 text-muted-foreground" aria-hidden />
              </div>
              <h3 className="font-semibold text-foreground">Keep Contributions Fixed</h3>
            </div>
            <p className="text-sm text-muted-foreground">Your contribution stays at {currentPercent}% throughout.</p>
            <div className="mt-4 flex-1">
              <p className="auto-increase-eyebrow">Projected in 10 years</p>
              <p className="auto-increase-gate-projection">${fixedProjection.toLocaleString()}</p>
            </div>
          </div>

          <div className="auto-increase-card auto-increase-card--featured">
            <span className="badge-floating">Recommended</span>
            <div className="mb-3 mt-1 flex items-center gap-2">
              <div className="success-icon-soft">
                <TrendingUp className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-semibold text-foreground">Enable Auto Increase</h3>
            </div>
            <p className="text-sm text-muted-foreground">Gradually raise your rate each year up to your chosen cap.</p>
            <div className="mt-4 flex-1">
              <p className="auto-increase-eyebrow">Projected in 10 years</p>
              <p className="auto-increase-gate-projection auto-increase-gate-projection--success">
                ${autoProjection.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="enrollment-insight-banner enrollment-insight-banner--row">
          <p className="enrollment-insight-banner__body">
            Automatic increases could add approximately{" "}
            <span className="enrollment-insight-banner__emphasis">
              {formatAutoIncreaseCurrency(financialImpact.difference)}
            </span>{" "}
            compared to keeping contributions fixed.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={handleEnableAutoIncrease} className="btn-enroll-success sm:flex-1">
            Enable Auto Increase
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" onClick={handleSkipForNow} className="btn btn-outline sm:flex-1">
            Skip for now
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          After enabling, you&apos;ll set your increase schedule on the next screen. Use <strong>Next</strong> once your
          choice is saved.
        </p>
      </div>
    </Shell>
  );
}
