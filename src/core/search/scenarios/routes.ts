import type { SearchScenario } from "./types";
import routesJson from "./routes.json";

/** Navigation-only scenarios (route targets). */
export const ROUTE_SCENARIOS = routesJson as SearchScenario[];
