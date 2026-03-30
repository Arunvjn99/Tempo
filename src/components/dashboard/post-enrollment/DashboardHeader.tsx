import { Sparkles, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Props = {
  userName: string;
  balance: number;
  growthPercent: number;
  aiRecommendation: string;
  onIncreaseContribution: () => void;
  className?: string;
};

function greetingKey(hour: number): "morning" | "afternoon" | "evening" {
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function PostEnrollmentDashboardHeader({
  userName,
  balance,
  growthPercent,
  aiRecommendation,
  onIncreaseContribution,
  className,
}: Props) {
  const { t } = useTranslation();
  const hour = new Date().getHours();
  const part = greetingKey(hour);
  const greeting =
    part === "morning"
      ? t("dashboard.postEnrollment.peGreetMorning", { name: userName })
      : part === "afternoon"
        ? t("dashboard.postEnrollment.peGreetAfternoon", { name: userName })
        : t("dashboard.postEnrollment.peGreetEvening", { name: userName });

  return (
    <header
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm",
        className,
      )}
    >
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        {/* Title row */}
        <div className="mb-4">
          <h1 className="font-dashboard-heading text-xl font-semibold tracking-tight text-gray-900">
            {greeting}
          </h1>
          <p className="font-dashboard-body mt-0.5 text-sm text-gray-500">
            {t("dashboard.postEnrollment.retirementProgress")}
          </p>
        </div>

        {/* Balance + growth */}
        <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 pb-4">
          <div>
            <p className="font-dashboard-body text-xs font-medium uppercase tracking-wider text-gray-500">
              {t("dashboard.postEnrollment.totalBalance")}
            </p>
            <p
              className="font-dashboard-heading mt-1 text-3xl font-bold tabular-nums tracking-tight text-gray-900 sm:text-4xl"
              aria-live="polite"
            >
              {formatUsd(balance)}
            </p>
          </div>
          <span
            className="mb-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
            style={{
              background: "color-mix(in srgb, var(--color-success) 14%, #f0fdf4)",
              color: "var(--color-success)",
            }}
          >
            <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
            +{growthPercent}% this quarter
          </span>
        </div>

        {/* AI insight strip */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                color: "var(--color-primary)",
              }}
              aria-hidden
            >
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="font-dashboard-body text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {t("dashboard.postEnrollment.peAiInsightLabel")}
              </p>
              <p className="font-dashboard-body text-sm font-medium leading-snug text-gray-700">
                {aiRecommendation}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onIncreaseContribution}
            className="font-dashboard-body shrink-0 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-on-primary)] shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
          >
            {t("dashboard.postEnrollment.increaseContribution")}
          </button>
        </div>
      </div>
    </header>
  );
}
