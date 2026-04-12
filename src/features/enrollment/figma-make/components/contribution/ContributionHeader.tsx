import { EnrollmentHeader } from "../shell";

type ContributionHeaderProps = {
  onBack: () => void;
};

/** Plan → Contribution step — title block (Figma hierarchy). */
export function ContributionHeader({ onBack }: ContributionHeaderProps) {
  return (
    <EnrollmentHeader
      title="Set your retirement savings"
      subtitle="We'll guide you to the right contribution for your future"
      subtitleVariant="default"
      onBack={onBack}
    />
  );
}
