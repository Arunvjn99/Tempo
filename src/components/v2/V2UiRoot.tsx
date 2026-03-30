import type { ReactNode } from "react";

export interface V2UiRootProps {
  children: ReactNode;
  className?: string;
}

/**
 * Required wrapper for all V2 UI — activates scoped tokens and resets.
 */
export function V2UiRoot({ children, className = "" }: V2UiRootProps) {
  return <div className={`v2-ui ${className}`.trim()}>{children}</div>;
}
