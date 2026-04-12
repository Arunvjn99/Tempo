import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Globe, Search } from "lucide-react";
import { requestOpenGlobalSearch } from "@/core/hooks/useGlobalSearch";
import { cn } from "@/core/lib/utils";
import { ConnectedThemeToggle } from "@/ui";
import { Button } from "@/ui/components/Button";
import { SUPPORTED_LANGS, normalizeLanguage } from "@/core/constants/locales";
import { ProfileMenu } from "@/ui/header/ProfileMenu";

function HeaderSearch() {
  const { t } = useTranslation();

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="iconMd"
        onClick={() => requestOpenGlobalSearch()}
        className="rounded-lg lg:hidden"
        aria-label={t("header.searchCompactAria")}
      >
        <Search className="h-4 w-4 text-secondary" aria-hidden />
      </Button>

      <Button
        type="button"
        variant="secondary"
        size="md"
        onClick={() => requestOpenGlobalSearch()}
        className={cn(
          "hidden h-auto min-h-9 min-w-0 w-full max-w-[220px] flex-1 justify-start gap-sm rounded-full font-normal lg:flex",
        )}
        aria-label={t("floatingSearch.openAria")}
      >
        <Search className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-left text-sm text-secondary">
          {t("floatingSearch.placeholder")}
        </span>
        <kbd className="hidden shrink-0 rounded-md border border-default bg-background-secondary px-sm py-xs font-mono text-xs text-secondary xl:inline">
          ⌘K
        </kbd>
      </Button>
    </>
  );
}

function HeaderLanguageSwitcher() {
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

  const displayLabel = SUPPORTED_LANGS.find((x) => x.code === currentLang)
    ? t(SUPPORTED_LANGS.find((x) => x.code === currentLang)!.labelKey)
    : currentLang.toUpperCase();

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        variant="secondary"
        size="md"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("common.language")}
        className="h-auto min-h-9 shrink-0 gap-sm rounded-lg px-md font-medium"
      >
        <Globe className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
        <span className="hidden max-w-32 truncate sm:inline">{displayLabel}</span>
      </Button>
      {open ? (
        <div
          className="absolute right-0 z-50 mt-sm max-h-[70vh] min-w-40 overflow-y-auto rounded-lg border border-default bg-surface-card py-xs shadow-elevation-md"
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
                  ? "font-medium text-brand"
                  : "text-secondary",
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

/**
 * Right zone: consistent `gap-sm` on narrow viewports, `gap-md` from `md` up (tablet/desktop).
 */
export function HeaderActions() {
  const { t } = useTranslation();

  return (
    <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3 md:gap-md">
      {/* Search flexes/shrinks first inside the actions cluster so nav keeps space */}
      <div className="min-w-0 flex-1 max-w-[220px] sm:min-w-[7rem]">
        <HeaderSearch />
      </div>
      <div className="flex shrink-0 items-center gap-sm md:gap-md">
        <HeaderLanguageSwitcher />
        <Button
          type="button"
          variant="secondary"
          size="iconMd"
          className="rounded-lg"
          aria-label={t("header.notifications")}
        >
          <Bell className="h-4 w-4 text-secondary" aria-hidden />
        </Button>
        <div className="flex h-9 items-center">
          <ConnectedThemeToggle />
        </div>
        <ProfileMenu size="sm" />
      </div>
    </div>
  );
}
