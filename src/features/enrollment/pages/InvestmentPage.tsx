// ─────────────────────────────────────────────
// InvestmentPage — Risk selection + portfolio config
// Handles: recommended / custom / per-source branches
// ─────────────────────────────────────────────

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useEnrollmentStore } from "../store";
import { validateStep } from "../store/validation";
import { AllocationEditor, type AllocationSlice } from "@/ui/components";
import { FormSection } from "@/ui/patterns";
import { EnrollmentActionRow } from "@/ui/patterns/enrollment-router";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";
import type { FundAllocation, RiskLevel } from "../store/types";

// ── Portfolio presets by risk ──────────────────
const PORTFOLIOS: Record<RiskLevel, { assetClass: string; pct: number; color: string }[]> = {
  conservative: [
    { assetClass: "Bonds", pct: 45, color: "var(--chart-1)" },
    { assetClass: "US Stocks", pct: 25, color: "var(--chart-2)" },
    { assetClass: "Int'l Stocks", pct: 15, color: "var(--chart-5)" },
    { assetClass: "Real Estate", pct: 15, color: "var(--chart-3)" },
  ],
  balanced: [
    { assetClass: "US Stocks", pct: 40, color: "var(--chart-2)" },
    { assetClass: "Bonds", pct: 25, color: "var(--chart-1)" },
    { assetClass: "Int'l Stocks", pct: 20, color: "var(--chart-5)" },
    { assetClass: "Real Estate", pct: 15, color: "var(--chart-3)" },
  ],
  growth: [
    { assetClass: "US Stocks", pct: 50, color: "var(--chart-2)" },
    { assetClass: "Int'l Stocks", pct: 20, color: "var(--chart-5)" },
    { assetClass: "Bonds", pct: 20, color: "var(--chart-1)" },
    { assetClass: "Real Estate", pct: 10, color: "var(--chart-3)" },
  ],
  aggressive: [
    { assetClass: "US Stocks", pct: 60, color: "var(--chart-2)" },
    { assetClass: "Int'l Stocks", pct: 25, color: "var(--chart-5)" },
    { assetClass: "Real Estate", pct: 10, color: "var(--chart-3)" },
    { assetClass: "Bonds", pct: 5, color: "var(--chart-1)" },
  ],
};

const RISK_OPTIONS: {
  value: RiskLevel; label: string; description: string; growthRate: string; emoji: string;
}[] = [
  { value: "conservative", label: "Conservative", description: "Lower risk, stable growth", growthRate: "~4.5%/yr", emoji: "🛡️" },
  { value: "balanced", label: "Balanced", description: "Mix of growth and stability", growthRate: "~6.8%/yr", emoji: "⚖️" },
  { value: "growth", label: "Growth", description: "Higher growth potential", growthRate: "~8.2%/yr", emoji: "📈" },
  { value: "aggressive", label: "Aggressive", description: "Maximum return, higher volatility", growthRate: "~9.5%/yr", emoji: "🚀" },
];

const FUND_CATALOG: FundAllocation[] = [
  { fundId: "vfiax", name: "Vanguard 500 Index", ticker: "VFIAX", assetClass: "US Stocks", expenseRatio: 0.04, allocationPct: 0 },
  { fundId: "vtiax", name: "Vanguard Total Int'l", ticker: "VTIAX", assetClass: "Int'l Stocks", expenseRatio: 0.11, allocationPct: 0 },
  { fundId: "vbmfx", name: "Vanguard Total Bond", ticker: "VBMFX", assetClass: "Bonds", expenseRatio: 0.15, allocationPct: 0 },
  { fundId: "vttsx", name: "Target 2045 Fund", ticker: "VTTSX", assetClass: "Target Date", expenseRatio: 0.15, allocationPct: 0 },
  { fundId: "vgsix", name: "REIT Index", ticker: "VGSIX", assetClass: "Real Estate", expenseRatio: 0.26, allocationPct: 0 },
  { fundId: "vgslx", name: "Small Cap Index", ticker: "VGSLX", assetClass: "US Stocks", expenseRatio: 0.05, allocationPct: 0 },
  { fundId: "vtsnx", name: "Int'l Growth", ticker: "VTSNX", assetClass: "Int'l Stocks", expenseRatio: 0.08, allocationPct: 0 },
  { fundId: "vipsx", name: "Inflation-Protected", ticker: "VIPSX", assetClass: "Bonds", expenseRatio: 0.2, allocationPct: 0 },
  { fundId: "svfxx", name: "Stable Value", ticker: "SVFXX", assetClass: "Stable Value", expenseRatio: 0.5, allocationPct: 0 },
];

