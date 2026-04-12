import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  contextInfo: string;
  additionalInfo?: string;
  onClick: () => void;
}

export function QuickActionCard({
  icon,
  title,
  description,
  contextInfo,
  additionalInfo,
  onClick,
}: QuickActionCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={onClick}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] text-[var(--color-primary)] group-hover:bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))] transition-colors">
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-primary mb-2">{title}</h3>
          <p className="text-sm text-secondary mb-3">{description}</p>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--color-primary)]">{contextInfo}</p>
            {additionalInfo && (
              <p className="text-xs text-secondary">{additionalInfo}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-default">
        <Button variant="ghost" size="sm" className="w-full group-hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]">
          Get Started →
        </Button>
      </div>
    </Card>
  );
}