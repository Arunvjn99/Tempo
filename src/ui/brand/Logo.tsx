/**
 * Product logo for pre-auth pages only (Login, Signup, Forgot Password, etc.).
 * Resolves mark via {@link useBrandedLogo} (company + theme); text fallback when no URL.
 */
import { CoreProductBranding } from "./CoreProductBranding";

interface LogoProps {
  className?: string;
  /** Show "by Congruent Solutions" subtext (default true) */
  showByline?: boolean;
}

export const Logo = ({ className = "", showByline = true }: LogoProps) => (
  <CoreProductBranding
    imgClassName={className ? `${className} object-contain mb-2` : "h-10 w-auto object-contain mb-2"}
    showByline={showByline}
  />
);
