import { lazy } from "react";

/** One chunk: `enrollmentRouteModule` — all Figma Make enrollment screens. */
export const FigmaEnrollmentLayout = lazy(() =>
  import("./enrollmentRouteModule").then((m) => ({ default: m.EnrollmentLayout })),
);
export const FigmaPersonalizationWizard = lazy(() =>
  import("./enrollmentRouteModule").then((m) => ({ default: m.PersonalizationWizard })),
);
export const FigmaPlanSelection = lazy(() =>
  import("./enrollmentRouteModule").then((m) => ({ default: m.PlanSelection })),
);
export const FigmaContributionSetup = lazy(() =>
  import("./enrollmentRouteModule").then((m) => ({ default: m.ContributionSetup })),
);
export const FigmaContributionSource = lazy(() =>
  import("./enrollmentRouteModule").then((m) => ({ default: m.ContributionSource })),
);
export const FigmaAutoIncrease = lazy(() =>
  import("./enrollmentRouteModule").then((m) => ({ default: m.AutoIncrease })),
);
export const FigmaAutoIncreaseSetup = lazy(() =>
  import("./enrollmentRouteModule").then((m) => ({ default: m.AutoIncreaseSetup })),
);
export const FigmaAutoIncreaseSkip = lazy(() =>
  import("./enrollmentRouteModule").then((m) => ({ default: m.AutoIncreaseSkip })),
);
export const FigmaInvestmentStrategy = lazy(() =>
  import("./enrollmentRouteModule").then((m) => ({ default: m.InvestmentStrategy })),
);
export const FigmaRetirementReadiness = lazy(() =>
  import("./enrollmentRouteModule").then((m) => ({ default: m.RetirementReadiness })),
);
export const FigmaReview = lazy(() => import("./enrollmentRouteModule").then((m) => ({ default: m.Review })));
export const FigmaSuccess = lazy(() => import("./enrollmentRouteModule").then((m) => ({ default: m.Success })));
