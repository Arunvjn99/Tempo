import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/ui/components/HeroSection";
import { PreEnrollmentLayout } from "@/features/enrollment/ui/PreEnrollmentLayout";
import { usePreEnrollmentDashboardHeader } from "@/ui/header/PreEnrollmentDashboardHeaderContext";
import {
  PreEnrollmentBentoSection,
  PreEnrollmentFooter,
  PreEnrollmentLearningSection,
} from "@/features/enrollment/ui/PreEnrollmentMarketingSections";
import { FigmaEnrollmentModal } from "@/features/enrollment/figma-v2/FigmaEnrollmentModal";

/**
 * Authenticated `/dashboard` — marketing shell + Figma Make enrollment opened from hero / header CTA.
 */
export function PreEnrollmentPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { setDashboardStartEnroll } = usePreEnrollmentDashboardHeader();

  const openModal = useCallback(() => setOpen(true), []);

  useEffect(() => {
    setDashboardStartEnroll(() => openModal);
    return () => setDashboardStartEnroll(null);
  }, [setDashboardStartEnroll, openModal]);

  const handleEnrollmentComplete = useCallback(() => {
    setOpen(false);
    navigate("/plans");
  }, [navigate]);

  return (
    <PreEnrollmentLayout>
      {open && (
        <FigmaEnrollmentModal
          onClose={() => setOpen(false)}
          onComplete={handleEnrollmentComplete}
        />
      )}
      <div className="min-h-screen min-h-[100dvh] w-full opacity-100 bg-[var(--surface-page)] text-[var(--text-primary)]">
        <main className="mx-auto flex max-w-6xl flex-col gap-32 px-6 pb-20 pt-12 md:pt-16">
          <HeroSection onStartEnroll={openModal} />
          <PreEnrollmentLearningSection />
          <PreEnrollmentBentoSection />
        </main>
        <PreEnrollmentFooter />
      </div>
    </PreEnrollmentLayout>
  );
}
