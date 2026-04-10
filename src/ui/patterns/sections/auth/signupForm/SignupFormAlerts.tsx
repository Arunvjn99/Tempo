export function SignupFormAlerts({
  serverError,
  successMessage,
}: {
  serverError: string | null;
  successMessage: string | null;
}) {
  return (
    <>
      {serverError && (
        <div
          role="alert"
          className="md:col-span-2 rounded-lg border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/5 px-4 py-3 text-sm text-[var(--color-danger)]"
        >
          {serverError}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="md:col-span-2 rounded-lg border border-[var(--color-success)]/20 bg-[var(--color-success)]/5 px-4 py-3 text-sm text-[var(--color-success)]"
        >
          {successMessage}
        </div>
      )}
    </>
  );
}
