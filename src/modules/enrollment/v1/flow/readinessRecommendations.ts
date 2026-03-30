import type { TFunction } from "i18next";
import { DollarSign, ShieldCheck, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
import type { EnrollmentV1Snapshot, RiskLevel } from "../store/useEnrollmentStore";
import { computeReadinessScoreLinear } from "./enrollmentDerivedEngine";
import {
  computeProjectedBalancePure,
  getGrowthRate,
  projectBalanceWithAutoIncrease,
} from "./readinessMetrics";

export type ReadinessApplyPatch =
  | { kind: "contribution"; value: number }
  | { kind: "autoIncreaseOn" }
  | { kind: "riskLevel"; value: RiskLevel }
  | { kind: "none" };

export type GeneratedRecommendation = {
  id: string;
  title: string;
  description: string;
  impact: "High" | "Medium";
  projectedGain: string;
  scoreImpact: string;
  scoreDelta: number;
  /** Score after applying this recommendation alone (capped 0–100). */
  newScore: number;
  /** Projected retirement balance after this recommendation. */
  projectedBalanceAfter: number;
  /** Estimated extra annual savings (employee + employer) vs. current, where applicable. */
  additionalAnnualSavings: number;
  Icon: LucideIcon;
  patch: ReadinessApplyPatch;
};

function formatDeltaPortfolio(delta: number): string {
  if (Math.abs(delta) < 500) return "+$0";
  if (Math.abs(delta) >= 1_000_000) return `${delta > 0 ? "+" : ""}$${(delta / 1_000_000).toFixed(1)}M`;
  const k = Math.round(delta / 1000);
  return `+${Math.abs(k)}K`;
}

const REC = "enrollment.v1.readiness.rec.";

/**
 * Builds AI-style recommendations from enrollment snapshot (mock / heuristic engine).
 */
export function generateRecommendations(
  data: EnrollmentV1Snapshot,
  appliedIds: readonly string[],
  ctx: {
    score: number;
    projectedBalance: number;
    yearsToRetirement: number;
  },
  t: TFunction,
): GeneratedRecommendation[] {
  const { score, projectedBalance, yearsToRetirement } = ctx;
  const growthRate = getGrowthRate(data.riskLevel);
  const out: GeneratedRecommendation[] = [];

  const pushIf = (id: string, rec: Omit<GeneratedRecommendation, "id"> & { id?: string }) => {
    if (appliedIds.includes(id)) return;
    out.push({ ...rec, id });
  };

  const bumpPct = Math.min(data.contribution + 3, 15);
  if (bumpPct > data.contribution) {
    const futureBal = data.autoIncrease
      ? projectBalanceWithAutoIncrease(
          data.salary,
          data.currentSavings,
          bumpPct,
          yearsToRetirement,
          growthRate,
          data.autoIncreaseRate,
          data.autoIncreaseMax,
        )
      : computeProjectedBalancePure(
          data.salary,
          data.currentSavings,
          bumpPct,
          yearsToRetirement,
          growthRate,
        );
    const deltaBal = futureBal - projectedBalance;
    const newScore = computeReadinessScoreLinear(bumpPct, yearsToRetirement, futureBal);
    const dScore = newScore - score;
    const empBefore = Math.round((data.salary * Math.min(data.contribution, 6)) / 100);
    const empAfter = Math.round((data.salary * Math.min(bumpPct, 6)) / 100);
    const addAnnual =
      Math.round(((bumpPct - data.contribution) * data.salary) / 100) + Math.max(0, empAfter - empBefore);
    pushIf("increase-contribution", {
      title: t(`${REC}increaseContributionTitle`),
      description: t(`${REC}increaseContributionDesc`),
      impact: "High",
      projectedGain: formatDeltaPortfolio(deltaBal),
      scoreImpact: `${dScore >= 0 ? "+" : ""}${dScore} pts`,
      scoreDelta: dScore,
      newScore: Math.min(100, newScore),
      projectedBalanceAfter: futureBal,
      additionalAnnualSavings: addAnnual,
      Icon: DollarSign,
      patch: { kind: "contribution", value: bumpPct },
    });
  }

  if (!data.autoIncrease) {
    const futureBal = projectBalanceWithAutoIncrease(
      data.salary,
      data.currentSavings,
      data.contribution,
      yearsToRetirement,
      growthRate,
      data.autoIncreaseRate,
      data.autoIncreaseMax,
    );
    const newScore = computeReadinessScoreLinear(data.contribution, yearsToRetirement, futureBal);
    const dScore = newScore - score;
    const deltaBal = futureBal - projectedBalance;
    const addAnnual = Math.max(0, Math.round((data.salary * data.autoIncreaseRate) / 100));
    pushIf("auto-increase", {
      title: t(`${REC}autoIncreaseTitle`),
      description: t(`${REC}autoIncreaseDesc`, {
        rate: data.autoIncreaseRate,
        max: data.autoIncreaseMax,
      }),
      impact: "Medium",
      projectedGain: formatDeltaPortfolio(deltaBal),
      scoreImpact: `${dScore >= 0 ? "+" : ""}${dScore} pts`,
      scoreDelta: dScore,
      newScore: Math.min(100, newScore),
      projectedBalanceAfter: futureBal,
      additionalAnnualSavings: addAnnual,
      Icon: TrendingUp,
      patch: { kind: "autoIncreaseOn" },
    });
  }

  if (data.contribution < 6 && bumpPct < 6) {
    const targetMatch = 6;
    const futureBal = data.autoIncrease
      ? projectBalanceWithAutoIncrease(
          data.salary,
          data.currentSavings,
          targetMatch,
          yearsToRetirement,
          growthRate,
          data.autoIncreaseRate,
          data.autoIncreaseMax,
        )
      : computeProjectedBalancePure(
          data.salary,
          data.currentSavings,
          targetMatch,
          yearsToRetirement,
          growthRate,
        );
    const deltaBal = futureBal - projectedBalance;
    const newScore = computeReadinessScoreLinear(targetMatch, yearsToRetirement, futureBal);
    const dScore = newScore - score;
    const addAnnual =
      Math.round(((targetMatch - data.contribution) * data.salary) / 100) +
      Math.round(((Math.min(targetMatch, 6) - Math.min(data.contribution, 6)) * data.salary) / 100);
    pushIf("employer-match", {
      title: t(`${REC}employerMatchTitle`),
      description: t(`${REC}employerMatchDesc`),
      impact: "Medium",
      projectedGain: formatDeltaPortfolio(deltaBal),
      scoreImpact: `${dScore >= 0 ? "+" : ""}${dScore} pts`,
      scoreDelta: dScore,
      newScore: Math.min(100, newScore),
      projectedBalanceAfter: futureBal,
      additionalAnnualSavings: Math.max(0, addAnnual),
      Icon: ShieldCheck,
      patch: { kind: "contribution", value: targetMatch },
    });
  }

  if (data.riskLevel === "conservative") {
    const balancedRate = getGrowthRate("balanced");
    const futureBal = data.autoIncrease
      ? projectBalanceWithAutoIncrease(
          data.salary,
          data.currentSavings,
          data.contribution,
          yearsToRetirement,
          balancedRate,
          data.autoIncreaseRate,
          data.autoIncreaseMax,
        )
      : computeProjectedBalancePure(
          data.salary,
          data.currentSavings,
          data.contribution,
          yearsToRetirement,
          balancedRate,
        );
    const deltaBal = futureBal - projectedBalance;
    const newScore = computeReadinessScoreLinear(data.contribution, yearsToRetirement, futureBal);
    const dScore = newScore - score;
    pushIf("strategy-balanced", {
      title: t(`${REC}strategyBalancedTitle`),
      description: t(`${REC}strategyBalancedDesc`),
      impact: "Medium",
      projectedGain: formatDeltaPortfolio(deltaBal),
      scoreImpact: `${dScore >= 0 ? "+" : ""}${dScore} pts`,
      scoreDelta: dScore,
      newScore: Math.min(100, newScore),
      projectedBalanceAfter: futureBal,
      additionalAnnualSavings: 0,
      Icon: Sparkles,
      patch: { kind: "riskLevel", value: "balanced" },
    });
  }

  const deduped = out.filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i);

  if (deduped.length === 0) {
    return [
      {
        id: "review-plan",
        title: t(`${REC}reviewPlanTitle`),
        description: t(`${REC}reviewPlanDesc`),
        impact: "Medium" as const,
        projectedGain: "+$0",
        scoreImpact: "+0 pts",
        scoreDelta: 0,
        newScore: score,
        projectedBalanceAfter: projectedBalance,
        additionalAnnualSavings: 0,
        Icon: Sparkles,
        patch: { kind: "none" },
      },
    ];
  }

  return deduped.sort((a, b) => b.scoreDelta - a.scoreDelta);
}
