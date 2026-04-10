/**
 * Search / command palette scenario registry.
 * Data lives under `./scenarios/` as JSON + typed assemblers; import from here for a stable API.
 */
export type { ScenarioType, SearchScenario } from "./scenarios/types";
export { SEARCH_SCENARIOS, getScenarioById } from "./scenarios/index";
