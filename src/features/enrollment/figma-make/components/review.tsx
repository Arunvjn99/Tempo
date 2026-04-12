import { useNavigate } from "react-router-dom";
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
import { computeReadinessScore } from "../../store/derived";

export function Review() {
  const navigate = useNavigate();
  const { data, updateData, personalization, setCurrentStep } = useEnrollment();

  const yearsToRetirement = personalization.retirementAge - personalization.currentAge;
  const readinessScore = computeReadinessScore({
    contributionPercent: data.contributionPercent,
    autoIncrease: data.autoIncrease,
    yearsToRetirement,
    currentSavings: personalization.currentSavings,
    riskLevel: data.riskLevel,
  });
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
      editPath: "plan" as const,
    },
    {
      label: "Contribution",
      value: `${data.contributionPercent}% ($${annualContribution.toLocaleString()}/year)`,
      editStep: 2,
      editPath: "contribution" as const,
    },
    {
      label: "Contribution source",
      value: sourcesDisplay,
      editStep: 3,
      editPath: "contribution-source" as const,
    },
    {
      label: "Auto increase",
      value: data.autoIncrease
        ? `+${data.autoIncreaseAmount}%/yr up to ${data.autoIncreaseMax}%`
        : "Disabled",
      editStep: 4,
      editPath: "auto-increase" as const,
    },
    {
      label: "Investment strategy",
      value: `${riskLabels[data.riskLevel]} Portfolio`,
      editStep: 5,
      editPath: "investment" as const,
    },
    {
      label: "Readiness",
      value: `Score ${readinessScore} / 100`,
      editStep: 6,
      editPath: "readiness" as const,
    },
  ];

  const handleConfirm = () => {
    navigate(ep("success"));
  };

  const confidenceMessage =
    employerContribution >= annualContribution * 0.5
      ? `Your employer contributes $${employerContribution.toLocaleString()} per year to your retirement savings.`
      : `You are on track for retirement at age ${personalization.retirementAge} with your current plan setup.`;

  const heroSubtle = "color-mix(in srgb, var(--primary-foreground) 72%, transparent)";

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <button
          type="button"
          onClick={() => {
            setCurrentStep(6);
            navigate(ep("readiness"));
          }}
          className="mb-3 flex items-center gap-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-[var(--text-primary)]">Review Your Retirement Plan</h1>
        <p className="mt-1 text-[var(--text-secondary)]" style={{ fontSize: "0.9rem" }}>
          Confirm your selections before enrolling.
        </p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[color-mix(in_srgb,var(--color-primary)_42%,var(--text-primary))] p-6 text-[var(--primary-foreground)]">
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: heroSubtle,
          }}
        >
          Projected retirement balance
        </p>
        <p className="mt-1 tabular-nums" style={{ fontSize: "2.6rem", fontWeight: 700 }}>
          {formatCurrency(projectedBalance)}
        </p>
        <p className="mt-0.5" style={{ fontSize: "0.75rem", color: heroSubtle }}>
          Based on your current plan setup over {yearsToRetirement} years. Past results do not guarantee future returns.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl bg-[color-mix(in_srgb,var(--surface-card)_18%,transparent)] px-3.5 py-3 backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-1.5">
              <DollarSign className="h-3 w-3" style={{ color: heroSubtle }} />
              <span style={{ fontSize: "0.62rem", fontWeight: 500, color: heroSubtle }}>Your contribution</span>
            </div>
            <p style={{ fontSize: "1.05rem", fontWeight: 700 }}>${annualContribution.toLocaleString()}</p>
            <p style={{ fontSize: "0.6rem", color: heroSubtle }}>per year</p>
          </div>

          <div className="rounded-xl bg-[color-mix(in_srgb,var(--surface-card)_18%,transparent)] px-3.5 py-3 backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-1.5">
              <Briefcase className="h-3 w-3" style={{ color: heroSubtle }} />
              <span style={{ fontSize: "0.62rem", fontWeight: 500, color: heroSubtle }}>Employer match</span>
            </div>
            <p style={{ fontSize: "1.05rem", fontWeight: 700 }}>${employerContribution.toLocaleString()}</p>
            <p style={{ fontSize: "0.6rem", color: heroSubtle }}>per year</p>
          </div>

          <div className="rounded-xl bg-[color-mix(in_srgb,var(--surface-card)_18%,transparent)] px-3.5 py-3 backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" style={{ color: heroSubtle }} />
              <span style={{ fontSize: "0.62rem", fontWeight: 500, color: heroSubtle }}>Expected growth</span>
            </div>
            <p style={{ fontSize: "1.05rem", fontWeight: 700 }}>~{(growthRate * 100).toFixed(1)}%</p>
            <p style={{ fontSize: "0.6rem", color: heroSubtle }}>
              annual ({riskLabels[data.riskLevel].toLowerCase()})
            </p>
          </div>

          <div className="rounded-xl bg-[color-mix(in_srgb,var(--surface-card)_18%,transparent)] px-3.5 py-3 backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-1.5">
              <Clock className="h-3 w-3" style={{ color: heroSubtle }} />
              <span style={{ fontSize: "0.62rem", fontWeight: 500, color: heroSubtle }}>Time horizon</span>
            </div>
            <p style={{ fontSize: "1.05rem", fontWeight: 700 }}>{yearsToRetirement} years</p>
            <p style={{ fontSize: "0.6rem", color: heroSubtle }}>retire at age {personalization.retirementAge}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[var(--text-primary)]" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
          Your Plan Setup
        </p>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          {planSections.map((section) => (
            <div
              key={section.label}
              className="group flex flex-col justify-between rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-3.5"
            >
              <div>
                <p
                  className="text-[var(--text-secondary)]"
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {section.label}
                </p>
                <p className="mt-1 text-[var(--text-primary)]" style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                  {section.value}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(section.editStep);
                  navigate(ep(section.editPath));
                }}
                className="mt-2.5 flex items-center gap-1 self-start text-[var(--color-primary)] transition-colors hover:opacity-90"
                style={{ fontSize: "0.7rem", fontWeight: 500 }}
              >
                <Edit3 className="h-3 w-3" />
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[color-mix(in_srgb,var(--color-warning)_28%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-warning)_12%,var(--surface-card))] px-5 py-3.5">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-warning)]" />
        <p className="text-[color-mix(in_srgb,var(--color-warning)_75%,var(--text-primary))]" style={{ fontSize: "0.82rem", fontWeight: 500 }}>
          {confidenceMessage}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <div className="mt-0.5">
            <input
              type="checkbox"
              checked={data.agreedToTerms}
              onChange={(e) => updateData({ agreedToTerms: e.target.checked })}
              className="h-5 w-5 rounded border-[var(--border-default)] accent-[var(--color-primary)]"
            />
          </div>
          <span className="text-[var(--text-primary)]" style={{ fontSize: "0.82rem" }}>
            I confirm my retirement plan enrollment and understand my contributions will begin next pay period.{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-0.5 text-[var(--color-primary)] hover:opacity-90"
              style={{ fontWeight: 500 }}
            >
              View full plan terms <ExternalLink className="h-3 w-3" />
            </a>
          </span>
        </label>
      </div>

      <div className="sticky bottom-4 md:static">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!data.agreedToTerms}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 transition-all md:shadow-none ${
            data.agreedToTerms
              ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)] hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
              : "cursor-not-allowed bg-[var(--surface-section)] text-[var(--text-secondary)]"
          }`}
        >
          <Shield className="h-4 w-4" /> Enroll in Retirement Plan
        </button>
      </div>
    </div>
  );
}
