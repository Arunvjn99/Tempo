// Enrollment wizard — 4-step personalization; UI in `sections/enrollment/wizard`, logic in `useEnrollmentWizard`.

import { WizardSegmentedProgress } from "@/ui/patterns/enrollment-router";
import { useEnrollmentWizard } from "../hooks/useEnrollmentWizard";
import { WizardRetirementAgeSection } from "@/ui/patterns/sections/enrollment/wizard/WizardRetirementAgeSection";
import { WizardLocationSection } from "@/ui/patterns/sections/enrollment/wizard/WizardLocationSection";
import { WizardSavingsSection } from "@/ui/patterns/sections/enrollment/wizard/WizardSavingsSection";
import { WizardInvestmentComfortSection } from "@/ui/patterns/sections/enrollment/wizard/WizardInvestmentComfortSection";
import { WizardNavRow } from "@/ui/patterns/sections/enrollment/wizard/WizardNavRow";

export function WizardPage() {
  const w = useEnrollmentWizard();

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <WizardSegmentedProgress wizardStep={w.wizardStep} />

        {w.wizardStep === 1 && (
          <WizardRetirementAgeSection
            currentAge={w.personalization.currentAge}
            retirementAge={w.personalization.retirementAge}
            retirementYear={w.retirementYear}
            yearsUntil={w.yearsUntil}
            onRetirementAgeChange={(age) => w.updatePersonalization({ retirementAge: age })}
          />
        )}

        {w.wizardStep === 2 && (
          <WizardLocationSection
            locationSearch={w.locationSearch}
            onLocationSearchChange={w.setLocationSearch}
            filteredPopular={w.filteredPopular}
            personalization={w.personalization}
            onPickLocation={(name) => w.updatePersonalization({ retirementLocation: name })}
          />
        )}

        {w.wizardStep === 3 && (
          <WizardSavingsSection
            currentSavings={w.personalization.currentSavings}
            onSavingsChange={(amount) => w.updatePersonalization({ currentSavings: amount })}
          />
        )}

        {w.wizardStep === 4 && (
          <WizardInvestmentComfortSection
            personalization={w.personalization}
            onSelectComfort={(key) => w.updatePersonalization({ investmentComfort: key })}
          />
        )}

        <WizardNavRow
          wizardStep={w.wizardStep}
          canContinue={w.canContinue}
          onBack={w.prevStep}
          onNext={w.handleNext}
        />
      </div>
    </div>
  );
}
