export function AssistantAvatarIcon() {
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--banner-gradient)" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}

export function AssistantAvatarRow({ className = "mb-1" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AssistantAvatarIcon />
      <span className="text-[11px] font-medium text-[var(--color-textSecondary)]">Core AI</span>
    </div>
  );
}
