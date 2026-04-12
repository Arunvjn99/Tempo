import { cn } from "@/core/lib/utils";
import { Slider } from "./Slider";

export interface AllocationSlice {
  key: string;
  label: string;
  color: string;
  value: number; // 0–100
}

interface AllocationEditorProps {
  slices: AllocationSlice[];
  onChange: (slices: AllocationSlice[]) => void;
  error?: string;
  className?: string;
  showBar?: boolean;
  showValues?: boolean;
}

/** Normalize a changed slice so totals remain 100 */
function normalizeSlices(
  slices: AllocationSlice[],
  changedKey: string,
  newValue: number,
): AllocationSlice[] {
  const clamped = Math.min(100, Math.max(0, newValue));
  const others = slices.filter((s) => s.key !== changedKey);
  const otherTotal = others.reduce((sum, s) => sum + s.value, 0);
  const remaining = 100 - clamped;

  let normalized: AllocationSlice[];

  if (otherTotal === 0 || others.length === 0) {
    const perOther = remaining / others.length;
    normalized = slices.map((s) =>
      s.key === changedKey ? { ...s, value: clamped } : { ...s, value: perOther },
    );
  } else {
    normalized = slices.map((s) => {
      if (s.key === changedKey) return { ...s, value: clamped };
      return { ...s, value: Math.round((s.value / otherTotal) * remaining * 10) / 10 };
    });
  }

  return normalized;
}

export function AllocationEditor({
  slices,
  onChange,
  error,
  className,
  showBar = true,
  showValues = true,
}: AllocationEditorProps) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const isValid = Math.round(total) === 100;

  const handleChange = (key: string, value: number) => {
    onChange(normalizeSlices(slices, key, value));
  };

  return (
    <div className={cn("space-y-md", className)}>
      {showBar && (
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {slices.map((s) => (
            <div
              key={s.key}
              style={{ width: `${s.value}%`, backgroundColor: s.color }}
              className="transition-all duration-300"
            />
          ))}
        </div>
      )}

      <div className="space-y-md">
        {slices.map((s) => (
          <div key={s.key} className="space-y-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
                <span className="text-sm font-medium text-primary">{s.label}</span>
              </div>
              {showValues && <span className="text-sm font-bold text-primary">{Math.round(s.value)}%</span>}
            </div>
            <Slider
              value={[s.value]}
              onValueChange={([v]) => handleChange(s.key, v ?? 0)}
              min={0}
              max={100}
              step={1}
            />
          </div>
        ))}
      </div>

      <div
        className={cn(
          "flex items-center justify-between rounded-md px-sm py-xs text-xs font-medium",
          isValid ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
        )}
      >
        <span>Total allocation</span>
        <span>{Math.round(total)}%</span>
      </div>

      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
