import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Download, Landmark, Repeat2, Scale, Wallet, Zap } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  AdvisorCard,
  AIToast,
  DashboardHero,
  FeaturedLearningCard,
  InsightCards,
  MonthlyContributionCard,
  PortfolioAllocation,
  QuickActions,
  ReadinessScore,
  RecentActivity,
} from "@/components/dashboard/command-center";
import { useUser } from "@/context/UserContext";
import { advisorAvatars } from "@/assets/avatars";
import { getRoutingVersion, withVersion } from "@/core/version";

/**
 * Post-enrollment home — Snitch command-center layout (`dashboard-design-system` tokens).
 * Single {@link FeaturedLearningCard} (no carousel). Routed at `/dashboard/post-enrollment` and `/:version/dashboard`.
 */
export const PostEnrollmentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const { profile, loading } = useUser();
  const [showAiToast, setShowAiToast] = useState(true);

  useEffect(() => {
    if (loading) return;
    console.log("POST DASHBOARD LOADED");
  }, [loading]);

  // POC mode — always allow access (no enrollmentStatus redirect)

  const firstName = profile?.name?.split(/\s+/)[0] ?? "there";

  const insightCards = useMemo(
    () => [
      {
        variant: "urgent" as const,
        title: t("dashboard.postEnrollment.cmdInsight1Title"),
        description: t("dashboard.postEnrollment.cmdInsight1Desc"),
        ctaLabel: t("dashboard.postEnrollment.cmdInsight1Cta"),
        onCtaClick: () => navigate("/profile"),
      },
      {
        variant: "insight" as const,
        title: t("dashboard.postEnrollment.cmdInsight2Title"),
        description: t("dashboard.postEnrollment.cmdInsight2Desc"),
        ctaLabel: t("dashboard.postEnrollment.cmdInsight2Cta"),
        onCtaClick: () => navigate(withVersion(version, "/enrollment/choose-plan")),
      },
    ],
    [navigate, t, version],
  );

  const allocationRows = useMemo(
    () => [
      { label: t("dashboard.postEnrollment.cmdAllocDomestic"), percent: 42, barColorVar: "var(--primary)" },
      { label: t("dashboard.postEnrollment.cmdAllocIntl"), percent: 28, barColorVar: "var(--primary)" },
      { label: t("dashboard.postEnrollment.cmdAllocFixed"), percent: 20, barColorVar: "var(--primary)" },
      { label: t("dashboard.postEnrollment.cmdAllocCash"), percent: 10, barColorVar: "var(--primary)" },
    ],
    [t],
  );

  const quickActions = useMemo(
    () => [
      {
        id: "loan",
        title: t("dashboard.postEnrollment.cmdQALoanTitle"),
        description: t("dashboard.postEnrollment.cmdQALoanDesc"),
        icon: Landmark,
        route: "/transactions/loan",
      },
      {
        id: "withdraw",
        title: t("dashboard.postEnrollment.cmdQAWithdrawTitle"),
        description: t("dashboard.postEnrollment.cmdQAWithdrawDesc"),
        icon: Wallet,
        route: "/transactions/withdraw",
      },
      {
        id: "rollover",
        title: t("dashboard.postEnrollment.cmdQARolloverTitle"),
        description: t("dashboard.postEnrollment.cmdQARolloverDesc"),
        icon: Repeat2,
        route: "/transactions/rollover",
      },
      {
        id: "rebalance",
        title: t("dashboard.postEnrollment.cmdQARebalanceTitle"),
        description: t("dashboard.postEnrollment.cmdQARebalanceDesc"),
        icon: Scale,
        route: "/transactions/rebalance",
      },
    ],
    [t],
  );

  const activityItems = useMemo(
    () => [
      {
        id: "1",
        title: t("dashboard.postEnrollment.cmdActPayrollTitle"),
        subtitle: t("dashboard.postEnrollment.cmdActPayrollSub"),
        variant: "primary" as const,
      },
      {
        id: "2",
        title: t("dashboard.postEnrollment.cmdActAITitle"),
        subtitle: t("dashboard.postEnrollment.cmdActAISub"),
        icon: Zap,
        variant: "ai" as const,
      },
      {
        id: "3",
        title: t("dashboard.postEnrollment.cmdActStmtTitle"),
        subtitle: t("dashboard.postEnrollment.cmdActStmtSub"),
        icon: Download,
        variant: "muted" as const,
      },
    ],
    [t],
  );

  if (loading) return null;

  return (
    <DashboardLayout header={<DashboardHeader />} fullWidthChildren>
      <div className="dashboard-design-system min-h-full bg-[var(--bg-primary)] pb-20 text-[var(--text-primary)]">
        <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-4 sm:px-6 lg:px-8 lg:pt-6">
          <DashboardHero
            userName={firstName}
            totalBalance="$324,560.21"
            growthPercent={2.4}
            aiMessage={t("dashboard.postEnrollment.cmdHeroAiMessage")}
            ctaLabel={t("dashboard.postEnrollment.cmdHeroCta")}
            onCtaClick={() => navigate(withVersion(version, "/enrollment/contribution"))}
            onAiActionClick={() => navigate(withVersion(version, "/enrollment/contribution"))}
          />

          <MonthlyContributionCard />

          <InsightCards cards={insightCards} />

          <div className="mb-12 grid grid-cols-12 gap-6 lg:gap-8">
            <ReadinessScore
              className="col-span-12 lg:col-span-4"
              score={68}
              footerText={t("dashboard.postEnrollment.cmdReadinessFooter")}
              aiRecommendation={t("dashboard.postEnrollment.cmdReadinessAi")}
            />
            <PortfolioAllocation
              className="col-span-12 lg:col-span-8"
              rows={allocationRows}
              onDetailsClick={() => navigate("/investments")}
            />
            <QuickActions className="col-span-12 lg:col-span-4" actions={quickActions} />
            <RecentActivity className="col-span-12 lg:col-span-4" items={activityItems} />
            <AdvisorCard
              className="col-span-12 lg:col-span-4"
              organization="Strategic Wealth Management"
              advisorName="Sarah Jenkins"
              credentials="CFP®"
              availability="Next avail: Today, 2:00 PM"
              imageSrc={advisorAvatars.maya}
              onBookClick={() => navigate("/profile")}
            />
          </div>

          <FeaturedLearningCard
            imageAlt={t("dashboard.postEnrollment.featuredLearningAlt")}
            onKnowMore={() => window.open("https://enrich.org/", "_blank", "noopener,noreferrer")}
          />
        </main>

        <AIToast
          visible={showAiToast}
          message={t("dashboard.postEnrollment.cmdAiToastMessage")}
          actionLabel={t("dashboard.postEnrollment.cmdAiToastAction")}
          onActionClick={() => navigate(withVersion(version, "/enrollment/contribution"))}
          onDismiss={() => setShowAiToast(false)}
        />
      </div>
    </DashboardLayout>
  );
};
