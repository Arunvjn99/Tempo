import { useEffect, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useGlobalSearch } from "@/core/hooks/useGlobalSearch";
import { AppHeader } from "@/ui/header/AppHeader";
import { CoreAIFab } from "@/ui/ai/CoreAIFab";
import { FloatingSearchBar } from "@/ui/search/FloatingSearchBar";
import { GlobalSearchHost } from "@/ui/search/GlobalSearchHost";
import { GlobalSearchProvider } from "@/core/context/GlobalSearchContext";
import { useAIAssistantStore } from "@/core/globalStores/aiAssistantStore";
import { useAISettingsStore } from "@/core/globalStores/aiSettingsStore";
import { cn } from "@/core/lib/utils";
import { PageTransition } from "@/ui/animations/PageTransition";
import { AppShellChromeProvider, useAppShellSubHeader } from "@/v4/layouts/AppShellContext";
import { PreEnrollmentDashboardHeaderProvider } from "@/ui/header/PreEnrollmentDashboardHeaderContext";
import { LogoutFeedbackProvider } from "@/ui/header/LogoutFeedbackProvider";
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
  const { closeSearch } = useGlobalSearch();

  useEffect(() => {
    closeSearch();
  }, [closeSearch]);

  useLayoutEffect(() => {
    document.body.classList.remove("global-search-open");
    useAIAssistantStore.getState().close();
  }, []);
  const isEnrollment = pathname === "/enrollment" || pathname.startsWith("/enrollment/");
  const isDashboard = pathname === "/dashboard";
  const isTransactionsHub =
    pathname === "/transactions" ||
    pathname === "/transactions-test" ||
    pathname.startsWith("/transactions/");
  const mainFullBleed = isEnrollment || isDashboard || isTransactionsHub;
  const showCoreAI = coreAIEnabled && !shouldHideCoreAI(pathname);

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-[var(--surface-page)] text-[var(--text-primary)] opacity-100 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <AppHeader />
      {subHeader ? <div className="w-full border-b border-default bg-background">{subHeader}</div> : null}
      <main className={cn("min-h-0 flex-1 overflow-x-hidden", mainFullBleed && "flex flex-col")}>
        {mainFullBleed ? (
          <div className="flex min-h-0 flex-1 flex-col pb-28">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        ) : (
          <div className={cn("mx-auto w-full pb-28", APP_SHELL_MAX_WIDTH_CLASS, APP_SHELL_MAIN_X, "py-6 md:py-8")}>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        )}
      </main>
      <FloatingSearchBar />
      <GlobalSearchHost />
      {showCoreAI ? <CoreAIFab /> : null}
    </div>
  );
}

export function V4AppShell() {
  return (
    <GlobalSearchProvider>
      <AppShellChromeProvider>
        <PreEnrollmentDashboardHeaderProvider>
          <LogoutFeedbackProvider>
            <V4AppShellInner />
          </LogoutFeedbackProvider>
        </PreEnrollmentDashboardHeaderProvider>
      </AppShellChromeProvider>
    </GlobalSearchProvider>
  );
}
