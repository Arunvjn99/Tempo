import { Outlet, useLocation } from "react-router-dom";
import { AppHeader } from "@/ui/header/AppHeader";
import { CoreAIFab } from "@/ui/ai/CoreAIFab";
import { FloatingSearchBar } from "@/ui/search/FloatingSearchBar";
import { GlobalSearchHost } from "@/ui/search/GlobalSearchHost";
import { useAISettingsStore } from "@/core/globalStores/aiSettingsStore";
import { cn } from "@/core/lib/utils";
import { PageTransition } from "@/ui/animations/PageTransition";
import { AppShellChromeProvider, useAppShellSubHeader } from "@/v4/layouts/AppShellContext";
import {
  APP_SHELL_MAX_WIDTH_CLASS,
  APP_SHELL_MAIN_X,
} from "@/v4/layouts/layoutConstants";

const HIDE_CORE_AI_PREFIXES = [
  "/v1/login",
  "/v2/login",
  "/v1/verify",
  "/v2/verify",
  "/signup",
  "/forgot",
  "/forgot/verify",
  "/reset",
  "/help",
];

function shouldHideCoreAI(pathname: string): boolean {
  if (pathname === "/") return true;
  return HIDE_CORE_AI_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function V4AppShellInner() {
  const { pathname } = useLocation();
  const coreAIEnabled = useAISettingsStore((s) => s.coreAIEnabled);
  const { subHeader } = useAppShellSubHeader();
  const showCoreAI = coreAIEnabled && !shouldHideCoreAI(pathname);

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-background text-foreground pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <AppHeader />
      {subHeader ? <div className="w-full border-b border-border bg-background">{subHeader}</div> : null}
      <main className="min-h-0 flex-1 overflow-x-hidden">
        <div className={cn("mx-auto w-full pb-28", APP_SHELL_MAX_WIDTH_CLASS, APP_SHELL_MAIN_X, "py-6 md:py-8")}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
      <FloatingSearchBar />
      <GlobalSearchHost />
      {showCoreAI ? <CoreAIFab /> : null}
    </div>
  );
}

export function V4AppShell() {
  return (
    <AppShellChromeProvider>
      <V4AppShellInner />
    </AppShellChromeProvider>
  );
}
