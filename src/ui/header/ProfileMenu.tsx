import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Globe, LogOut, Settings, SunMoon } from "lucide-react";
import { useTheme } from "@/core/context/ThemeContext";
import { useUser } from "@/core/context/UserContext";
import { SUPPORTED_LANGS, normalizeLanguage } from "@/core/constants/locales";
import { cn } from "@/core/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/ui/components/dropdown-menu";
import { useLogoutFeedbackRequest } from "./LogoutFeedbackProvider";

const avatarBase =
  "flex shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold leading-none text-primary-foreground transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:opacity-90 data-[state=open]:opacity-90";

export type ProfileMenuProps = {
  /** Header row avatar vs floating pill */
  size?: "sm" | "md";
  className?: string;
};

export function ProfileMenu({ size = "sm", className }: ProfileMenuProps) {
  const { t, i18n } = useTranslation();
  const { profile } = useUser();
  const { toggleTheme } = useTheme();
  const { requestLogout } = useLogoutFeedbackRequest();

  const initials = useMemo(() => {
    const name = profile?.name?.trim();
    if (!name) return "?";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [profile?.name]);

  const currentLang = useMemo(
    () => normalizeLanguage(i18n.language ?? "en"),
    [i18n.language],
  );

  const sizeClass = size === "md" ? "h-9 w-9 text-xs" : "h-8 w-8 text-xs";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className={cn(avatarBase, sizeClass, className)}
        aria-label={t("header.profileMenuAria", { defaultValue: "Account menu" })}
      >
        {initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="size-4" aria-hidden />
            {t("header.menu.settings", { defaultValue: "Settings" })}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Globe className="size-4" aria-hidden />
            {t("common.language", { defaultValue: "Language" })}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {SUPPORTED_LANGS.map(({ code, labelKey }) => (
              <DropdownMenuItem
                key={code}
                onSelect={() => {
                  void i18n.changeLanguage(code);
                }}
              >
                {t(labelKey)}
                {currentLang === code ? (
                  <span className="ml-auto text-xs text-brand">✓</span>
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            toggleTheme();
          }}
        >
          <SunMoon className="size-4" aria-hidden />
          {t("header.menu.theme", { defaultValue: "Theme" })}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => {
            e.preventDefault();
            requestLogout();
          }}
        >
          <LogOut className="size-4" aria-hidden />
          {t("auth.logout", { defaultValue: "Log out" })}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
