import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
        title: "Missing beneficiary",
        description: "Legal requirement - Action Required",
        ctaLabel: "Resolve Now",
        onCtaClick: () => navigate("/profile"),
      },
      {
        variant: "insight" as const,
        title: "Optimization Insight",
        description: "Increase savings by 1% to retire 2 years earlier",
        ctaLabel: "View Plan",
        onCtaClick: () => navigate(withVersion(version, "/enrollment/choose-plan")),
      },
    ],
    [navigate, version],
  );

  const allocationRows = useMemo(
    () => [
      { label: "Domestic Equities", percent: 42, barColorVar: "var(--primary)" },
      { label: "International Stocks", percent: 28, barColorVar: "var(--primary)" },
      { label: "Fixed Income & Bonds", percent: 20, barColorVar: "var(--primary)" },
      { label: "Cash Alternatives", percent: 10, barColorVar: "var(--primary)" },
    ],
    [],
  );

  const quickActions = useMemo(
    () => [
      {
        id: "loan",
        title: "Take a Loan",
        description: "Borrow from your plan",
        icon: Landmark,
        route: "/transactions/loan",
      },
      {
        id: "withdraw",
        title: "Withdraw",
        description: "Access your funds",
        icon: Wallet,
        route: "/transactions/withdraw",
      },
      {
        id: "rollover",
        title: "Rollover",
        description: "Move retirement funds",
        icon: Repeat2,
        route: "/transactions/rollover",
      },
      {
        id: "rebalance",
        title: "Rebalance",
        description: "Adjust your portfolio",
        icon: Scale,
        route: "/transactions/rebalance",
      },
    ],
    [],
  );

  const activityItems = useMemo(
    () => [
      {
        id: "1",
        title: "Payroll Contribution",
        subtitle: "Nov 14, 2023 • +$1,200.00",
        variant: "primary" as const,
      },
      {
        id: "2",
        title: "AI Allocation Adjust",
        subtitle: "Nov 10, 2023 • System optimized",
        icon: Zap,
        variant: "ai" as const,
      },
      {
        id: "3",
        title: "Quarterly Statement",
        subtitle: "Oct 30, 2023 • Download available",
        icon: Download,
        variant: "muted" as const,
      },
    ],
    [],
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
            aiMessage="Increase your contribution by 1% to reach your goal 2 years earlier."
            ctaLabel="Increase Contribution"
            onCtaClick={() => navigate(withVersion(version, "/enrollment/contribution"))}
            onAiActionClick={() => navigate(withVersion(version, "/enrollment/contribution"))}
          />

          <MonthlyContributionCard />

          <InsightCards cards={insightCards} />

          <div className="mb-12 grid grid-cols-12 gap-6 lg:gap-8">
            <ReadinessScore
              className="col-span-12 lg:col-span-4"
              score={68}
              footerText="You're ahead of 64% of users in your age group."
              aiRecommendation="AI Recommended: Increase Diversification"
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
            imageAlt="Financial wellness"
            onKnowMore={() => window.open("https://enrich.org/", "_blank", "noopener,noreferrer")}
          />
        </main>

        <AIToast
          visible={showAiToast}
          message="You're contributing 15% less than similar users in your field."
          actionLabel="Fix this"
          onActionClick={() => navigate(withVersion(version, "/enrollment/contribution"))}
          onDismiss={() => setShowAiToast(false)}
        />
      </div>
    </DashboardLayout>
  );
};
