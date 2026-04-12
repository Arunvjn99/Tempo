import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocation, useNavigate, type NavigateFunction } from "react-router-dom";

/**
 * When set (dashboard modal overlay), enrollment navigation is driven by local state — no nested Router.
 * When null (full-page `/enrollment/*`), hooks defer to react-router.
 */
type EnrollmentFlowNavValue = {
  /** Path segment after `/enrollment/` — `""` means wizard. */
  enrollmentSubPath: string;
  navigate: NavigateFunction;
};

const EnrollmentFlowNavContext = createContext<EnrollmentFlowNavValue | null>(null);

export function EnrollmentFlowNavProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: EnrollmentFlowNavValue;
}) {
  return (
    <EnrollmentFlowNavContext.Provider value={value}>{children}</EnrollmentFlowNavContext.Provider>
  );
}

/** Same shape as `useNavigate()` but uses modal state when the modal provider is active. */
export function useEnrollmentFlowNavigate(): NavigateFunction {
  const ctx = useContext(EnrollmentFlowNavContext);
  const rrNavigate = useNavigate();
  return useMemo(() => (ctx ? ctx.navigate : rrNavigate), [ctx, rrNavigate]);
}

/** Subpath after `/enrollment/` — matches previous `useLocation` parsing in `enrollment-layout`. */
export function useEnrollmentFlowSubPath(): string {
  const ctx = useContext(EnrollmentFlowNavContext);
  const { pathname } = useLocation();
  if (ctx) return ctx.enrollmentSubPath;
  return pathname.replace(/^\/enrollment\/?/, "") || "";
}
