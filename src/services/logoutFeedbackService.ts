import { supabase } from "@/core/supabase";
import { isSupabaseConfigured } from "@/services/authService";

export type LogoutFeedbackInsert = {
  userId: string | null;
  rating: number;
  comment: string | null;
  /** e.g. route label for analytics */
  page: string;
  /** e.g. `logout` or JSON metadata */
  scenario: string | null;
};

/**
 * Persists logout feedback. Fails soft: callers should catch and continue logout.
 * RLS: authenticated rows must set `user_id` to `auth.uid()`; anon inserts use `user_id: null`.
 */
export async function insertLogoutFeedback(row: LogoutFeedbackInsert): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) return;

  const { error } = await supabase.from("feedback").insert({
    user_id: row.userId,
    rating: row.rating,
    comment: row.comment,
    page: row.page,
    scenario: row.scenario,
  });

  if (error) {
    throw new Error(error.message);
  }
}
