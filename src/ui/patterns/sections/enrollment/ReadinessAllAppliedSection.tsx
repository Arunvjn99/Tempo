import { CheckCircle2 } from "lucide-react";

export function ReadinessAllAppliedSection() {
  return (
    <div className="rounded-2xl border border-success/20 bg-success/5 px-5 py-4 text-center">
      <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-success" />
      <p className="text-[0.9rem] font-semibold text-success">All improvements applied</p>
      <p className="mt-0.5 text-[0.78rem] text-success/80">Your score and balance have been optimized.</p>
    </div>
  );
}
