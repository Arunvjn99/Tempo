// ─────────────────────────────────────────────
// ReviewPage — Pixel-perfect Figma rebuild
// ─────────────────────────────────────────────

import {
  ArrowLeft,
  Briefcase,
  Clock,
  DollarSign,
  Edit3,
  ExternalLink,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEnrollmentStore, useEnrollmentDerived } from "../store";
import { formatCurrency } from "../store/derived";
import type { EnrollmentStepId } from "../store/types";

export function ReviewPage() {
  const enrollment = useEnrollmentStore((s) => s.enrollment);
  const personalization = useEnrollmentStore((s) => s.personalization);
  const updateEnrollment = useEnrollmentStore((s) => s.updateEnrollment);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);
  const goToStep = useEnrollmentStore((s) => s.goToStep);
  const derived = useEnrollmentDerived();

  const edit = (step: EnrollmentStepId) => goToStep(step);

  const matchRate = Math.min(enrollment.contributionPercent, 6);
  const annualContribution = Math.round((enrollment.salary * enrollment.contributionPercent) / 100);
  const annualMatch = Math.round((enrollment.salary * matchRate) / 100);
  const growthRatePct = (derived.growthRate * 100).toFixed(1);

  const riskLabel =
    enrollment.riskLevel.charAt(0).toUpperCase() + enrollment.riskLevel.slice(1);

  // Build contribution source display
  const sourcesParts: string[] = [];
  if (enrollment.contributionSources.preTax > 0)
    sourcesParts.push(`Pre-tax ${enrollment.contributionSources.preTax}%`);
  if (enrollment.contributionSources.roth > 0)
    sourcesParts.push(`Roth ${enrollment.contributionSources.roth}%`);
  if (enrollment.supportsAfterTax && enrollment.contributionSources.afterTax > 0)
    sourcesParts.push(`After-tax ${enrollment.contributionSources.afterTax}%`);
  const sourcesDisplay = sourcesParts.join(" / ") || "—";

  const planSections: { label: string; value: string; step: EnrollmentStepId }[] = [
    {
      label: "Plan",
      value: enrollment.plan === "traditional" ? "Traditional 401(k)" : "Roth 401(k)",
      step: "plan",
    },
    {
      label: "Contribution",
      value: `${enrollment.contributionPercent}% ($${annualContribution.toLocaleString()}/yr)`,
      step: "contribution",
    },
    {
      label: "Contribution source",
      value: sourcesDisplay,
      step: "contribution-source",
    },
    {
      label: "Auto-increase",
      value: enrollment.autoIncrease
        ? `+${enrollment.autoIncreaseAmount}%/yr up to ${enrollment.autoIncreaseMax}%`
        : "Disabled",
      step: "auto-increase",
    },
    {
      label: "Investment strategy",
      value: `${riskLabel} Portfolio`,
      step: "investment",
    },
  ];

  const confidenceMessage =
    annualMatch >= annualContribution * 0.5
      ? `Your employer contributes ${formatCurrency(annualMatch)} per year to your retirement savings.`
      : `You are on track for retirement at age ${personalization.retirementAge} with your current plan setup.`;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={prevStep}
          className="mb-3 inline-flex items-center gap-1 text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </button>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Review Your Retirement Plan
        </h1>
        <p className="mt-1 text-[0.9rem] text-muted-foreground">
          Confirm your selections before enrolling.
        </p>
      </div>

      {/* ── Gradient Hero Card ── */}
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
        <p className="text-[0.75rem] font-medium uppercase tracking-[0.05em] opacity-80">
          Projected retirement balance
        </p>
        <p className="mt-1 text-[2.6rem] font-bold tabular-nums leading-none">
          {formatCurrency(derived.projectedBalance)}
        </p>
        <p className="mt-0.5 text-[0.75rem] opacity-70">
          Based on your current plan setup over {derived.yearsToRetirement} years. Past results do
          not guarantee future returns.
        </p>

        {/* Supporting metrics */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl bg-white/10 px-3.5 py-3 backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-1.5">
              <DollarSign className="h-3 w-3 opacity-70" aria-hidden />
              <span className="text-[0.62rem] font-medium opacity-70">Your contribution</span>
            </div>
            <p className="text-[1.05rem] font-bold">${annualContribution.toLocaleString()}</p>
            <p className="text-[0.6rem] opacity-70">per year</p>
          </div>

          <div className="rounded-xl bg-white/10 px-3.5 py-3 backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-1.5">
              <Briefcase className="h-3 w-3 opacity-70" aria-hidden />
              <span className="text-[0.62rem] font-medium opacity-70">Employer match</span>
            </div>
            <p className="text-[1.05rem] font-bold">${annualMatch.toLocaleString()}</p>
            <p className="text-[0.6rem] opacity-70">per year</p>
          </div>

          <div className="rounded-xl bg-white/10 px-3.5 py-3 backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 opacity-70" aria-hidden />
              <span className="text-[0.62rem] font-medium opacity-70">Expected growth</span>
            </div>
            <p className="text-[1.05rem] font-bold">~{growthRatePct}%</p>
            <p className="text-[0.6rem] opacity-70">annual ({riskLabel.toLowerCase()})</p>
          </div>

          <div className="rounded-xl bg-white/10 px-3.5 py-3 backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-1.5">
              <Clock className="h-3 w-3 opacity-70" aria-hidden />
              <span className="text-[0.62rem] font-medium opacity-70">Time horizon</span>
            </div>
            <p className="text-[1.05rem] font-bold">{derived.yearsToRetirement} years</p>
            <p className="text-[0.6rem] opacity-70">
              retire at age {personalization.retirementAge}
            </p>
          </div>
        </div>
      </div>

      {/* ── Plan Summary Grid ── */}
      <div>
        <p className="mb-3 text-[0.95rem] font-semibold text-foreground">Your Plan Setup</p>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          {planSections.map((section) => (
            <div
              key={section.label}
              className="flex flex-col justify-between rounded-xl border border-border bg-card px-4 py-3.5"
            >
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                  {section.label}
                </p>
                <p className="mt-1 text-[0.82rem] font-medium text-foreground">{section.value}</p>
              </div>
              <button
                type="button"
                onClick={() => edit(section.step)}
                className="mt-2.5 inline-flex items-center gap-1 self-start text-[0.7rem] font-medium text-primary transition-colors hover:opacity-70"
              >
                <Edit3 className="h-3 w-3" aria-hidden />
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Confidence Reinforcement Banner ── */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
        <p className="text-[0.82rem] font-medium text-amber-800 dark:text-amber-200">
          {confidenceMessage}
        </p>
      </div>

      {/* ── Terms Checkbox ── */}
      <div className="rounded-xl border border-border bg-card p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <div className="mt-0.5">
            <input
              type="checkbox"
              checked={enrollment.agreedToTerms}
              onChange={(e) => updateEnrollment({ agreedToTerms: e.target.checked })}
              className="h-5 w-5 cursor-pointer rounded border-border text-primary accent-primary"
            />
          </div>
          <span className="text-[0.82rem] text-foreground">
            I confirm my retirement plan enrollment and understand my contributions will begin next
            pay period.{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-0.5 font-medium text-primary hover:opacity-80"
            >
              View full plan terms <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </span>
        </label>
      </div>

      {/* ── Primary CTA ── */}
      <div className="sticky bottom-4 md:static">
        <button
          type="button"
          onClick={nextStep}
          disabled={!enrollment.agreedToTerms}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 px-8 text-[0.9rem] font-semibold transition-all shadow-lg md:shadow-none disabled:cursor-not-allowed disabled:opacity-40 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] disabled:hover:opacity-40"
        >
          <Shield className="h-4 w-4" aria-hidden />
          Enroll in Retirement Plan
        </button>
      </div>
    </div>
  );
}
