import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

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
        <Button
          type="button"
          variant="ghost"
          size="custom"
          onClick={onBack}
          className="inline-flex h-auto min-h-0 items-center gap-1.5 px-0 py-0 text-[0.875rem] font-semibold text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Button>
      ) : (
        <div />
      )}

      <Button
        type="button"
        variant="custom"
        size="custom"
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
      </Button>
    </div>
  );
}
