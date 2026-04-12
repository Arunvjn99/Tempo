// ─────────────────────────────────────────────
// EnrollmentFlowPage — legacy store-driven shell (not used by v4 router).
// Canonical UX: Figma Make at `/enrollment/*`; dashboard opens personalization via `FigmaEnrollmentModal` (figma-v2).
// ─────────────────────────────────────────────

import "../figma-make/styles/figma-make-enrollment.css";
import React from "react";
import { AnimatePresence, motion, motionTransition, useReducedMotion } from "@/ui/animations";
import { useEnrollmentStore } from "../store";
import { getStepProgress, MAIN_STEP_IDS } from "../store/steps";
import { WizardPage } from "./WizardPage";
import { PlanSelectionPage } from "./PlanSelectionPage";
import { ContributionPage } from "./ContributionPage";
import { ContributionSourcePage } from "./ContributionSourcePage";
import { AutoIncreasePage } from "./AutoIncreasePage";
import { AutoIncreaseSetupPage } from "./AutoIncreaseSetupPage";
import { AutoIncreaseSkipPage } from "./AutoIncreaseSkipPage";
import { InvestmentPage } from "./InvestmentPage";
import { ReadinessPage } from "./ReadinessPage";
import { ReviewPage } from "./ReviewPage";
import { SuccessPage } from "./SuccessPage";
import type { EnrollmentStepId } from "../store/types";
import {
  SegmentedStepProgress,
  ENROLLMENT_MAIN_STEP_LABELS,
  EnrollmentWizardBanner,
} from "@/ui/patterns/enrollment-router";
import { FigmaScope } from "@/ui/figma/FigmaScope";

const STEP_MAP: Record<EnrollmentStepId, React.ComponentType> = {
  wizard: WizardPage,
  plan: PlanSelectionPage,
  contribution: ContributionPage,
  "contribution-source": ContributionSourcePage,
  "auto-increase": AutoIncreasePage,
  "auto-increase-setup": AutoIncreaseSetupPage,
  "auto-increase-skip": AutoIncreaseSkipPage,
  investment: InvestmentPage,
  readiness: ReadinessPage,
  review: ReviewPage,
  success: SuccessPage,
};

export function EnrollmentFlowPage() {
  const reduceMotion = useReducedMotion();
  const currentStep = useEnrollmentStore((s) => s.currentStep);
  const Page = STEP_MAP[currentStep] ?? WizardPage;
  const progress = getStepProgress(currentStep);

  const showStepper = currentStep !== "wizard" && currentStep !== "success";
  const showWizardBanner = currentStep === "wizard";
  const mainStepNumber = progress.current > 0 ? progress.current : 1;

  return (
    <FigmaScope className="min-h-screen min-h-[100dvh] bg-[var(--surface-page)] text-[var(--text-primary)]">
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-10 pt-2 md:px-6 md:pb-12 md:pt-4">
        {showWizardBanner ? <EnrollmentWizardBanner /> : null}

        {showStepper ? (
          <div className="space-y-4 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-4 shadow-[var(--shadow-card)]">
            <p className="text-xs text-[var(--text-secondary)]">
              Step {mainStepNumber} of {MAIN_STEP_IDS.length}
            </p>
            <SegmentedStepProgress
              currentStep={mainStepNumber}
              labels={ENROLLMENT_MAIN_STEP_LABELS}
            />
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="w-full"
            style={{ opacity: 1 }}
            initial={reduceMotion ? { y: 0 } : { y: 10 }}
            animate={{ y: 0 }}
            exit={reduceMotion ? { y: 0 } : { y: -8 }}
            transition={motionTransition({ duration: "normal", ease: "smooth" })}
          >
            <Page />
          </motion.div>
        </AnimatePresence>
      </div>
    </FigmaScope>
  );
}
