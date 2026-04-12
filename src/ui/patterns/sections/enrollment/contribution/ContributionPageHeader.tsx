import { ArrowLeft } from "lucide-react";
import { Button } from "@/ui/components/Button";

export interface ContributionPageHeaderProps {
  onBack: () => void;
}

export function ContributionPageHeader({ onBack }: ContributionPageHeaderProps) {
  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        size="custom"
        onClick={onBack}
        className="mb-3 inline-flex h-auto min-h-0 items-center gap-1 px-0 py-0 text-enroll-back font-semibold text-secondary hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back
      </Button>
      <h1 className="text-2xl font-bold text-primary">Set your retirement savings</h1>
      <p className="mt-1 text-enroll-subtitle text-secondary">
        We&apos;ll guide you to the right contribution for your future
      </p>
    </div>
  );
}
