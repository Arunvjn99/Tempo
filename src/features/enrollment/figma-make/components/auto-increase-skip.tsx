import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
      <div>
        <button
          type="button"
          onClick={() => navigate(ep("auto-increase"))}
          className="mb-3 flex items-center gap-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="mb-1 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-warning-light)]">
            <AlertTriangle className="h-[18px] w-[18px] text-[var(--color-warning)]" />
          </div>
          <h1 className="text-[var(--text-primary)]">Skip automatic increases?</h1>
        </div>
        <p className="mt-1 text-[var(--text-secondary)]" style={{ fontSize: "0.9rem" }}>
          Automatic increases help grow your retirement savings gradually over time without requiring large changes today.
        </p>
        <p className="mt-2 text-[var(--text-secondary)]" style={{ fontSize: "0.82rem" }}>
          Automatic increases usually align with salary raises, so your take-home pay typically remains comfortable.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative flex flex-col rounded-2xl border-2 border-[var(--color-success)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-card)]">
          <span
            className="absolute -top-3 left-4 rounded-full bg-[var(--color-success)] px-3 py-0.5 text-[var(--primary-foreground)]"
            style={{ fontSize: "0.75rem", fontWeight: 600 }}
          >
            Recommended
          </span>
          <div className="mb-3 mt-1 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_18%,var(--surface-card))]">
              <TrendingUp className="h-5 w-5 text-[var(--color-success)]" />
            </div>
            <h3 className="text-[var(--text-primary)]">With Auto Increase</h3>
          </div>
          <p
            className="text-[var(--text-secondary)]"
            style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}
          >
            Estimated savings in 10 years
          </p>
          <p className="mt-1 text-[color-mix(in_srgb,var(--color-success)_55%,var(--text-primary))]" style={{ fontSize: "2rem", fontWeight: 700 }}>
            ${withAutoProjection.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col rounded-2xl border border-[var(--border-default)] bg-[var(--surface-section)] p-5 opacity-75">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-section)]">
              <Minus className="h-5 w-5 text-[var(--text-secondary)]" />
            </div>
            <h3 className="text-[var(--text-secondary)]">Without Auto Increase</h3>
          </div>
          <p
            className="text-[var(--text-secondary)]"
            style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}
          >
            Estimated savings in 10 years
          </p>
          <p className="mt-1 text-[var(--text-secondary)]" style={{ fontSize: "2rem", fontWeight: 700 }}>
            ${withoutAutoProjection.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-success)_22%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))] p-4 text-center">
        <p className="text-[color-mix(in_srgb,var(--color-success)_70%,var(--text-primary))]" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
          Automatic increases could add approximately <span style={{ fontWeight: 700 }}>${difference.toLocaleString()}</span> to your savings.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleEnable}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-success)] py-3.5 text-[var(--primary-foreground)] shadow-[var(--shadow-card)] transition-all hover:opacity-95 active:scale-[0.98]"
        >
          Enable Auto Increase <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-3.5 text-[var(--text-secondary)] transition-all hover:bg-[var(--surface-section)] active:scale-[0.98]"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}
