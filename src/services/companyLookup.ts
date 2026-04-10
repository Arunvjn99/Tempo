/**
 * Simple read-only company queries (PostgREST). All browser Supabase access for these operations goes here.
 */
import { supabase } from "@/core/supabase";

/** Resolve `companies.logo_url` by email domain (login hint). */
export async function fetchCompanyLogoUrlByDomain(domain: string): Promise<string | null> {
  if (!supabase) return null;
  const normalized = domain.trim().toLowerCase();
  if (!normalized) return null;
  const { data, error } = await supabase
    .from("companies")
    .select("logo_url")
    .eq("domain", normalized)
    .maybeSingle();
  if (error || !data?.logo_url) return null;
  return typeof data.logo_url === "string" ? data.logo_url.trim() : null;
}

/** List companies for signup dropdown (`id`, `name` only). */
export async function listCompaniesForSignup(): Promise<{
  data: { id: string; name: string }[] | null;
  error: { code?: string; message?: string } | null;
}> {
  if (!supabase) {
    return { data: null, error: { message: "Supabase not configured" } };
  }
  const { data, error } = await supabase.from("companies").select("id, name");
  if (error) {
    return { data: null, error: { code: error.code, message: error.message } };
  }
  return { data: data as { id: string; name: string }[], error: null };
}
