import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type StartEnrollHandler = () => void;

type PreEnrollmentDashboardHeaderContextValue = {
  /** Called from `/dashboard` when the enrollment form should open (e.g. Start Enroll). */
  setDashboardStartEnroll: (handler: StartEnrollHandler | null) => void;
  runDashboardStartEnroll: () => void;
  /** True when the dashboard has registered a Start Enroll handler (drives header CTA visibility). */
  hasDashboardStartEnroll: boolean;
};

const PreEnrollmentDashboardHeaderContext =
  createContext<PreEnrollmentDashboardHeaderContextValue | null>(null);

export function PreEnrollmentDashboardHeaderProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<StartEnrollHandler | null>(null);
  const [hasDashboardStartEnroll, setHasDashboardStartEnroll] = useState(false);

  const setDashboardStartEnroll = useCallback((handler: StartEnrollHandler | null) => {
    handlerRef.current = handler;
    setHasDashboardStartEnroll(handler != null);
  }, []);

  const runDashboardStartEnroll = useCallback(() => {
    handlerRef.current?.();
  }, []);

  const value = useMemo(
    () => ({
      setDashboardStartEnroll,
      runDashboardStartEnroll,
      hasDashboardStartEnroll,
    }),
    [setDashboardStartEnroll, runDashboardStartEnroll, hasDashboardStartEnroll],
  );

  return (
    <PreEnrollmentDashboardHeaderContext.Provider value={value}>
      {children}
    </PreEnrollmentDashboardHeaderContext.Provider>
  );
}

export function usePreEnrollmentDashboardHeader() {
  const ctx = useContext(PreEnrollmentDashboardHeaderContext);
  if (!ctx) {
    throw new Error(
      "usePreEnrollmentDashboardHeader must be used within PreEnrollmentDashboardHeaderProvider",
    );
  }
  return ctx;
}
