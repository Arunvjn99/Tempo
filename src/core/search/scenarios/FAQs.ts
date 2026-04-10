import type { SearchScenario } from "./types";
import faqsJson from "./faqs.json";

/** AI / quick-answer scenarios (type `ai`, including optional `quickAnswer`). */
export const FAQ_SCENARIOS = faqsJson as SearchScenario[];
