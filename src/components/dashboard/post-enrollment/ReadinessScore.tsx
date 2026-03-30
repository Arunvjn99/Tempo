import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { pePanel } from "./dashboardSurfaces";

type Props = {
  score: number;
  labelKey: string;
  onLaunchSimulator: () => void;
  className?: string;
};

export function ReadinessScore({ score, labelKey, onLaunchSimulator, className }: Props) {
  const { t } = useTranslation();
  const clamped = Math.min(100, Math.max(0, score));
  const data = [
    { name: "progress", value: clamped },
    { name: "rest", value: 100 - clamped },
  ];

  return (
    <section className={cn(pePanel, "relative", className)}>
      <div className="flex items-center justify-between">
        <p className="font-dashboard-body text-base font-semibold text-gray-900">
          {t("dashboard.postEnrollment.peReadinessTitle")}
        </p>
      </div>
      <p className="font-dashboard-body mt-1 text-xs text-gray-500">
        {t("dashboard.postEnrollment.peReadinessSubtitle")}
      </p>

      <div className="relative mx-auto mt-5 h-[180px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="72%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive
            >
              <Cell fill="var(--color-primary)" />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="font-dashboard-heading text-4xl font-bold tabular-nums text-gray-900">{clamped}</p>
          <p className="font-dashboard-body mt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            / 100
          </p>
          <p className="font-dashboard-body mt-1 text-xs font-semibold text-[var(--color-success)]">
            {t(labelKey)}
          </p>
        </div>
      </div>

      <p className="font-dashboard-body mt-3 text-center text-xs text-gray-500">
        {t("dashboard.postEnrollment.peReadinessSubtitle")}
      </p>

      <button
        type="button"
        onClick={onLaunchSimulator}
        className="font-dashboard-body mt-4 w-full rounded-lg border border-gray-900 bg-gray-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
      >
        {t("dashboard.postEnrollment.peLaunchSimulator")}
      </button>
    </section>
  );
}
