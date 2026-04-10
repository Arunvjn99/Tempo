import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/features/enrollment/store/derived";
import { ReadinessAnimatedScoreRing } from "./ReadinessAnimatedScoreRing";
import { getReadinessScoreMessage } from "./readinessScoreUi";

export interface ReadinessScoreHeroSectionProps {
  score: number;
  scoreColor: string;
  projectedBalance: number;
  yearsToRetirement: number;
}

export function ReadinessScoreHeroSection({
  score,
  scoreColor,
  projectedBalance,
  yearsToRetirement,
}: ReadinessScoreHeroSectionProps) {
  const message = getReadinessScoreMessage(score);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center">
        <ReadinessAnimatedScoreRing value={score} strokeColor={scoreColor} />

        <p className="mt-4 text-center text-[1.05rem] font-semibold text-foreground">{message}</p>
        <p className="mt-1 text-center text-[0.85rem] text-muted-foreground">
          You are <span className="font-semibold text-foreground">{score}% on track</span> for your retirement goal.
        </p>
        <p className="mt-1 text-center text-[0.75rem] text-muted-foreground">
          Most participants your age aim for a readiness score of 65 or higher.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[65%] rounded-full bg-border" />
          </div>
          <span className="text-[0.7rem] font-medium text-muted-foreground">
            Target: <span className="font-semibold">65</span>
          </span>
        </div>
      </div>

      <div className="my-5 border-t border-border" />

      <div className="text-center">
        <div className="mb-1 flex items-center justify-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          <p className="text-[0.78rem] font-medium text-muted-foreground">Projected retirement balance</p>
        </div>
        <p className="text-[1.8rem] font-bold tabular-nums text-foreground">{formatCurrency(projectedBalance)}</p>
        <p className="mt-0.5 text-[0.75rem] text-muted-foreground">
          In {yearsToRetirement} years with your current settings.
        </p>
      </div>
    </div>
  );
}