export function InvestmentPage() {
  const enrollment = useEnrollmentStore((s) => s.enrollment);
  const personalization = useEnrollmentStore((s) => s.personalization);
  const updateEnrollment = useEnrollmentStore((s) => s.updateEnrollment);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);

  const [customFunds, setCustomFunds] = useState<FundAllocation[]>(
    enrollment.customFunds.length ? enrollment.customFunds : [],
  );

  const validation = validateStep("investment", enrollment, personalization);
  const portfolio = PORTFOLIOS[enrollment.riskLevel];

  const portfolioSlices: AllocationSlice[] = portfolio.map((p) => ({
    key: p.assetClass,
    label: p.assetClass,
    color: p.color,
    value: p.pct,
  }));

  const customSlices: AllocationSlice[] = customFunds.map((f) => ({
    key: f.fundId,
    label: `${f.ticker} — ${f.name}`,
    color: "var(--chart-10)",
    value: f.allocationPct,
  }));

  const handleCustomChange = (slices: AllocationSlice[]) => {
    const updated = customFunds.map((f) => ({
      ...f,
      allocationPct: slices.find((s) => s.key === f.fundId)?.value ?? f.allocationPct,
    }));
    setCustomFunds(updated);
    updateEnrollment({ customFunds: updated });
  };

  const addFund = (fund: FundAllocation) => {
    if (customFunds.find((f) => f.fundId === fund.fundId)) return;
    const updated = [...customFunds, { ...fund, allocationPct: 0 }];
    setCustomFunds(updated);
    updateEnrollment({ customFunds: updated });
  };

  const removeFund = (fundId: string) => {
    const updated = customFunds.filter((f) => f.fundId !== fundId);
    setCustomFunds(updated);
    updateEnrollment({ customFunds: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          type="button"
          variant="ghost"
          size="custom"
          onClick={prevStep}
          className="mb-3 inline-flex h-auto items-center gap-1 px-0 text-[0.85rem] text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Button>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Investment strategy</h1>
        <p className="mt-1 text-[0.9rem] text-muted-foreground">
          Choose how your contributions will be invested.
        </p>
      </div>

      {/* Risk level selection */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {RISK_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant="custom"
            size="custom"
            onClick={() => updateEnrollment({ riskLevel: opt.value })}
            className={cn(
              "relative h-auto justify-start rounded-xl border p-4 text-left font-normal transition-all",
              enrollment.riskLevel === opt.value
                ? "border-primary ring-2 ring-primary ring-offset-1 ring-offset-background"
                : "border-border bg-card hover:border-primary/50",
            )}
          >
            {opt.value === "balanced" && (
              <span className="absolute right-2 top-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Most common
              </span>
            )}
            <div className="text-2xl">{opt.emoji}</div>
            <p className="mt-2 text-sm font-bold text-foreground">{opt.label}</p>
            <p className="text-xs text-muted-foreground">{opt.description}</p>
            <p className="mt-1 text-xs font-medium text-primary">{opt.growthRate}</p>
          </Button>
        ))}
      </div>

      {/* Recommended vs Custom toggle */}
      <div className="flex rounded-xl border border-border bg-muted/40 p-1">
        {[true, false].map((rec) => (
          <Button
            key={String(rec)}
            type="button"
            variant="custom"
            size="custom"
            onClick={() => updateEnrollment({ useRecommendedPortfolio: rec })}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors",
              enrollment.useRecommendedPortfolio === rec
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-transparent hover:text-foreground",
            )}
          >
            {rec ? "Recommended Portfolio" : "Custom Funds"}
          </Button>
        ))}
      </div>

      {enrollment.useRecommendedPortfolio ? (
        /* ── Recommended portfolio ── */
        <FormSection title={`${enrollment.riskLevel.charAt(0).toUpperCase() + enrollment.riskLevel.slice(1)} Portfolio`}>
          <AllocationEditor slices={portfolioSlices} onChange={() => {}} showBar />
          <div className="mt-md">
            <p className="mb-sm text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Included funds
            </p>
            <div className="space-y-xs">
              {FUND_CATALOG.slice(0, 4).map((f) => (
                <div key={f.fundId} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
                  <div>
                    <span className="font-medium text-foreground">{f.ticker}</span>
                    <span className="ml-sm text-muted-foreground">{f.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{(f.expenseRatio * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        </FormSection>
      ) : (
        /* ── Custom fund picker ── */
        <div className="space-y-lg">
          <FormSection title="Build your portfolio">
            {customFunds.length > 0 ? (
              <AllocationEditor
                slices={customSlices}
                onChange={handleCustomChange}
                error={validation.errors.funds}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Add funds from the catalog below to build your portfolio.
              </p>
            )}
            {customFunds.length > 0 && (
              <div className="mt-md space-y-xs">
                {customFunds.map((f) => (
                  <div key={f.fundId} className="flex items-center justify-between rounded-xl border border-border px-4 py-2 text-sm">
                    <span className="font-medium text-foreground">{f.ticker} — {f.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="custom"
                      onClick={() => removeFund(f.fundId)}
                      className="h-auto px-0 text-xs text-danger hover:bg-transparent hover:underline"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </FormSection>

          <FormSection title="Fund catalog">
            <div className="space-y-xs">
              {FUND_CATALOG.filter((f) => !customFunds.find((cf) => cf.fundId === f.fundId)).map((f) => (
                <div key={f.fundId} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                  <div>
                    <span className="text-sm font-semibold text-foreground">{f.ticker}</span>
                    <span className="ml-sm text-sm text-muted-foreground">{f.name}</span>
                    <span className="ml-sm rounded bg-surface px-xs py-0.5 text-xs text-muted-foreground">
                      {f.assetClass}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => addFund(f)}
                    className="h-auto rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </FormSection>
        </div>
      )}

      {/* Per-source allocation (if multiple sources) */}
      {!enrollment.useRecommendedPortfolio && (
        (() => {
          const { preTax, roth, afterTax } = enrollment.contributionSources;
          const hasMultiple = [preTax, roth, afterTax].filter((v) => v > 0).length > 1;
          if (!hasMultiple) return null;
          return (
            <FormSection title="Per-source allocation">
              <p className="mb-md text-sm text-muted-foreground">
                You can use the same portfolio for all sources, or set different strategies per tax treatment.
              </p>
              <div className="flex rounded-xl border border-border bg-muted/40 p-1">
                {[true, false].map((same) => (
                  <Button
                    key={String(same)}
                    type="button"
                    variant="custom"
                    size="custom"
                    onClick={() => updateEnrollment({ sameAllocationForAllSources: same })}
                    className={cn(
                      "flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
                      enrollment.sameAllocationForAllSources === same
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-transparent hover:text-foreground",
                    )}
                  >
                    {same ? "Same for all" : "Different per source"}
                  </Button>
                ))}
              </div>
            </FormSection>
          );
        })()
      )}

      <EnrollmentActionRow hideBack onNext={nextStep} nextDisabled={!validation.valid} />
    </div>
  );
}
