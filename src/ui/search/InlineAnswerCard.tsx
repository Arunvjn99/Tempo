import { useTranslation } from "react-i18next";
import { cn } from "@/core/lib/utils";

export type InlineAnswerCardProps = {
  question: string;
  shortAnswer: string;
  onKnowMore: () => void;
  /** Wrapper class: e.g. `search-palette-quick-answer` (⌘K) or `answer-card` (hero). */
  containerClassName?: string;
  className?: string;
};

/**
 * Inline FAQ / quick-answer block: title, ≤2-line summary, “Know more” → Core AI.
 */
export function InlineAnswerCard({
  question,
  shortAnswer,
  onKnowMore,
  containerClassName = "search-palette-quick-answer",
  className,
}: InlineAnswerCardProps) {
  const { t } = useTranslation();

  return (
    <div className={cn(containerClassName, className)} role="region" aria-label={t("preEnrollment.heroQuickAnswer", { defaultValue: "Quick answer" })}>
      <p className="answer-question">{question}</p>
      <p className="answer-text">{shortAnswer}</p>
      <button
        type="button"
        className="answer-cta"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onKnowMore}
      >
        {t("preEnrollment.heroSearchKnowMore", { defaultValue: "Know more" })}
      </button>
    </div>
  );
}
