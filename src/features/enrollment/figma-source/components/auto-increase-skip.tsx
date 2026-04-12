import { useEnrollmentFlowNavigate } from "../enrollmentFlowNav";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import { ArrowLeft, ArrowRight, TrendingUp, Minus, AlertTriangle } from "lucide-react";
import {
  AUTO_INCREASE_PROJECTION_HORIZON_YEARS,
  getGrowthRate,
  projectBalanceShortHorizonFixedPercent,
  projectBalanceShortHorizonWithSteppedPercent,
} from "@/utils/retirementCalculations";

export function AutoIncreaseSkip() {
  const navigate = useEnrollmentFlowNavigate();
  const { data, updateData, setCurrentStep, personalization } = useEnrollment();

  const growthRate = getGrowthRate(data.riskLevel);
  const withoutAutoProjection = projectBalanceShortHorizonFixedPercent(
    data.salary,
    data.contributionPercent,
    growthRate,
    AUTO_INCREASE_PROJECTION_HORIZON_YEARS,
    personalization.currentSavings,
  );
  const withAutoProjection = projectBalanceShortHorizonWithSteppedPercent(
    data.salary,
    data.contributionPercent,
    growthRate,
    AUTO_INCREASE_PROJECTION_HORIZON_YEARS,
    {
      stepPercent: data.autoIncreaseAmount || 1,
      maxPercent: data.autoIncreaseMax || 15,
      startingBalance: personalization.currentSavings,
    },
  );
  const difference = withAutoProjection - withoutAutoProjection;

  const handleEnable = () => {
    updateData({ autoIncrease: true });
    navigate(ep("auto-increase-setup"));
  };

  const handleSkip = () => {
    updateData({ autoIncrease: false });
    setCurrentStep(5);
    navigate(ep("investment"));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(ep("auto-increase"))}
          className="flex items-center gap-1 text-[var(--text-secondary)] mb-3 hover:text-[var(--text-primary)] text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-lg bg-[color-mix(in_srgb,var(--text-secondary)_14%,var(--surface-card))] flex items-center justify-center">
            <AlertTriangle className="w-4.5 h-4.5 text-[var(--text-secondary)]" />
          </div>
          <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Skip automatic increases?</h1>
        </div>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Automatic increases help grow your retirement savings gradually over
          time without requiring large changes today.
        </p>
        <p className="text-[var(--text-secondary)] mt-2 text-sm">
          Automatic increases usually align with salary raises, so your take-home pay typically remains comfortable.
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* With Auto Increase */}
        <div className="card-standard border-2 border-[var(--color-primary)] p-5 flex flex-col relative">
          <span
            className="absolute -top-3 left-4 bg-[var(--color-primary)] text-[var(--primary-foreground)] px-3 py-0.5 rounded-full text-xs font-semibold"
          >
            Recommended
          </span>
          <div className="flex items-center gap-2 mb-3 mt-1">
            <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-[var(--text-primary)] text-xl font-semibold">With Auto Increase</h3>
          </div>
          <p
            className="text-[var(--text-secondary)] text-xs uppercase font-semibold tracking-wide"
          >
            Estimated savings in 10 years
          </p>
          <p
            className="text-[color-mix(in_srgb,var(--color-primary)_80%,var(--text-primary))] mt-1 text-3xl font-bold"
          >
            ${withAutoProjection.toLocaleString()}
          </p>
        </div>

        {/* Without Auto Increase */}
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-card)] flex flex-col opacity-75">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-card)] border border-[var(--border-default)] flex items-center justify-center">
              <Minus className="w-5 h-5 text-[var(--text-secondary)]" />
            </div>
            <h3 className="text-[var(--text-secondary)] text-xl font-semibold">Without Auto Increase</h3>
          </div>
          <p
            className="text-[var(--text-secondary)] text-xs uppercase font-semibold tracking-wide"
          >
            Estimated savings in 10 years
          </p>
          <p
            className="text-[var(--text-secondary)] mt-1 text-3xl font-bold"
          >
            ${withoutAutoProjection.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Highlight Banner */}
      <div className="bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] rounded-xl p-4 text-center">
        <p
          className="text-[var(--text-primary)] text-sm font-medium"
        >
          Automatic increases could add approximately{" "}
          <span className="font-bold">
            ${difference.toLocaleString()}
          </span>{" "}
          to your savings.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleEnable}
          className="flex-1 bg-[var(--color-primary)] text-[var(--primary-foreground)] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all "
        >
          Enable Auto Increase <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleSkip}
          className="flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-3.5 text-[var(--text-secondary)] shadow-[var(--shadow-card)] flex items-center justify-center gap-2 transition-all hover:bg-[var(--surface-card)] active:scale-[0.98]"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}
