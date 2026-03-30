import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export function PostEnrollmentDashboardSkeleton() {
  return (
    <DashboardLayout header={<DashboardHeader />} fullWidthChildren>
      <div className="min-h-full bg-[var(--ds-page-bg)] pb-24">
        <div className="mx-auto max-w-[1440px] animate-pulse space-y-10 px-4 py-8 sm:px-6 lg:space-y-12 lg:px-8">
          <div className="h-64 rounded-3xl bg-[var(--color-background-secondary)] shadow-md sm:h-72" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-10 xl:gap-12">
            <div className="flex flex-col gap-10">
              <div className="h-80 rounded-3xl bg-[var(--color-background-secondary)] shadow-sm" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 rounded-2xl bg-[var(--color-background-secondary)] shadow-sm" />
                ))}
              </div>
              <div className="h-40 rounded-3xl bg-[var(--color-background-secondary)] shadow-sm" />
              <div className="h-36 rounded-3xl bg-[var(--color-background-secondary)] shadow-sm" />
            </div>
            <div className="flex flex-col gap-10">
              <div className="h-96 rounded-3xl bg-[var(--color-background-secondary)] shadow-sm" />
              <div className="h-64 rounded-3xl bg-[var(--color-background-secondary)] shadow-sm" />
              <div className="h-48 rounded-3xl bg-[var(--color-background-secondary)] shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
