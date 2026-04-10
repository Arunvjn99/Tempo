import { type ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

interface ChoiceButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  variant?: "card" | "pill" | "radio";
  disabled?: boolean;
}

const VARIANTS: Record<string, { base: string; on: string; off: string }> = {
  card: {
    base: "rounded-card border px-md py-sm text-left text-sm font-medium transition-colors",
    on: "border-primary bg-primary/10 text-primary",
    off: "border-border bg-surface text-foreground hover:bg-muted",
  },
  pill: {
    base: "rounded-full px-md py-sm text-sm font-medium transition-colors",
    on: "bg-primary text-primary-foreground shadow-sm",
    off: "text-muted-foreground hover:text-foreground",
  },
  radio: {
    base: "flex w-full items-center gap-md rounded-card border p-md text-left transition-colors",
    on: "border-primary bg-primary/5",
    off: "border-border bg-surface hover:bg-muted",
  },
};

export function ChoiceButton({
  active,
  onClick,
  children,
  className,
  variant = "card",
  disabled = false,
}: ChoiceButtonProps) {
  const v = VARIANTS[variant] ?? VARIANTS.card;
  return (
    <Button
      type="button"
      variant="custom"
      size="custom"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex w-auto items-start justify-start font-medium",
        v.base,
        active ? v.on : v.off,
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {children}
    </Button>
  );
}

interface ChoiceGroupProps<T extends string> {
  options: { id: T; label: string; description?: string }[];
  value: T | null;
  onChange: (value: T) => void;
  columns?: number;
  variant?: ChoiceButtonProps["variant"];
  className?: string;
}

export function ChoiceGroup<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
  variant = "card",
  className,
}: ChoiceGroupProps<T>) {
  const gridCols =
    columns === 1 ? "grid-cols-1"
    : columns === 3 ? "sm:grid-cols-3"
    : columns === 4 ? "grid-cols-2 md:grid-cols-4"
    : "sm:grid-cols-2";

  return (
    <div className={cn("grid gap-sm", gridCols, className)}>
      {options.map((opt) => (
        <ChoiceButton
          key={opt.id}
          active={value === opt.id}
          onClick={() => onChange(opt.id)}
          variant={variant}
        >
          <span className="block font-semibold">{opt.label}</span>
          {opt.description && (
            <span className="mt-xs block text-xs font-normal text-muted-foreground">{opt.description}</span>
          )}
        </ChoiceButton>
      ))}
    </div>
  );
}
