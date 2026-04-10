import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AppShellChromeContextValue = {
  subHeader: ReactNode | null;
  setSubHeader: (node: ReactNode | null) => void;
};

const AppShellChromeContext = createContext<AppShellChromeContextValue | null>(null);

export function AppShellChromeProvider({ children }: { children: ReactNode }) {
  const [subHeader, setSubHeaderState] = useState<ReactNode | null>(null);
  const setSubHeader = useCallback((node: ReactNode | null) => {
    setSubHeaderState(node);
  }, []);
  const value = useMemo(
    () => ({ subHeader, setSubHeader }),
    [subHeader, setSubHeader],
  );
  return (
    <AppShellChromeContext.Provider value={value}>
      {children}
    </AppShellChromeContext.Provider>
  );
}

export function useAppShellSubHeader(): AppShellChromeContextValue {
  const ctx = useContext(AppShellChromeContext);
  if (!ctx) {
    throw new Error("useAppShellSubHeader must be used within AppShellChromeProvider");
  }
  return ctx;
}
