# Enrollment Wizard Navigation — Technical Audit

**Date:** 2025-03-01  
**Scope:** Multi-step enrollment flow navigation, stepper active state, Back/Next behavior, and URL/state sync.  
**Flow:** `/enrollment/choose-plan` → `contribution` → `future-contributions` → `investments` → `review`.

---

## 1. Source of truth for “current step”

| Concern | Finding |
|--------|--------|
| **Primary source** | **URL pathname.** The layout derives step index via `pathToStep(pathname)` from a fixed list of paths. |
| **Where** | `EnrollmentLayout` → `EnrollmentStepLayout` uses `useLocation().pathname` and `pathToStep(pathname)` to get `step`, and passes `activeStep={step}` to `EnrollmentHeaderWithStepper`. Step content is chosen by a **switch on pathname** in `EnrollmentStepContent()`, not by React Router’s `<Outlet />` for the five step routes. |
| **Duplication** | **Footer step:** Previously, each page passed a `step` prop (e.g. Review `step={4}`, Investments `step={3}`) to `EnrollmentFooter`. That duplicated step and could disagree with the URL (e.g. after browser Back). **Fix:** Footer now derives step from `pathname` when on an enrollment step path so Back and URL stay in sync. |
| **Context** | `EnrollmentContext` holds form/draft state (plan, contribution, auto-increase, etc.). It does **not** hold “current step index.” Step is not in context. |
| **Query params** | Not used for step. |
| **Shared path list** | `src/enrollment/enrollmentStepPaths.ts` now defines `ENROLLMENT_STEP_PATHS` and `pathToStep()` so layout, footer, and any guards use one source. |

**Conclusion:** Single source of truth for “which step” is the **URL pathname**, with path→step mapping in `enrollmentStepPaths.ts`. Stepper and (after fix) footer Back both align with pathname.

---

## 2. Navigation logic (per step)

### Choose Plan → Contribution

- **File:** `src/pages/enrollment/ChoosePlan.tsx`
- **Next:** `handleContinue`: validates `state.selectedPlan != null`, builds draft from context + `loadEnrollmentDraft()`, calls `saveEnrollmentDraft(...)`, then `navigate("/enrollment/contribution")`. Sync; no async before navigate.
- **Context:** User selects plan via `setSelectedPlan("roth_401k")`, so context has `selectedPlan` before Continue. Draft is saved with that value; Contribution reads from same context (provider does not remount on route change).

### Contribution → Future contributions

- **File:** `src/pages/enrollment/Contribution.tsx`
- **Next:** `handleNext`: calls `saveDraftForNextStep()` (sync: load draft, merge contribution/source allocation, save), then `navigate("/enrollment/future-contributions")`. Sync.
- **Back:** Inline button `handleBack` → `navigate("/enrollment/choose-plan")`.
- **Guard:** `useEffect` redirects to `/enrollment/choose-plan` with `replace: true` when `state.isInitialized && !selectedPlanId`. Context is initialized from draft once when provider mounts; if user selected plan on ChoosePlan, context already has `selectedPlan`, so redirect should not fire on normal flow.

### Future contributions → Investments

- **File:** `src/pages/enrollment/FutureContributions.tsx`
- **Next:** `handleContinue`: loads draft, merges auto-increase settings, `saveEnrollmentDraft(...)`, then `navigate("/enrollment/investments")`. Sync.
- **Back:** Inline `handleBack` → `navigate("/enrollment/contribution")`.

### Investments → Review

- **File:** `src/components/investments/InvestmentsFooter.tsx`
- **Next:** `handleContinue`: if `!canConfirmAllocation` return; `confirmAllocation()`; load draft, merge `investment: getInvestmentSnapshot()`, save; `navigate("/enrollment/review")`. Sync (no await). `confirmAllocation()` may be async internally but navigation is not gated on it.
- **Back:** Uses `EnrollmentFooter` with step derived from pathname (after fix).

### Review

- **File:** `src/pages/enrollment/Review.tsx` (wrapped by `EnrollmentReviewContent`)
- **Primary:** Submit opens success modal; no step navigation.
- **Back:** Uses `EnrollmentFooter` with step derived from pathname (after fix).

**Summary:** All “Next” handlers are synchronous: save draft (sync) then `navigate(...)`. No conditional navigate that could silently no-op except ChoosePlan’s validation (toast if no plan). No intentional async delay before navigate; no race with router.

---

## 3. Stepper component audit

