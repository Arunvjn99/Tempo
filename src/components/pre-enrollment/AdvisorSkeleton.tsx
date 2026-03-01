/** Skeleton placeholder for AdvisorSection while loading */
export const AdvisorSkeleton = () => (
  <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[var(--color-surface)] border-t border-[var(--color-border)] w-full rounded-2xl min-w-0 overflow-hidden px-4 sm:px-6 md:px-8">
    <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 space-y-3">
      <div className="h-8 w-72 mx-auto animate-pulse rounded bg-[var(--color-border)]" />
      <div className="h-4 w-96 mx-auto animate-pulse rounded bg-[var(--color-border)]" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col items-center text-center p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-[var(--color-surface)]/80 border border-[var(--color-border)] min-w-0"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full animate-pulse bg-[var(--color-border)] mb-4 sm:mb-6" />
          <div className="h-5 w-24 animate-pulse rounded bg-[var(--color-border)] mb-2" />
          <div className="h-4 w-20 animate-pulse rounded bg-[var(--color-border)] mb-3" />
          <div className="h-3 w-full animate-pulse rounded bg-[var(--color-border)] mb-4" />
          <div className="flex gap-2 w-full mt-auto">
            <div className="flex-1 h-10 animate-pulse rounded-xl bg-[var(--color-border)]" />
            <div className="flex-1 h-10 animate-pulse rounded-xl bg-[var(--color-border)]" />
          </div>
        </div>
      ))}
    </div>
  </section>
);
