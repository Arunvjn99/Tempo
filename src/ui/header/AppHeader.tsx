import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useBrandedLogo } from "@/core/hooks/useBrandedLogo";
import { useUser } from "@/core/context/UserContext";
import { cn } from "@/core/lib/utils";
import { motionOffset, motionTransition } from "@/ui/animations/motionTokens";
import { HeaderActions } from "./HeaderActions";
import { HeaderMobileNavDialog, HeaderNav } from "./HeaderNav";
import { getHeaderNavMode } from "./headerNavConfig";

const headerChrome =
  "sticky top-0 z-50 flex h-16 w-full shrink-0 flex-col border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80";

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
      to="/dashboard"
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
        <span className="block max-w-36 truncate text-sm font-semibold text-foreground sm:max-w-48 md:text-base lg:max-w-xs">
          {brandLabel}
        </span>
      )}
    </Link>
  );
}

export function AppHeader() {
  const { t } = useTranslation();
  const { enrollmentStatus } = useUser();
  const { logoUrl, hasImage, brandLabel, onImageError } = useBrandedLogo();
  const reduceMotion = useReducedMotion();

  const mode = useMemo(() => getHeaderNavMode(enrollmentStatus), [enrollmentStatus]);

  const inner = (
    <div className="container-app flex h-full min-h-0 min-w-0 items-center">
      {/* LEFT GROUP: hamburger (mobile) + logo + desktop nav */}
      <div className="flex min-w-0 items-center gap-xl">
        <HeaderMobileNavDialog mode={mode} />
        <HeaderLogo
          logoUrl={logoUrl}
          hasImage={hasImage}
          brandLabel={brandLabel}
          ariaLabel={t("header.logoAria")}
          companyLogoAlt={t("header.companyLogoAlt")}
          onImageError={onImageError}
        />
        <nav className="hidden md:flex items-center gap-xl ml-md" aria-label="Main">
          <HeaderNav mode={mode} variant="desktop" />
        </nav>
      </div>

      {/* RIGHT GROUP */}
      <div className="ml-auto flex min-w-0 shrink-0 items-center gap-md">
        <HeaderActions />
      </div>
    </div>
  );

  if (reduceMotion) {
    return <header className={headerChrome}>{inner}</header>;
  }

  return (
    <motion.header
      className={headerChrome}
      initial={{ y: -motionOffset.headerEnterY, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={motionTransition({ duration: "normal", ease: "smooth" })}
    >
      {inner}
    </motion.header>
  );
}
