import { cn } from "@/core/lib/utils";

/**
 * Supabase public storage — source of truth for the CORE product mark in auth.
 * Future: resolve `logo_url` from user/org metadata when available, then fall back to this URL.
 */
export const CORE_LOGO_URL =
  "https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/CORE%20logo.png";

type CoreLogoProps = {
  className?: string;
  /** Defaults to "CORE". */
  alt?: string;
};

export function CoreLogo({
  className = "h-8 w-auto object-contain",
  alt = "CORE",
}: CoreLogoProps) {
  return <img src={CORE_LOGO_URL} alt={alt} className={cn(className)} decoding="async" />;
}
