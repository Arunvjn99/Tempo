import { supabase } from "../lib/supabase";
import { loadEnrollmentDraft, saveEnrollmentDraft, type EnrollmentDraft } from "../enrollment/enrollmentDraftStore";

export type SaveAutoIncreasePreferenceInput = {
  /** `null` = clear / undecided (rare; omit when committing skip or enable) */
  enabled: boolean | null;
  skipped: boolean;
  /** When enabling, pass full draft slice; when skipping, caller may omit (zeros applied). */
  autoIncreaseDraft?: NonNullable<EnrollmentDraft["autoIncrease"]>;
};

/**
 * Persists auto-increase step decision into the enrollment draft (sessionStorage).
 * Returns an explicit error when the draft is missing or storage fails — no silent failure.
 */
export function saveAutoIncreasePreference(
  input: SaveAutoIncreasePreferenceInput
): { ok: boolean; error?: string } {
  try {
    const draft = loadEnrollmentDraft();
    if (!draft) {
      return {
        ok: false,
        error: "Enrollment draft is missing. Continue from plan selection so your progress can be saved.",
      };
    }

    let nextAutoIncrease: EnrollmentDraft["autoIncrease"] = draft.autoIncrease;

    if (input.skipped) {
      nextAutoIncrease = { enabled: false, annualIncreasePct: 0, stopAtPct: 0 };
    } else if (input.enabled === true) {
      nextAutoIncrease =
        input.autoIncreaseDraft ??
        draft.autoIncrease ??
        ({ enabled: true, annualIncreasePct: 2, stopAtPct: 15 } satisfies NonNullable<EnrollmentDraft["autoIncrease"]>);
    } else if (input.enabled === false && !input.skipped) {
      nextAutoIncrease = { enabled: false, annualIncreasePct: 0, stopAtPct: 0 };
    } else if (input.enabled === null) {
      nextAutoIncrease =
        input.autoIncreaseDraft ?? ({ enabled: false, annualIncreasePct: 0, stopAtPct: 0 } satisfies NonNullable<
          EnrollmentDraft["autoIncrease"]
        >);
    }

    saveEnrollmentDraft({
      ...draft,
      autoIncreasePreference: {
        enabled: input.enabled,
        skipped: input.skipped,
      },
      autoIncrease: nextAutoIncrease,
    });
    return { ok: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    if (import.meta.env.DEV) console.error("[enrollmentService] saveAutoIncreasePreference:", e);
    return { ok: false, error };
  }
}

/**
 * Save or update the current user's enrollment with the selected plan_id.
 * Uses upsert on user_id (one row per user). Does not modify routing or contribution flow.
 */
export async function saveEnrollmentPlanId(planId: string | null): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) {
    return { ok: false, error: "Supabase not configured" };
  }
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return { ok: false, error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("enrollments")
      .upsert(
        {
          user_id: user.id,
          plan_id: planId || null,
          status: "in_progress",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      if (import.meta.env.DEV) console.error("[enrollmentService] saveEnrollmentPlanId error:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    if (import.meta.env.DEV) console.error("[enrollmentService] saveEnrollmentPlanId exception:", e);
    return { ok: false, error: String(e) };
  }
}

/**
 * Marks the current user's enrollment as completed (post-enrollment dashboard).
 * Preserves existing plan_id when upserting.
 */
export async function markEnrollmentCompleted(): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) {
    return { ok: false, error: "Supabase not configured" };
  }
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return { ok: false, error: "Not authenticated" };
    }

    const { data: existing } = await supabase
      .from("enrollments")
      .select("plan_id")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data, error } = await supabase
      .from("enrollments")
      .upsert(
        {
          user_id: user.id,
          plan_id: existing?.plan_id ?? null,
          status: "completed",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select("status")
      .single();

    if (error) {
      if (import.meta.env.DEV) console.error("[enrollmentService] markEnrollmentCompleted error:", error.message);
      return { ok: false, error: error.message };
    }
    if (!data) {
      const msg = "markEnrollmentCompleted: no row returned from upsert";
      if (import.meta.env.DEV) console.error("[enrollmentService]", msg);
      return { ok: false, error: msg };
    }
    if (data.status !== "completed") {
      const msg = `markEnrollmentCompleted: expected status completed, got ${String(data.status)}`;
      if (import.meta.env.DEV) console.error("[enrollmentService]", msg);
      return { ok: false, error: msg };
    }
    return { ok: true };
  } catch (e) {
    if (import.meta.env.DEV) console.error("[enrollmentService] markEnrollmentCompleted exception:", e);
    return { ok: false, error: String(e) };
  }
}
