/**
 * Deterministic short answers for common retirement questions (hero + command palette).
 * Keep each `answer` to at most ~2 lines for the inline card.
 */
export type ShortAnswerTopic = {
  id: string;
  keywords: string[];
  /** Card heading */
  title: string;
  answer: string;
};

export const SHORT_ANSWER_TOPICS: ShortAnswerTopic[] = [
  {
    id: "401k",
    keywords: ["401k", "401(k)", "401 k", "four zero one k", "employer plan"],
    title: "What is a 401(k)?",
    answer:
      "A 401(k) is an employer-sponsored retirement plan. You contribute from pay—often with a match—and investments grow tax-advantaged until withdrawal.",
  },
  {
    id: "roth",
    keywords: ["roth", "roth 401", "roth vs", "after-tax"],
    title: "Roth vs traditional",
    answer:
      "Traditional saves you taxes now; Roth uses after-tax dollars, so qualified withdrawals are tax-free. The better fit depends on your tax bracket now vs retirement.",
  },
  {
    id: "contribution",
    keywords: ["contribution", "deferral", "paycheck", "how much to save", "match"],
    title: "Contributions",
    answer:
      "You choose a percentage or dollar amount from each paycheck. Many employers match part of what you save—aim to capture the full match first.",
  },
  {
    id: "withdrawal",
    keywords: ["withdraw", "withdrawal", "take money out", "distribution", "cash out"],
    title: "Withdrawals",
    answer:
      "401(k) withdrawals before retirement may have taxes and penalties unless you qualify for an exception. Rules depend on age, reason, and plan terms.",
  },
];

/** First topic whose keyword appears in the query (case-insensitive). */
export function matchShortAnswer(query: string): ShortAnswerTopic | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const scored = SHORT_ANSWER_TOPICS.map((topic) => {
    let best = 0;
    for (const k of topic.keywords) {
      const needle = k.toLowerCase();
      if (!needle) continue;
      if (q === needle) best = Math.max(best, 100 + needle.length);
      else if (q.includes(needle)) best = Math.max(best, needle.length);
    }
    return { topic, score: best };
  }).filter((x) => x.score > 0);

  if (scored.length === 0) return null;
  scored.sort((a, b) => b.score - a.score);
  return scored[0]!.topic;
}
