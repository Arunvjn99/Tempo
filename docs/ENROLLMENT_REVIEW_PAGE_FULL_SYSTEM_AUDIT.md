# Enrollment Review Page – Full System Audit

**Scope:** Review page calculations, data flow, UI structure, and improvement opportunities.  
**Date:** 2025-03-01.

---

## 1. Files Responsible for Each Concern

### 1.1 Projected Retirement Balance Calculation

| Responsibility | File(s) | Notes |
|----------------|--------|-------|
| **Primary calculation** | `src/pages/enrollment/Review.tsx` | `projectedValue` useMemo (lines 166–173): compound growth loop over `yearsToRetirement`; uses `enrollment.state.currentBalance`, `enrollment.monthlyContribution?.employee`, `weightedSummary.expectedReturn`. |
| **Return assumption source** | `src/context/InvestmentContext.tsx` | `weightedSummary` from `computeWeightedAllocation(investmentAllocation, sourceAllocation)`; default 7% when missing. |
| **Aggregation of return** | `src/utils/investmentAllocationHelpers.ts` | `computeWeightedAllocation()`: weight-by-fund `expectedReturn` and `expenseRatio`; no inflation or salary growth. |
| **Fund-level expected return** | `src/data/mockFunds.ts` | Each fund has `expectedReturn` (e.g. 10.2, 10.0, …). |
| **Monthly contribution used in projection** | `src/enrollment/context/EnrollmentContext.tsx` | `monthlyContribution` from `deriveContribution()` (employee + employer); used as **constant** per year in Review (no ADI in projection). |
| **Contribution derivation** | `src/enrollment/logic/contributionCalculator.ts` | `deriveContribution()`: percentage/fixed → per-paycheck → monthly; employer match from assumptions; **no** compound growth (used elsewhere for a simple estimate). |

**Formula (Review):**

- `years = retirementAge - currentAge` (defaults 67, 40).
- `annual = monthlyContribution.employee * 12`.
- `rate = (weightedSummary.expectedReturn ?? 7) / 100`.
- `v = currentBalance`; for each year: `v = v * (1 + rate) + annual`.
- **Not used:** inflation, salary growth, ADI (auto-increase), employer match in the loop (only employee monthly).

---

### 1.2 Readiness Score Calculation

| Responsibility | File(s) | Notes |
|----------------|--------|-------|
| **Readiness % and goal** | `src/pages/enrollment/Review.tsx` (lines 179–184) | `readinessGoal = Math.max(projectedValue * 2, 1)`; `readinessPercent = min(99, round((projectedValue / readinessGoal) * 100))`; `shortfallAmount = max(0, readinessGoal - projectedValue)`. |
| **Basis** | Same file | **Corpus ratio:** goal is defined as 2× projected balance (synthetic). So readiness is always **50%** with current formula (projectedValue / (2 * projectedValue)). Not income replacement ratio; not an external goal. |

**Conclusion:** Readiness is a **static synthetic corpus ratio** (projected / (2 × projected)). It does not use a user-entered retirement goal, income replacement, or plan-specific targets.

---

### 1.3 Donut Chart Data

| Responsibility | File(s) | Notes |
|----------------|--------|-------|
| **Data** | `src/pages/enrollment/Review.tsx` | Same `readinessPercent` (0–99) drives donut. |
| **Rendering** | `src/pages/enrollment/Review.tsx` | SVG circle with `strokeDasharray` / `strokeDashoffset` = `263.9 * (1 - readinessPercent/100)`; center text `readinessPercent %`. |
| **No separate service** | — | Donut is purely presentational; no dedicated chart data layer. |

---

### 1.4 AI Suggestion Generation

