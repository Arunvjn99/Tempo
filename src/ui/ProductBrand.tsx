import { CoreLogo, CORE_LOGO_URL } from "@/components/ui/CoreLogo";
import { branding } from "@/core/config/branding";
import { cn } from "@/core/lib/utils";

/** @deprecated Import {@link CORE_LOGO_URL} from `@/components/ui/CoreLogo` instead. */
export const CORE_PRODUCT_LOGO_SRC = CORE_LOGO_URL;

export type ProductBrandProps = {
  className?: string;
  /** Applied to the `<img>` (height, object-fit). Default matches auth card headers. */
  logoClassName?: string;
  /** `header` — card hero (default). `footer` — compact mark, no subtitle/byline. */
  density?: "header" | "footer";
  /** Secondary line under the logo (hidden when `density="footer"`). */
  showSubtitle?: boolean;
  /** “by Congruent Solutions” (hidden when `density="footer"`). */
  showByline?: boolean;
};

const subtitleText = "Retirement Intelligence Platform";

/**
 * CORE product identity for **auth and pre-app** surfaces only.
 * Post-login chrome should use company branding (`useBrandedLogo` / app header), not this component.
 */
export function ProductBrand({
  className,
  logoClassName,
  density = "header",
  showSubtitle = true,
  showByline = true,
}: ProductBrandProps) {
  const isFooter = density === "footer";
  const showSub = !isFooter && showSubtitle;
  const showBy = !isFooter && showByline;

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isFooter ? "items-center" : "items-start",
        className,
      )}
    >
      <CoreLogo
        alt={branding.logo.alt}
        className={cn(
          isFooter
            ? "h-6 w-auto max-h-6 max-w-[120px] object-contain object-center"
            : "h-8 w-auto max-w-[200px] object-contain object-left",
          logoClassName,
        )}
      />
      {showSub ? (
        <p className="text-sm leading-snug text-[var(--color-text-secondary)]">{subtitleText}</p>
      ) : null}
      {showBy ? (
        <span className="text-xs text-[var(--color-text-secondary)] opacity-80">by Congruent Solutions</span>
      ) : null}
    </div>
  );
}
