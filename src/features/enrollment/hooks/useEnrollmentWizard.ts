import { useMemo, useState, useCallback } from "react";
import { useEnrollmentStore } from "../store";
import { POPULAR_LOCATIONS } from "@/ui/patterns/sections/enrollment/wizard/wizardConstants";

export function useEnrollmentWizard() {
  const [locationSearch, setLocationSearch] = useState("");

  const personalization = useEnrollmentStore((s) => s.personalization);
  const wizardStep = useEnrollmentStore((s) => s.wizardStep);
  const updatePersonalization = useEnrollmentStore((s) => s.updatePersonalization);
  const updateEnrollment = useEnrollmentStore((s) => s.updateEnrollment);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);

  const retirementYear = useMemo(
    () => new Date().getFullYear() + (personalization.retirementAge - personalization.currentAge),
    [personalization.retirementAge, personalization.currentAge],
  );
  const yearsUntil = personalization.retirementAge - personalization.currentAge;

  const canContinue = useMemo(() => {
    if (wizardStep === 1) return personalization.retirementAge >= 50 && personalization.retirementAge <= 75;
    if (wizardStep === 2) return !!personalization.retirementLocation;
    if (wizardStep === 3) return personalization.currentSavings !== undefined;
    if (wizardStep === 4) return !!personalization.investmentComfort;
    return false;
  }, [wizardStep, personalization]);

  const handleNext = useCallback(() => {
    if (!canContinue) return;
    if (wizardStep === 4) {
      updateEnrollment({ riskLevel: personalization.investmentComfort });
      updatePersonalization({ wizardCompleted: true });
      nextStep();
    } else {
      nextStep();
    }
  }, [
    canContinue,
    wizardStep,
    updateEnrollment,
    updatePersonalization,
    nextStep,
    personalization.investmentComfort,
  ]);

  const filteredPopular = useMemo(
    () => POPULAR_LOCATIONS.filter((loc) => loc.name.toLowerCase().includes(locationSearch.toLowerCase())),
    [locationSearch],
  );

  return {
    locationSearch,
    setLocationSearch,
    personalization,
    wizardStep,
    updatePersonalization,
    prevStep,
    retirementYear,
    yearsUntil,
    canContinue,
    handleNext,
    filteredPopular,
  };
}
