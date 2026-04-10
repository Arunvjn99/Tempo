/**
 * Full-screen splash shown on initial app load (~1.5s), once per session.
 * Logo from {@link useBrandedLogo}; text fallback when no URL.
 */
import { useEffect, useState } from "react";
import { useBrandedLogo } from "@/core/hooks/useBrandedLogo";

const SPLASH_DURATION_MS = 1500;
const SPLASH_SHOWN_KEY = "splash_shown";

export const SplashScreen = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof sessionStorage === "undefined") return true;
    return !sessionStorage.getItem(SPLASH_SHOWN_KEY);
  });

  const { logoUrl, hasImage, brandLabel, onImageError } = useBrandedLogo();

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(SPLASH_SHOWN_KEY, "1");
      } catch {
        // ignore
      }
      setVisible(false);
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--color-background)]"
      role="presentation"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-6">
        {hasImage ? (
          <img
            src={logoUrl}
            alt=""
            onError={onImageError}
            className="h-12 w-auto object-contain dark:[filter:brightness(0)_invert(1)]"
            decoding="async"
          />
        ) : (
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {brandLabel}
          </span>
        )}
        <div className="flex gap-1">
          <span
            className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};
