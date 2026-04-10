/**
 * Company data beyond simple lookup (e.g. branding row). Simple lookups: {@link ./companyLookup}.
 */
import { supabase } from "@/core/supabase";
import type { CompanyRow } from "./types";

export { fetchCompanyLogoUrlByDomain, listCompaniesForSignup } from "./companyLookup";

export async function fetchCompanyForUserBranding(
  companyId: string,
): Promise<{ data: CompanyRow | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error("Supabase not configured") };
  }
  const { data, error } = await supabase
    .from("companies")
    .select("id, name, primary_color, secondary_color, branding_json, logo_url")
    .eq("id", companyId)
    .single();
  if (error) {
    return { data: null, error: new Error(error.message) };
  }
  return { data: data as CompanyRow, error: null };
}
