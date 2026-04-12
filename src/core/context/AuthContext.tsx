/**
 * Session lifecycle and auth methods; delegates I/O to @/services/authService.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import {
  getSession,
  isSupabaseConfigured,
  signInWithPassword,
  signUpWithPassword,
  signOut as authSignOut,
  subscribeAuthStateChange,
  SUPABASE_NOT_CONFIGURED_MESSAGE,
} from "@/services/authService";
import { useOtpStore } from "@/core/globalStores/otpStore";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, string>) => Promise<{ session: Session | null; user: User | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Map Supabase auth errors to user-friendly messages. */
function getAuthErrorMessage(error: AuthError | null): string {
  if (!error) return "An unexpected error occurred.";
  const msg = (error as { message?: string }).message ?? error.toString();
  const desc = (error as { error_description?: string }).error_description;
  const text = desc ?? msg;
  if (text.includes("already registered") || text.includes("already exists")) return "This email is already registered. Try signing in or use a different email.";
  if (text.includes("Invalid login credentials")) return "Invalid email or password.";
  if (text.includes("Email not confirmed")) return "Please confirm your email using the link we sent you, then try signing in again.";
  if (text.includes("Password should be at least 6")) return "Password must be at least 6 characters.";
  if (text.includes("Unable to validate email")) return "Please enter a valid email address.";
  if (text.includes("rate limit") || text.includes("too many")) return "Too many attempts. Please wait a few minutes and try again.";
  if (text.includes("signup disabled") || text.includes("Signup disabled")) return "Sign-up is currently disabled. Please contact support.";
  return text;
}

function throwIfError(error: AuthError | null): void {
  if (error) {
    const friendlyMessage = getAuthErrorMessage(error);
    const err = new Error(friendlyMessage) as Error & { originalError?: AuthError };
    err.originalError = error;
    throw err;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseConfigured()) {
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    const initSession = async () => {
      try {
        if (import.meta.env.DEV) console.log("[auth-diag] getSession: requesting…");
        const { data, error } = await getSession();
        if (import.meta.env.DEV) console.log("[auth-diag] getSession:", { session: data.session, error });
        if (cancelled) return;
        if (error) {
          if (import.meta.env.DEV) console.error("[auth-diag] getSession error:", error);
          setSession(null);
          setUser(null);
          return;
        }
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (e) {
        if (!cancelled) {
          setSession(null);
          setUser(null);
        }
        if (import.meta.env.DEV) console.error("[auth-diag] getSession exception:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = subscribeAuthStateChange((_event, newSession) => {
      if (cancelled) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
    }
    const { error } = await signInWithPassword(email, password);
    throwIfError(error);
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, string>,
  ): Promise<{ session: Session | null; user: User | null }> => {
    if (!isSupabaseConfigured()) {
      throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
    }
    const { data, error } = await signUpWithPassword(email, password, {
      data: metadata,
      emailRedirectTo:
        typeof window !== "undefined" ? `${window.location.origin}/verify?mode=signup` : undefined,
    });
    throwIfError(error);
    return { session: data.session ?? null, user: data.user ?? null };
  };

  const signOut = async (): Promise<void> => {
    if (!isSupabaseConfigured()) {
      useOtpStore.getState().resetOtp();
      return;
    }
    const { error } = await authSignOut();
    throwIfError(error);
    useOtpStore.getState().resetOtp();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
