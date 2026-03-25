import { forwardRef } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  /** Stronger glow when panel/toggle is active */
  pressed?: boolean;
}

/**
 * Primary “Ask AI” control — uses `--ai-gradient`, `--ai-glow`, and token-based hover from global CSS.
 */
export const AIButton = forwardRef<HTMLButtonElement, AIButtonProps>(function AIButton(
  { label, pressed = false, className, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn("ai-button", pressed && "ai-button--pressed", className)}
      {...rest}
    >
      <Sparkles className="ai-button__icon size-4 shrink-0" strokeWidth={2} aria-hidden />
      <span>{label}</span>
    </button>
  );
});
