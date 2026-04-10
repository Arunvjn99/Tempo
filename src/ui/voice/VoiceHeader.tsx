interface VoiceHeaderProps {
  onClose: () => void;
}

/**
 * VoiceHeader - Header with title and close button
 */
export const VoiceHeader = ({ onClose }: VoiceHeaderProps) => {
  return (
    <header className="voice-header">
      <div className="voice-header__content">
        <h1 className="voice-header__title">Voice Assistant</h1>
        <p className="voice-header__subtitle">Ask questions or get help with your retirement account</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="voice-header__close"
        aria-label="Close voice mode"
      >
        <span aria-hidden="true">×</span>
      </button>
    </header>
  );
};
