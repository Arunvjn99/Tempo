import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Search } from "lucide-react";
import { useUser } from "@/core/context/UserContext";
import { requestOpenGlobalSearch } from "@/core/hooks/useGlobalSearch";
import { useBrandedLogo } from "@/core/hooks/useBrandedLogo";
import { SUPPORTED_LANGS, normalizeLanguage } from "@/core/constants/locales";
import { cn } from "@/core/lib/utils";
import { ConnectedThemeToggle } from "@/ui/components/ConnectedThemeToggle";
import { Button } from "@/ui/components/Button";
import { GlassCard } from "@/ui/components/GlassCard";
import { EnrollmentNavBrand } from "@/features/enrollment/ui/EnrollmentNavBrand";
import { HeaderMobileNavDialog, HeaderNav } from "@/ui/header/HeaderNav";
import { getHeaderNavMode } from "@/ui/header/headerNavConfig";
import { ProfileMenu } from "@/ui/header/ProfileMenu";
import { TEMP_BYPASS_DASHBOARD_REDIRECTS, TEMP_DEFAULT_APP_ROUTE } from "@/core/tempRoutingBypass";

const floatingIconButtonClass =
  "w-9 h-9 flex shrink-0 items-center justify-center rounded-full hover:bg-[var(--surface-soft)] transition";

const floatingStartEnrollButtonClass =
  "inline-flex max-w-full min-w-0 shrink items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--surface-page)] transition-colors hover:bg-[color-mix(in_srgb,var(--text-primary)_90%,var(--surface-page))] sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs";

function FloatingHeaderLogo({
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
        "header-logo min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-page)]",
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
            className="h-7 w-auto max-w-[var(--header-logo-max-width)] object-contain sm:h-8"
            decoding="async"
            loading="eager"
          />
        </div>
      ) : (
        <span className="block max-w-32 truncate text-xs font-semibold text-[var(--text-primary)] sm:max-w-48 sm:text-sm">
          {brandLabel}
        </span>
      )}
    </Link>
  );
}

function FloatingHeaderStartEnrollButton({ onStartEnroll }: { onStartEnroll: () => void }) {
  const { t } = useTranslation();
  return (
    <Button
      type="button"
      variant="custom"
      size="custom"
      onClick={onStartEnroll}
      className={cn(floatingStartEnrollButtonClass, "max-w-[150px] justify-center sm:max-w-[170px]")}
      title={t("header.startEnrollmentButton", { defaultValue: "Start Enrollment" })}
    >
      <span className="min-w-0 truncate">{t("header.startEnrollmentButton", { defaultValue: "Start Enrollment" })}</span>
      <ArrowRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
    </Button>
  );
}

function FloatingHeaderSearchButton() {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className={floatingIconButtonClass}
      onClick={() => requestOpenGlobalSearch()}
      aria-label={t("header.searchCompactAria")}
    >
      <Search className="h-4 w-4 text-[var(--text-secondary)]" aria-hidden />
    </button>
  );
}

