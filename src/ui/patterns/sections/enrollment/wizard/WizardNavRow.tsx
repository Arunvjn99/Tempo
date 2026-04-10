import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/core/lib/utils";

interface WizardNavRowProps {
  wizardStep: number;
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function WizardNavRow({ wizardStep, canContinue, onBack, onNext }: WizardNavRowProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      {wizardStep > 1 ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[0.875rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </button>
      ) : (
        <div />
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={!canContinue}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[0.9rem] font-semibold transition-all",
          canContinue
            ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
            : "cursor-not-allowed bg-muted text-muted-foreground",
        )}
      >
        {wizardStep === 4 ? "Start Enrollment" : "Continue"}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
