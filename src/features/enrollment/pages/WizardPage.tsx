// Wizard is opened from the dashboard via `FigmaEnrollmentModal` (figma-v2). Inline wizard route redirects home.

import { Navigate } from "react-router-dom";

export function WizardPage() {
  return <Navigate to="/dashboard" replace />;
}
