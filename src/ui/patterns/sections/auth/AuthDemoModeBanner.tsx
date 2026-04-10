import { cn } from "@/core/lib/utils";

type AuthDemoModeBannerVariant = "login" | "signup";

const COPY: Record<
  AuthDemoModeBannerVariant,
  { prefix: string; suffix: string }
> = {
  login: {
    prefix: "Running in demo mode (no backend). Email login is disabled until you configure",
    suffix: "— see README.",
  },
  signup: {
    prefix: "Running in demo mode (no backend). Sign up is disabled until you configure",
    suffix:
      "— see README. Use Explore Demo on the login page to try the app.",
  },
};

export function AuthDemoModeBanner({
  variant,
  className = "",
}: {
  variant: AuthDemoModeBannerVariant;
  className?: string;
}) {
  const { prefix, suffix } = COPY[variant];
  return (
    <div
      role="status"
      className={cn(
        "rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-4 py-3 text-sm text-[var(--color-text)]",
        className,
      )}
    >
      {prefix}{" "}
      <code className="rounded bg-[var(--color-surface)] px-1 text-xs">VITE_SUPABASE_URL</code> and{" "}
      <code className="rounded bg-[var(--color-surface)] px-1 text-xs">VITE_SUPABASE_ANON_KEY</code> in{" "}
      <code className="rounded bg-[var(--color-surface)] px-1 text-xs">.env</code> {suffix}
    </div>
  );
}
