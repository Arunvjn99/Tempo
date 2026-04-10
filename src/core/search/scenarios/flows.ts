import type { SearchScenario } from "./types";
import flowsJson from "./flows.json";

/** Transaction / enrollment flow entry scenarios (`OPEN_*` actions). */
export const FLOW_SCENARIOS = flowsJson as SearchScenario[];
