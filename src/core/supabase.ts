/**
 * ⚠️ DO NOT MODIFY: Core Supabase Integration
 * Single browser (anon) client for the app. Env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY.
 * Changing exports or env handling breaks @/services/* and app auth flows.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { timeoutFetch } from "./network/timeoutFetch";

// These variables must be set in Netlify Environment Settings for production,
// or in a local .env file for development (prefixed with VITE_).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (import.meta.env.DEV) {
  const urlPresent = Boolean(supabaseUrl?.trim());
  const keyPresent = Boolean(supabaseAnonKey?.trim());
  let host: string | null = null;
  if (urlPresent) {
    try {
      host = new URL(supabaseUrl!.trim()).host;
    } catch {
      host = "(invalid URL)";
    }
  }
  console.info("[Supabase diag]", {
    VITE_SUPABASE_URL: urlPresent,
    VITE_SUPABASE_ANON_KEY: keyPresent,
    host,
  });
}

const PLACEHOLDER_PATTERNS = [
  "your-project",
  "YOUR_PROJECT_ID",
  "your-anon-key",
  "YOUR_ANON_KEY",
  "PASTE_REAL_ANON_KEY_HERE",
];

function hasPlaceholder(url: string, key: string): boolean {
  return PLACEHOLDER_PATTERNS.some((p) => url.includes(p) || key.includes(p));
}

let client: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Not configured: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "The app runs in demo mode without backend auth. See README.md for setup.",
  );
} else if (hasPlaceholder(supabaseUrl, supabaseAnonKey)) {
  console.warn(
    "[Supabase] Not configured: environment variables look like placeholders. " +
      "Replace them with real values from your Supabase project (Settings → API).",
  );
} else {
  const SUPABASE_FETCH_TIMEOUT_MS = 10_000;
  client = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (input: URL | RequestInfo, options?: RequestInit) =>
        timeoutFetch(input instanceof URL ? input.toString() : input, options ?? {}, SUPABASE_FETCH_TIMEOUT_MS),
    },
  });
}

/** `null` when env vars are missing or placeholder — app stays runnable (demo / offline UI). */
export const supabase: SupabaseClient | null = client;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

/** Error message thrown by auth when Supabase is not available. */
export const SUPABASE_NOT_CONFIGURED_MESSAGE = "Supabase not configured";
