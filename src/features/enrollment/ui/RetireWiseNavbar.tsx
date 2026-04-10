import { ArrowRight } from "lucide-react";
import { Button } from "@/ui/components/Button";
import { GlassCard } from "@/ui/components/GlassCard";
import { EnrollmentNavBrand } from "@/features/enrollment/ui/EnrollmentNavBrand";

export type RetireWiseNavbarProps = {
  onStartEnroll: () => void;
};

/** Top pill navigation — RetireWise reference (glass surface extracted to {@link GlassCard}). */
export function RetireWiseNavbar({ onStartEnroll }: RetireWiseNavbarProps) {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6">
      <GlassCard
        className="max-w-fit mx-auto rounded-full px-8 py-3 flex items-center gap-10"
        role="navigation"
        aria-label="Primary"
      >
        <EnrollmentNavBrand />

        <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-slate-500">
          <a href="#" className="text-slate-900 hover:text-slate-900 transition-colors">
            Dashboard
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Transactions
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Investment Portfolio
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Plans
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Profile
          </a>
        </div>

        <Button
          type="button"
          variant="custom"
          size="custom"
          onClick={onStartEnroll}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
        >
          Start Enroll <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </GlassCard>
    </div>
  );
}