| Responsibility | File(s) | Notes |
|----------------|--------|-------|
| **Definition** | `src/pages/enrollment/Review.tsx` (lines 241–261) | Hardcoded `insights` array: two items (increase pre-tax, target-date fund). |
| **Copy** | `src/locales/en/enrollment.json` | `insightIncreasePreTax`, `insightIncreasePreTaxDesc`, `insightPreTaxImpact`, `insightTargetDate*`, `applySuggestion`. |
| **Behavior** | `Review.tsx` | `handleApplySuggestion("contribution" \| "investments")`: toast + navigate to `/enrollment/contribution` or `/enrollment/investments`. |
| **No backend / no personalization** | — | No API, no user-specific logic, no dynamic impact numbers (e.g. “+$42,000” is fixed in locale). |

---

### 1.5 Contribution Totals (Percentage + Dollar)

| Responsibility | File(s) | Notes |
|----------------|--------|-------|
| **Percentage** | `src/pages/enrollment/Review.tsx` | `contributionTotal = enrollment.state.contributionAmount`; `sourceAllocation` (preTax, roth, afterTax) as % of 100; display `(value/100)*contributionTotal` % per source. |
| **Dollar** | `src/enrollment/context/EnrollmentContext.tsx` | `monthlyContribution` (employee, employer, total) from `deriveContribution()`; `perPaycheck` from same. |
| **Derivation** | `src/enrollment/logic/contributionCalculator.ts` | `deriveContribution()`: salary, contributionType, contributionValue, employer match cap/percent → monthly and per-paycheck. |
| **Review display** | `Review.tsx` | Left column shows contribution **%** only (no dollar amount on Review page). |

---

### 1.6 ADI (Automatic Deferral Increase) Calculation Logic

| Responsibility | File(s) | Notes |
|----------------|--------|-------|
| **State** | `src/enrollment/context/EnrollmentContext.tsx` | `state.autoIncrease`: enabled, percentage, maxPercentage, incrementCycle, preTaxIncrease, rothIncrease, afterTaxIncrease. |
| **Draft persistence** | `src/enrollment/enrollmentDraftStore.ts` | `EnrollmentDraft.autoIncrease`: only `enabled`, `annualIncreasePct`, `stopAtPct`, `minimumFloorPct`. **Gap:** `incrementCycle`, `preTaxIncrease`, `rothIncrease`, `afterTaxIncrease` are **not** in draft shape; they are lost on reload from Save & Exit. |
| **Hydration** | `EnrollmentContext.tsx` (getInitialEnrollmentState) | Maps draft `annualIncreasePct` → `percentage`, `stopAtPct` → `maxPercentage`; cycle and per-source increases fall back to defaults. |
| **Projection with ADI** | `src/enrollment/logic/projectionCalculator.ts` | Used on Future Contributions step for “projected at age X”; **not** used on Review. Review projection uses **flat** employee contribution only. |
| **Review display** | `Review.tsx` | ADI card shows cycle badge and per-source % from `enrollment.state.autoIncrease` (display only; not used in projected balance on Review). |

---

### 1.7 Investment Allocation Aggregation

| Responsibility | File(s) | Notes |
|----------------|--------|-------|
| **Per-source allocation** | `src/context/InvestmentContext.tsx` | `investmentAllocation`: preTax/roth/afterTax → `{ funds: FundAllocation[] }`. |
| **Weighted aggregation** | `src/utils/investmentAllocationHelpers.ts` | `computeWeightedAllocation(allocation, sources)`: weights by source % (preTax/roth/afterTax), merges by fundId, normalizes to 100%; computes `expectedReturn`, `totalFees`, `riskLevel`, `isValid`. |
| **Chart / Review list** | `InvestmentContext.tsx` | `chartAllocations = fundAllocationsToChartFormat(weightedSummary.funds)` → `{ fundId, percentage }[]`. |
| **Review consumption** | `Review.tsx` | `fundTableRows` from `investment.chartAllocations` + `getFundById`; `totalAllocation`; `weightedSummary` for return, fees, validity. |
| **Persistence** | `enrollmentDraftStore.ts` | `draft.investment.sourceAllocation` (full InvestmentAllocation); restored when `InvestmentProvider` mounts (e.g. on Review) via `loadEnrollmentDraft()` in useEffect. |

---

