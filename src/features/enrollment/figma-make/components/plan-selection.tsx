import { useNavigate } from "react-router-dom";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import { Check, Sparkles, ArrowRight, MessageCircle, Info, Landmark, HelpCircle } from "lucide-react";
import { useState } from "react";

/**
 * UI structure and hierarchy from Figma Make export
 * `Final _Satish Implement User Flow (Copy) 2` — `src/app/components/plan-selection.tsx`.
 * Colors mapped to theme tokens (no raw hex in JSX).
 */
export function PlanSelection() {
  const navigate = useNavigate();
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

  if (!hasTwoPlans) {
    const onlyPlan = data.companyPlans[0] || "traditional";
    const planLabel = onlyPlan === "traditional" ? "Traditional 401(k)" : "Roth 401(k)";

    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="w-full max-w-md space-y-5 rounded-3xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 text-center shadow-[var(--shadow-lg)] sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))]">
            <Landmark className="h-7 w-7 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-[var(--text-primary)]">Your employer offers a {planLabel} retirement plan</h2>
            <p className="mt-2 text-[0.85rem] text-[var(--text-secondary)]">
              {onlyPlan === "traditional"
                ? "This plan allows tax-deferred retirement savings. Your contributions reduce your taxable income today."
                : "This plan allows you to contribute after-tax dollars and withdraw tax-free in retirement."}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--color-success)_22%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))] p-3">
            <Info className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
            <p className="text-left text-[0.8rem] text-[color-mix(in_srgb,var(--color-success)_35%,var(--text-primary))]">
              Your employer matches contributions up to 6%.
            </p>
          </div>

          <button
            type="button"
            onClick={() => confirmPlan(onlyPlan)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-[var(--primary-foreground)] transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
          >
            Continue to Contributions <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-[0.75rem] text-[var(--text-secondary)]">
            You can change this plan later from your account settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center md:text-left">
        <h1 className="text-[var(--text-primary)]">Choose Your Retirement Plan</h1>
        <p className="mt-1 text-[0.9rem] text-[var(--text-secondary)]">
          Select the retirement plan that fits your tax strategy.
        </p>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-[color-mix(in_srgb,var(--border-default)_55%,var(--surface-section))] bg-[var(--surface-section)] px-4 py-2.5">
        <Info className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
        <p className="text-[0.8rem] text-[color-mix(in_srgb,var(--text-secondary)_85%,var(--text-primary))]">
          Your employer matches contributions up to <strong>6%</strong> of your salary — that's free money toward your
          retirement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick("traditional")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCardClick("traditional");
            }
          }}
          className={`flex cursor-pointer flex-col rounded-2xl p-5 text-left transition-all ${
            selectedPlan === "traditional"
              ? "border-2 border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] shadow-[var(--shadow-md)] ring-2 ring-[color-mix(in_srgb,var(--color-primary)_18%,var(--surface-card))]"
              : "border border-[var(--border-default)] bg-[var(--surface-card)] shadow-[var(--shadow-card)] hover:border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] hover:shadow-[var(--shadow-md)]"
          }`}
        >
          <div className="relative mb-1">
            <span
              className="inline-flex items-center gap-1 rounded-full bg-[var(--color-warning-light)] px-2.5 py-0.5 text-[color-mix(in_srgb,var(--color-warning)_70%,var(--text-primary))]"
              style={{ fontSize: "0.7rem", fontWeight: 600 }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Most Common Choice
              <HelpCircle className="h-3 w-3 opacity-70" />
            </span>

            {showTooltip && (
              <div
                className="absolute left-0 top-full z-10 mt-1 whitespace-nowrap rounded-lg bg-[var(--text-primary)] px-3 py-2 text-[var(--surface-page)] shadow-[var(--shadow-md)]"
                style={{ fontSize: "0.75rem" }}
              >
                Chosen by most employees because it reduces taxable income today.
                <div className="absolute left-6 top-0 h-2 w-2 -translate-y-1/2 rotate-45 bg-[var(--text-primary)]" />
              </div>
            )}
          </div>

          <h3 className="text-[var(--text-primary)]">Traditional 401(k)</h3>

          <p className="mt-1 text-[0.85rem] text-[var(--text-secondary)]">
            Lower taxes today and grow savings tax-deferred.
          </p>

          <ul className="mt-4 flex-1 space-y-2">
            {["Lower taxable income today", "Employer match eligible", "Tax-deferred growth"].map((b) => (
              <li key={b} className="flex items-start gap-2 text-[0.85rem] text-[color-mix(in_srgb,var(--text-secondary)_35%,var(--text-primary))]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                {b}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              confirmPlan("traditional");
            }}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3 text-[var(--primary-foreground)] transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
          >
            Continue with Traditional 401(k) <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick("roth")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCardClick("roth");
            }
          }}
          className={`flex cursor-pointer flex-col rounded-2xl p-5 text-left transition-all ${
            selectedPlan === "roth"
              ? "border-2 border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] shadow-[var(--shadow-md)] ring-2 ring-[color-mix(in_srgb,var(--color-primary)_18%,var(--surface-card))]"
              : "border border-[var(--border-default)] bg-[var(--surface-card)] shadow-[var(--shadow-card)] hover:border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] hover:shadow-[var(--shadow-md)]"
          }`}
        >
          <h3 className="text-[var(--text-primary)]">Roth 401(k)</h3>

          <p className="mt-1 text-[0.85rem] text-[var(--text-secondary)]">
            Pay taxes now and withdraw tax-free in retirement.
          </p>

          <ul className="mt-4 flex-1 space-y-2">
            {["Tax-free withdrawals in retirement", "Flexible retirement income", "No required minimum distributions"].map((b) => (
              <li key={b} className="flex items-start gap-2 text-[0.85rem] text-[color-mix(in_srgb,var(--text-secondary)_35%,var(--text-primary))]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                {b}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              confirmPlan("roth");
            }}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 transition-all active:scale-[0.98] ${
              selectedPlan === "roth"
                ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-primary-hover)]"
                : "border border-[var(--color-primary)] bg-[var(--surface-card)] text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--surface-card))]"
            }`}
          >
            Choose Roth 401(k) <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-center text-[0.8rem] text-[var(--text-secondary)]">
        You can change this plan later from your account settings.
      </p>

      <div className="border-t border-[color-mix(in_srgb,var(--border-default)_55%,var(--surface-section))] pt-2" />

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-section)] p-5">
        <p className="text-[var(--text-primary)]" style={{ fontWeight: 500 }}>
          Not sure which plan is right for you?
        </p>
        <p className="mt-1 text-[0.8rem] text-[var(--text-secondary)]">
          Our AI assistant can help explain the differences.
        </p>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={() => {
              setShowAI(!showAI);
              setShowCompare(false);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors ${
              showAI
                ? "bg-[color-mix(in_srgb,var(--color-purple)_28%,var(--surface-section))] text-[color-mix(in_srgb,var(--color-purple)_88%,var(--text-primary))]"
                : "bg-[var(--color-purple-soft)] text-[color-mix(in_srgb,var(--color-purple)_72%,var(--text-primary))] hover:bg-[var(--color-purple-muted)]"
            }`}
            style={{ fontSize: "0.85rem" }}
          >
            <Sparkles className="h-4 w-4" /> Ask AI
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCompare(!showCompare);
              setShowAI(false);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors ${
              showCompare
                ? "bg-[color-mix(in_srgb,var(--border-default)_45%,var(--surface-section))] text-[var(--text-primary)]"
                : "border border-[var(--border-default)] bg-[var(--surface-card)] text-[color-mix(in_srgb,var(--text-secondary)_45%,var(--text-primary))] hover:bg-[var(--surface-section)]"
            }`}
            style={{ fontSize: "0.85rem" }}
          >
            <MessageCircle className="h-4 w-4" /> Compare Plans
          </button>
        </div>

        {showAI && (
          <div className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--color-purple)_22%,var(--border-default))] bg-[var(--color-purple-soft)] p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-purple)]" />
              <div style={{ fontSize: "0.85rem" }}>
                <p className="text-[color-mix(in_srgb,var(--color-purple)_88%,var(--text-primary))]" style={{ fontWeight: 600 }}>
                  AI Recommendation
                </p>
                <p className="mt-1 text-[color-mix(in_srgb,var(--color-purple)_65%,var(--text-primary))]">
                  <strong>Traditional 401(k)</strong> is ideal if you expect to be in a lower tax bracket in retirement — your
                  contributions reduce your taxable income now. <strong>Roth 401(k)</strong> is better if you expect higher
                  income later — you pay taxes now but withdraw tax-free. Most employees benefit from the Traditional plan due
                  to the immediate tax savings and employer match.
                </p>
              </div>
            </div>
          </div>
        )}

        {showCompare && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full" style={{ fontSize: "0.85rem" }}>
              <thead>
                <tr className="border-b border-[var(--border-default)]">
                  <th className="py-2 text-left text-[var(--text-secondary)]" style={{ fontWeight: 500 }}>
                    Feature
                  </th>
                  <th className="py-2 text-left font-semibold text-[var(--text-primary)]">Traditional</th>
                  <th className="py-2 text-left font-semibold text-[var(--text-primary)]">Roth</th>
                </tr>
              </thead>
              <tbody className="text-[color-mix(in_srgb,var(--text-secondary)_35%,var(--text-primary))]">
                <tr className="border-b border-[color-mix(in_srgb,var(--border-default)_55%,var(--surface-section))]">
                  <td className="py-2 text-[var(--text-secondary)]">Contributions</td>
                  <td className="py-2">Pre-tax</td>
                  <td className="py-2">After-tax</td>
                </tr>
                <tr className="border-b border-[color-mix(in_srgb,var(--border-default)_55%,var(--surface-section))]">
                  <td className="py-2 text-[var(--text-secondary)]">Withdrawals</td>
                  <td className="py-2">Taxed</td>
                  <td className="py-2">Tax-free</td>
                </tr>
                <tr className="border-b border-[color-mix(in_srgb,var(--border-default)_55%,var(--surface-section))]">
                  <td className="py-2 text-[var(--text-secondary)]">Tax benefit</td>
                  <td className="py-2">Now</td>
                  <td className="py-2">In retirement</td>
                </tr>
                <tr className="border-b border-[color-mix(in_srgb,var(--border-default)_55%,var(--surface-section))]">
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
