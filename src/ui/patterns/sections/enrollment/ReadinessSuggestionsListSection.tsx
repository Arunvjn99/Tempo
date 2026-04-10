import { ArrowRight, Award } from "lucide-react";
import { Button } from "@/ui/components/Button";
import { formatCurrency } from "@/features/enrollment/store/derived";
import type { ReadinessSuggestionView } from "@/features/enrollment/store/readinessSuggestions";
import { cn } from "@/core/lib/utils";

export interface ReadinessSuggestionsListSectionProps {
  suggestions: ReadinessSuggestionView[];
  currentScore: number;
  onRequestApply: (s: ReadinessSuggestionView) => void;
}

export function ReadinessSuggestionsListSection({
  suggestions,
  currentScore,
  onRequestApply,
}: ReadinessSuggestionsListSectionProps) {
  if (suggestions.length === 0) return null;

  return (
    <div>
      <p className="mb-1 text-[0.95rem] font-semibold text-foreground">Optional ways to improve your readiness</p>
      <p className="mb-3 text-[0.75rem] text-muted-foreground">
        Apply one of these improvements to increase your retirement readiness score.
      </p>

      <div className="space-y-2.5">
        {suggestions.map((s, idx) => {
          const isTop = idx === 0;
          return (
            <div
              key={s.type}
              className={cn(
                "rounded-xl border transition-all",
                isTop ? "border-primary/30 bg-card" : "border-border bg-muted/30",
              )}
            >
              <div className="p-4">
                {isTop && (
                  <div className="mb-2.5 flex items-center gap-1">
                    <Award className="h-3 w-3 text-primary" />
                    <span className="text-[0.62rem] font-semibold uppercase tracking-wide text-primary">
                      Recommended
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                      isTop ? "bg-primary/10" : "bg-muted",
                    )}
                  >
                    {s.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.85rem] font-semibold text-foreground">{s.title}</p>
                    <p className="mt-0.5 text-[0.75rem] leading-relaxed text-muted-foreground">{s.description}</p>

                    <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
                      <div>
                        <p className="text-[0.62rem] font-medium text-muted-foreground">Score</p>
                        <div className="mt-0.5 flex items-center gap-1">
                          <span className="text-[0.85rem] font-semibold text-muted-foreground tabular-nums">
                            {currentScore}
                          </span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[0.85rem] font-bold text-success tabular-nums">{s.newScore}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[0.62rem] font-medium text-muted-foreground">Savings</p>
                        <p className="mt-0.5 text-[0.85rem] font-bold text-primary tabular-nums">
                          +{formatCurrency(s.additionalAnnualSavings)}/yr
                        </p>
                      </div>
                      <div>
                        <p className="text-[0.62rem] font-medium text-muted-foreground">Balance</p>
                        <p className="mt-0.5 text-[0.85rem] font-bold text-foreground tabular-nums">
                          {formatCurrency(s.projectedBalance)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="custom"
                  size="custom"
                  onClick={() => onRequestApply(s)}
                  className="mt-3 w-full rounded-lg border border-primary/30 bg-card px-4 py-2 text-[0.8rem] font-semibold text-foreground transition-all hover:bg-primary/5"
                >
                  Apply Recommendation
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
