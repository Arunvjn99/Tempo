import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Props = {
  balance: number;
  growthPercent: number;
  className?: string;
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function TotalBalanceCard({ balance, growthPercent, className }: Props) {
  const { t } = useTranslation();

  return (
    <div className={cn("min-w-0", className)}>
      <p className="font-dashboard-body text-sm font-medium text-[var(--color-text-secondary)]">
        {t("dashboard.postEnrollment.totalBalance")}
      </p>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <p
          className="font-dashboard-heading text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          aria-live="polite"
        >
          {formatUsd(balance)}
        </p>
        <span
          className="mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{
            background: "color-mix(in srgb, var(--color-success) 14%, var(--color-background))",
            color: "var(--color-success)",
          }}
        >
          <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
          +{growthPercent}%
        </span>
      </div>
    </div>
  );
}
