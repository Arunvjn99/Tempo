// ─────────────────────────────────────────────
// SuccessPage — Pixel-perfect Figma rebuild
// ─────────────────────────────────────────────

import { BarChart3, Calendar, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/ui/components/Button";
import { motion } from "@/ui/animations";
import { useNavigate } from "react-router-dom";
import { useEnrollmentStore, useEnrollmentDerived } from "../store";
import { formatCurrency } from "../store/derived";

const NEXT_ITEMS = [
  { icon: Calendar, text: "Contributions start next pay period" },
  { icon: Mail, text: "Confirmation email will be sent" },
  { icon: BarChart3, text: "Track savings from dashboard" },
] as const;

export function SuccessPage() {
  const navigate = useNavigate();
  const derived = useEnrollmentDerived();
  const enrollment = useEnrollmentStore((s) => s.enrollment);
  const reset = useEnrollmentStore((s) => s.reset);

  const handleDashboard = () => {
    reset();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-card p-8 text-center shadow-lg"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Success icon */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 16 }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" aria-hidden />
          </div>
        </motion.div>

        {/* Heading */}
        <div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Congratulations!</h1>
          <p className="mt-2 text-[0.9rem] text-muted-foreground">
            Your retirement plan has been successfully activated.
          </p>
          <p className="mt-3 text-[0.8rem] text-muted-foreground">
            Projected balance at current settings:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(derived.projectedBalance)}
            </span>
            {" · "}
            Contributing {enrollment.contributionPercent}% with employer match
          </p>
        </div>

        {/* What happens next */}
        <div className="rounded-2xl bg-muted/50 p-5 text-left">
          <p className="text-[0.9rem] font-semibold text-foreground">What happens next</p>
          <ul className="mt-4 space-y-4">
            {NEXT_ITEMS.map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" aria-hidden />
                </div>
                <span className="text-[0.85rem] text-foreground">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dashboard CTA */}
        <Button
          type="button"
          variant="primary"
          size="custom"
          onClick={handleDashboard}
          className="w-full rounded-xl py-3.5 text-[0.9rem] font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Go to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
