import { Info } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export type ContributionChartProps = {
  gradientId: string;
  projectionData: { year: number; value: number; contributions: number; marketGain: number }[];
  projectedTotal: number;
};

/**
 * Area chart, legend, and projection disclaimer (middle of right column).
 */
export function ContributionChart({ gradientId, projectionData, projectedTotal }: ContributionChartProps) {
  return (
    <>
      <div className="fm-inset-panel h-64 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id={`${gradientId}-market`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.22} />
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              key="grid"
              strokeDasharray="3 3"
              stroke="var(--border-default)"
              opacity={0.45}
              vertical={false}
            />
            <XAxis
              key="xaxis"
              dataKey="year"
              tick={{ fontSize: 10, fill: "var(--text-secondary)", fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "var(--border-default)" }}
              interval={4}
              dy={5}
            />
            <YAxis
              key="yaxis"
              tick={{ fontSize: 10, fill: "var(--text-secondary)", fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
              dx={-5}
            />
            <Tooltip
              key="tooltip"
              formatter={(val: number | undefined, name: string) => {
                const v = val ?? 0;
                if (name === "value") return [`$${v.toLocaleString()}`, "Total Savings"];
                if (name === "contributions") return [`$${v.toLocaleString()}`, "Your Contributions"];
                if (name === "marketGain") return [`$${v.toLocaleString()}`, "Market Gains"];
                return [v, name];
              }}
              contentStyle={{
                borderRadius: 12,
                fontSize: 12,
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--surface-card)",
                color: "var(--text-primary)",
                boxShadow: "none",
                fontWeight: 500,
              }}
            />
            <ReferenceLine
              key="refline"
              y={projectedTotal * 0.75}
              stroke="var(--color-primary)"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: "Target Goal",
                position: "insideTopRight",
                fill: "var(--color-primary)",
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            <Area
              key="area-contributions"
              type="monotone"
              dataKey="contributions"
              stroke="var(--text-secondary)"
              fill="transparent"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Area
              key="area-market"
              type="monotone"
              dataKey="marketGain"
              stroke="var(--color-success)"
              fill={`url(#${gradientId}-market)`}
              strokeWidth={2}
              stackId="1"
            />
            <Area
              key="area-total"
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              fill={`url(#${gradientId})`}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[var(--color-primary)]" />
          <p className="text-xs text-[var(--text-secondary)]">Total Savings</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[var(--color-success)]" />
          <p className="text-xs text-[var(--text-secondary)]">Market Gains</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="h-0.5 w-3 bg-[color-mix(in_srgb,var(--text-secondary)_50%,transparent)]"
            style={{ borderTop: "2px dashed var(--text-secondary)" }}
          />
          <p className="text-xs text-[var(--text-secondary)]">Your Contributions</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)]" />
        <p className="text-xs leading-normal text-[var(--text-secondary)]">
          Projection assumes 7% annual return. Actual results may vary. Monthly income uses 4% withdrawal rule.
        </p>
      </div>
    </>
  );
}