function FloatingHeaderLanguageButton() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = useMemo(
    () => normalizeLanguage(i18n.language ?? "en"),
    [i18n.language],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className={floatingIconButtonClass}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("common.language")}
      >
        <Globe className="h-4 w-4 text-[var(--text-secondary)]" aria-hidden />
      </button>
      {open ? (
        <div
          className="absolute right-0 z-50 mt-sm max-h-[70vh] min-w-40 overflow-y-auto rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] py-xs "
          role="menu"
        >
          {SUPPORTED_LANGS.map(({ code, labelKey }) => (
            <Button
              key={code}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                void i18n.changeLanguage(code);
                setOpen(false);
              }}
              role="menuitem"
              className={cn(
                "h-auto w-full min-h-0 justify-start rounded-none px-md py-sm font-normal",
                currentLang === code
                  ? "font-medium text-[var(--color-primary)]"
                  : "text-[var(--text-secondary)]",
              )}
            >
              {t(labelKey)}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export type PreEnrollmentFloatingHeaderInnerProps = {
  showStartEnroll: boolean;
  onStartEnroll: () => void;
};

/**
 * Minimal pill header for the pre-enrollment dashboard (`/dashboard` scrolled to top).
 * Icon-only utilities on the right; same nav links as the standard header.
 */
export function PreEnrollmentFloatingHeaderInner({
  showStartEnroll,
  onStartEnroll,
}: PreEnrollmentFloatingHeaderInnerProps) {
  const { t } = useTranslation();
  const { enrollmentStatus } = useUser();
  const { logoUrl, hasImage, brandLabel, onImageError } = useBrandedLogo();
  const mode = useMemo(() => getHeaderNavMode(enrollmentStatus), [enrollmentStatus]);

  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-2 px-4 py-2 sm:gap-3 md:gap-4">
      <div className="flex min-h-0 min-w-0 flex-1 items-center gap-2 sm:gap-3 md:gap-4">
        <div className="shrink-0">
          <HeaderMobileNavDialog mode={mode} />
        </div>
        <div className="min-w-0 shrink-0">
          <FloatingHeaderLogo
            logoUrl={logoUrl}
            hasImage={hasImage}
            brandLabel={brandLabel}
            ariaLabel={t("header.logoAria")}
            companyLogoAlt={t("header.companyLogoAlt")}
            onImageError={onImageError}
          />
        </div>

        <div className="hidden min-h-0 min-w-0 flex-1 items-center justify-center gap-2 md:flex md:gap-3 lg:gap-4">
          <div className="scrollbar-hide max-w-full min-w-0 overflow-x-auto overflow-y-visible">
            <nav
              className="inline-flex w-max max-w-full shrink-0 items-center gap-3 whitespace-nowrap md:gap-5 lg:gap-6"
              aria-label="Main"
            >
              <HeaderNav mode={mode} variant="desktop" />
            </nav>
          </div>
          {showStartEnroll ? (
            <div className="hidden shrink-0 md:block">
              <FloatingHeaderStartEnrollButton onStartEnroll={onStartEnroll} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
        {showStartEnroll ? (
          <div className="shrink md:hidden">
            <FloatingHeaderStartEnrollButton onStartEnroll={onStartEnroll} />
          </div>
        ) : null}

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <FloatingHeaderSearchButton />
          <FloatingHeaderLanguageButton />
          <ConnectedThemeToggle
            className={cn(
              floatingIconButtonClass,
              "!h-9 !w-9 min-h-0 min-w-0 border-0 bg-transparent p-0 ",
              "text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--brand-primary)]",
              "focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-[var(--surface-page)]",
            )}
          />
          <ProfileMenu size="md" />
        </div>
      </div>
    </div>
  );
}

export type PreEnrollmentHeaderProps = {
  onStartEnroll: () => void;
};

/**
 * @deprecated Navigation and floating chrome are handled by {@link AppHeader} on `/dashboard`.
 * Retained for rare direct use; prefer the global header + {@link PreEnrollmentDashboardHeaderProvider}.
 */
export function PreEnrollmentHeader({ onStartEnroll }: PreEnrollmentHeaderProps) {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6">
      <GlassCard
        className="max-w-fit mx-auto rounded-full px-8 py-3 flex items-center gap-10"
        role="navigation"
        aria-label="Primary"
      >
        <EnrollmentNavBrand />

        <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-[var(--text-secondary)]">
          <Link to="/dashboard" className="text-[var(--text-primary)] transition-colors hover:text-[var(--text-primary)]">
            Dashboard
          </Link>
          <Link to="/transactions" className="transition-colors hover:text-[var(--text-primary)]">
            Transactions
          </Link>
          <Link to="/investments" className="transition-colors hover:text-[var(--text-primary)]">
            Investment Portfolio
          </Link>
          <Link to="/plans" className="transition-colors hover:text-[var(--text-primary)]">
            Plans
          </Link>
          <Link to="/profile" className="transition-colors hover:text-[var(--text-primary)]">
            Profile
          </Link>
        </div>

        <Button
          type="button"
          variant="custom"
          size="custom"
          onClick={onStartEnroll}
          className="flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] px-6 py-2.5 text-[13px] font-bold text-[var(--surface-page)] transition-all hover:bg-[color-mix(in_srgb,var(--text-primary)_90%,var(--surface-page))]"
        >
          Start Enroll <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </GlassCard>
    </div>
  );
}
