// ─────────────────────────────────────────────
// V4 Investments — composes overview from /ui
// ─────────────────────────────────────────────

import { InvestmentsOverview } from "@/ui/patterns/sections/workspace/InvestmentsOverview";
import { useInvestmentsPage } from "../hooks/useInvestmentsPage";

export function InvestmentsPage() {
  const vm = useInvestmentsPage();
  return <InvestmentsOverview {...vm} />;
}
