/**
 * Page title for the Transaction Center hub — sits below the global app header.
 */
export function TransactionsHeader({
  title = "Transaction Center",
  subtitle = "Manage loans, withdrawals, transfers, and more from one place.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-6 sm:mb-8">
      <h1 className="font-dashboard-heading text-[22px] font-bold tracking-[-0.3px] text-primary sm:text-2xl md:text-[28px] md:leading-tight">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1.5 max-w-2xl text-[13px] font-medium leading-relaxed text-secondary sm:text-sm">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
