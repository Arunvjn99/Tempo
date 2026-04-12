import { Outlet } from "react-router-dom";
import { FigmaScope } from "@/ui/figma/FigmaScope";

/** Wraps `/transactions/*` so Figma Make CSS variables apply to hub + all flow screens. */
export function FigmaTransactionsOutlet() {
  return (
    <FigmaScope className="min-h-0 min-h-full flex-1 flex flex-col">
      <Outlet />
    </FigmaScope>
  );
}
