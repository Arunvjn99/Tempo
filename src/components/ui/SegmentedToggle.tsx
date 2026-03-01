/**
 * Premium segmented control (e.g. $ | %) with sliding indicator.
 * Design tokens only. Min height 40px. role="radiogroup". Keyboard + a11y.
 */
import { useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";

export interface SegmentedToggleOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedToggleProps<T extends string = string> {
  options: SegmentedToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Group label for screen readers */
  "aria-label": string;
  /** Optional class for the wrapper */
  className?: string;
  /** Optionally disable the control */
  disabled?: boolean;
}

export function SegmentedToggle<T extends string = string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className = "",
  disabled = false,
}: SegmentedToggleProps<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;
  const n = options.length;
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    buttonRefs.current = buttonRefs.current.slice(0, options.length);
  }, [options.length]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (disabled) return;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? Math.min(index + 1, options.length - 1)
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? Math.max(index - 1, 0)
          : -1;
    if (next >= 0 && options[next] && next !== index) {
      e.preventDefault();
      onChange(options[next].value);
      setTimeout(() => buttonRefs.current[next]?.focus(), 0);
    }
  };

  return (
    <div
      className={`segmented-toggle inline-flex relative rounded-xl p-0.5 min-h-[40px] border ${className}`.trim()}
      style={
        {
          background: "var(--enroll-soft-bg)",
          borderColor: "var(--enroll-card-border)",
          "--segmented-n": n,
          "--segmented-i": safeIndex,
        } as React.CSSProperties
      }
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {/* Sliding indicator — smooth 200ms, no layout shift; width accounts for gaps */}
      <span
        className="segmented-toggle__indicator pointer-events-none absolute top-0.5 bottom-0.5 rounded-lg transition-[left,width] duration-200 ease-out"
        style={
          {
            left: "calc(2px + var(--segmented-i) * ((100% - 4px - (var(--segmented-n) - 1) * 2px) / var(--segmented-n) + 2px))",
            width: "calc((100% - 4px - (var(--segmented-n) - 1) * 2px) / var(--segmented-n))",
            background: "var(--enroll-card-bg)",
            boxShadow: "var(--enroll-elevation-1)",
          } as React.CSSProperties
        }
        aria-hidden
      />
      {options.map((opt, i) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            ref={(el) => { buttonRefs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            onClick={() => !disabled && onChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="segmented-toggle__option relative z-10 flex-1 min-w-0 min-h-[36px] py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "transparent",
              color: isActive ? "var(--enroll-text-primary)" : "var(--enroll-text-muted)",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
