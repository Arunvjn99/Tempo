import { getFAQMatch } from "@/features/ai/services/faqAnswers";
import { matchShortAnswer } from "./shortAnswers";
import { findScenarioForRawQuery } from "./executeScenario";
import { getScenarioById } from "./scenarioConfig";

export type QueryClassification = "informational" | "action";

/**
 * Routes search UX: informational → inline short answer + “Know more” to Core AI;
 * action → suggestions / navigation / flows without blocking on a definition card.
 */
export function classifyQuery(raw: string): QueryClassification {
  const q = raw.trim().toLowerCase();
  if (!q) return "action";

  if (getFAQMatch(raw)) return "informational";

  if (matchShortAnswer(raw)) return "informational";

  const sid = findScenarioForRawQuery(raw);
  if (!sid) return "informational";

  const scenario = getScenarioById(sid);
  if (!scenario) return "informational";

  if (scenario.type === "navigation" || scenario.type === "action") return "action";
  if (scenario.type === "ai" && scenario.quickAnswer) return "informational";
  return "action";
}
