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
              "card-standard flex h-full flex-col p-lg transition-colors",
              "hover:border-primary/40 hover:bg-muted",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            )}
          >
            <span className="text-base font-semibold text-primary">{item.title}</span>
            <span className="mt-xs flex-1 text-sm text-secondary">{item.description}</span>
            <span className="mt-md inline-flex items-center gap-xs text-sm font-medium text-brand">
              Start
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
