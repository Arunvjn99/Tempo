import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const GLOBAL_SEARCH_OPEN_EVENT = "global-search-open";

export type GlobalSearchOpenDetail = {
  initialQuery?: string;
};

export function requestOpenGlobalSearch(detail?: GlobalSearchOpenDetail) {
  window.dispatchEvent(
    new CustomEvent<GlobalSearchOpenDetail>(GLOBAL_SEARCH_OPEN_EVENT, {
      detail: detail ?? {},
    }),
  );
}

type GlobalSearchContextValue = {
  open: boolean;
  initialQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null);

/**
 * Single source of truth for the command palette — must wrap any component that calls
 * {@link useGlobalSearch} (e.g. {@link GlobalSearchHost} + {@link FloatingSearchBar}).
 * Multiple `useState` instances previously caused desync: closing the overlay did not reset
 * all listeners, leaving stuck body classes / perceived full-page dim after navigation.
 */
export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");

  useEffect(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) setInitialQuery("");
  }, [open]);

  const openSearch = useCallback(() => {
    setInitialQuery("");
    setOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setOpen((o) => !o);
  }, []);

  useEffect(() => {
    const onPaletteOpen = (e: Event) => {
      const ce = e as CustomEvent<GlobalSearchOpenDetail>;
      const q = ce.detail?.initialQuery;
      setInitialQuery(typeof q === "string" ? q : "");
      setOpen(true);
    };
    window.addEventListener(GLOBAL_SEARCH_OPEN_EVENT, onPaletteOpen);
    return () => window.removeEventListener(GLOBAL_SEARCH_OPEN_EVENT, onPaletteOpen);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open]);

  const value = useMemo(
    () => ({
      open,
      initialQuery,
      openSearch,
      closeSearch,
      toggleSearch,
    }),
    [open, initialQuery, openSearch, closeSearch, toggleSearch],
  );

  return <GlobalSearchContext.Provider value={value}>{children}</GlobalSearchContext.Provider>;
}

export function useGlobalSearch(): GlobalSearchContextValue {
  const ctx = useContext(GlobalSearchContext);
  if (!ctx) {
    throw new Error("useGlobalSearch must be used within GlobalSearchProvider");
  }
  return ctx;
}
