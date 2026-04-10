/**
 * Profile writes and re-exports of profile reads. Simple reads: {@link ./profileQueries}.
 */
import { supabase } from "@/core/supabase";

export { fetchProfileByUserId, fetchProfileCompanyId } from "./profileQueries";

export async function upsertProfileRow(
  row: {
    id: string;
    name: string;
    company_id: string | null;
    location: string;
    role: string;
  },
  options?: { onConflict?: string },
): Promise<{ error: Error | null }> {
  if (!supabase) {
    return { error: new Error("Supabase not configured") };
  }
  const { error } = await supabase.from("profiles").upsert(row, {
    onConflict: options?.onConflict ?? "id",
  });
  if (error) {
    return { error: new Error(error.message) };
  }
  return { error: null };
}
