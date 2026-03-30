import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import type { PerformancePoint } from "@/stores/postEnrollmentDashboardStore";
import { cn } from "@/lib/utils";
import { pePanel } from "./dashboardSurfaces";

type Props = {
  data: PerformancePoint[];
  className?: string;
};

export function PerformanceChart({ data, className }: Props) {
  const { t } = useTranslation();
  const gid = useId().replace(/:/g, "");
  const gradId = `pe-chart-grad-${gid}`;

  const domain = useMemo(() => {
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.18 || max * 0.03;
    return [Math.floor(min - pad), Math.ceil(max + pad)] as [number, number];
  }, [data]);

  const tickFill = "var(--color-text-tertiary)";
  const stroke = "var(--color-primary)";

  return (
    <section className={cn(pePanel, className)}>
      <div className="mb-6">
        <h2 className="font-dashboard-heading text-lg font-semibold text-[var(--color-text)] sm:text-xl">
          {t("dashboard.postEnrollment.performanceGrowth")}
        </h2>
        <p className="font-dashboard-body mt-2 max-w-lg text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {t("dashboard.postEnrollment.peChartSubtitle")}
        </p>
      </div>
      <div
        className="h-[280px] w-full pl-1 pr-2 pt-4 sm:h-[320px] lg:h-[360px]"
        aria-label={t("dashboard.postEnrollment.performanceGrowth")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.42} />
                <stop offset="55%" stopColor={stroke} stopOpacity={0.12} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickFill, fontSize: 12 }}
              dy={10}
            />
            <YAxis
              domain={domain}
              axisLine={false}
              tickLine={false}
              width={56}
              tick={{ fill: tickFill, fontSize: 12 }}
              tickFormatter={(v) =>
                new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                  maximumFractionDigits: 1,
                }).format(v)
              }
            />
            <Tooltip
              cursor={{
                stroke: "color-mix(in srgb, var(--color-primary) 28%, transparent)",
                strokeWidth: 1,
              }}
              contentStyle={{
                borderRadius: "14px",
                border: "none",
                background: "var(--color-background)",
                boxShadow: "var(--shadow-md)",
                fontFamily: "inherit",
                padding: "12px 16px",
              }}
              labelStyle={{ color: "var(--color-text-secondary)", fontSize: 11, marginBottom: 4 }}
              formatter={(value) => [
                typeof value === "number"
                  ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
                  : "—",
                t("dashboard.postEnrollment.totalBalance"),
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={stroke}
              strokeWidth={3}
              fill={`url(#${gradId})`}
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--color-background)",
                fill: stroke,
              }}
              style={{
                filter: "drop-shadow(0 3px 14px color-mix(in srgb, var(--color-primary) 38%, transparent))",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
