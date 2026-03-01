/** Skeleton placeholder for HeroSection while loading */
export const HeroSkeleton = () => (
  <section className="relative w-full overflow-hidden rounded-2xl">
    <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 pt-8 pb-10 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24 px-0 min-h-0">
      <div className="flex-1 w-full min-w-0 flex flex-col justify-center min-h-0 space-y-4">
        <div className="h-6 w-24 rounded-full animate-pulse bg-[var(--color-border)]" />
        <div className="h-8 w-32 animate-pulse rounded bg-[var(--color-border)]" />
        <div className="h-10 sm:h-12 w-3/4 max-w-md animate-pulse rounded bg-[var(--color-border)]" />
        <div className="h-12 sm:h-14 w-full max-w-lg animate-pulse rounded bg-[var(--color-border)]" />
        <div className="h-4 w-full max-w-md animate-pulse rounded bg-[var(--color-border)]" />
        <div className="flex flex-wrap gap-3 pt-2">
          <div className="h-12 w-36 animate-pulse rounded-2xl bg-[var(--color-border)]" />
          <div className="h-12 w-44 animate-pulse rounded-2xl bg-[var(--color-border)]" />
        </div>
        <div className="h-4 w-40 animate-pulse rounded bg-[var(--color-border)]" />
      </div>
      <div className="flex-1 hidden lg:block min-h-[200px] animate-pulse rounded-2xl bg-[var(--color-border)]" />
    </div>
  </section>
);
