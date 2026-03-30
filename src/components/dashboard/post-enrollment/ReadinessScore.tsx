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
    <section
      className={cn(
        pePanel,
        "relative overflow-hidden",
        className,
      )}
      style={{
        background:
          "linear-gradient(165deg, color-mix(in srgb, var(--color-primary) 7%, var(--color-background)) 0%, var(--color-background) 48%, var(--color-background) 100%)",
      }}
    >
      <p className="font-dashboard-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        {t("dashboard.postEnrollment.peReadinessTitle")}
      </p>
      <p className="font-dashboard-body mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {t("dashboard.postEnrollment.peReadinessSubtitle")}
      </p>

      <div className="relative mx-auto mt-8 h-[220px] w-[220px] shrink-0 sm:h-[240px] sm:w-[240px]">
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
              <Cell fill="var(--ds-readiness-track)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="font-dashboard-heading text-4xl font-bold tabular-nums text-[var(--color-text)] sm:text-5xl">{clamped}</p>
          <p className="font-dashboard-body mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-success)]">
            {t(labelKey)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLaunchSimulator}
        className="font-dashboard-body mt-8 w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-semibold text-[var(--color-text-on-primary)] shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
      >
        {t("dashboard.postEnrollment.peLaunchSimulator")}
      </button>
    </section>
  );
}
