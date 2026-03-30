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
    <div className="w-full min-w-0 space-y-6">
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

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,35%)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
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

        <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] dark:border-gray-700 dark:bg-gray-900 lg:flex-row">
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

            <div className="space-y-6">
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

            {/* ── Recommended Allocation — standalone high-impact module ── */}
            <div className="mt-4 space-y-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] dark:border-blue-900/50 dark:from-blue-950/30 dark:to-gray-900">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{t(`${A}recommendedForYou`)}</p>
                </div>
                <div className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {t(`${A}scoreLabel`)}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium leading-snug text-gray-800 dark:text-gray-200">
                  {t(`${A}recommendedMix`, { preTax: recommended.preTax, roth: recommended.roth })}
                </p>
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500 dark:text-blue-400" aria-hidden />
                  <p className="text-xs font-medium leading-snug text-blue-700/80 dark:text-blue-300/80">
                    {data.currentAge > 50 ? t(`${A}tipPreTaxBetter`) : t(`${A}tipRothBetter`)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSources({ ...recommended })}
                disabled={Math.abs(total - 100) > 0.001}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                {t(`${A}applyRecommendedCta`)}
              </button>
            </div>

            {/* ── Secondary: keep custom allocation — clearly outside recommendation block ── */}
            <div className="mt-4">
              <button
                type="button"
                disabled={Math.abs(total - 100) > 0.001}
                className="flex h-10 w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/40"
              >
                {t(`${A}keepCustomAllocation`)}
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] dark:border-gray-700 dark:bg-gray-900 lg:w-[32%] lg:self-start">
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

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{t(`${A}understandingTitle`)}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

const EXPLAIN_ACCENT: Record<"pretax" | "roth" | "aftertax", { icon: string; check: string }> = {
  pretax: { icon: "bg-blue-600", check: "text-blue-600" },
  roth: { icon: "bg-purple-600", check: "text-purple-600" },
  aftertax: { icon: "bg-orange-500", check: "text-orange-500" },
};

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
  const accent = EXPLAIN_ACCENT[variant];
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-[1px] hover:shadow-md dark:border-gray-700 dark:bg-gray-900",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-white", accent.icon)}>{icon}</div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">{title}</h3>
      </div>
      <div className="space-y-1.5">
        {items.map((line) => (
          <div key={line} className="flex items-start gap-2">
            <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", accent.check)} aria-hidden />
            <p className="text-sm text-gray-700 dark:text-gray-300">{line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
