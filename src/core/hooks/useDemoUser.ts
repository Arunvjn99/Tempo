import { useScenarioStore } from "@/core/globalStores/scenarioStore";
import { scenarioToPersonaProfile } from "@/core/engine/scenarioEngine";
import type { PersonaProfile } from "@/core/types/participantPersona";

/**
 * Demo persona for the active scenario — single source: {@link useScenarioStore} (`scenarioData`).
 */
export function useDemoUser(): PersonaProfile | null {
  return useScenarioStore((s) =>
    s.scenarioData ? scenarioToPersonaProfile(s.scenarioData) : null,
  );
}
