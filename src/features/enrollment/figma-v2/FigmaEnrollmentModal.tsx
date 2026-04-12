import FigmaEnrollmentV2 from "./FigmaEnrollmentV2";

type FigmaEnrollmentModalProps = {
  onClose: () => void;
  onComplete: () => void;
};

/**
 * Centered popup: blurred backdrop + surfaced card shell around `FigmaEnrollmentV2`.
 */
export function FigmaEnrollmentModal({ onClose, onComplete }: FigmaEnrollmentModalProps) {
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--text-primary)_20%,transparent)] backdrop-blur-[6px]" onClick={onClose} role="presentation" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-[60] rounded-md px-2 py-1 text-sm text-[color-mix(in_srgb,var(--text-primary)_80%,transparent)] hover:text-[var(--text-primary)]"
      >
        Close
      </button>

      {/* Center container */}
      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div
          className="
            relative
            w-full
            max-w-[620px]
            rounded-[20px]
            bg-[var(--surface-card)]
            shadow-[var(--shadow-xl)]
            overflow-hidden
          "
        >
          <FigmaEnrollmentV2 onClose={onClose} onComplete={onComplete} />
        </div>
      </div>
    </div>
  );
}
