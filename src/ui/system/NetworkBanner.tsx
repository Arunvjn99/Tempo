/**
 * Global network banner: fixed top, non-blocking. Red when offline, orange when degraded.
 * Dismissible; auto-hides when status becomes healthy.
 */

import { useState, useEffect } from "react";
import { useNetwork } from "@/core/network/networkContext";
import { Button } from "@/ui/components/Button";

const OFFLINE_MESSAGE =
  "You appear to be offline. Please check your connection.";
const DEGRADED_MESSAGE =
  "Connection to server is unstable. This may be a DNS or ISP issue.";

export function NetworkBanner() {
  const { status } = useNetwork();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (status === "healthy") setDismissed(false);
  }, [status]);

  if (status === "healthy" || dismissed) return null;

  const isOffline = status === "offline";
  const message = isOffline ? OFFLINE_MESSAGE : DEGRADED_MESSAGE;

  return (
    <>
    <div className="h-[42px] shrink-0" aria-hidden />
    <div
      role="alert"
      aria-live="polite"
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md ${
        isOffline ? "bg-[var(--color-danger)]" : "bg-[var(--color-warning)]"
      }`}
    >
      <span className="flex-1">{message}</span>
      <Button
        type="button"
        variant="custom"
        size="iconSm"
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded text-primary-foreground/90 hover:bg-[color-mix(in_srgb,var(--primary-foreground)_20%,transparent)] focus-visible:ring-primary-foreground/50"
        aria-label="Dismiss"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </Button>
    </div>
    </>
  );
}
