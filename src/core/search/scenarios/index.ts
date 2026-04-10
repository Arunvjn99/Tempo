import type { SearchScenario } from "./types";
import scenarioOrder from "./scenarioOrder.json";
import routesJson from "./routes.json";
import flowsJson from "./flows.json";
import faqsJson from "./faqs.json";

/**
 * Scripted search / command palette / hero typeahead — 75 participant-life scenarios.
 * Routes: `/enrollment` and `/transactions` are versioned at execution via `withVersionIfEnrollment`.
 * Order matches the legacy single-file config (see `scenarioOrder.json`).
 */
const byId = new Map<string, SearchScenario>();
for (const s of [...routesJson, ...flowsJson, ...faqsJson] as SearchScenario[]) {
  byId.set(s.id, s);
}

export const SEARCH_SCENARIOS: SearchScenario[] = (scenarioOrder as string[]).map((id) => {
  const s = byId.get(id);
  if (!s) {
    throw new Error(`[search scenarios] Missing scenario for id "${id}"`);
  }
  return s;
});

export function getScenarioById(id: string): SearchScenario | undefined {
  return SEARCH_SCENARIOS.find((s) => s.id === id);
}