## 2. Data Flow Into Review Page

### 2.1 From Personalized Onboarding / Choose Plan

- **Source:** `EnrollmentContext` state initialized from `loadEnrollmentDraft()` in `getInitialEnrollmentState()`; also updated by PersonalizePlanModal and Choose Plan step.
- **Fields:** `currentAge`, `retirementAge`, `currentBalance` (as `otherSavings.amount` in draft), `salary`, `selectedPlan`, `selectedPlanDbId`, `investmentProfile`, `investmentProfileCompleted`.
- **Flow:** Draft in sessionStorage → `EnrollmentProvider` initial state; modal/Choose Plan call `setCurrentAge`, `setRetirementAge`, etc., and may `saveEnrollmentDraft()`. Review reads `enrollment.state.*` (no direct draft read; state is already updated by prior steps).

### 2.2 From Contribution Step

- **Source:** `EnrollmentContext`: `contributionAmount`, `contributionType`, `sourceAllocation`, `salary`, `employerMatchEnabled`, `assumptions` (match cap/percent, annualReturnRate, inflationRate).
- **Flow:** Contribution page calls `setContributionAmount`, `setSourceAllocation`, etc. Save & Exit / Continue may call `saveEnrollmentDraft()` with contribution fields. Review uses `enrollment.state.contributionAmount`, `enrollment.state.sourceAllocation`, `enrollment.monthlyContribution` (derived in context from same state).

### 2.3 From Auto Increase (Future Contributions) Step

- **Source:** `EnrollmentContext.state.autoIncrease`.
- **Flow:** Future Contributions step calls `setAutoIncrease()`; on Continue it calls `saveEnrollmentDraft()` with `autoIncrease: { enabled, annualIncreasePct, stopAtPct, minimumFloorPct }`. Review displays ADI from `enrollment.state.autoIncrease`. **Not** used in Review’s projected balance (no ADI in compound loop).

### 2.4 From Investment Selection Step

- **Source:** `InvestmentContext` (allocation) + draft.
- **Flow:** Investments step saves `investment: getInvestmentSnapshot()` (sourceAllocation, editAllocationEnabled) into draft on Continue. On Review, `EnrollmentReviewContent` mounts `InvestmentProvider` with `sourceAllocation` from enrollment; `InvestmentProvider`’s useEffect runs `loadEnrollmentDraft()` and sets `investmentAllocation` from `draft.investment.sourceAllocation`. So Review’s allocation is **draft-backed** when opening Review; in-memory enrollment state is from prior steps.

---

## 3. Key Calculation Details

### 3.1 Where Retirement Goal Target Is Computed

- **Single place:** `Review.tsx` line 180: `readinessGoal = Math.max(projectedValue * 2, 1)`.
- **Meaning:** Goal is **2× projected balance** (synthetic). There is no user-entered goal, no income-replacement target, and no plan-level goal from API.

### 3.2 Where Shortfall Is Computed

- **Single place:** `Review.tsx` line 182: `shortfallAmount = Math.max(0, readinessGoal - projectedValue)`.
- **With current goal:** Shortfall = projectedValue (since goal = 2 × projectedValue). Display is in dollars (e.g. formatCurrency(shortfallAmount)).

### 3.3 Return Assumption Used

- **Review projected balance:** `weightedSummary.expectedReturn` from `computeWeightedAllocation()` (investment mix). Default **7%** if missing (line 169).
- **Contribution/FutureContributions UI:** `state.assumptions.annualReturnRate` (default 7) and `state.assumptions.inflationRate` (default 2.5) are **display-only** / passed to projection UI; **not** used in Review’s `projectedValue` or readiness.

### 3.4 Inflation

- **Stored:** `EnrollmentContext.state.assumptions.inflationRate` (default 2.5).
- **Used in Review:** **No.** Projected balance and readiness use nominal growth only.
- **Used elsewhere:** Passed to projection/display logic on Contribution and Future Contributions (e.g. `projectionCalculator`); not in `contributionCalculator.deriveContribution` or Review.

