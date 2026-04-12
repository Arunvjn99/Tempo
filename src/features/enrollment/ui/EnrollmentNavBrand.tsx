import { cn } from "@/core/lib/utils";
import { useBrandedLogo } from "@/core/hooks/useBrandedLogo";

type EnrollmentNavBrandProps = {
  className?: string;
  /** Image height class (Tailwind), e.g. `h-7` */
  imgClassName?: string;
};

/**
 * Workspace / tenant mark for enrollment sandbox nav — URL from company + theme (e.g. Supabase storage).
 */
export function EnrollmentNavBrand({
  className,
  imgClassName = "h-7 w-auto max-w-[160px] object-contain",
}: EnrollmentNavBrandProps) {
  const { logoUrl, hasImage, brandLabel, onImageError } = useBrandedLogo();

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      {hasImage ? (
        <img
          src={logoUrl}
          alt={brandLabel}
          onError={onImageError}
          className={imgClassName}
          decoding="async"
        />
      ) : (
        <span className="truncate font-bold text-lg tracking-tight text-[var(--text-primary)]">
          {brandLabel}
        </span>
      )}
    </div>
  );
}
