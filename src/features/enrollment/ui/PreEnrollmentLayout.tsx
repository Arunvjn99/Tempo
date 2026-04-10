import type { ReactNode } from "react";
import { GradientBackground } from "@/ui/components/GradientBackground";

export type PreEnrollmentLayoutProps = {
  children: ReactNode;
};

/** Shell for RetireWise pre-enrollment marketing pages (background layers + scroll). */
export function PreEnrollmentLayout({ children }: PreEnrollmentLayoutProps) {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-slate-900 selection:text-white relative overflow-hidden">
      <GradientBackground />
      {children}
    </div>
  );
}
