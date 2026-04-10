/**
 * Visual baseline: mounts the RetireWise AI Studio reference app verbatim (see `retirewiseReference/App`).
 * Use `/pre-enrollment/sandbox` (authenticated) to compare against `PreEnrollmentPage`.
 */
import RetireWiseReferenceApp from "@/features/enrollment/retirewiseReference/App";

export function PreEnrollmentSandbox() {
  return <RetireWiseReferenceApp />;
}
