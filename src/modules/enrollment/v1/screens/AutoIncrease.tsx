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
export function AutoIncrease() {
  const { pathname } = useLocation();
  if (pathname === V1_ENROLLMENT_AUTO_INCREASE_CONFIG_PATH || pathname.endsWith("/auto-increase/config")) {
    return <AutoIncreaseConfigScreen />;
  }
  if (pathname === V1_ENROLLMENT_AUTO_INCREASE_SKIP_PATH || pathname.endsWith("/auto-increase/skip")) {
    return <AutoIncreaseSkip />;
  }
  return <AutoIncreaseDecisionScreen />;
}
