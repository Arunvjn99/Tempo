import { useLocation } from "react-router-dom";
import {
  V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH,
  V1_ENROLLMENT_AUTO_INCREASE_SKIP_PATH,
} from "../flow/v1WizardPaths";
import { AutoIncreaseConfigScreen } from "./AutoIncreaseConfigScreen";
import { AutoIncreaseDecisionScreen } from "./AutoIncreaseDecisionScreen";
import { AutoIncreaseSkip } from "./AutoIncreaseSkip";

/**
 * Routes the auto-increase step to decision vs config by URL (no merged UI).
 */
function normalizeEnrollmentPath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

export function AutoIncrease() {
  const { pathname } = useLocation();
  const p = normalizeEnrollmentPath(pathname);
  const configPath = normalizeEnrollmentPath(V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH);
  const skipPath = normalizeEnrollmentPath(V1_ENROLLMENT_AUTO_INCREASE_SKIP_PATH);

  if (p === configPath || p.endsWith("/auto-increase/config")) {
    return <AutoIncreaseConfigScreen />;
  }
  if (p === skipPath || p.endsWith("/auto-increase/skip")) {
    return <AutoIncreaseSkip />;
  }
  return <AutoIncreaseDecisionScreen />;
}
