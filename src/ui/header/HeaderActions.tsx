import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Bell, Globe, Search } from "lucide-react";
import { useUser } from "@/core/context/UserContext";
import { requestOpenGlobalSearch } from "@/core/hooks/useGlobalSearch";
import { cn } from "@/core/lib/utils";
import { ConnectedThemeToggle } from "@/ui";
import { Button } from "@/ui/components/Button";
import { SUPPORTED_LANGS, normalizeLanguage } from "@/core/constants/locales";

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
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
      </Button>

      <Button
        type="button"
        variant="secondary"
        size="md"
        onClick={() => requestOpenGlobalSearch()}
        className={cn(
          "hidden h-auto min-h-9 w-full max-w-[220px] justify-start gap-sm rounded-full font-normal lg:flex",
        )}
        aria-label={t("floatingSearch.openAria")}
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-left text-sm text-muted-foreground">
          {t("floatingSearch.placeholder")}
        </span>
        <kbd className="hidden shrink-0 rounded-md border border-border bg-background-secondary px-sm py-xs font-mono text-xs text-muted-foreground xl:inline">
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
        <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="hidden max-w-32 truncate sm:inline">{displayLabel}</span>
      </Button>
      {open ? (
        <div
          className="absolute right-0 z-50 mt-sm max-h-[70vh] min-w-40 overflow-y-auto rounded-lg border border-border bg-card py-xs shadow-elevation-md"
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
                  ? "font-medium text-primary"
                  : "text-muted-foreground",
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

function ProfileAvatar() {
  const { t } = useTranslation();
  const { profile } = useUser();
  const initials = useMemo(() => {
    const name = profile?.name?.trim();
    if (!name) return "?";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [profile?.name]);

  return (
    <Link
      to="/profile"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold leading-none text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={t("header.profileAria")}
    >
      {initials}
    </Link>
  );
}

/**
 * Right zone: consistent `gap-sm` on narrow viewports, `gap-md` from `md` up (tablet/desktop).
 */
export function HeaderActions() {
  const { t } = useTranslation();

  return (
    <div className="flex min-w-0 shrink-0 items-center justify-end gap-sm md:gap-md">
      <HeaderSearch />
      <HeaderLanguageSwitcher />
      <Button
        type="button"
        variant="secondary"
        size="iconMd"
        className="rounded-lg"
        aria-label={t("header.notifications")}
      >
        <Bell className="h-4 w-4 text-muted-foreground" aria-hidden />
      </Button>
      <div className="flex h-9 items-center">
        <ConnectedThemeToggle />
      </div>
      <ProfileAvatar />
    </div>
  );
}
