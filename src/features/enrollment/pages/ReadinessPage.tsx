// ─────────────────────────────────────────────
// ReadinessPage — orchestrates readiness UI + enrollment store
// ─────────────────────────────────────────────

import { useState } from "react";
import { useEnrollmentStore, useEnrollmentDerived } from "../store";
import { formatCurrency } from "../store/derived";
import { buildReadinessSuggestions, type ReadinessSuggestionView } from "../store/readinessSuggestions";
import {
  EnrollmentActionRow,
  getReadinessScoreColor,
  ReadinessAllAppliedSection,
  ReadinessAppliedSuccessBanner,
  ReadinessMetricsGridSection,
  ReadinessPageHeaderSection,
  ReadinessRecommendedBannerSection,
  ReadinessScoreHeroSection,
  ReadinessSuggestionConfirmModal,
  ReadinessSuggestionsListSection,
} from "@/ui/patterns";
import type { SuggestionType } from "../store/types";

export function ReadinessPage() {
  const enrollment = useEnrollmentStore((s) => s.enrollment);
  const personalization = useEnrollmentStore((s) => s.personalization);
  const applySuggestion = useEnrollmentStore((s) => s.applySuggestion);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);
  const derived = useEnrollmentDerived();

  const [confirming, setConfirming] = useState<ReadinessSuggestionView | null>(null);
  const [applied, setApplied] = useState<SuggestionType[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const score = derived.readinessScore;
  const scoreColor = getReadinessScoreColor(score);
  const suggestions = buildReadinessSuggestions(
    enrollment,
    personalization,
    score,
    derived.projectedBalance,
  ).filter((s) => !applied.includes(s.type));

  const totalPotentialIncrease = suggestions.reduce((sum, s) => sum + s.scoreIncrease, 0);
  const potentialScore = Math.min(100, score + totalPotentialIncrease);

  const handleApply = (s: ReadinessSuggestionView) => {
    applySuggestion(s.type);
    setApplied((prev) => [...prev, s.type]);
    setSuccessMessage(`"${s.title}" applied — your score updated!`);
    setConfirming(null);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-0">
      <ReadinessPageHeaderSection />

      <div className="grid items-start gap-6 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-5">
          <ReadinessScoreHeroSection
            score={score}
            scoreColor={scoreColor}
            projectedBalance={derived.projectedBalance}
            yearsToRetirement={derived.yearsToRetirement}
          />

          <ReadinessMetricsGridSection
            projectedBalanceLabel={formatCurrency(derived.projectedBalance)}
            monthlyIncomeLabel={formatCurrency(derived.monthlyRetirementIncome)}
            yearsToRetirement={derived.yearsToRetirement}
            contributionPercent={enrollment.contributionPercent}
          />

          {successMessage && <ReadinessAppliedSuccessBanner message={successMessage} />}
        </div>

        <div className="min-w-0 space-y-4">
          {suggestions.length > 0 && totalPotentialIncrease > 0 && (
            <ReadinessRecommendedBannerSection
              potentialScore={potentialScore}
              totalPotentialIncrease={totalPotentialIncrease}
            />
          )}

          <ReadinessSuggestionsListSection
            suggestions={suggestions}
            currentScore={score}
            onRequestApply={setConfirming}
          />

          {suggestions.length === 0 && applied.length > 0 && <ReadinessAllAppliedSection />}
        </div>
      </div>

      <EnrollmentActionRow onBack={prevStep} onNext={nextStep} nextLabel="Continue to Review" />

      <ReadinessSuggestionConfirmModal
        isOpen={!!confirming}
        suggestion={confirming}
        currentScore={score}
        currentBalance={derived.projectedBalance}
        onCancel={() => setConfirming(null)}
        onApply={() => confirming && handleApply(confirming)}
      />
    </div>
  );
}
