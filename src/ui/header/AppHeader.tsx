import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useBrandedLogo } from "@/core/hooks/useBrandedLogo";
import { useUser } from "@/core/context/UserContext";
import { cn } from "@/core/lib/utils";
import { motionOffset, motionTransition } from "@/ui/animations/motionTokens";
import { Button } from "@/ui/components/Button";
import { PreEnrollmentFloatingHeaderInner } from "@/features/enrollment/ui/PreEnrollmentHeader";
import { HeaderActions } from "./HeaderActions";
import { HeaderMobileNavDialog, HeaderNav } from "./HeaderNav";
import { getHeaderNavMode } from "./headerNavConfig";
import { usePreEnrollmentDashboardHeader } from "./PreEnrollmentDashboardHeaderContext";
import { TEMP_BYPASS_DASHBOARD_REDIRECTS, TEMP_DEFAULT_APP_ROUTE } from "@/core/tempRoutingBypass";

const SCROLL_THRESHOLD_PX = 20;

function HeaderLogo({
  logoUrl,
  hasImage,
  brandLabel,
  ariaLabel,
  companyLogoAlt,
  onImageError,
}: {
  logoUrl: string;
  hasImage: boolean;
  brandLabel: string;
  ariaLabel: string;
  companyLogoAlt: string;
  onImageError: () => void;
}) {
  return (
    <Link
      to={TEMP_BYPASS_DASHBOARD_REDIRECTS ? TEMP_DEFAULT_APP_ROUTE : "/dashboard"}
      className={cn(
        "header-logo min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !hasImage && "max-w-full",
      )}
      aria-label={ariaLabel}
    >
      {hasImage ? (
        <div className="header-logo__frame">
          <img
            src={logoUrl}
            alt={companyLogoAlt}
            onError={onImageError}
            className="h-8 w-auto max-w-[var(--header-logo-max-width)] object-contain"
            decoding="async"
            loading="eager"
          />
        </div>
      ) : (
        <span className="block max-w-36 truncate text-sm font-semibold text-primary sm:max-w-48 md:text-base lg:max-w-xs">
          {brandLabel}
        </span>
      )}
    </Link>
  );
}

const startEnrollButtonClass =
  "inline-flex max-w-full min-w-0 shrink items-center gap-1.5 rounded-full bg-foreground px-3 py-2 text-xs font-bold text-background transition-colors hover:bg-foreground/90 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[13px]";

function HeaderStartEnrollButton({ onStartEnroll }: { onStartEnroll: () => void }) {
  const { t } = useTranslation();
  return (
    <Button
      type="button"
      variant="custom"
      size="custom"
      onClick={onStartEnroll}
      className={cn(startEnrollButtonClass, "max-w-[180px] justify-center")}
      title={t("header.startEnrollmentButton", { defaultValue: "Start Enrollment" })}
    >
      <span className="min-w-0 truncate">{t("header.startEnrollmentButton", { defaultValue: "Start Enrollment" })}</span>
      <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
    </Button>
  );
}

function AppHeaderInner({
  showStartEnroll,
  onStartEnroll,
}: {
  showStartEnroll: boolean;
  onStartEnroll: () => void;
}) {
  const { t } = useTranslation();
  const { enrollmentStatus } = useUser();
  const { logoUrl, hasImage, brandLabel, onImageError } = useBrandedLogo();
  const mode = useMemo(() => getHeaderNavMode(enrollmentStatus), [enrollmentStatus]);

  return (
    <div className="mx-auto flex min-h-16 w-full min-w-0 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 md:gap-6">
      {/* LEFT: menu + logo + (desktop: scrollable nav | CTA does not steal nav space) */}
      <div className="flex min-h-0 min-w-0 flex-1 items-center gap-3 md:gap-6 lg:gap-8">
        <div className="shrink-0">
          <HeaderMobileNavDialog mode={mode} />
        </div>

        <div className="min-w-0 shrink-0 pr-1 sm:pr-0">
          <HeaderLogo
            logoUrl={logoUrl}
            hasImage={hasImage}
            brandLabel={brandLabel}
            ariaLabel={t("header.logoAria")}
            companyLogoAlt={t("header.companyLogoAlt")}
            onImageError={onImageError}
          />
        </div>

        <div className="hidden min-h-0 min-w-0 flex-1 items-center md:flex md:gap-4 lg:gap-6">
          {/* Nav gets priority: scroll horizontally if the bar is narrow; never shrink link text away */}
          <div className="scrollbar-hide min-w-0 flex-1 overflow-x-auto overflow-y-visible">
            <nav
              className="inline-flex w-max shrink-0 items-center gap-4 whitespace-nowrap md:gap-6 lg:gap-8"
              aria-label="Main"
            >
              <HeaderNav mode={mode} variant="desktop" />
            </nav>
          </div>
          {showStartEnroll ? (
            <div className="hidden max-w-[180px] shrink md:block">
              <HeaderStartEnrollButton onStartEnroll={onStartEnroll} />
            </div>
          ) : null}
        </div>
      </div>

      {/* RIGHT: mobile CTA + utilities — min-w-0 lets search shrink before nav */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
        {showStartEnroll ? (
          <div className="max-w-[180px] shrink md:hidden">
            <HeaderStartEnrollButton onStartEnroll={onStartEnroll} />
          </div>
        ) : null}
        <HeaderActions />
      </div>
    </div>
  );
}

export function AppHeader() {
  const { pathname } = useLocation();
  const { runDashboardStartEnroll, hasDashboardStartEnroll } = usePreEnrollmentDashboardHeader();
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  const isPreEnrollment = pathname === "/dashboard";
  const isFloating = isPreEnrollment && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
  }, [pathname]);

  const showStartEnroll = isPreEnrollment && hasDashboardStartEnroll;

  const headerShellClass =
    "fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out";

  const barClass = cn(
    "mx-auto flex w-full min-w-0 transition-all duration-300 ease-in-out",
    isFloating
      ? "mt-4 h-auto max-w-5xl rounded-full border border-default bg-[var(--surface-card)] shadow-header"
      : "min-h-16 w-full border-b border-default bg-[var(--surface-card)] shadow-header",
  );

  /** Reserves space under the fixed header so main content does not jump when morphing. */
  const spacerClass = cn(
    "shrink-0 transition-all duration-300 ease-in-out",
    isFloating ? "h-[4.5rem]" : "h-16",
  );

  const inner = isFloating ? (
    <PreEnrollmentFloatingHeaderInner
      showStartEnroll={showStartEnroll}
      onStartEnroll={runDashboardStartEnroll}
    />
  ) : (
    <AppHeaderInner showStartEnroll={showStartEnroll} onStartEnroll={runDashboardStartEnroll} />
  );

  if (reduceMotion) {
    return (
      <>
        <header className={headerShellClass}>
          <div className={barClass}>{inner}</div>
        </header>
        <div aria-hidden className={spacerClass} />
      </>
    );
  }

  return (
    <>
      <motion.header
        className={headerShellClass}
        initial={{ y: -motionOffset.headerEnterY }}
        animate={{ y: 0 }}
        transition={motionTransition({ duration: "normal", ease: "smooth" })}
      >
        <div className={barClass}>{inner}</div>
      </motion.header>
      <div aria-hidden className={spacerClass} />
    </>
  );
}
