import { useTranslation } from "react-i18next";
import type { LoanSlice } from "@/stores/postEnrollmentDashboardStore";
import { cn } from "@/lib/utils";
import { pePanelTight } from "./dashboardSurfaces";

type Props = {
  loan: LoanSlice;
  onManage: () => void;
  className?: string;
};

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
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

export function ActiveLoanCard({ loan, onManage, className }: Props) {
  const { t } = useTranslation();
  const paidRatio = loan.originalPrincipal > 0 ? loan.paidPrincipal / loan.originalPrincipal : 0;

  return (
    <section
      className={cn(pePanelTight, className)}
      style={{
        background:
          "linear-gradient(180deg, var(--color-background) 0%, color-mix(in srgb, var(--color-background-secondary) 40%, var(--color-background)) 100%)",
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="font-dashboard-heading text-lg font-semibold text-[var(--color-text)]">
          {t("dashboard.postEnrollment.peActiveLoanTitle")}
        </h2>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{
            background: "color-mix(in srgb, var(--color-success) 14%, var(--color-background))",
            color: "var(--color-success)",
          }}
        >
          {t(loan.statusLabel)}
        </span>
      </div>
      <p className="font-dashboard-body mt-2 text-sm text-[var(--color-text-secondary)]">{loan.productName}</p>

      <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-dashboard-body text-[var(--color-text-secondary)]">
            {t("dashboard.postEnrollment.peLoanRemaining")}
          </dt>
          <dd className="font-dashboard-heading mt-1 font-semibold tabular-nums text-[var(--color-text)]">
            {money(loan.remainingPrincipal)}
          </dd>
        </div>
        <div>
          <dt className="font-dashboard-body text-[var(--color-text-secondary)]">
            {t("dashboard.postEnrollment.peLoanNextPayment")}
          </dt>
          <dd className="font-dashboard-heading mt-1 font-semibold text-[var(--color-text)]">
            {money(loan.nextPaymentAmount)} · {formatDate(loan.nextPaymentDate)}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-[var(--color-text-secondary)]">
          <span>{t("dashboard.postEnrollment.peLoanPaid")}</span>
          <span className="tabular-nums">{Math.round(paidRatio * 100)}%</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: "var(--ds-readiness-track)" }}
          role="progressbar"
          aria-valuenow={Math.round(paidRatio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-all"
            style={{ width: `${paidRatio * 100}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onManage}
        className="font-dashboard-body mt-6 w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-[var(--color-text-on-primary)] shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
      >
        {t("dashboard.postEnrollment.peLoanManage")}
      </button>
    </section>
  );
}
