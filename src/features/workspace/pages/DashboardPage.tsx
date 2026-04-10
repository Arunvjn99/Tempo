// ─────────────────────────────────────────────
// V4 Dashboard — composes sections from /ui
// ─────────────────────────────────────────────

import { useCallback } from "react";
import { PageLayout } from "@/ui/patterns";
import {
  DashboardHeroSection,
  DashboardLearnMoreSection,
  DashboardAssistanceSection,
} from "@/ui/patterns/sections/workspace";

function scrollToLearnMore() {
  document.getElementById("learn-more")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function DashboardPage() {
  const onLearnMore = useCallback(() => {
    scrollToLearnMore();
  }, []);

  const h = new Date().getHours();
  const greetingPrefix =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const greetingPill = `${greetingPrefix}, there`;

  return (
    <div className="flex flex-col">
      <DashboardHeroSection greetingPill={greetingPill} onLearnMore={onLearnMore} />

      <PageLayout className="!pt-12 !pb-16">
        <DashboardLearnMoreSection />
        <DashboardAssistanceSection />
      </PageLayout>
    </div>
  );
}
