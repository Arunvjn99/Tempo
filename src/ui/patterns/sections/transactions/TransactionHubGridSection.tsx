import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/core/lib/utils";

export interface TransactionHubCardItem {
  id: string;
  to: string;
  title: string;
  description: string;
}

export function TransactionHubGridSection({ items }: { items: TransactionHubCardItem[] }) {
  return (
    <ul className="grid gap-md sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            to={item.to}
            className={cn(
              "flex h-full flex-col rounded-card border border-border bg-card p-lg transition-colors",
              "hover:border-primary/40 hover:bg-muted/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            )}
          >
            <span className="text-base font-semibold text-foreground">{item.title}</span>
            <span className="mt-xs flex-1 text-sm text-muted-foreground">{item.description}</span>
            <span className="mt-md inline-flex items-center gap-xs text-sm font-medium text-primary">
              Start
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
