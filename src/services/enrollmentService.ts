import { supabase } from "@/core/supabase";

function pickEnrollmentStatus(row: unknown): string | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  if (typeof r.status === "string") return r.status;
  if (typeof r.enrollment_status === "string") return r.enrollment_status;
  return null;
}

export async function fetchEnrollmentStatusForUser(
  userId: string,
): Promise<{ status: string | null; error: Error | null }> {
  if (!supabase) {
    return { status: null, error: null };
  }
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    return { status: null, error: new Error(error.message) };
  }
  return { status: pickEnrollmentStatus(data), error: null };
}
