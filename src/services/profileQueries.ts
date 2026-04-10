/**
 * Simple profile reads (PostgREST). Mutations live in userService.
 */
import { supabase } from "@/core/supabase";
import type { ProfileRow } from "./types";

export async function fetchProfileByUserId(
  userId: string,
): Promise<{ data: ProfileRow | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error("Supabase not configured") };
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, company_id, location, role")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    return { data: null, error: new Error(error.message) };
  }
  return { data: data as ProfileRow | null, error: null };
}

export async function fetchProfileCompanyId(
  userId: string,
): Promise<{ data: string | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error("Supabase not configured") };
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", userId)
    .single();
  if (error) {
    return { data: null, error: new Error(error.message) };
  }
  const cid = data?.company_id;
  return {
    data: typeof cid === "string" ? cid : null,
    error: null,
  };
}
