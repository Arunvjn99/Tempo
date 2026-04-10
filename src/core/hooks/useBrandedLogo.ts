import { useEffect, useMemo, useState } from "react";
import { branding } from "@/core/config/branding";
import { useTheme } from "@/core/context/ThemeContext";
import { useUser } from "@/core/context/UserContext";

export type UseBrandedLogoResult = {
  /** Resolved image URL (Supabase storage or theme JSON); empty when none. */
  logoUrl: string;
  /** Whether an image should be shown (false after error or when URL missing). */
  hasImage: boolean;
  /** Text fallback when `hasImage` is false. */
  brandLabel: string;
  onImageError: () => void;
};

/**
 * Logo resolution: company row from backend (e.g. Supabase storage URL) → theme colors → text fallback.
 * No static asset paths; callers render `<img>` only when `hasImage` is true.
 */
export function useBrandedLogo(): UseBrandedLogoResult {
  const { company, profile } = useUser();
  const { currentColors } = useTheme();
  const [failed, setFailed] = useState(false);

  const logoUrl = useMemo(() => {
    const fromCompany = company?.logo_url?.trim();
    if (fromCompany) return fromCompany;
    const fromTheme = currentColors.logo?.trim();
    if (fromTheme) return fromTheme;
    return "";
  }, [company?.logo_url, currentColors.logo]);

  useEffect(() => {
    setFailed(false);
  }, [logoUrl]);

  const brandLabel =
    company?.name?.trim() || profile?.name?.trim() || branding.authAppName;

  const resolvedUrl = failed ? "" : logoUrl;
  const hasImage = Boolean(resolvedUrl);

  return {
    logoUrl: resolvedUrl,
    hasImage,
    brandLabel,
    onImageError: () => setFailed(true),
  };
}
