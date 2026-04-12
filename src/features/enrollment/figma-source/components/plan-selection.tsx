import { useEnrollmentFlowNavigate } from "../enrollmentFlowNav";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import { Check, Sparkles, ArrowRight, MessageCircle, Info, Landmark, HelpCircle } from "lucide-react";
import { useState } from "react";

export function PlanSelection() {
  const navigate = useEnrollmentFlowNavigate();
  const { data, updateData, setCurrentStep } = useEnrollment();
  const [showAI, setShowAI] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"traditional" | "roth" | null>(data.plan);
  const [showTooltip, setShowTooltip] = useState(false);

  const confirmPlan = (plan: "traditional" | "roth") => {
    updateData({ plan });
    setCurrentStep(2);
    navigate(ep("contribution"));
  };

  const handleCardClick = (plan: "traditional" | "roth") => {
    setSelectedPlan(plan);
  };

  const hasTwoPlans = data.companyPlans.length >= 2;

  // ─── Single plan case ───
  if (!hasTwoPlans) {
    const onlyPlan = data.companyPlans[0] || "traditional";
    const planLabel = onlyPlan === "traditional" ? "Traditional 401(k)" : "Roth 401(k)";

    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="card-standard max-w-md w-full space-y-5 p-6 text-center sm:p-8">
          <div className="w-14 h-14 rounded-2xl bg-[color-mix(in_srgb,var(--color-primary)_15%,var(--surface-card))] flex items-center justify-center mx-auto">
            <Landmark className="w-7 h-7 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Your employer offers a {planLabel} retirement plan</h2>
            <p className="text-[var(--text-secondary)] mt-2 text-sm">
              {onlyPlan === "traditional"
                ? "This plan allows tax-deferred retirement savings. Your contributions reduce your taxable income today."
                : "This plan allows you to contribute after-tax dollars and withdraw tax-free in retirement."}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-3 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-[var(--color-primary)]" />
            <p className="text-left text-xs text-[var(--text-primary)]">
              Your employer matches contributions up to 6%.
            </p>
          </div>

          <button
            onClick={() => confirmPlan(onlyPlan)}
            className="w-full bg-[var(--color-primary)] text-[var(--primary-foreground)] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all"
          >
            Continue to Contributions <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[var(--text-secondary)] text-xs">
            You can change this plan later from your account settings.
          </p>
        </div>
      </div>
    );
  }

  // ─── Two plans case ───
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Choose Your Retirement Plan</h1>
        <p className="mt-1 text-base text-[var(--text-secondary)]">
          Select the retirement plan that fits your tax strategy.
        </p>
      </div>

      {/* Employer match context banner — lighter, smaller */}
      <div className="bg-[var(--surface-card)] border border-[var(--border-default)]  rounded-xl px-4 py-2.5 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
        <p className="text-[var(--text-secondary)] text-xs">
          Your employer matches contributions up to <strong>6%</strong> of your salary — that's free money toward your retirement.
        </p>
      </div>

      {/* Plan cards — equal height via flex */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* ─── Traditional 401(k) ─── */}
        <div
          onClick={() => handleCardClick("traditional")}
          className={`rounded-2xl p-5 text-left transition-all cursor-pointer flex flex-col ${
            selectedPlan === "traditional"
              ? "border-2 border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]  ring-2 ring-[var(--color-primary)]/20"
              : "border border-[var(--border-default)] bg-[var(--surface-card)]   hover:border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))]"
          }`}
        >
          {/* Badge — inside card header */}
          <div className="relative mb-1">
            <span
              className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-section)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-primary)]"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Most Common Choice
              <HelpCircle className="w-3 h-3 opacity-70" />
            </span>

            {showTooltip && (
              <div
                className="absolute top-full left-0 z-10 mt-1 whitespace-nowrap rounded-lg bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] px-3 py-2 text-[var(--surface-page)]  text-xs"
              >
                Chosen by most employees because it reduces taxable income today.
                <div className="absolute left-6 top-0 h-2 w-2 -translate-y-1/2 rotate-45 bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)]" />
              </div>
            )}
          </div>

          {/* Plan title */}
          <h3 className="text-[var(--text-primary)] text-xl font-semibold">Traditional 401(k)</h3>

          {/* Short description */}
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Lower taxes today and grow savings tax-deferred.
          </p>

          {/* Benefits list */}
          <ul className="mt-4 space-y-2 flex-1">
            {["Lower taxable income today", "Employer match eligible", "Tax-deferred growth"].map((b) => (
              <li key={b} className="flex items-start gap-2 text-[var(--text-primary)] text-sm">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-primary)]" />
                {b}
              </li>
            ))}
          </ul>

          {/* Primary CTA — at bottom */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              confirmPlan("traditional");
            }}
            className="w-full mt-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-primary-hover)]"
          >
            Continue with Traditional 401(k) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Roth 401(k) ─── */}
        <div
          onClick={() => handleCardClick("roth")}
          className={`rounded-2xl p-5 text-left transition-all cursor-pointer flex flex-col ${
            selectedPlan === "roth"
              ? "border-2 border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]  ring-2 ring-[var(--color-primary)]/20"
              : "border border-[var(--border-default)] bg-[var(--surface-card)]   hover:border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))]"
          }`}
        >
          {/* Plan title */}
          <h3 className="text-[var(--text-primary)] text-xl font-semibold">Roth 401(k)</h3>

          {/* Short description */}
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Pay taxes now and withdraw tax-free in retirement.
          </p>

          {/* Benefits list */}
          <ul className="mt-4 space-y-2 flex-1">
            {["Tax-free withdrawals in retirement", "Flexible retirement income", "No required minimum distributions"].map((b) => (
              <li key={b} className="flex items-start gap-2 text-[var(--text-primary)] text-sm">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-primary)]" />
                {b}
              </li>
            ))}
          </ul>

          {/* Primary CTA — at bottom */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              confirmPlan("roth");
            }}
            className={`w-full mt-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              selectedPlan === "roth"
                ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-primary-hover)]"
                : "bg-[var(--surface-card)] text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
            }`}
          >
            Choose Roth 401(k) <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reassurance message */}
      <p className="text-center text-[var(--text-secondary)] text-xs">
        You can change this plan later from your account settings.
      </p>

      {/* Divider */}
      <div className="border-t border-[var(--border-default)] pt-2" />

      {/* ─── AI Help Section ─── */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-card)]">
        <p className="text-[var(--text-primary)] font-medium">Not sure which plan is right for you?</p>
        <p className="text-[var(--text-secondary)] mt-1 text-xs">
          Our AI assistant can help explain the differences.
        </p>
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => { setShowAI(!showAI); setShowCompare(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors text-sm ${
              showAI
                ? "bg-[color-mix(in_srgb,var(--color-primary)_24%,var(--surface-card))] text-[var(--text-primary)]"
                : "bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] text-[color-mix(in_srgb,var(--color-primary)_72%,var(--text-primary))] hover:bg-[color-mix(in_srgb,var(--color-primary)_16%,var(--surface-card))]"
            }`}
          >
            <Sparkles className="w-4 h-4" /> Ask AI
          </button>
          <button
            onClick={() => { setShowCompare(!showCompare); setShowAI(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors text-sm ${
              showCompare
                ? "bg-[var(--surface-section)] text-[var(--text-primary)]"
                : "bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-card)] border border-[var(--border-default)]"
            }`}
          >
            <MessageCircle className="w-4 h-4" /> Compare Plans
          </button>
        </div>

        {showAI && (
          <div className="mt-4 p-4 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))]">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)] mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="text-[var(--text-primary)] font-semibold">AI Recommendation</p>
                <p className="text-[color-mix(in_srgb,var(--color-primary)_72%,var(--text-primary))] mt-1">
                  <strong>Traditional 401(k)</strong> is ideal if you expect to be in a lower tax
                  bracket in retirement — your contributions reduce your taxable income now.{" "}
                  <strong>Roth 401(k)</strong> is better if you expect higher income later — you
                  pay taxes now but withdraw tax-free. Most employees benefit from the Traditional
                  plan due to the immediate tax savings and employer match.
                </p>
              </div>
            </div>
          </div>
        )}

        {showCompare && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-default)]">
                  <th className="text-left py-2 text-[var(--text-secondary)] font-medium">Feature</th>
                  <th className="text-left py-2 text-[var(--text-primary)] font-semibold">Traditional</th>
                  <th className="text-left py-2 text-[var(--text-primary)] font-semibold">Roth</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-primary)]">
                <tr className="border-b border-[var(--border-default)]">
                  <td className="py-2 text-[var(--text-secondary)]">Contributions</td>
                  <td className="py-2">Pre-tax</td>
                  <td className="py-2">After-tax</td>
                </tr>
                <tr className="border-b border-[var(--border-default)]">
                  <td className="py-2 text-[var(--text-secondary)]">Withdrawals</td>
                  <td className="py-2">Taxed</td>
                  <td className="py-2">Tax-free</td>
                </tr>
                <tr className="border-b border-[var(--border-default)]">
                  <td className="py-2 text-[var(--text-secondary)]">Tax benefit</td>
                  <td className="py-2">Now</td>
                  <td className="py-2">In retirement</td>
                </tr>
                <tr className="border-b border-[var(--border-default)]">
                  <td className="py-2 text-[var(--text-secondary)]">RMDs</td>
                  <td className="py-2">Required</td>
                  <td className="py-2">None</td>
                </tr>
                <tr>
                  <td className="py-2 text-[var(--text-secondary)]">Best for</td>
                  <td className="py-2">Higher tax bracket now</td>
                  <td className="py-2">Higher tax bracket later</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
