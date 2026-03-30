import { Sparkles, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { HeroIllustration } from "./HeroIllustration";
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
        "overflow-hidden rounded-3xl shadow-md",
        className,
      )}
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--color-background) 88%, var(--color-primary) 4%), var(--color-background-secondary) 100%)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="flex flex-col gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:gap-14 lg:px-12 lg:py-14 xl:gap-20">
        {/* Primary copy */}
        <div className="min-w-0 flex-1 space-y-8">
          <div className="space-y-3">
            <h1 className="font-dashboard-heading text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl lg:text-[1.75rem] xl:text-4xl">
              {greeting}
            </h1>
            <p className="font-dashboard-body max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)]">
              {t("dashboard.postEnrollment.retirementProgress")}
            </p>
          </div>

          <div className="space-y-4">
            <p className="font-dashboard-body text-sm font-medium text-[var(--color-text-secondary)]">
              {t("dashboard.postEnrollment.totalBalance")}
            </p>
            <div className="flex flex-wrap items-end gap-4">
              <p
                className="font-dashboard-heading text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl xl:text-[3.5rem] xl:leading-[1.05]"
                aria-live="polite"
              >
                {formatUsd(balance)}
              </p>
              <span
                className="mb-1.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
                style={{
                  background: "color-mix(in srgb, var(--color-success) 16%, var(--color-background))",
                  color: "var(--color-success)",
                }}
              >
                <TrendingUp className="h-4 w-4 shrink-0" aria-hidden />
                +{growthPercent}%
              </span>
            </div>
          </div>

          {/* AI insight — strip, not a nested card */}
          <div
            className="flex flex-col gap-5 rounded-2xl px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
            style={{
              background: "color-mix(in srgb, var(--color-primary) 9%, var(--color-background))",
              boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--color-primary) 12%, transparent)",
            }}
          >
            <div className="flex min-w-0 items-start gap-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "color-mix(in srgb, var(--color-primary) 18%, transparent)",
                  color: "var(--color-primary)",
                }}
                aria-hidden
              >
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="min-w-0 space-y-1">
                <p className="font-dashboard-body text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {t("dashboard.postEnrollment.peAiInsightLabel")}
                </p>
                <p className="font-dashboard-body text-sm font-medium leading-snug text-[var(--color-text)] sm:text-base">
                  {aiRecommendation}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onIncreaseContribution}
              className="font-dashboard-body shrink-0 rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--color-text-on-primary)] shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] sm:px-8"
            >
              {t("dashboard.postEnrollment.increaseContribution")}
            </button>
          </div>
        </div>

        {/* Illustration */}
        <div className="relative flex shrink-0 justify-center lg:w-[min(34%,340px)] lg:justify-end">
          <HeroIllustration className="w-full max-w-[300px] lg:max-w-none" />
        </div>
      </div>
    </header>
  );
}
