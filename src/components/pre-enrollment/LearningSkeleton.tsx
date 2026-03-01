/** Skeleton placeholder for LearningSection (cards) while loading */
export const LearningSkeleton = () => (
  <section className="py-8 sm:py-12 md:py-16 lg:py-20 w-full min-w-0">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-5 sm:mb-8">
      <div className="space-y-2">
        <div className="h-7 w-64 animate-pulse rounded bg-[var(--color-border)]" />
        <div className="h-4 w-80 animate-pulse rounded bg-[var(--color-border)]" />
      </div>
    </div>
    <div className="flex gap-3 sm:gap-4 overflow-x-hidden">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-64 sm:h-72 w-56 sm:w-64 flex-shrink-0 animate-pulse rounded-xl sm:rounded-2xl bg-[var(--color-border)]"
        />
      ))}
    </div>
  </section>
);
