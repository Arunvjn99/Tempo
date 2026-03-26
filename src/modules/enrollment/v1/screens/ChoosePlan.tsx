import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  HelpCircle,
  Landmark,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { pathForWizardStep } from "../flow/v1WizardPaths";
import type { SelectedPlanOption } from "../store/useEnrollmentStore";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { cn } from "@/lib/utils";
import { AIButton } from "@/components/ui/AIButton";

export function ChoosePlan() {
  const navigate = useNavigate();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const nextStep = useEnrollmentStore((s) => s.nextStep);

  const [showAI, setShowAI] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlanOption | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const traditionalOptRef = useRef<HTMLDivElement>(null);
  const rothOptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedPlan(data.selectedPlan);
  }, [data.selectedPlan]);

  const companyPlans = data.companyPlans;
  const hasTwoPlans = companyPlans.length >= 2;

  const confirmPlan = (plan: SelectedPlanOption) => {
    updateField("selectedPlan", plan);
    nextStep();
    navigate(pathForWizardStep(1));
  };

  const handleCardClick = (plan: SelectedPlanOption) => {
    setSelectedPlan(plan);
  };

  const handleOptionKeyDown = (e: KeyboardEvent, plan: SelectedPlanOption) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(plan);
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      if (plan === "traditional") rothOptRef.current?.focus();
      else traditionalOptRef.current?.focus();
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      if (plan === "traditional") rothOptRef.current?.focus();
      else traditionalOptRef.current?.focus();
    }
  };

  if (!hasTwoPlans) {
    const onlyPlan = companyPlans[0] ?? "traditional";
    const planLabel = onlyPlan === "traditional" ? "Traditional 401(k)" : "Roth 401(k)";

    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="card w-full max-w-md space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Landmark className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground md:text-xl">
              Your employer offers a {planLabel} retirement plan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {onlyPlan === "traditional"
                ? "This plan allows tax-deferred retirement savings. Your contributions reduce your taxable income today."
                : "This plan allows you to contribute after-tax dollars and withdraw tax-free in retirement."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => confirmPlan(onlyPlan)}
            className="btn btn-primary w-full"
          >
            Continue to Contributions
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center md:text-left">
        <h1 id="enrollment-plan-selection-heading" className="text-xl font-semibold text-foreground md:text-2xl">
          Choose Your Retirement Plan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Select the retirement plan that fits your tax strategy.
        </p>
      </div>

      <div
        className="grid gap-4 md:grid-cols-2"
        role="listbox"
        aria-labelledby="enrollment-plan-selection-heading"
      >
        <div
          ref={traditionalOptRef}
          role="option"
          tabIndex={0}
          aria-selected={selectedPlan === "traditional"}
          onClick={() => handleCardClick("traditional")}
          onKeyDown={(e) => handleOptionKeyDown(e, "traditional")}
          className={cn(
            "plan-option-card",
            selectedPlan === "traditional" && "plan-option-card--selected",
          )}
        >
          <div className="relative mb-1">
            <span
              className="badge-pill badge-pill--warning"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Most Common Choice
              <HelpCircle className="h-3 w-3 opacity-70" aria-hidden />
            </span>
            {showTooltip ? (
              <div className="enroll-tooltip">
                Chosen by most employees because it reduces taxable income today.
              </div>
            ) : null}
          </div>

          <h3 className="font-semibold text-foreground">Traditional 401(k)</h3>
          <p className="mt-1 text-sm text-muted-foreground">Lower taxes today and grow savings tax-deferred.</p>

          <ul className="mt-4 flex-1 space-y-2">
            {["Lower taxable income today", "Employer match eligible", "Tax-deferred growth"].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="icon-check-success" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled={selectedPlan !== "traditional"}
            aria-disabled={selectedPlan !== "traditional"}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedPlan === "traditional") confirmPlan("traditional");
            }}
            className={cn(
              "btn mt-5 w-full",
              selectedPlan === "traditional" ? "btn-primary" : "btn-outline",
            )}
          >
            Continue with Traditional 401(k)
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </button>
        </div>

        <div
          ref={rothOptRef}
          role="option"
          tabIndex={0}
          aria-selected={selectedPlan === "roth"}
          onClick={() => handleCardClick("roth")}
          onKeyDown={(e) => handleOptionKeyDown(e, "roth")}
          className={cn("plan-option-card", selectedPlan === "roth" && "plan-option-card--selected")}
        >
          <h3 className="font-semibold text-foreground">Roth 401(k)</h3>
          <p className="mt-1 text-sm text-muted-foreground">Pay taxes now and withdraw tax-free in retirement.</p>

          <ul className="mt-4 flex-1 space-y-2">
            {[
              "Tax-free withdrawals in retirement",
              "Flexible retirement income",
              "No required minimum distributions",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="icon-check-success" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled={selectedPlan !== "roth"}
            aria-disabled={selectedPlan !== "roth"}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedPlan === "roth") confirmPlan("roth");
            }}
            className={cn("btn mt-5 w-full", selectedPlan === "roth" ? "btn-primary" : "btn-outline")}
          >
            Choose Roth 401(k)
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>

      <div className="card-soft space-y-3">
        <p className="font-medium text-foreground">Not sure which plan is right for you?</p>
        <p className="text-sm text-muted-foreground">Our AI assistant can help explain the differences.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <AIButton
            type="button"
            label="Ask AI"
            pressed={showAI}
            aria-pressed={showAI}
            className="w-full sm:w-auto"
            onClick={() => {
              setShowAI(!showAI);
              setShowCompare(false);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setShowCompare(!showCompare);
              setShowAI(false);
            }}
            className={cn("btn btn-outline w-full sm:w-auto", showCompare && "btn--pressed")}
          >
            <MessageCircle className="size-4 shrink-0" aria-hidden />
            Compare Plans
          </button>
        </div>

        {showAI ? (
          <div className="ai-insight mt-4 p-4">
            <div className="flex items-start gap-2">
              <span className="ai-insight__icon-wrap mt-0.5 shrink-0" aria-hidden>
                <Sparkles className="ai-insight__sparkle text-[var(--ai-primary)]" strokeWidth={2} />
              </span>
              <div className="text-sm">
                <p className="ai-insight__label">AI Recommendation</p>
                <p className="mt-1 text-muted-foreground">
                  <strong className="text-foreground">Traditional 401(k)</strong> is ideal if you expect to be in
                  a lower tax bracket in retirement — your contributions reduce your taxable income now.{" "}
                  <strong className="text-foreground">Roth 401(k)</strong> is better if you expect higher income
                  later — you pay taxes now but withdraw tax-free. Most employees benefit from the Traditional plan
                  due to the immediate tax savings and employer match.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {showCompare ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left font-medium text-muted-foreground">Feature</th>
                  <th className="py-2 text-left font-semibold text-foreground">Traditional</th>
                  <th className="py-2 text-left font-semibold text-foreground">Roth</th>
                </tr>
              </thead>
              <tbody className="text-foreground/90">
                <tr className="border-b border-border/60">
                  <td className="py-2 text-muted-foreground">Contributions</td>
                  <td className="py-2">Pre-tax</td>
                  <td className="py-2">After-tax</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 text-muted-foreground">Withdrawals</td>
                  <td className="py-2">Taxed</td>
                  <td className="py-2">Tax-free</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 text-muted-foreground">Tax benefit</td>
                  <td className="py-2">Now</td>
                  <td className="py-2">In retirement</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 text-muted-foreground">RMDs</td>
                  <td className="py-2">Required</td>
                  <td className="py-2">None</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Best for</td>
                  <td className="py-2">Higher tax bracket now</td>
                  <td className="py-2">Higher tax bracket later</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
