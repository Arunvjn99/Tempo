import { EnrollmentHeader } from "../shell";

type InvestmentHeaderProps = {
  onBack: () => void;
};

/** Auto-increase → Investment step — title block (Figma hierarchy). */
export function InvestmentHeader({ onBack }: InvestmentHeaderProps) {
  return (
    <EnrollmentHeader
      title="Your Investment Strategy"
      subtitle="See how each contribution source is invested."
      subtitleVariant="compact"
      onBack={onBack}
    />
  );
}
