import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import {
  loadEnrollmentDraft,
  saveEnrollmentDraft,
  ENROLLMENT_SAVED_TOAST_KEY,
} from "../../enrollment/enrollmentDraftStore";
import { pathToStep, isEnrollmentStepPath, ENROLLMENT_STEP_PATHS } from "../../enrollment/enrollmentStepPaths";

export type EnrollmentStep = 0 | 1 | 2 | 3 | 4;

interface EnrollmentFooterProps {
  /** Step index (0–4). When on an enrollment step path, this is overridden by pathname so Back stays in sync with URL. */
  step: EnrollmentStep;
  primaryLabel: string;
  primaryDisabled?: boolean;
  onPrimary: () => void;
  summaryText?: string;
  /** When true, summary text uses error styling */
  summaryError?: boolean;
  getDraftSnapshot?: () => Record<string, unknown>;
  /** When true, use in-content styling (border-top, spacing) for use inside step content */
  inContent?: boolean;
}

/**
 * EnrollmentFooter - Inline CTA section for enrollment steps (scrolls with content).
 * Left: Back (disabled on step 0)
 * Center: Optional contextual summary
 * Right: Save & Exit + Primary CTA
 */
export const EnrollmentFooter = ({
  step: stepProp,
  primaryLabel,
  primaryDisabled = false,
  onPrimary,
  summaryText,
  summaryError = false,
  getDraftSnapshot,
  inContent = false,
}: EnrollmentFooterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathDerivedStep = pathToStep(pathname);
  const onStepPath = isEnrollmentStepPath(pathname);
  const step = onStepPath ? pathDerivedStep : stepProp;

  const handleBack = () => {
    if (step <= 0) return;
    const prevPath = ENROLLMENT_STEP_PATHS[step - 1];
    if (prevPath) navigate(prevPath);
  };

  const handleSaveAndExit = () => {
    const draft = loadEnrollmentDraft();
    if (draft) {
      const snapshot = getDraftSnapshot?.();
      saveEnrollmentDraft(snapshot ? { ...draft, ...snapshot } : draft);
      sessionStorage.setItem(ENROLLMENT_SAVED_TOAST_KEY, "1");
    }
    navigate("/dashboard");
  };

  const isFirstStep = step === 0;

  return (
    <footer
      className={`enrollment-footer${inContent ? " enrollment-footer--in-content" : ""}`}
      role="contentinfo"
      aria-label={t("enrollment.footerAria")}
    >
      <div className="enrollment-footer__inner">
        <div className="enrollment-footer__left">
          <Button
            type="button"
            onClick={handleBack}
            disabled={isFirstStep}
            className="enrollment-footer__back"
            aria-label={isFirstStep ? t("enrollment.footerBackDisabledAria") : t("enrollment.footerBackAria")}
          >
            {t("enrollment.footerBack")}
          </Button>
        </div>
        <div className="enrollment-footer__center" aria-live="polite">
          {summaryText && (
            <span className={`enrollment-footer__summary ${summaryError ? "enrollment-footer__summary--error" : ""}`}>
              {summaryText}
            </span>
          )}
        </div>
        <div className="enrollment-footer__right">
          <Button
            type="button"
            onClick={handleSaveAndExit}
            className="enrollment-footer__save-exit"
          >
            {t("enrollment.footerSaveAndExit")}
          </Button>
          <Button
            type="button"
            onClick={onPrimary}
            disabled={primaryDisabled}
            className="enrollment-footer__primary"
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </footer>
  );
};

