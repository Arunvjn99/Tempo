import type { User } from "@supabase/supabase-js";

export type DashboardView = "pre" | "post";

/**
 * Which dashboard shell to show. Uses only DB enrollment status — no metadata fallback.
 */
export function getDashboardView(
  _user: User | null,
  enrollmentStatusFromDb: string | null
): DashboardView {
  if (enrollmentStatusFromDb === "completed") return "post";
  return "pre";
}

export function isUserEnrolled(
  user: User | null,
  enrollmentStatusFromDb: string | null
): boolean {
  return getDashboardView(user, enrollmentStatusFromDb) === "post";
}
