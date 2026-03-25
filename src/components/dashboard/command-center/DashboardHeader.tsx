import { Bell, Search, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { requestOpenGlobalSearch } from "@/hooks/useGlobalSearch";

export type DashboardNavItem = { id: string; label: string; href?: string; active?: boolean };

export interface DashboardHeaderProps {
  brandLabel?: string;
  navItems?: DashboardNavItem[];
  onNavClick?: (id: string) => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  userAvatarSrc?: string;
  userAvatarAlt?: string;
  className?: string;
}

const defaultNav: DashboardNavItem[] = [
  { id: "dashboard", label: "Dashboard", active: true },
  { id: "portfolio", label: "Portfolio" },
  { id: "planning", label: "Planning" },
  { id: "learning", label: "Learning" },
  { id: "advisor", label: "Advisor" },
];

export function DashboardHeader({
  brandLabel = "Retirement Portal",
  navItems = defaultNav,
  onNavClick,
  onNotificationsClick,
  onSettingsClick,
  userAvatarSrc,
  userAvatarAlt = "User profile",
  className,
}: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full border-b border-[color-mix(in_srgb,var(--color-on-surface)_6%,transparent)]",
        "bg-[color-mix(in_srgb,var(--color-nav-blur)_100%,transparent)] backdrop-blur-xl",
        "shadow-[0px_12px_32px_rgba(25,28,30,0.04)]",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-8 py-4">
        <div
          className="font-semibold tracking-tighter text-[var(--color-on-surface)]"
          style={{ fontFamily: "Manrope, system-ui, sans-serif", fontSize: "1.25rem" }}
        >
          {brandLabel}
        </div>
        <div className="hidden items-center gap-8 text-sm font-semibold tracking-tight md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavClick?.(item.id)}
              className={cn(
                "border-b-2 pb-1 transition-colors duration-200",
                item.active
                  ? "border-[var(--color-primary)] text-[var(--color-on-surface)]"
                  : "border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => requestOpenGlobalSearch()}
            className="rounded-md p-1 text-[var(--color-on-surface-variant)] transition-transform hover:text-[var(--color-on-surface)] active:scale-95"
            aria-label={t("nav.goToSearch")}
          >
            <Search className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            onClick={onNotificationsClick}
            className="rounded-md p-1 text-[var(--color-on-surface-variant)] transition-transform hover:text-[var(--color-on-surface)] active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={onSettingsClick}
            className="rounded-md p-1 text-[var(--color-on-surface-variant)] transition-transform hover:text-[var(--color-on-surface)] active:scale-95"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" strokeWidth={2} />
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full bg-[var(--color-surface-container-high)]">
            {userAvatarSrc ? (
              <img src={userAvatarSrc} alt={userAvatarAlt} className="h-full w-full object-cover" />
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
