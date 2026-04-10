import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SlideUp, ScaleIn, motionDuration } from "@/ui/animations";
import { LazyHeroScene } from "@/ui/3d";

export function DashboardHeroSection({
  greetingPill,
  onLearnMore,
}: {
  greetingPill: string;
  onLearnMore: () => void;
}) {
  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-primary/[0.07] via-background to-background"
      aria-label="Welcome hero"
    >
      <div
        className="pointer-events-none absolute -left-48 -top-48 size-[800px] rounded-full bg-primary/[0.08] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 size-[600px] rounded-full bg-primary/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/55 to-background"
        aria-hidden
      />

      <div className="relative z-20 container-app py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <SlideUp duration="normal" ease="smooth" className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
              {greetingPill}
            </span>

            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-[3.25rem]">
              Let&apos;s build your <span className="text-primary">future, together.</span>
            </h1>

            <p className="max-w-[440px] text-pretty text-[1.0625rem] leading-relaxed text-muted-foreground">
              You&apos;re one step away from activating your 401(k). We&apos;ve simplified everything so you can focus
              on what matters.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/enrollment"
                className="group inline-flex min-h-[3rem] w-full flex-col items-center justify-center gap-0.5 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] sm:w-auto sm:min-w-[220px]"
              >
                <span className="inline-flex items-center gap-2">
                  Start my enrollment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
                <span className="text-center text-xs font-medium text-primary-foreground/80">It only takes 5 minutes</span>
              </Link>
              <button
                type="button"
                onClick={onLearnMore}
                className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Learn about the plan <span aria-hidden>→</span>
              </button>
            </div>
          </SlideUp>

          <ScaleIn
            duration="normal"
            ease="smooth"
            delay={motionDuration.fast}
            className="relative order-first lg:order-none"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
              <LazyHeroScene className="absolute inset-0 border-0 shadow-none" />
              <div className="absolute bottom-4 left-4 right-4 z-10 rounded-xl border border-border/80 bg-card/95 p-4 shadow-lg backdrop-blur-sm">
                <p className="text-xs font-medium text-muted-foreground">Plan highlight</p>
                <p className="mt-1 text-sm font-semibold text-foreground">Employer match up to 6%</p>
              </div>
            </div>
          </ScaleIn>
        </div>
      </div>
    </section>
  );
}
