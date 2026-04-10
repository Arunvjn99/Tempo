import type { AuthError, Session } from "@supabase/supabase-js";
import {
  supabase,
  isSupabaseConfigured,
  SUPABASE_NOT_CONFIGURED_MESSAGE,
} from "@/core/supabase";

export { isSupabaseConfigured, SUPABASE_NOT_CONFIGURED_MESSAGE };

export async function getSession() {
  if (!supabase) {
    return { data: { session: null as Session | null }, error: null as AuthError | null };
  }
  return supabase.auth.getSession();
}

export function subscribeAuthStateChange(
  callback: (event: string, session: Session | null) => void,
) {
  if (!supabase) {
    return {
      data: {
        subscription: { unsubscribe: () => {} },
      },
    };
  }
  return supabase.auth.onAuthStateChange(callback);
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) {
    return {
      data: { user: null, session: null },
      error: { message: SUPABASE_NOT_CONFIGURED_MESSAGE, name: "AuthApiError" } as AuthError,
    };
  }
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(
  email: string,
  password: string,
  options?: {
    data?: Record<string, string>;
    emailRedirectTo?: string;
  },
) {
  if (!supabase) {
    return {
      data: { session: null, user: null },
      error: new Error(SUPABASE_NOT_CONFIGURED_MESSAGE) as unknown as AuthError,
    };
  }
  return supabase.auth.signUp({
    email,
    password,
    options: {
      ...(options?.data ? { data: options.data } : {}),
      ...(options?.emailRedirectTo !== undefined
        ? { emailRedirectTo: options.emailRedirectTo }
        : {}),
    },
  });
}

export async function signOut() {
  if (!supabase) {
    return { error: null as AuthError | null };
  }
  return supabase.auth.signOut();
}
