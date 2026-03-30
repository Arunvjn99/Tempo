import type { InputHTMLAttributes } from "react";

export type V2InputVariant = "search" | "amount";

export interface V2InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant: V2InputVariant;
  /** Renders search icon when variant is `search` */
  showSearchIcon?: boolean;
}

export function V2Input({ variant, showSearchIcon = true, className = "", ...rest }: V2InputProps) {
  if (variant === "search") {
    return (
      <div className="v2-input-wrap v2-input-wrap--search">
        {showSearchIcon ? (
          <span className="v2-input-icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
        ) : null}
        <input className={`v2-input v2-input--search ${className}`.trim()} {...rest} />
      </div>
    );
  }

  return <input className={`v2-input v2-input--amount ${className}`.trim()} {...rest} />;
}

export function V2AmountInput({ className = "", ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, "size">) {
  return (
    <div className="v2-amount-field">
      <span className="v2-amount-field__prefix" aria-hidden>
        $
      </span>
      <input className={`v2-input v2-input--amount ${className}`.trim()} {...rest} />
    </div>
  );
}