- **Component:** `EnrollmentHeaderWithStepper` receives `activeStep` from the layout (which gets it from `pathToStep(pathname)`). It passes `currentStep={activeStep}` to `EnrollmentStepper`.
- **EnrollmentStepper:** Purely presentational; no internal step state. It uses `currentStep` for “current” and “completed” (index < current). So stepper state is **pathname-driven** and matches the URL.
- **Remounting:** Layout uses `<EnrollmentStepLayout key={pathname} />`, so when pathname changes the step layout (and thus header/stepper) remount with the new pathname; `pathToStep(pathname)` and `activeStep` are correct for the new URL.

**Conclusion:** Stepper active state is correct as long as the URL is correct; no separate “wizard state” for the stepper.

---

## 4. Router and layout behavior

- **Router:** `createBrowserRouter`; `/enrollment` has `EnrollmentLayout`; children include `choose-plan`, `contribution`, `future-contributions`, `investments`, `review`. So React Router does match these paths and could render via `<Outlet />`.
- **Layout choice:** For the five step paths, the layout does **not** render `<Outlet />`; it renders `EnrollmentStepContent()` which is a manual switch on pathname (ChoosePlan, Contribution, FutureContributions, Investments guard + content, Review content). Comment in code: “works around Outlet not updating in some cases.” So the **visible** step content is entirely driven by pathname in the layout; the router’s matched child element is not used for steps.
- **Key:** `EnrollmentStepLayout` is keyed by `pathname`, so on URL change the step layout remounts; `EnrollmentProvider` is above it and does **not** remount, so context (and draft-derived state) is preserved across step transitions.

---

## 5. History stack and replace vs push

- **Normal Next:** All step transitions use `navigate(nextPath)` with no `replace: true`, so history stack grows (Back goes to previous step). Correct.
- **Guards:** Contribution’s guard uses `navigate("/enrollment/choose-plan", { replace: true })` so user doesn’t get stuck in a back loop. Appropriate.

---

## 6. Fixes applied

1. **Single module for step paths**  
   Added `src/enrollment/enrollmentStepPaths.ts` with `ENROLLMENT_STEP_PATHS`, `pathToStep()`, and `isEnrollmentStepPath()`. Layout imports from here so path list is not duplicated.

2. **EnrollmentFooter Back from URL**  
   Footer now uses `useLocation()` and, when on an enrollment step path, derives step from `pathToStep(pathname)` for Back and for `isFirstStep`. Back always goes to `ENROLLMENT_STEP_PATHS[step - 1]`, so it stays in sync with the URL. Call sites can still pass `step`; it is used only when pathname is not a step path (fallback).

---

## 7. Recommendations

- **If “Next doesn’t navigate” still occurs:** Check (1) that the Next handler is actually invoked (no disabled primary, no early return), (2) that no error is thrown before `navigate()`, (3) that no guard or effect runs after navigation and redirects (e.g. Contribution’s `!selectedPlanId` guard). Adding a short log before `navigate()` in each handler can confirm.
- **Route vs label:** “Auto Increase” in the stepper corresponds to path `/enrollment/future-contributions`; there is no path segment `auto-increase`.
- **Optional:** Have each step page pass `step={pathToStep(location.pathname)}` for consistency; footer will override with pathname when on a step path, so this is optional.

---

## 8. File reference

| File | Role |
|------|------|
| `src/app/router.tsx` | Defines `/enrollment` and step child routes. |
| `src/enrollment/enrollmentStepPaths.ts` | Step paths and pathToStep (single source). |
| `src/layouts/EnrollmentLayout.tsx` | Uses pathname → step, renders stepper + EnrollmentStepContent (pathname switch). |
| `src/components/enrollment/EnrollmentHeaderWithStepper.tsx` | Stepper bar; receives activeStep from layout. |
| `src/components/enrollment/EnrollmentStepper.tsx` | Presentational stepper; currentStep prop only. |
| `src/components/enrollment/EnrollmentFooter.tsx` | Back from pathname-derived step when on step path; Save & Exit; Primary CTA. |
| `src/enrollment/context/EnrollmentContext.tsx` | Form/draft state; initial state from draft; no step index. |
| `src/pages/enrollment/ChoosePlan.tsx` | Continue: save draft, navigate to contribution. |
| `src/pages/enrollment/Contribution.tsx` | Next: save draft, navigate to future-contributions; guard redirect if no plan. |
| `src/pages/enrollment/FutureContributions.tsx` | Continue: save draft, navigate to investments. |
| `src/components/investments/InvestmentsFooter.tsx` | Continue: confirm allocation, save draft, navigate to review; uses EnrollmentFooter. |
| `src/pages/enrollment/Review.tsx` | Uses EnrollmentFooter; Submit opens modal. |
