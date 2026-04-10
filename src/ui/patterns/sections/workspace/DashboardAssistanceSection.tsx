import { Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/ui/components/Button";
import {
  SlideUp,
  StaggerRoot,
  StaggerItem,
  AnimatedCard,
  motionDuration,
  motionStagger,
} from "@/ui/animations";

export function DashboardAssistanceSection() {
  return (
    <>
      <SlideUp duration="fast" ease="snappy" delay={motionDuration.fast} className="block">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground md:mb-6 md:text-xl">
          Need assistance?
        </h2>
      </SlideUp>

      <StaggerRoot
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8"
        stagger={motionStagger.relaxed}
        delayChildren={motionDuration.fast}
      >
        <StaggerItem className="lg:col-span-7">
          <AnimatedCard animateOnMount={false} className="flex h-full min-h-[200px] flex-col justify-between p-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Human support
              </div>
              <h3 className="text-lg font-semibold text-foreground">Speak with a retirement specialist</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Schedule a one-on-one conversation to review your plan options and enrollment steps.
              </p>
            </div>
            <Button
              type="button"
              variant="custom"
              size="custom"
              className="mt-6 w-full rounded-xl border border-border bg-muted/30 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50 sm:w-auto sm:px-8"
            >
              Schedule now
            </Button>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem className="lg:col-span-5">
          <AnimatedCard
            animateOnMount={false}
            className="flex h-full min-h-[200px] flex-col justify-between border-primary/20 bg-primary/[0.04] p-6"
          >
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                  Core AI
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Beta
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Ask Core AI</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Get instant answers and personalized retirement insights anytime.
              </p>
            </div>
            <Button
              type="button"
              variant="custom"
              size="custom"
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start chatting
            </Button>
          </AnimatedCard>
        </StaggerItem>
      </StaggerRoot>
    </>
  );
}
