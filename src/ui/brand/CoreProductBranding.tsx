/**
 * Product branding for pre-auth pages (Login, Signup, Forgot Password, etc.).
 * Logo URL resolves from company + theme via {@link useBrandedLogo} (e.g. Supabase storage).
 */
import { branding } from "@/core/config/branding";
import { useBrandedLogo } from "@/core/hooks/useBrandedLogo";

interface CoreProductBrandingProps {
  className?: string;
  /** Optional: show "by Congruent Solutions" subtext */
  showByline?: boolean;
  /** Optional: class for the logo img / title block */
  imgClassName?: string;
}

export const CoreProductBranding = ({
  className = "",
  showByline = true,
  imgClassName = "h-10 w-auto object-contain mb-2",
}: CoreProductBrandingProps) => {
  const { logoUrl, hasImage, brandLabel, onImageError } = useBrandedLogo();

  return (
    <div className={`flex flex-col items-start mb-6 ${className}`.trim()}>
      {hasImage ? (
        <img
          src={logoUrl}
          alt={branding.logo.alt}
          onError={onImageError}
          className={`${imgClassName} dark:[filter:brightness(0)_invert(1)]`.trim()}
          decoding="async"
        />
      ) : (
        <span
          className={`block font-bold tracking-tight text-foreground ${imgClassName}`.trim()}
        >
          {brandLabel}
        </span>
      )}
      <p className="text-sm text-[var(--color-text-secondary)]">
        Retirement Intelligence Platform
      </p>
      {showByline && (
        <span className="text-xs text-[var(--color-text-secondary)] opacity-80 mt-0.5">
          by Congruent Solutions
        </span>
      )}
    </div>
  );
};
