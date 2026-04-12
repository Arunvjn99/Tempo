import { useLayoutEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEnrollmentStore } from "../store";
import { isEnrollmentStepPathSegment } from "../routes/enrollmentPaths";
import { EnrollmentFlowPage } from "./EnrollmentFlowPage";

/**
 * Single enrollment URL (`/enrollment`); optional `/enrollment/:stepId` deep links
 * apply the step once then replace with `/enrollment` (store-driven flow).
 */
export function EnrollmentRoute() {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const goTo = useEnrollmentStore((s) => s.goTo);

  useLayoutEffect(() => {
    if (stepId && isEnrollmentStepPathSegment(stepId)) {
      goTo(stepId);
      navigate({ pathname: "/enrollment", search: location.search }, { replace: true });
    }
  }, [stepId, goTo, navigate, location.search]);

  return <EnrollmentFlowPage />;
}
