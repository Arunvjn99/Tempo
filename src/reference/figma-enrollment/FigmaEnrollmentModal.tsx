import FigmaEnrollmentV2 from "./FigmaEnrollmentV2";

type FigmaEnrollmentModalProps = {
  onClose: () => void;
  onComplete: () => void;
};

/**
 * Centered popup: light blurred backdrop + white panel shell around `FigmaEnrollmentV2`.
 */
export function FigmaEnrollmentModal({ onClose, onComplete }: FigmaEnrollmentModalProps) {
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--text-primary)_20%,transparent)] backdrop-blur-[6px]" onClick={onClose} role="presentation" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-[60] rounded-md px-2 py-1 text-sm text-primary/80 hover:text-primary"
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
            bg-surface-card
            shadow-[0_20px_60px_rgba(0,0,0,0.15)]
            overflow-hidden
          "
        >
          <FigmaEnrollmentV2 onClose={onClose} onComplete={onComplete} />
        </div>
      </div>
    </div>
  );
}
