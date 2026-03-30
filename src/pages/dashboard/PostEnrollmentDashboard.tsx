import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeftRight, Landmark, Repeat2, Wallet } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  ActiveLoanCard,
  AdvisorCard,
  LearningHub,
  MonthlyContribution,
  NextBestActions,
  PerformanceChart,
  PortfolioAllocation,
  PostEnrollmentDashboardHeader,
  QuickActions,
  type QuickActionItem,
  ReadinessScore,
  RecentActivity,
} from "@/components/dashboard/post-enrollment";
import { PostEnrollmentDashboardSkeleton } from "@/components/dashboard/post-enrollment/PostEnrollmentDashboardSkeleton";
import { useUser } from "@/context/UserContext";
import { advisorAvatars } from "@/assets/avatars";
import { getRoutingVersion, withVersion, withVersionIfEnrollment } from "@/core/version";
import { usePostEnrollmentDashboardStore } from "@/stores/postEnrollmentDashboardStore";

/**
 * Post-enrollment home — asymmetric 70/30 layout (Figma hierarchy).
 * Left: hero → quick actions → contributions → learning → portfolio → performance → activity.
 * Right: readiness → loan → next actions → advisor.
 */
export const PostEnrollmentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const { profile, loading } = useUser();
  const data = usePostEnrollmentDashboardStore((s) => s.data);
  const displayName = usePostEnrollmentDashboardStore((s) => s.displayName);
  const setUserDisplayName = usePostEnrollmentDashboardStore((s) => s.setUserDisplayName);

  useEffect(() => {
    const first = profile?.name?.trim()?.split(/\s+/)[0];
    if (first) setUserDisplayName(first);
  }, [profile?.name, setUserDisplayName]);

  const increaseContribution = () => navigate(withVersion(version, "/enrollment/contribution"));

  const quickActions: QuickActionItem[] = useMemo(
    () => [
      {
        id: "loan",
        title: t("dashboard.postEnrollment.cmdQALoanTitle"),
        description: t("dashboard.postEnrollment.cmdQALoanDesc"),
        icon: Landmark,
        onClick: () => navigate(withVersion(version, "/transactions/loan/eligibility")),
      },
      {
        id: "withdraw",
        title: t("dashboard.postEnrollment.cmdQAWithdrawTitle"),
        description: t("dashboard.postEnrollment.cmdQAWithdrawDesc"),
        icon: Wallet,
        onClick: () => navigate(withVersion(version, "/transactions/withdraw")),
      },
      {
        id: "transfer",
        title: t("dashboard.postEnrollment.peQATransferTitle"),
        description: t("dashboard.postEnrollment.peQATransferDesc"),
        icon: ArrowLeftRight,
        onClick: () => navigate(withVersion(version, "/transactions")),
      },
      {
        id: "rollover",
        title: t("dashboard.postEnrollment.cmdQARolloverTitle"),
        description: t("dashboard.postEnrollment.cmdQARolloverDesc"),
        icon: Repeat2,
        onClick: () => navigate(withVersion(version, "/transactions/rollover")),
      },
    ],
    [navigate, t, version],
  );

  const advisor = useMemo(
    () => ({
      ...data.advisor,
      imageSrc: data.advisor.imageSrc || advisorAvatars.maya,
      nextAvailableLabel: t(data.advisor.nextAvailable),
    }),
    [data.advisor, t],
  );

  if (loading) {
    return <PostEnrollmentDashboardSkeleton />;
  }

  return (
    <DashboardLayout header={<DashboardHeader />} fullWidthChildren>
      <div className="post-enrollment-dashboard min-h-full bg-[#F5F7FA] pb-16 font-dashboard-body text-[var(--color-text)]">
        <main className="mx-auto max-w-[1280px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <PostEnrollmentDashboardHeader
            userName={displayName}
            balance={data.balance}
            growthPercent={data.growthPercent}
            aiRecommendation={t(data.aiRecommendation)}
            onIncreaseContribution={increaseContribution}
          />

          {/* Asymmetric primary / secondary columns (~70% / ~30%) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
            <div className="flex min-w-0 flex-col gap-6">
              <QuickActions actions={quickActions} />
              <MonthlyContribution
                userMonthly={data.contributions.userMonthly}
                employerMonthly={data.contributions.employerMonthly}
                userPercent={data.contributions.userPercent}
                employerPercent={data.contributions.employerPercent}
              />
              <LearningHub
                title={t(data.learning.titleKey)}
                description={t(data.learning.descriptionKey)}
                href={data.learning.href}
              />
              <PortfolioAllocation portfolio={data.portfolio} onViewDetails={() => navigate("/investments")} />
              <PerformanceChart data={data.performance} />
              <RecentActivity items={data.activities} />
            </div>

            <aside className="flex min-w-0 flex-col gap-6">
              <ReadinessScore
                score={data.readinessScore}
                labelKey={data.readinessLabelKey}
                onLaunchSimulator={() => navigate("/dashboard/investment-portfolio")}
              />
              <ActiveLoanCard
                loan={data.loan}
                onManage={() => navigate(withVersion(version, "/transactions/loan/eligibility"))}
              />
              <NextBestActions
                actions={data.nextActions}
                onAction={(route) => navigate(withVersionIfEnrollment(version, route))}
              />
              <AdvisorCard
                name={advisor.name}
                title={advisor.title}
                organization={advisor.organization}
                rating={advisor.rating}
                experienceYears={advisor.experienceYears}
                imageSrc={advisor.imageSrc}
                nextAvailableLabel={advisor.nextAvailableLabel}
                onMessage={() => navigate("/profile")}
                onSchedule={() => navigate("/profile")}
              />
            </aside>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};
