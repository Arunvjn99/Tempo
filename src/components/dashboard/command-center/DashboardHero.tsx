import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const POST_ENROLLMENT_HERO_VIDEO_SRC =
  "https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/Heromeeting.webm";

export interface DashboardHeroProps {
  greetingPrefix?: string;
  userName: string;
  totalBalance: string;
  growthPercent: number;
  growthLabel?: string;
  aiMessage: string;
  aiActionLabel?: string;
  ctaLabel: string;
  onCtaClick?: () => void;
  onAiActionClick?: () => void;
  className?: string;
}

export function DashboardHero({
  greetingPrefix = "Good morning",
  userName,
  totalBalance,
  growthPercent,
  growthLabel = "this month",
  aiMessage,
  aiActionLabel = "AI Recommendation:",
  ctaLabel,
  onCtaClick,
  onAiActionClick,
  className,
}: DashboardHeroProps) {
  return (
    <section className={cn("mt-8 mb-12", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[1.25rem] border p-8 shadow-[var(--color-shadow-hero)] md:p-12",
          "border-[var(--border-subtle)] bg-[var(--bg-primary)]",
        )}
      >
        <div className="relative z-10 flex flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="min-w-0 flex-1 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-[var(--text-muted)]">
                {greetingPrefix}, {userName}{" "}
                <span aria-hidden>👋</span>
              </h2>
              <div className="flex flex-wrap items-baseline gap-4">
                <h1
                  className="dashboard-animate-count-up text-5xl font-extrabold tracking-tighter text-[var(--color-primary)] md:text-6xl"
                  style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                >
                  {totalBalance}
                </h1>
                <span
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold"
                  style={{
                    background: "var(--dashboard-growth-bg)",
                    color: "var(--dashboard-growth-fg)",
                  }}
                >
                  <span aria-hidden>↑</span>+{growthPercent}%{" "}
                  <span className="ml-0.5 text-[10px] font-medium opacity-80">{growthLabel}</span>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onAiActionClick}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-transform",
                "hover:-translate-y-0.5",
              )}
              style={{
                borderColor: "var(--dashboard-ai-insight-border)",
                background: "var(--dashboard-ai-insight-bg)",
              }}
            >
              <div
                className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--dashboard-ai-icon-bg)" }}
              >
                <Sparkles
                  className="h-3.5 w-3.5 text-[var(--dashboard-ai-insight-text)]"
                  strokeWidth={2}
                />
              </div>
              <p className="text-sm leading-relaxed text-[var(--dashboard-ai-insight-text)]">
                <span className="font-bold">{aiActionLabel}</span> {aiMessage}
              </p>
            </button>
            <div className="pt-2">
              <button
                type="button"
                onClick={onCtaClick}
                className={cn(
                  "dashboard-hero-cta group flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold transition-all duration-300",
                  "bg-[var(--color-primary)] active:scale-95",
                )}
                style={{ color: "var(--color-on-primary-fill)" }}
              >
                {ctaLabel}
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                  style={{ color: "var(--color-on-primary-fill)" }}
                />
              </button>
            </div>
          </div>
          <div className="hero-video-wrapper w-full">
            <video
              className="hero-video"
              src={POST_ENROLLMENT_HERO_VIDEO_SRC}
              autoPlay
              loop
              muted
              playsInline
              aria-label="Team meeting and financial planning"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
