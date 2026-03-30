import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Sparkles, TrendingUp } from "lucide-react";
import { V2UiRoot } from "./V2UiRoot";

export interface V2WizardShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle: string;
  closeLabel: string;
  stepper: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  exitOverlay?: ReactNode;
}

/**
 * Centered modal shell (~720px) with gradient header — replaces legacy Modal for the V2 wizard.
 */
export function V2WizardShell({
  isOpen,
  onClose,
  title,
  subtitle,
  closeLabel,
  stepper,
  footer,
  children,
  exitOverlay,
}: V2WizardShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    prevFocus.current = document.activeElement as HTMLElement;
    const id = window.setTimeout(() => panelRef.current?.focus(), 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = prevOverflow;
      prevFocus.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const modal = panelRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    modal.addEventListener("keydown", onTab);
    return () => modal.removeEventListener("keydown", onTab);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <V2UiRoot>
      <div className="v2-wizard-overlay" role="presentation">
        <div
          ref={panelRef}
          className="v2-wizard-panel"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <header className="v2-wizard-header">
            {/* figma-dump: Sparkles top-2 right-2 opacity-20; TrendingUp bottom-0 right-0 opacity-10 */}
            <div className="v2-wizard-header__decor v2-wizard-header__decor--sparkles" aria-hidden>
              <Sparkles className="v2-wizard-header__sparkles-icon" strokeWidth={2} />
            </div>
            <div className="v2-wizard-header__decor v2-wizard-header__decor--trend" aria-hidden>
              <TrendingUp className="v2-wizard-header__trend-icon" strokeWidth={2} />
            </div>
            <button type="button" className="v2-wizard-header__close" onClick={onClose} aria-label={closeLabel}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="v2-wizard-header__text">
              <h2 className="v2-wizard-header__title">{title}</h2>
              <p className="v2-wizard-header__subtitle">{subtitle}</p>
            </div>
          </header>
          <div className="v2-wizard-stepper-wrap">{stepper}</div>
          <div className="v2-wizard-body v2-wizard-body--fit">{children}</div>
          {footer}
          {exitOverlay}
        </div>
      </div>
    </V2UiRoot>,
    document.body,
  );
}
