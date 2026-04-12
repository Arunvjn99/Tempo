import { useNavigate } from "react-router-dom";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import { ArrowRight, ArrowLeft, TrendingUp, Minus } from "lucide-react";
import {
  AUTO_INCREASE_PROJECTION_HORIZON_YEARS,
  getGrowthRate,
  projectBalanceShortHorizonFixedPercent,
  projectBalanceShortHorizonWithSteppedPercent,
} from "@/utils/retirementCalculations";

export function AutoIncrease() {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep, personalization } = useEnrollment();

  const growthRate = getGrowthRate(data.riskLevel);
  const fixedProjection = projectBalanceShortHorizonFixedPercent(
    data.salary,
    data.contributionPercent,
    growthRate,
    AUTO_INCREASE_PROJECTION_HORIZON_YEARS,
    personalization.currentSavings,
  );
  const autoProjection = projectBalanceShortHorizonWithSteppedPercent(
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
  const difference = autoProjection - fixedProjection;

  const handleSelect = (autoIncrease: boolean) => {
    updateData({ autoIncrease });
    if (autoIncrease) {
      // Navigate to setup screen to configure increase details
      navigate(ep("auto-increase-setup"));
    } else {
      navigate(ep("auto-increase-skip"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => {
            setCurrentStep(3);
            navigate(ep("contribution-source"));
          }}
          className="mb-3 flex items-center gap-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-[var(--text-primary)]">Increase your savings automatically</h1>
        <p className="mt-1 text-[var(--text-secondary)]" style={{ fontSize: "0.9rem" }}>
          Small increases today can grow your retirement savings over time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-[var(--border-enroll-subtle)] bg-[var(--surface-suggestion-muted)] p-6 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-section)]">
              <Minus className="h-5 w-5 text-[var(--text-secondary)]" />
            </div>
            <h3 className="text-[var(--text-primary)]">Keep Contributions Fixed</h3>
          </div>
          <p className="text-[var(--text-secondary)]" style={{ fontSize: "0.85rem" }}>
            Your contribution stays at {data.contributionPercent}% throughout.
          </p>
          <div className="mt-4 flex-1">
            <p className="text-[var(--text-secondary)]" style={{ fontSize: "0.75rem" }}>
              Projected in {AUTO_INCREASE_PROJECTION_HORIZON_YEARS} years
            </p>
            <div className="mt-2 rounded-xl border border-[var(--border-insight)] bg-[var(--surface-insight-well)] px-4 py-3">
              <p className="text-[var(--text-primary)] tabular-nums" style={{ fontSize: "2rem", fontWeight: 700 }}>
                ${fixedProjection.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleSelect(false)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-3 text-[var(--text-primary)] transition-all hover:bg-[var(--surface-section)] active:scale-[0.98]"
          >
            Skip Auto Increase
          </button>
        </div>

        <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-[var(--border-highlight)] bg-[var(--surface-success-soft)] p-6 shadow-elevation-lg ring-1 ring-[color-mix(in_srgb,var(--color-success)_22%,transparent)]">
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
            <h3 className="text-[var(--text-primary)]">Enable Auto Increase</h3>
          </div>
          <p className="text-[var(--text-secondary)]" style={{ fontSize: "0.85rem" }}>
            Increase by {data.autoIncreaseAmount || 1}% each year up to {data.autoIncreaseMax || 15}%.
          </p>
          <div className="mt-4 flex-1">
            <p className="text-[var(--text-secondary)]" style={{ fontSize: "0.75rem" }}>
              Projected in {AUTO_INCREASE_PROJECTION_HORIZON_YEARS} years
            </p>
            <div className="mt-2 rounded-xl border border-[var(--border-insight)] bg-[var(--surface-insight-well)] px-4 py-3">
              <p className="text-[color-mix(in_srgb,var(--color-success)_55%,var(--text-primary))] tabular-nums" style={{ fontSize: "2rem", fontWeight: 700 }}>
                ${autoProjection.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleSelect(true)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-success)] py-3 text-[var(--primary-foreground)] transition-all hover:opacity-95 active:scale-[0.98]"
          >
            Enable Auto Increase <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border-highlight)] bg-[var(--surface-insight-well)] p-4 text-center shadow-card">
        <p className="text-[var(--text-primary)]" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
          Automatic increases could add{" "}
          <span className="font-bold tabular-nums text-[color-mix(in_srgb,var(--color-success)_70%,var(--text-primary))]">
            +${difference.toLocaleString()}
          </span>{" "}
          over {AUTO_INCREASE_PROJECTION_HORIZON_YEARS} years.
        </p>
      </div>
    </div>
  );
}
