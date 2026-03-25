import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { EnrollmentLayout } from "@/versions/v2/enrollment/EnrollmentLayout";

/**
 * Shell for `/:version/enrollment/*` nested routes (hub + Versioned* step pages).
 * Uses the single canonical layout (same behavior as former v0/v2 copies).
 *
 * Important: `/v1/enrollment/<step>` is matched FIRST by static routes in `router.tsx`
 * (`EnrollmentV1Layout` + `modules/enrollment/v1/screens/*`). Those URLs do NOT render
 * this tree’s `VersionedChoosePlan` / archive pages — edit `modules/enrollment/v1/` for that UI.
 */
export function VersionedEnrollment() {
  const { version } = useParams<{ version?: string }>();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("[Enrollment] VersionedEnrollment layout mounted", { version });
    }
  }, [version]);

  return <EnrollmentLayout />;
}
