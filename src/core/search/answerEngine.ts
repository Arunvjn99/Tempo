import { getFAQMatch } from "@/features/ai/services/faqAnswers";
import { classifyQuery } from "./classifyQuery";
import { matchShortAnswer } from "./shortAnswers";
import { SEARCH_SCENARIOS } from "./scenarioConfig";

export type QuickAnswerResult = {
  /** Present when answer comes from `SEARCH_SCENARIOS` (scripted follow-up). */
  scenarioId?: string;
  question: string;
  answer: string;
  source: "library" | "scenario" | "faq";
  /** Set when `source === "faq"` — used for Core AI `FAQ_DETAIL`. */
  faqId?: string;
};

/**
 * Inline quick answer: FAQ library (targeted questions), then scenario `quickAnswer`, then short-answer topics.
 * Skips entirely when `classifyQuery` is `action` (navigation / flows).
 */
export function getQuickAnswer(input: string): QuickAnswerResult | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;

  if (classifyQuery(input) === "action") return null;

  const faq = getFAQMatch(input);
  if (faq) {
    return {
      question: faq.question,
      answer: faq.shortAnswer,
      source: "faq",
      faqId: faq.id,
    };
  }

  const scenarioHit = SEARCH_SCENARIOS.find((scenario) =>
    scenario.queries.some((query) => {
      const needle = query.toLowerCase().slice(0, 12);
      return needle.length > 0 && q.includes(needle);
    }),
  );

  if (scenarioHit?.quickAnswer) {
    return {
      scenarioId: scenarioHit.id,
      question: scenarioHit.queries[0] ?? q,
      answer: scenarioHit.quickAnswer,
      source: "scenario",
    };
  }

  const lib = matchShortAnswer(input);
  if (lib) {
    return {
      question: lib.title,
      answer: lib.answer,
      source: "library",
    };
  }

  return null;
}
