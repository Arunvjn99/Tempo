import { useEnrollmentFlowNavigate } from "../enrollmentFlowNav";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import {
  ArrowLeft,
  Edit3,
  Shield,
  DollarSign,
  Briefcase,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { getGrowthRate, projectBalanceConstantTotalAnnual } from "@/utils/retirementCalculations";

export function Review() {
  const navigate = useEnrollmentFlowNavigate();
  const { data, updateData, personalization, setCurrentStep } = useEnrollment();

  const yearsToRetirement = personalization.retirementAge - personalization.currentAge;
  const matchPercent = Math.min(data.contributionPercent, 6);
  const annualContribution = Math.round((data.salary * data.contributionPercent) / 100);
  const employerContribution = Math.round((data.salary * matchPercent) / 100);
  const totalAnnual = annualContribution + employerContribution;

  const growthRate = getGrowthRate(data.riskLevel);

  const projectedBalance = projectBalanceConstantTotalAnnual(
    personalization.currentSavings,
    totalAnnual,
    yearsToRetirement,
    growthRate,
  );

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  const riskLabels: Record<string, string> = {
    conservative: "Conservative",
    balanced: "Balanced",
    growth: "Growth",
    aggressive: "Aggressive",
  };

  // Build contribution source display
  const sourcesParts: string[] = [];
  if (data.contributionSources.preTax > 0) sourcesParts.push(`Pre-tax ${data.contributionSources.preTax}%`);
  if (data.contributionSources.roth > 0) sourcesParts.push(`Roth ${data.contributionSources.roth}%`);
  if (data.supportsAfterTax && data.contributionSources.afterTax > 0) sourcesParts.push(`After-tax ${data.contributionSources.afterTax}%`);
  const sourcesDisplay = sourcesParts.join(" / ");

  const planSections = [
    {
      label: "Plan",
      value: data.plan === "traditional" ? "Traditional 401(k)" : "Roth 401(k)",
      editStep: 1,
      editPath: "plan",
    },
    {
      label: "Contribution",
      value: `${data.contributionPercent}% ($${annualContribution.toLocaleString()}/year)`,
      editStep: 2,
      editPath: "contribution",
    },
    {
      label: "Contribution source",
      value: sourcesDisplay,
      editStep: 3,
      editPath: "contribution-source",
    },
    {
      label: "Auto increase",
      value: data.autoIncrease
        ? `+${data.autoIncreaseAmount}%/yr up to ${data.autoIncreaseMax}%`
        : "Disabled",
      editStep: 4,
      editPath: "auto-increase",
    },
    {
      label: "Investment strategy",
      value: `${riskLabels[data.riskLevel]} Portfolio`,
      editStep: 5,
      editPath: "investment",
    },
  ];

  const handleConfirm = () => {
    navigate(ep("success"));
  };

  // Confidence message
  const confidenceMessage =
    employerContribution >= annualContribution * 0.5
      ? `Your employer contributes $${employerContribution.toLocaleString()} per year to your retirement savings.`
      : `You are on track for retirement at age ${personalization.retirementAge} with your current plan setup.`;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <button
          onClick={() => {
            setCurrentStep(6);
            navigate(ep("readiness"));
          }}
          className="flex items-center gap-1 text-[var(--text-secondary)] mb-3 hover:text-[var(--text-primary)] text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Review Your Retirement Plan</h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Confirm your selections before enrolling.
        </p>
      </div>

      {/* ── Section 1: Retirement Outcome Hero ── */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[color-mix(in_srgb,var(--color-primary)_42%,var(--text-primary))] rounded-2xl p-6 text-[var(--primary-foreground)]">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--primary-foreground)]">
          Projected retirement balance
        </p>
        <p className="mt-1 tabular-nums text-4xl font-bold">
          {formatCurrency(projectedBalance)}
        </p>
        <p className="mt-0.5 text-xs text-[var(--primary-foreground)]">
          Based on your current plan setup over {yearsToRetirement} years. Past results do not guarantee future returns.
        </p>

        {/* Supporting metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-3.5 py-3 text-[var(--text-primary)]">
            <div className="mb-1 flex items-center gap-1.5">
              <DollarSign className="h-3 w-3 text-[var(--text-secondary)]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">Your contribution</span>
            </div>
            <p className="text-base font-bold">${annualContribution.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-secondary)]">per year</p>
          </div>

          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-3.5 py-3 text-[var(--text-primary)]">
            <div className="mb-1 flex items-center gap-1.5">
              <Briefcase className="h-3 w-3 text-[var(--text-secondary)]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">Employer match</span>
            </div>
            <p className="text-base font-bold">${employerContribution.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-secondary)]">per year</p>
          </div>

          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-3.5 py-3 text-[var(--text-primary)]">
            <div className="mb-1 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-[var(--text-secondary)]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">Expected growth</span>
            </div>
            <p className="text-base font-bold">~{(growthRate * 100).toFixed(1)}%</p>
            <p className="text-xs text-[var(--text-secondary)]">
              annual ({riskLabels[data.riskLevel].toLowerCase()})
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-3.5 py-3 text-[var(--text-primary)]">
            <div className="mb-1 flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-[var(--text-secondary)]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">Time horizon</span>
            </div>
            <p className="text-base font-bold">{yearsToRetirement} years</p>
            <p className="text-xs text-[var(--text-secondary)]">retire at age {personalization.retirementAge}</p>
          </div>
        </div>
      </div>

      {/* ── Section 2: Plan Summary Grid ── */}
      <div>
        <p className="text-[var(--text-primary)] mb-3 text-base font-semibold">
          Your Plan Setup
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {planSections.map((section) => (
            <div
              key={section.label}
              className="group flex flex-col justify-between rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-3.5"
            >
              <div>
                <p
                  className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wide"
                >
                  {section.label}
                </p>
                <p className="text-[var(--text-primary)] mt-1 text-sm font-medium">
                  {section.value}
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentStep(section.editStep);
                  navigate(ep(section.editPath));
                }}
                className="mt-2.5 flex items-center gap-1 self-start text-xs font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary)]/90"
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Confidence Reinforcement ── */}
      <div className="bg-[color-mix(in_srgb,var(--text-secondary)_12%,var(--surface-card))] border border-[var(--border-default)] rounded-xl px-5 py-3.5 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
        <p className="text-[var(--text-primary)] text-sm font-medium">
          {confidenceMessage}
        </p>
      </div>

      {/* ── Section 4: Final Confirmation ── */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="mt-0.5">
            <input
              type="checkbox"
              checked={data.agreedToTerms}
              onChange={(e) => updateData({ agreedToTerms: e.target.checked })}
              className="h-5 w-5 rounded border-[var(--border-default)] text-[var(--color-primary)] accent-[var(--color-primary)]"
            />
          </div>
          <span className="text-[var(--text-primary)] text-sm">
            I confirm my retirement plan enrollment and understand my contributions will begin next
            pay period.{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-0.5 font-medium text-[var(--color-primary)] hover:text-[var(--color-primary)]/90"
            >
              View full plan terms <ExternalLink className="w-3 h-3" />
            </a>
          </span>
        </label>
      </div>

      {/* ── Primary Action ── */}
      <div className="sticky bottom-4 md:static">
        <button
          onClick={handleConfirm}
          disabled={!data.agreedToTerms}
          className={`w-full py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all   ${
            data.agreedToTerms
              ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
              : "bg-[var(--surface-section)] text-[var(--text-secondary)] cursor-not-allowed"
          }`}
        >
          <Shield className="w-4 h-4" /> Enroll in Retirement Plan
        </button>
      </div>
    </div>
  );
}
