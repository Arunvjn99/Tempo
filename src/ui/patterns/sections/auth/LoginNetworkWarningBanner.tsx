export function LoginNetworkWarningBanner() {
  return (
    <div
      role="alert"
      className="rounded-lg border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-4 py-3 text-sm text-[var(--color-warning)]"
    >
      Unable to reach authentication server. Check your connection or try again later.
    </div>
  );
}
