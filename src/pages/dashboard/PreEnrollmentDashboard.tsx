import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { PreEnrollment } from "@/versions/v1/dashboard/PreEnrollment";

/**
 * Explicit pre-enrollment home at `/dashboard/pre-enrollment`.
 * Enrolled users are sent to the post-enrollment dashboard.
 */
export function PreEnrollmentDashboard() {
  const { loading, enrollmentStatus } = useUser();
  if (loading) return null;
  if (enrollmentStatus === "completed") {
    return <Navigate to="/dashboard/post-enrollment" replace />;
  }
  return <PreEnrollment />;
}
