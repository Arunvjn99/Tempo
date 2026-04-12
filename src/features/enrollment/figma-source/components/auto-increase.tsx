import { useEnrollmentFlowNavigate } from "../enrollmentFlowNav";
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
  const navigate = useEnrollmentFlowNavigate();
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
        <button onClick={() => { setCurrentStep(3); navigate(ep("contribution-source")); }} className="flex items-center gap-1 text-[var(--text-secondary)] mb-3 hover:text-[var(--text-primary)] text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Increase your savings automatically</h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Small increases today can grow your retirement savings over time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Fixed */}
        <div className="card-standard flex flex-col p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-card)] border border-[var(--border-default)] flex items-center justify-center">
              <Minus className="w-5 h-5 text-[var(--text-secondary)]" />
            </div>
            <h3 className="text-[var(--text-primary)] text-xl font-semibold">Keep Contributions Fixed</h3>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            Your contribution stays at {data.contributionPercent}% throughout.
          </p>
          <div className="mt-4 flex-1">
            <p className="text-[var(--text-secondary)] text-xs">Projected in 10 years</p>
            <p className="text-[var(--text-primary)] text-3xl font-bold">
              ${fixedProjection.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => handleSelect(false)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-3 text-[var(--text-primary)] shadow-[var(--shadow-card)] transition-all hover:bg-[var(--surface-card)] active:scale-[0.98]"
          >
            Skip Auto Increase
          </button>
        </div>

        {/* Auto Increase - Recommended */}
        <div className="card-standard border-2 border-[var(--color-primary)] p-5 flex flex-col relative">
          <span className="absolute -top-3 left-4 bg-[var(--color-primary)] text-[var(--primary-foreground)] px-3 py-0.5 rounded-full text-xs font-semibold">
            Recommended
          </span>
          <div className="flex items-center gap-2 mb-3 mt-1">
            <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-[var(--text-primary)] text-xl font-semibold">Enable Auto Increase</h3>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            Increase by 1% each year up to 15%.
          </p>
          <div className="mt-4 flex-1">
            <p className="text-[var(--text-secondary)] text-xs">Projected in 10 years</p>
            <p className="text-[color-mix(in_srgb,var(--color-primary)_80%,var(--text-primary))] text-3xl font-bold">
              ${autoProjection.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => handleSelect(true)}
            className="w-full mt-5 bg-[var(--color-primary)] text-[var(--primary-foreground)] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all"
          >
            Enable Auto Increase <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Impact Banner */}
      <div className="bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] rounded-xl p-4 text-center">
        <p className="text-[var(--text-primary)] text-sm font-medium">
          Automatic increases could add <span className="font-bold">+${difference.toLocaleString()}</span> over 10 years.
        </p>
      </div>
    </div>
  );
}
