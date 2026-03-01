import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import {
  HeroSection,
  HeroSkeleton,
  LearningSection,
  LearningSkeleton,
  AdvisorSection,
  AdvisorSkeleton,
} from "../../components/pre-enrollment";
import { useUser } from "../../context/UserContext";

export const PreEnrollment = () => {
  const { loading } = useUser();

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div>
        {loading ? (
          <>
            <HeroSkeleton />
            <LearningSkeleton />
            <AdvisorSkeleton />
          </>
        ) : (
          <>
            <HeroSection />
            <LearningSection />
            <AdvisorSection />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