### 3.5 Salary Growth

- **Not implemented.** Contributions in the Review projection are **constant** (same `annual` every year). No salary growth, no inflation adjustment, no ADI in the loop.

---

## 4. Readiness Score Basis

- **Current implementation:** **Corpus ratio** with a **synthetic goal** (2 × projected balance).
- **Formula:** `readinessPercent = (projectedValue / readinessGoal) * 100` with `readinessGoal = 2 * projectedValue` → always **50%**.
- **Not used:** Income replacement ratio, user-entered goal, plan-specific target, or external API.

---

## 5. UI Structure

### 5.1 Component Hierarchy

```
Route: /enrollment/review
  └─ EnrollmentLayout (EnrollmentProvider)
       └─ EnrollmentStepLayout (DashboardLayout + EnrollmentHeaderWithStepper)
            └─ Outlet
                 └─ EnrollmentReviewContent
                      └─ InvestmentProvider (sourceAllocation from enrollment)
                           └─ Review
                                ├─ AnimatePresence (feedback toast)
                                ├─ EnrollmentPageContent (title, subtitle, badge)
                                │    └─ Two-column grid (max-w-[1200px], 65fr 35fr)
                                │         ├─ Left: 6 cards (Plan, Contribution, ADI, Investments, What Happens Next, Terms)
                                │         └─ Right: Readiness card, AI Insight card, Projected Balance card
                                ├─ EnrollmentFooter (step=4, getDraftSnapshot → investment)
                                ├─ AIAdvisorModal
                                ├─ SuccessEnrollmentModal
                                └─ FeedbackModal
```

### 5.2 Layout Grid

- **Container:** `EnrollmentPageContent` → inner `max-w-7xl mx-auto px-6 lg:px-12`.
- **Review grid:** `max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-8 lg:gap-10 items-start`. Right column uses `lg:sticky lg:top-24` for the outcome block.
- **Cards:** Shared `cardStyle` (CSS vars: --enroll-card-bg, --enroll-card-border, --enroll-card-radius, --enroll-elevation-2).

### 5.3 State Persistence

- **Enrollment:** In-memory React state in `EnrollmentProvider`; initial state from `loadEnrollmentDraft()` at app load. Steps update state and may merge into draft on Save & Exit / Continue.
- **Investment on Review:** `InvestmentProvider` mounts fresh on Review; in useEffect loads draft and sets `investmentAllocation` from `draft.investment.sourceAllocation`. So Review’s allocation is whatever was last saved (e.g. on Continue from Investments).
- **Save & Exit from Review:** `EnrollmentFooter.handleSaveAndExit` calls `loadEnrollmentDraft()`, merges `getDraftSnapshot()` (investment only from Review), then `saveEnrollmentDraft()`. Enrollment state (plan, contribution, ADI, profile, etc.) is **not** re-serialized from context into draft here; only existing draft + investment snapshot is saved. So if draft was never saved in a prior step, some fields could be stale after Save & Exit from Review.

### 5.4 Re-render and Navigation

- **Re-renders:** Review uses `useMemo` for `prerequisites`, `fundTableRows`, `projectedValue`, and derived readiness/shortfall. `weightedSummary` and `chartAllocations` come from InvestmentContext (memoized). No obvious unnecessary re-renders; Framer Motion on cards may re-run on state changes.
- **Guards:** If `!prerequisites.hasPlan` or `!prerequisites.hasContribution` → `<Navigate to="…" replace />`. If `!prerequisites.hasInvestment`, Submit is disabled and allocation warning shown; no redirect.
- **Back:** EnrollmentFooter Back on step 4 goes to `/enrollment/investments`. No step-order enforcement in layout; step pages own redirects.

---

## 6. Improvement Opportunities

### 6.1 Retirement Simulator Widget

- **Current:** Single projected balance and readiness %; no sliders or what-if.
- **Opportunity:** Add a small simulator (e.g. in right column or modal): vary return %, retirement age, or contribution % and see updated projected balance and readiness. Reuse `projectedValue`-style loop (and optionally `projectionCalculator` for ADI) with local state for “what-if” inputs.

