import { TrendingUp, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { computeReadinessScore, formatPercent } from "./derived";
import type { EnrollmentState, PersonalizationState, RiskLevel, SuggestionType } from "./types";

export interface ReadinessSuggestionView {
  type: SuggestionType;
  icon: ReactNode;
  title: string;
  description: string;
  scoreIncrease: number;
  newScore: number;
  additionalAnnualSavings: number;
  projectedBalance: number;
  currentLabel: string;
  currentValue: string;
  newLabel: string;
  newValue: string;
}

export function buildReadinessSuggestions(
  enrollment: EnrollmentState,
  personalization: PersonalizationState,
  currentScore: number,
  projectedBalance: number,
): ReadinessSuggestionView[] {
  const { contributionPercent, autoIncrease, riskLevel, salary } = enrollment;
  const { yearsToRetirement, currentSavings } = {
    yearsToRetirement: Math.max(0, personalization.retirementAge - personalization.currentAge),
    currentSavings: personalization.currentSavings,
  };

  const suggestions: ReadinessSuggestionView[] = [];

  const computeScore = (patch: {
    contributionPercent?: number;
    autoIncrease?: boolean;
    riskLevel?: RiskLevel;
  }) =>
    computeReadinessScore({
      contributionPercent: patch.contributionPercent ?? contributionPercent,
      autoIncrease: patch.autoIncrease ?? autoIncrease,
      yearsToRetirement,
      currentSavings,
      riskLevel: patch.riskLevel ?? riskLevel,
    });

  if (contributionPercent < 10) {
    const newPct = contributionPercent + 2;
    suggestions.push({
      type: "boost-contribution",
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
      title: "Boost Contribution by 2%",
      description: `Increase from ${formatPercent(contributionPercent)} to ${formatPercent(newPct)}`,
      scoreIncrease: computeScore({ contributionPercent: newPct }) - currentScore,
      newScore: computeScore({ contributionPercent: newPct }),
      additionalAnnualSavings: Math.round((salary * 2) / 100),
      projectedBalance: projectedBalance * 1.12,
      currentLabel: "Current Rate",
      currentValue: formatPercent(contributionPercent),
      newLabel: "New Rate",
      newValue: formatPercent(newPct),
    });
  }

  if (!autoIncrease) {
    suggestions.push({
      type: "enable-auto-increase",
      icon: <Zap className="h-4 w-4 text-primary" />,
      title: "Enable Auto-Increase",
      description: "Grow contributions 1% per year automatically",
      scoreIncrease: computeScore({ autoIncrease: true }) - currentScore,
      newScore: computeScore({ autoIncrease: true }),
      additionalAnnualSavings: Math.round((salary * 1) / 100),
      projectedBalance: projectedBalance * 1.08,
      currentLabel: "Auto-Increase",
      currentValue: "Off",
      newLabel: "Auto-Increase",
      newValue: "Enabled",
    });
  }

  if (riskLevel === "conservative" || riskLevel === "balanced") {
    const newRisk = riskLevel === "conservative" ? "balanced" : "growth";
    suggestions.push({
      type: "increase-risk",
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
      title: "Increase Risk Level",
      description: "Move to growth strategy for higher long-term returns",
      scoreIncrease: computeScore({ riskLevel: newRisk }) - currentScore,
      newScore: computeScore({ riskLevel: newRisk }),
      additionalAnnualSavings: Math.round((salary * 0.5) / 100),
      projectedBalance: projectedBalance * 1.06,
      currentLabel: "Risk Level",
      currentValue: riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1),
      newLabel: "Risk Level",
      newValue: newRisk.charAt(0).toUpperCase() + newRisk.slice(1),
    });
  }

  return suggestions.slice(0, 3);
}
