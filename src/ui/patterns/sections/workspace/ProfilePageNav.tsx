import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";
import type { ProfileNavItem } from "./profileTypes";

export function ProfilePageNav({
  items,
  activeSection,
  onSelect,
}: {
  items: ProfileNavItem[];
  activeSection: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="hidden lg:block">
      <div className="sticky top-24 space-y-xs">
        {items.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant="custom"
            size="custom"
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex w-full items-center gap-sm rounded-card px-md py-sm text-sm font-medium transition-colors",
              activeSection === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Button>
        ))}
      </div>
    </nav>
  );
}
