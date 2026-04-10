import { useMemo } from "react";
import { useScenarioStore } from "@/core/globalStores/scenarioStore";
import { scenarioToPersonaProfile } from "@/core/engine/scenarioEngine";
import type { PersonaProfile } from "@/core/types/participantPersona";

/**
 * Demo persona for the active scenario — single source: {@link useScenarioStore} (`scenarioData`).
 * Persona is memoized from `scenarioData` so identity is stable across renders (avoids infinite loops in consumers that depend on `demoUser`).
 */
export function useDemoUser(): PersonaProfile | null {
  const scenarioData = useScenarioStore((s) => s.scenarioData);
  return useMemo(
    () => (scenarioData ? scenarioToPersonaProfile(scenarioData) : null),
    [scenarioData],
  );
}
