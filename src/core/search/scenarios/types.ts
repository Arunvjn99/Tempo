export type ScenarioType = "navigation" | "action" | "ai";

export interface SearchScenario {
  id: string;
  keywords: string[];
  queries: string[];
  type: ScenarioType;
  /** Shown in command palette subtitle */
  subtitle?: string;
  route?: string;
  action?: string;
  /** Short deterministic answer for inline / toast UX (paired with type "ai"). */
  quickAnswer?: string;
}
