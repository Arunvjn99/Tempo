import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { computeSourceSplitMonthly } from "../flow/enrollmentDerivedEngine";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Shield,
  Sparkles,
  TrendingUp,
  Wallet,
  DollarSign,
} from "lucide-react";
import type { ContributionSources } from "../store/useEnrollmentStore";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { cn } from "@/lib/utils";

const A = "enrollment.v1.sourceAllocation.";

const PLAN_DEFAULT: ContributionSources = { preTax: 60, roth: 40, afterTax: 0 };

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

export function ContributionSource() {
  const { t } = useTranslation();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const sources = data.contributionSources;
  const monthlyTotal = data.monthlyContribution;
  const monthlyMatch = data.employerMatch;
  const percent = data.contribution;
  const supportsAfterTax = data.supportsAfterTax;

  const recommended = useMemo((): ContributionSources => {
    if (data.currentAge > 50) return { preTax: 70, roth: 30, afterTax: 0 };
    if (data.currentAge < 40) return { preTax: 40, roth: 60, afterTax: 0 };
    return { preTax: 55, roth: 45, afterTax: 0 };
  }, [data.currentAge]);

  const explainPreTax = useMemo(() => asStringArray(t(`${A}explainPreTaxItems`, { returnObjects: true })), [t]);
  const explainRoth = useMemo(() => asStringArray(t(`${A}explainRothItems`, { returnObjects: true })), [t]);
  const explainAfterTax = useMemo(() => asStringArray(t(`${A}explainAfterTaxItems`, { returnObjects: true })), [t]);

  const [showAdvanced, setShowAdvanced] = useState(sources.afterTax > 0);

  const matchPercent = Math.min(percent, 6);
  const { monthlyPreTax, monthlyRoth, monthlyAfterTax } = computeSourceSplitMonthly(monthlyTotal, sources);
  const totalMonthlyInvestment = monthlyTotal + monthlyMatch;

  const planDefaultSplit = computeSourceSplitMonthly(monthlyTotal, PLAN_DEFAULT);
  const planDefaultPreTax = planDefaultSplit.monthlyPreTax;
  const planDefaultRoth = planDefaultSplit.monthlyRoth;

  const setSources = (next: ContributionSources) => {
    updateField("contributionSources", next);
  };

  const handlePreTaxChange = (value: number) => {
    const newPreTax = Math.min(100, Math.max(0, value));
    const remaining = 100 - newPreTax;
    const currentRothAfterTaxTotal = sources.roth + sources.afterTax;
    if (currentRothAfterTaxTotal > 0) {
      const rothRatio = sources.roth / currentRothAfterTaxTotal;
      setSources({
        preTax: newPreTax,
        roth: Math.round(remaining * rothRatio),
        afterTax: Math.round(remaining * (1 - rothRatio)),
      });
    } else {
      setSources({ preTax: newPreTax, roth: remaining, afterTax: 0 });
    }
  };

  const handleRothChange = (value: number) => {
    const newRoth = Math.min(100, Math.max(0, value));
    const remaining = 100 - newRoth;
    const currentPreTaxAfterTaxTotal = sources.preTax + sources.afterTax;
    if (currentPreTaxAfterTaxTotal > 0) {
      const preTaxRatio = sources.preTax / currentPreTaxAfterTaxTotal;
      setSources({
        preTax: Math.round(remaining * preTaxRatio),
        roth: newRoth,
        afterTax: Math.round(remaining * (1 - preTaxRatio)),
      });
    } else {
      setSources({ preTax: remaining, roth: newRoth, afterTax: 0 });
    }
  };

  const handleAfterTaxChange = (value: number) => {
    const newAfterTax = Math.min(100, Math.max(0, value));
    const remaining = 100 - newAfterTax;
    const currentPreTaxRothTotal = sources.preTax + sources.roth;
    if (currentPreTaxRothTotal > 0) {
      const preTaxRatio = sources.preTax / currentPreTaxRothTotal;
      setSources({
        preTax: Math.round(remaining * preTaxRatio),
        roth: Math.round(remaining * (1 - preTaxRatio)),
        afterTax: newAfterTax,
      });
    } else {
      setSources({ preTax: remaining, roth: 0, afterTax: newAfterTax });
    }
  };

  const total = sources.preTax + sources.roth + sources.afterTax;

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 text-left">
          <h1 className="text-2xl font-semibold leading-tight text-foreground">{t(`${A}title`)}</h1>
          <p className="mt-1 max-w-xl text-sm leading-snug text-muted-foreground">{t(`${A}subtitle`)}</p>
        </div>
        <div className="inline-flex min-w-0 max-w-full shrink-0 flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] px-4 py-2.5 shadow-sm">
          <Wallet className="h-5 w-5 text-primary" aria-hidden />
          <p className="text-sm font-bold text-foreground">
            {t(`${A}contributingSummary`, {
              percent,
              amount: `$${monthlyTotal.toLocaleString()}`,
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,35%)_minmax(0,1fr)] lg:items-start">
        <div className="card card--pad-sm flex flex-col space-y-3 rounded-xl border border-border bg-card p-5 opacity-90 shadow-sm">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-md bg-secondary px-2.5 py-1">
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">
                  {t(`${A}defaultBadge`)}
                </p>
              </div>
            </div>
            <h3 className="text-base font-bold text-foreground">{t(`${A}planDefaultTitle`)}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t(`${A}planDefaultHint`)}</p>
          </div>
          <div className="alloc-bar-plain">
            <div className="flex h-full w-full">
              <div className="alloc-seg-pretax" style={{ width: `${PLAN_DEFAULT.preTax}%` }} />
              <div className="alloc-seg-roth" style={{ width: `${PLAN_DEFAULT.roth}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="alloc-dot alloc-dot--md alloc-dot--pretax" />
                <p className="text-sm text-foreground">
                  {t(`${A}preTaxLabel`)} ({PLAN_DEFAULT.preTax}%)
                </p>
              </div>
              <p className="text-sm font-semibold">${planDefaultPreTax.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="alloc-dot alloc-dot--md alloc-dot--roth" />
                <p className="text-sm text-foreground">
                  {t(`${A}rothLabel`)} ({PLAN_DEFAULT.roth}%)
                </p>
              </div>
              <p className="text-sm font-semibold">${planDefaultRoth.toLocaleString()}</p>
            </div>
          </div>
          <p className="flex-1 pt-2 text-left text-[0.7rem] leading-snug text-muted-foreground">
            {t(`${A}planDefaultFootnote`)}
          </p>
          <button type="button" onClick={() => setSources({ ...PLAN_DEFAULT })} className="btn btn-primary h-10 w-full text-sm">
            {t(`${A}usePlanDefaultCta`)}
          </button>
        </div>

        <div className="card card-border-accent flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm lg:flex-row">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-foreground">{t(`${A}yourTaxStrategy`)}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(`${A}totalAllocation`, { total })}</p>
              </div>
              <div className="badge-recommended-enroll">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
                <p className="text-[0.7rem] font-bold uppercase tracking-wide text-foreground">
                  {t(`${A}recommendedBadge`)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="alloc-bar-track">
                {sources.preTax > 0 ? (
                  <div className="alloc-seg-pretax transition-all" style={{ width: `${sources.preTax}%` }} />
                ) : null}
                {sources.roth > 0 ? (
                  <div className="alloc-seg-roth transition-all" style={{ width: `${sources.roth}%` }} />
                ) : null}
                {sources.afterTax > 0 ? (
                  <div className="alloc-seg-aftertax transition-all" style={{ width: `${sources.afterTax}%` }} />
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="alloc-dot alloc-dot--pretax" />
                  {sources.preTax}% {t(`${A}preTaxLabel`)}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="alloc-dot alloc-dot--roth" />
                  {sources.roth}% {t(`${A}rothLabel`)}
                </span>
                {sources.afterTax > 0 ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="alloc-dot alloc-dot--aftertax" />
                    {sources.afterTax}% {t(`${A}afterTaxLabel`)}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <SliderRow
                label={t(`${A}preTaxLabel`)}
                sub={t(`${A}preTaxSub`)}
                color="blue"
                value={sources.preTax}
                monthly={monthlyPreTax}
                onChange={handlePreTaxChange}
              />
              <SliderRow
                label={t(`${A}rothLabel`)}
                sub={t(`${A}rothSub`)}
                color="purple"
                value={sources.roth}
                monthly={monthlyRoth}
                onChange={handleRothChange}
              />
              {showAdvanced && supportsAfterTax ? (
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="enroll-advanced-tag">
                    <p className="enroll-advanced-tag__text">{t(`${A}advancedTag`)}</p>
                  </div>
                  <SliderRow
                    label={t(`${A}afterTaxLabel`)}
                    sub={t(`${A}afterTaxSub`)}
                    color="orange"
                    value={sources.afterTax}
                    monthly={monthlyAfterTax}
                    onChange={handleAfterTaxChange}
                  />
                </div>
              ) : null}
            </div>

            {!showAdvanced ? (
              <button
                type="button"
                onClick={() => setShowAdvanced(true)}
                className="flex items-center gap-1.5 self-start text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="h-4 w-4" aria-hidden />
                {t(`${A}showAdvanced`)}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowAdvanced(false);
                  if (sources.afterTax > 0) {
                    setSources({
                      preTax: sources.preTax + sources.afterTax,
                      roth: sources.roth,
                      afterTax: 0,
                    });
                  }
                }}
                className="flex items-center gap-1.5 self-start text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className="h-4 w-4" aria-hidden />
                {t(`${A}hideAdvanced`)}
              </button>
            )}

            <div className="enroll-recommended-strip">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                  <p className="text-sm font-bold text-foreground">{t(`${A}recommendedForYou`)}</p>
                </div>
                <div className="badge-score">{t(`${A}scoreLabel`)}</div>
              </div>
              <p className="text-sm leading-snug text-foreground/90">
                {t(`${A}recommendedMix`, { preTax: recommended.preTax, roth: recommended.roth })}
              </p>
            </div>

            <div className="tip-callout">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <p className="tip-callout__text">
                  {data.currentAge > 50 ? t(`${A}tipPreTaxBetter`) : t(`${A}tipRothBetter`)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSources({ ...recommended })}
                disabled={Math.abs(total - 100) > 0.001}
                className="btn btn-outline mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t(`${A}applyRecommendedCta`)}
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between border-t border-border pt-5 lg:w-[32%] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">{t(`${A}yourMonthlyImpact`)}</h4>
              <div>
                <p className="text-xs text-muted-foreground">{t(`${A}youContributeColon`)}</p>
                <p className="text-xl font-extrabold text-foreground">${monthlyTotal.toLocaleString()}</p>
                <div className="mt-2 space-y-1.5 border-l-2 border-border pl-3">
                  <RowMini label={t(`${A}preTaxLabel`)} amount={monthlyPreTax} variant="pretax" />
                  <RowMini label={t(`${A}rothLabel`)} amount={monthlyRoth} variant="roth" />
                  {monthlyAfterTax > 0 ? (
                    <RowMini label={t(`${A}afterTaxLabel`)} amount={monthlyAfterTax} variant="aftertax" />
                  ) : null}
                </div>
              </div>
              <div className="success-card success-card--compact">
                <p className="success-card-emphasis">{t(`${A}employerMatch`)}</p>
                <p className="success-card-emphasis-lg">+${monthlyMatch.toLocaleString()}/month</p>
                <p className="success-card-footnote">{t(`${A}employerMatchFootnote`, { percent: matchPercent })}</p>
              </div>
              <div className="card-soft card-soft--tight">
                <p className="text-[0.7rem] font-semibold text-muted-foreground">{t(`${A}totalInvestment`)}</p>
                <p className="text-2xl font-extrabold text-foreground">${totalMonthlyInvestment.toLocaleString()}</p>
                <p className="text-[0.65rem] text-muted-foreground">{t(`${A}perMonth`)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {Math.abs(total - 100) > 0.001 ? (
        <p className="text-center text-sm font-medium text-destructive">{t(`${A}allocMustTotal`, { total })}</p>
      ) : null}

      <div className="space-y-3 opacity-95">
        <h2 className="text-xl font-bold text-foreground">{t(`${A}understandingTitle`)}</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <ExplainCard
            title={t(`${A}preTaxLabel`)}
            icon={<TrendingUp className="enroll-on-accent-icon h-4 w-4" aria-hidden />}
            variant="pretax"
            items={explainPreTax}
          />
          <ExplainCard
            title={t(`${A}rothLabel`)}
            icon={<Shield className="enroll-on-accent-icon h-4 w-4" aria-hidden />}
            variant="roth"
            items={explainRoth}
          />
          <ExplainCard
            title={t(`${A}afterTaxLabel`)}
            icon={<DollarSign className="enroll-on-accent-icon h-4 w-4" aria-hidden />}
            variant="aftertax"
            items={explainAfterTax}
            className="md:col-span-2 lg:col-span-1"
          />
        </div>
      </div>
    </div>
  );
}

function RowMini({
  label,
  amount,
  variant,
}: {
  label: string;
  amount: number;
  variant: "pretax" | "roth" | "aftertax";
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "alloc-dot",
            variant === "pretax" && "alloc-dot--pretax",
            variant === "roth" && "alloc-dot--roth",
            variant === "aftertax" && "alloc-dot--aftertax",
          )}
        />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-xs font-semibold">${amount.toLocaleString()}</p>
    </div>
  );
}

const ACCENT_BY_COLOR: Record<"blue" | "purple" | "orange", { valueClass: string }> = {
  blue: { valueClass: "alloc-value-pretax" },
  purple: { valueClass: "alloc-value-roth" },
  orange: { valueClass: "alloc-value-aftertax" },
};

function SliderRow({
  label,
  sub,
  color,
  value,
  monthly,
  onChange,
}: {
  label: string;
  sub: string;
  color: "blue" | "purple" | "orange";
  value: number;
  monthly: number;
  onChange: (n: number) => void;
}) {
  const { valueClass } = ACCENT_BY_COLOR[color];
  const rangeMod =
    color === "blue" ? "source-allocation-range--pretax" : color === "purple" ? "source-allocation-range--roth" : "source-allocation-range--aftertax";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "alloc-dot alloc-dot--md",
                color === "blue" && "alloc-dot--pretax",
                color === "purple" && "alloc-dot--roth",
                color === "orange" && "alloc-dot--aftertax",
              )}
            />
            <p className="text-sm font-semibold text-foreground">{label}</p>
          </div>
          <p className="ml-5 text-[0.7rem] leading-snug text-muted-foreground">{sub}</p>
        </div>
        <p className={valueClass}>{value}%</p>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("source-allocation-range", rangeMod)}
        style={{ "--range-pct": `${value}%` } as CSSProperties}
      />
      <div className="flex justify-between text-[0.7rem] text-muted-foreground">
        <span>0%</span>
        <span className="font-semibold text-foreground">${monthly.toLocaleString()}/mo</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function ExplainCard({
  title,
  icon,
  variant,
  items,
  className,
}: {
  title: string;
  icon: ReactNode;
  variant: "pretax" | "roth" | "aftertax";
  items: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "explain-card",
        variant === "roth" && "explain-card--roth",
        variant === "aftertax" && "explain-card--aftertax",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div className="explain-card__icon">{icon}</div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <div className="space-y-1.5">
        {items.map((line) => (
          <div key={line} className="flex items-start gap-2">
            <Check className="explain-card__check" aria-hidden />
            <p className="text-sm text-foreground/90">{line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
