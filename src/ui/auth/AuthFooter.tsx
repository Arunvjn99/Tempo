import { branding } from "@/core/config/branding";
import { useBrandedLogo } from "@/core/hooks/useBrandedLogo";

/** Footer for auth pages: copyright (left), Privacy (center), logo mark (right). */
export const AuthFooter = () => {
  const { copyright, privacyLink, core } = branding.footer;
  const { logoUrl, hasImage, brandLabel, onImageError } = useBrandedLogo();

  return (
    <footer
      className="flex w-full flex-shrink-0 items-center justify-center bg-transparent px-4 py-6 md:px-8 lg:px-12"
      role="contentinfo"
    >
      <div className="flex w-full max-w-[420px] flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0 md:max-w-[520px] lg:max-w-[560px]">
        <p className="text-center text-xs text-[var(--color-textSecondary)] sm:text-left">
          {copyright}
        </p>
        <a
          href={privacyLink.href}
          className="text-center text-xs text-[var(--color-textSecondary)] no-underline hover:underline"
        >
          {privacyLink.label}
        </a>
        <div className="flex shrink-0 items-center justify-center sm:justify-end">
          {hasImage ? (
            <img
              src={logoUrl}
              alt={core.label}
              onError={onImageError}
              className="max-h-6 w-auto object-contain dark:[filter:brightness(0)_invert(1)]"
              decoding="async"
            />
          ) : (
            <span className="text-xs font-semibold text-[var(--color-textSecondary)]">
              {brandLabel}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};
