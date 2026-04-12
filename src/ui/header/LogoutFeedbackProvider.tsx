import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/core/context/AuthContext";
import { insertLogoutFeedback } from "@/services/logoutFeedbackService";
import { LogoutFeedbackModal } from "./LogoutFeedbackModal";

type LogoutFeedbackContextValue = {
  requestLogout: () => void;
};

const LogoutFeedbackContext = createContext<LogoutFeedbackContextValue | null>(null);

export function useLogoutFeedbackRequest(): LogoutFeedbackContextValue {
  const ctx = useContext(LogoutFeedbackContext);
  if (!ctx) {
    throw new Error("useLogoutFeedbackRequest must be used within LogoutFeedbackProvider");
  }
  return ctx;
}

function feedbackPageLabel(pathname: string): string {
  if (pathname === "/dashboard" || pathname.startsWith("/enrollment")) {
    return "pre-enrollment";
  }
  return pathname || "app";
}

export function LogoutFeedbackProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const finalizeLogout = useCallback(async () => {
    try {
      await signOut();
    } catch {
      /* still leave — Supabase or network errors must not trap the user */
    } finally {
      setBusy(false);
      setOpen(false);
      navigate("/login", { replace: true });
    }
  }, [navigate, signOut]);

  const tryInsertFeedback = useCallback(
    async (rating: number, comment: string) => {
      const uid = user?.id ?? null;
      const page = feedbackPageLabel(pathname);
      const scenario = JSON.stringify({ action: "logout", path: pathname });
      try {
        await insertLogoutFeedback({
          userId: uid,
          rating,
          comment: comment.length > 0 ? comment : null,
          page,
          scenario,
        });
      } catch {
        /* non-blocking per product rules */
      }
    },
    [pathname, user?.id],
  );

  const handleSubmitFeedback = useCallback(
    async (rating: number, comment: string) => {
      setBusy(true);
      await tryInsertFeedback(rating, comment);
      await finalizeLogout();
    },
    [finalizeLogout, tryInsertFeedback],
  );

  const handleSkip = useCallback(async () => {
    setBusy(true);
    await finalizeLogout();
  }, [finalizeLogout]);

  const requestLogout = useCallback(() => {
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ requestLogout }), [requestLogout]);

  return (
    <LogoutFeedbackContext.Provider value={value}>
      {children}
      <LogoutFeedbackModal
        open={open}
        onOpenChange={(next) => {
          if (!busy) setOpen(next);
        }}
        onSubmitFeedback={handleSubmitFeedback}
        onSkip={handleSkip}
        busy={busy}
      />
    </LogoutFeedbackContext.Provider>
  );
}
