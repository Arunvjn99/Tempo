import { Link } from "react-router-dom";
import { Button } from "@/ui/components/Button";
import { ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PageLayout, CardGridLayout, FormSection } from "@/ui/patterns";
import { FadeIn, SlideUp, motionDuration } from "@/ui/animations";
import { cn } from "@/core/lib/utils";
import type { InvestmentsPageViewModel } from "@/features/workspace/hooks/useInvestmentsPage";

const BG = ["bg-primary", "bg-success", "bg-warning", "bg-secondary"] as const;

export function InvestmentsOverview({ range, setRange, ranges, data, formatCurrency }: InvestmentsPageViewModel) {
  return (
    <PageLayout>
      <FadeIn duration="normal" ease="smooth">
        <header className="flex flex-col gap-xs">
          <h1 className="text-2xl font-bold text-primary">Investments</h1>
          <p className="text-sm text-secondary">Your portfolio performance and allocation.</p>
        </header>
      </FadeIn>

      <CardGridLayout className="!grid-cols-2 lg:!grid-cols-4">
        {[
          {
            label: "Total Balance",
            value: formatCurrency(data.totalBalance),
            sub: `+${formatCurrency(data.totalGain)} (${data.gainPct}%)`,
            up: true,
          },
          {
            label: "YTD Return",
            value: `${data.ytdReturn}%`,
            sub: "vs benchmark",
            up: data.ytdReturn > data.benchmarkReturn,
          },
          {
            label: "Benchmark",
            value: `${data.benchmarkReturn}%`,
            sub: "S&P 500",
            up: false,
          },
          { label: "Alpha", value: `+${data.alpha}%`, sub: "Outperformance", up: true },
        ].map((kpi, i) => (
          <SlideUp key={kpi.label} duration="fast" ease="snappy" delay={motionDuration.fast * i}>
            <div className="rounded-card border border-default bg-surface-card p-lg">
              <p className="text-xs font-medium uppercase tracking-wider text-secondary">{kpi.label}</p>
              <p className="mt-sm text-2xl font-bold text-primary">{kpi.value}</p>
              <p
                className={cn(
                  "mt-xs flex items-center gap-xs text-xs font-medium",
                  kpi.up ? "text-success" : "text-secondary",
                )}
              >
                {kpi.up ? (
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                ) : (
                  <ArrowDownRight className="h-3 w-3" aria-hidden />
                )}
                {kpi.sub}
              </p>
            </div>
          </SlideUp>
        ))}
      </CardGridLayout>

      <div className="flex gap-xs overflow-x-auto">
        {ranges.map((r) => (
          <Button
            key={r}
            type="button"
            variant="custom"
            size="custom"
            onClick={() => setRange(r)}
            className={cn(
              "shrink-0 rounded-full border px-md py-xs text-xs font-medium transition-colors",
              range === r
                ? "border-primary bg-primary text-primary-foreground"
                : "border-default bg-surface text-secondary hover:bg-primary/5",
            )}
          >
            {r}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
        <SlideUp duration="fast" ease="snappy" delay={motionDuration.fast * 5}>
          <FormSection title="Allocation">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-border">
              {data.holdings.map((h, i) => (
                <div
                  key={h.id}
                  className={cn(BG[i % BG.length], "transition-all")}
                  style={{ width: `${h.allocation}%` }}
                />
              ))}
            </div>
            <ul className="mt-md space-y-sm">
              {data.holdings.map((h, i) => (
                <li key={h.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-sm">
                    <span className={cn("h-2.5 w-2.5 rounded-full", BG[i % BG.length])} aria-hidden />
                    <span className="text-secondary">{h.name}</span>
                  </span>
                  <span className="font-medium text-primary">{h.allocation}%</span>
                </li>
              ))}
            </ul>
            <div className="mt-md flex justify-end">
              <Link
                to="/transactions/rebalance"
                className="inline-flex items-center gap-xs text-sm font-medium text-brand hover:underline"
              >
                Rebalance
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </FormSection>
        </SlideUp>

        <SlideUp duration="fast" ease="snappy" delay={motionDuration.fast * 6} className="lg:col-span-2">
          <FormSection title="Holdings">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-default text-left text-xs text-secondary">
                    <th className="pb-sm pr-md font-medium">Fund</th>
                    <th className="pb-sm pr-md font-medium text-right">Balance</th>
                    <th className="pb-sm pr-md font-medium text-right">Alloc</th>
                    <th className="pb-sm font-medium text-right">YTD</th>
                  </tr>
                </thead>
                <tbody>
                  {data.holdings.map((h) => (
                    <tr key={h.id} className="border-b border-default/50">
                      <td className="py-sm pr-md">
                        <p className="font-medium text-primary">{h.ticker}</p>
                        <p className="text-xs text-secondary">{h.name}</p>
                      </td>
                      <td className="py-sm pr-md text-right font-medium text-primary">
                        {formatCurrency(h.balance)}
                      </td>
                      <td className="py-sm pr-md text-right text-primary">{h.allocation}%</td>
                      <td
                        className={cn(
                          "py-sm text-right font-medium",
                          h.ytdReturn >= 0 ? "text-success" : "text-danger",
                        )}
                      >
                        {h.ytdReturn >= 0 ? "+" : ""}
                        {h.ytdReturn}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormSection>
        </SlideUp>
      </div>

      <SlideUp duration="fast" ease="snappy" delay={motionDuration.fast * 7}>
        <FormSection title="Portfolio Health">
          <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
            {[
              { label: "Risk Alignment", value: data.health.risk },
              { label: "Diversification", value: data.health.diversification },
              { label: "On Track Score", value: data.health.onTrack ? 90 : 40 },
            ].map((h) => (
              <div key={h.label} className="space-y-sm">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">{h.label}</span>
                  <span className="font-bold text-primary">{h.value}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      h.value >= 70 ? "bg-success" : h.value >= 40 ? "bg-warning" : "bg-danger",
                    )}
                    style={{ width: `${h.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </FormSection>
      </SlideUp>
    </PageLayout>
  );
}
