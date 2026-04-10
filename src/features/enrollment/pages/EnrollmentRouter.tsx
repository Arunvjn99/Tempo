// ─────────────────────────────────────────────
// EnrollmentRouter — Step-based router
// Renders the correct page based on flow store state
// ─────────────────────────────────────────────

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

export function EnrollmentRouter() {
  const reduceMotion = useReducedMotion();
  const currentStep = useEnrollmentStore((s) => s.currentStep);
  const Page = STEP_MAP[currentStep] ?? WizardPage;
  const progress = getStepProgress(currentStep);

  const showStepper =
    currentStep !== "wizard" &&
    currentStep !== "success";

  const showWizardBanner = currentStep === "wizard";

  const mainStepNumber = progress.current > 0 ? progress.current : 1;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-10 pt-2 md:px-6 md:pb-12 md:pt-4">
      {showWizardBanner ? <EnrollmentWizardBanner /> : null}

      {showStepper ? (
        <div className="mb-6 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
          <p className="mb-2 text-[0.75rem] text-muted-foreground">
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
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          transition={motionTransition({ duration: "normal", ease: "smooth" })}
        >
          <Page />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
