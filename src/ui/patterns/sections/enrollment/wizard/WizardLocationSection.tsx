import { Search } from "lucide-react";
import { Button } from "@/ui/components/Button";
import { cn } from "@/core/lib/utils";
import type { PersonalizationState } from "@/features/enrollment/store/types";
import type { PopularLocation } from "./wizardConstants";

interface WizardLocationSectionProps {
  locationSearch: string;
  onLocationSearchChange: (v: string) => void;
  filteredPopular: readonly PopularLocation[];
  personalization: PersonalizationState;
  onPickLocation: (name: string) => void;
}

export function WizardLocationSection({
  locationSearch,
  onLocationSearchChange,
  filteredPopular,
  personalization,
  onPickLocation,
}: WizardLocationSectionProps) {
  return (
    <div className="mt-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">Where do you imagine retiring?</h2>
        <p className="mt-1 text-[0.875rem] text-muted-foreground">Location helps estimate cost of living.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search city or state..."
          value={locationSearch}
          onChange={(e) => onLocationSearchChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-[0.9rem] text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <p className="text-[0.8rem] font-medium text-muted-foreground">Popular retirement destinations</p>

      <div className="grid grid-cols-2 gap-3">
        {filteredPopular.map((loc) => (
          <Button
            key={loc.name}
            type="button"
            variant="custom"
            size="custom"
            onClick={() => onPickLocation(loc.name)}
            className={cn(
              "rounded-xl border-2 p-4 text-left transition-all",
              personalization.retirementLocation === loc.name
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <span className="mb-1 block text-[1.3rem]">{loc.emoji}</span>
            <span
              className={cn(
                "text-[0.9rem] font-medium",
                personalization.retirementLocation === loc.name ? "text-primary" : "text-foreground",
              )}
            >
              {loc.name}
            </span>
          </Button>
        ))}
      </div>

      <Button
        type="button"
        variant="custom"
        size="custom"
        onClick={() => onPickLocation("Not sure yet")}
        className={cn(
          "w-full rounded-xl border-2 px-4 py-3 text-[0.9rem] font-medium transition-all",
          personalization.retirementLocation === "Not sure yet"
            ? "border-primary bg-primary/5 text-primary"
            : "border-border bg-card text-foreground hover:border-primary/30",
        )}
      >
        Not sure yet
      </Button>
    </div>
  );
}
