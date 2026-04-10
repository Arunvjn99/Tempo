import { Sparkles } from "lucide-react";

export interface ReadinessRecommendedBannerSectionProps {
  potentialScore: number;
  totalPotentialIncrease: number;
}

export function ReadinessRecommendedBannerSection({
  potentialScore,
  totalPotentialIncrease,
}: ReadinessRecommendedBannerSectionProps) {
  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-primary/5 to-muted px-5 py-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-[0.9rem] font-bold text-foreground">Recommended for You</p>
        </div>
        <div className="rounded-lg bg-success/10 px-2 py-1">
          <p className="text-[0.75rem] font-extrabold text-success">Score: {potentialScore}</p>
        </div>
      </div>
      <p className="text-[0.8rem] leading-relaxed text-muted-foreground">
        You can reach a score of <span className="font-semibold text-primary">{potentialScore}</span> — apply the
        recommendations below to boost your readiness by{" "}
        <span className="font-semibold">+{totalPotentialIncrease} points</span>.
      </p>
    </div>
  );
}
