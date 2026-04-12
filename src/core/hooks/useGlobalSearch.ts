/**
 * Global command palette state + event bridge.
 * Implementation lives in {@link GlobalSearchProvider} — do not duplicate `useState` here.
 */
export {
  GLOBAL_SEARCH_OPEN_EVENT,
  type GlobalSearchOpenDetail,
  requestOpenGlobalSearch,
  useGlobalSearch,
} from "@/core/context/GlobalSearchContext";