### 6.2 Optimization Modal Logic

- **Current:** “Apply Suggestion” only navigates to Contribution or Investments with a toast; no modal, no pre-filled suggestion.
- **Opportunity:** Modal that explains the suggestion (e.g. “Increase pre-tax by 2%”) and optionally pre-fills or guides the user (e.g. set contribution +2% or apply a target-date mix), then navigate. Would require passing suggested values via state or draft.

### 6.3 Post-Submit Poppers / Success UX

- **Current:** Submit opens `SuccessEnrollmentModal`; on close, may set `pendingFeedback` and then open `FeedbackModal`, then navigate to post-enrollment dashboard.
- **Opportunity:** Add small “popper” or inline confirmations (e.g. “Enrollment submitted”, “Check your email”) or tooltips for next steps (e.g. “View your plan”) to reduce reliance on modals and clarify flow.

### 6.4 Refactor to 65/35 Structure

- **Current:** Layout is already 65/35 (`lg:grid-cols-[65fr_35fr]`) with left = decisions, right = outcome (readiness, AI insight, projected balance). No refactor strictly required for ratio.
- **Opportunity:** Extract left/right into named components (e.g. `ReviewDecisionsColumn`, `ReviewOutcomeColumn`) and optionally move cards into subcomponents (e.g. `ReviewPlanCard`, `ReviewReadinessCard`) for tests and reuse.

### 6.5 Other Improvements

- **Readiness goal:** Replace synthetic 2× goal with a configurable or user-entered goal (or income replacement target) so readiness % and shortfall are meaningful.
- **Projected balance:** Optionally use ADI and employer match in the compound loop; consider inflation/salary growth for real-dollar clarity (with clear labeling).
- **Draft consistency:** On Save & Exit from Review, merge full enrollment state (and ADI cycle/per-source) into draft so that returning from dashboard restores everything. Extend `EnrollmentDraft.autoIncrease` to include `incrementCycle`, `preTaxIncrease`, `rothIncrease`, `afterTaxIncrease`.
- **AI insights:** Drive impact copy (e.g. “+$42,000”) from a simple model (e.g. +2% contribution → delta in projected balance) for personalization.

---

## 7. Structured Technical Findings Summary

| ID | Area | Finding | Severity / Note |
|----|------|--------|------------------|
| F1 | Projected balance | Calculated only in Review; uses employee monthly contribution and allocation return; no ADI, no employer in loop, no inflation/salary growth. | By design; document and optionally extend. |
| F2 | Readiness | Goal = 2× projected → readiness always 50%; shortfall = projected. Not income replacement or user goal. | Logic bug / placeholder; should be replaced. |
| F3 | Return assumption | Review uses investment `weightedSummary.expectedReturn` (default 7%); assumptions.annualReturnRate not used on Review. | Consistent but different from Contribution/FutureContributions copy. |
| F4 | Inflation | Stored in assumptions; not used in Review projection or readiness. | Gap if disclosure says “inflation-adjusted”. |
| F5 | ADI | Displayed on Review; not used in projected balance; draft does not persist cycle or per-source increases. | Data loss on reload; projection ignores ADI. |
| F6 | AI suggestions | Static list + i18n; no API, no user-specific impact. | Feature gap for personalization. |
| F7 | Save & Exit from Review | Only merges `getDraftSnapshot()` (investment) into existing draft; does not write full enrollment state to draft. | Risk of stale draft if user skipped saving on earlier steps. |
| F8 | Investment on Review | Hydrated from draft in InvestmentProvider useEffect; depends on draft being saved at Investments step. | Correct; document dependency. |

---

**Document version:** 1.0  
**Related:** `ENROLLMENT_ROUTING_AUDIT.md`, `ENROLLMENT_ROUTING_STATE_AUDIT.md`, `FULL_SYSTEM_AUDIT.md`.
