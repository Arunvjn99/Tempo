import { ArrowLeft } from "lucide-react";

export interface ContributionPageHeaderProps {
  onBack: () => void;
}

export function ContributionPageHeader({ onBack }: ContributionPageHeaderProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1 text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back
      </button>
      <h1 className="text-2xl font-bold text-foreground">Set your retirement savings</h1>
      <p className="mt-1 text-[0.95rem] text-muted-foreground">
        We&apos;ll guide you to the right contribution for your future
      </p>
    </div>
  );
}
