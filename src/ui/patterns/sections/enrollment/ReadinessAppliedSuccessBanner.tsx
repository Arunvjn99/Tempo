import { CheckCircle2 } from "lucide-react";

export function ReadinessAppliedSuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-success/20 bg-success/5 px-5 py-3.5">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
      <p className="text-[0.85rem] font-semibold text-success">{message}</p>
    </div>
  );
}
