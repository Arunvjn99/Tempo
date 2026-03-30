import { ArrowLeftRight, Download, Landmark, RefreshCw, Wallet, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ActivityEntry } from "@/stores/postEnrollmentDashboardStore";
import { cn } from "@/lib/utils";
import { pePanel } from "./dashboardSurfaces";

type Props = {
  items: ActivityEntry[];
  className?: string;
};

function iconFor(type: ActivityEntry["type"]) {
  switch (type) {
    case "contribution":
      return Wallet;
    case "dividend":
      return Zap;
    case "loan_payment":
      return Landmark;
    case "transfer":
      return ArrowLeftRight;
    case "rebalance":
      return RefreshCw;
    default:
      return Wallet;
  }
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

function formatMoney(n: number) {
  const abs = Math.abs(n);
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(abs);
  return n < 0 ? `-${formatted}` : `+${formatted}`;
}

export function RecentActivity({ items, className }: Props) {
  const { t } = useTranslation();
  const divider = "color-mix(in srgb, var(--color-border) 45%, transparent)";

  return (
    <section className={cn(pePanel, className)}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-dashboard-heading text-base font-semibold text-gray-900">
          {t("dashboard.postEnrollment.recentTransactions")}
        </h2>
        <button
          type="button"
          className="font-dashboard-body text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          {t("dashboard.postEnrollment.viewAll")}
        </button>
      </div>
      <ul className="mt-4">
        {items.map((item, i) => {
          const Icon = iconFor(item.type);
          const positive = item.amount != null && (item.amountIsPositive ?? item.amount >= 0);
          return (
            <li
              key={item.id}
              className="flex gap-3 py-3 first:pt-0 last:pb-0"
              style={{
                borderTop: i === 0 ? undefined : `1px solid ${divider}`,
              }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "color-mix(in srgb, var(--color-primary) 10%, var(--color-background-secondary))",
                  color: "var(--color-primary)",
                }}
                aria-hidden
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-dashboard-body text-sm font-medium text-[var(--color-text)]">{item.title}</p>
                <p className="font-dashboard-body mt-1 text-xs text-[var(--color-text-secondary)]">
                  {formatDate(item.date)}
                </p>
              </div>
              {item.amount != null && (
                <p
                  className={cn(
                    "font-dashboard-heading shrink-0 text-sm font-semibold tabular-nums",
                    positive ? "text-[var(--color-success)]" : "text-[var(--color-text)]",
                  )}
                >
                  {formatMoney(item.amount)}
                </p>
              )}
              {item.amount == null && (
                <span className="text-[var(--color-text-tertiary)]" aria-hidden>
                  <Download className="h-4 w-4" />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
