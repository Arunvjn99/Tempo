import { useState } from "react";
import { HeroSection } from "@/ui/components/HeroSection";
import { EnrollmentForm } from "@/features/enrollment/retirewiseReference/components/EnrollmentForm";
import { PreEnrollmentLayout } from "@/features/enrollment/ui/PreEnrollmentLayout";
import { RetireWiseNavbar } from "@/features/enrollment/ui/RetireWiseNavbar";
import {
  PreEnrollmentBentoSection,
  PreEnrollmentFooter,
  PreEnrollmentLearningSection,
} from "@/features/enrollment/ui/PreEnrollmentMarketingSections";

/**
 * Production pre-enrollment marketing view — composes extracted layout + hero + reference sections.
 */
export function PreEnrollmentPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <PreEnrollmentLayout>
      <RetireWiseNavbar onStartEnroll={() => setIsFormOpen(true)} />
      <EnrollmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onComplete={() => setIsFormOpen(false)}
      />
      <main className="max-w-6xl mx-auto px-6 pt-48 pb-20 flex flex-col gap-32">
        <HeroSection onStartEnroll={() => setIsFormOpen(true)} />
        <PreEnrollmentLearningSection />
        <PreEnrollmentBentoSection />
      </main>
      <PreEnrollmentFooter />
    </PreEnrollmentLayout>
  );
}
