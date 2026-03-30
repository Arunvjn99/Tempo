/**
 * Decorative hero art — abstract “growth” motif (tokens only, no raster assets).
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse 80% 70% at 70% 40%, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 70%)",
      }}
    >
      <svg viewBox="0 0 320 280" className="h-full w-full max-h-[280px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pe-hero-arc" x1="40" y1="200" x2="280" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="pe-hero-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M32 220 Q 120 200 180 140 T 288 48"
          stroke="url(#pe-hero-arc)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          style={{ filter: "drop-shadow(0 4px 12px color-mix(in srgb, var(--color-primary) 25%, transparent))" }}
        />
        <path
          d="M32 220 L32 240 L288 240 L288 220 Q 200 200 140 160 T 32 220 Z"
          fill="url(#pe-hero-fill)"
        />
        <circle cx="260" cy="56" r="10" fill="var(--color-primary)" opacity="0.9" />
        <circle cx="260" cy="56" r="22" stroke="var(--color-primary)" strokeOpacity="0.25" strokeWidth="2" fill="none" />
        <circle cx="96" cy="188" r="6" fill="var(--color-success)" opacity="0.85" />
        <circle cx="168" cy="132" r="5" fill="var(--color-primary)" opacity="0.5" />
      </svg>
    </div>
  );
}
