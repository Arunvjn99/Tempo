import { PostEnrollmentDashboard } from "./PostEnrollmentDashboard";

/**
 * `/:version/dashboard` — same Snitch post-enrollment surface as `/dashboard/post-enrollment`.
 * {@link PostEnrollmentDashboard} redirects non–post-enrollment users to `/dashboard/pre-enrollment`.
 */
export function VersionedDashboard() {
  return <PostEnrollmentDashboard />;
}
