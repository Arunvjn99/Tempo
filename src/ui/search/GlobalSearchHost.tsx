import { useGlobalSearch } from "@/core/hooks/useGlobalSearch";
import { CommandSearch } from "./CommandSearch";

/**
 * Mounts the global command palette (⌘/Ctrl+K). Scenario routing lives in `useSearch` + `scenarioConfig`.
 */
export function GlobalSearchHost() {
  const { open, closeSearch, initialQuery } = useGlobalSearch();

  return open ? (
    <CommandSearch open={open} initialQuery={initialQuery} onClose={closeSearch} />
  ) : null;
}
