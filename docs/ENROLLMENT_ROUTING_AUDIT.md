# Enrollment Routing Audit

**Date:** 2025-03-01  
**Scope:** Routing inconsistency — Continue from Contribution not navigating; Back from Future Contributions going to Plans.  
**Instruction:** Audit only; no fixes.

---

## PHASE 1 — ROUTING STRUCTURE

### Route definitions (source: `src/app/router.tsx`)

| Full path | Route path (child) | Component | Nested? |
|-----------|--------------------|-----------|--------|
| `/enrollment` | (index) | `EnrollmentManagement` | Yes (parent: `EnrollmentLayout`) |
| `/enrollment/manage/:planId` | `manage/:planId` | `PlanDetailManagement` | Yes |
| `/enrollment/choose-plan` | `choose-plan` | `ChoosePlan` | Yes |
| `/enrollment/plans` | `plans` | `PlansPage` | Yes |
| `/enrollment/contribution` | `contribution` | `Contribution` | Yes |
| `/enrollment/future-contributions` | `future-contributions` | `FutureContributions` | Yes |
| `/enrollment/investments` | `investments` | `EnrollmentInvestmentsGuard` → `EnrollmentInvestmentsContent` | Yes |
| `/enrollment/review` | `review` | `EnrollmentReviewContent` | Yes |

- **Parent:** `path: "/enrollment"`, `element: <ProtectedRoute><EnrollmentLayout /></ProtectedRoute>`.
- **Nested routes:** All step routes are children of `/enrollment`; `EnrollmentLayout` renders `<Outlet />` for the matched child.
- **No basename** on `createBrowserRouter` in `router.tsx`.

### Stepper path array (source: `src/layouts/EnrollmentLayout.tsx`)

```ts
const ENROLLMENT_STEP_PATHS = [
  "/enrollment/choose-plan",      // index 0 → Plan
  "/enrollment/contribution",     // index 1 → Contribution
  "/enrollment/future-contributions", // index 2 → Auto Increase
  "/enrollment/investments",      // index 3 → Investment
  "/enrollment/review",           // index 4 → Review
] as const;
```

- **Step index** is derived only from URL: `pathToStep(pathname)` = `ENROLLMENT_STEP_PATHS.indexOf(pathname)`; if not found, returns `0`.
- **No `/enrollment/plans`** in this array; `/enrollment/plans` is a separate route (PlansPage), not part of the 5-step stepper.

---

## PHASE 2 — NAVIGATION LOGIC

### Contribution step — Continue button

**File:** `src/pages/enrollment/Contribution.tsx`

**Handler:**

```ts
const handleNext = useCallback(() => {
  if (!canContinue) return;
  const draft = loadEnrollmentDraft();
  if (draft) {
    saveEnrollmentDraft({
      ...draft,
      contributionType: "percentage",
      contributionAmount: contributionPct,
      sourceAllocation: state.sourceAllocation,
    });
  }
  navigate("/enrollment/future-contributions", {
    state: { fromContribution: true, contributionPct, sourceAllocation: state.sourceAllocation },
  });
}, [canContinue, contributionPct, state.sourceAllocation, navigate]);
```

**Continue button:**

```tsx
<Button
  type="button"
  onClick={handleNext}
  disabled={!canContinue}
  className="enrollment-footer__primary ..."
>
  {t("enrollment.continueToAutoIncrease")}
</Button>
```

**Can continue:**

```ts
const canContinue = contributionPct > 0 && contributionPct <= 100 && allocationValid;
const allocationValid = Math.abs(sourceTotal - 100) < 0.01;  // preTax + roth + afterTax ≈ 100
```

- **What it does:** Calls `navigate("/enrollment/future-contributions", { state: { ... } })` — changes route and passes state.
- **When it doesn’t run:** If `canContinue` is false, `handleNext` returns immediately and **never calls `navigate`**. The button is `disabled={!canContinue}`, so in normal use the user shouldn’t be able to click when disabled, but if the disabled state were wrong or bypassed, the click would still do nothing.

### Future Contributions step — Back button

**File:** `src/pages/enrollment/FutureContributions.tsx`

**Handler:**

```ts
const handleBack = useCallback(() => navigate("/enrollment/contribution"), [navigate]);
```

**Back button (in-page footer):**

```tsx
<Button
  type="button"
  onClick={handleBack}
  className="enrollment-footer__back ..."
>
  {t("enrollment.footerBack")}
</Button>
```

- **What it does:** Navigates to **`/enrollment/contribution`** (Contribution page). There is no other in-page Back that navigates to Plans.
- **Note:** `FutureContributions` does **not** use the shared `EnrollmentFooter` component; it has its own footer with this `handleBack`. The shared `EnrollmentFooter` (used e.g. on Review) uses a `step` prop and would map step 2 Back to `/enrollment/contribution` as well.

### Other navigation references

- **Contribution Back:** `handleBack = () => navigate("/enrollment/choose-plan")` (correct for step 1).
- **ChoosePlan Continue:** `navigate("/enrollment/contribution")`.
- **EnrollmentFooter** (when used): Back by step → step 1: choose-plan, step 2: contribution, step 3: future-contributions, step 4: investments. No Back from future-contributions goes to plans in this component.

---

## PHASE 3 — STEPPER / ENROLLMENT CONTEXT

### Where `activeStep` comes from

**File:** `src/layouts/EnrollmentLayout.tsx`

- **EnrollmentStepLayout** uses `useLocation()`, reads `pathname`, then:
  - `step = pathToStep(pathname)` (index in `ENROLLMENT_STEP_PATHS`).
  - Renders `<EnrollmentHeaderWithStepper activeStep={step} />`.
- So **step index is driven only by the current URL pathname**. There is no separate “currentStep” or “stepIndex” in EnrollmentContext; no `setCurrentStep` or `setStepIndex` in the enrollment flow.

### Redirects that can override navigation

1. **Contribution** (`src/pages/enrollment/Contribution.tsx`):

   ```ts
   if (state.isInitialized && !selectedPlanId) {
     return <Navigate to="/enrollment/plans" replace />;
   }
   ```

   - When **Contribution** mounts, if there is no `selectedPlanId` in enrollment state, it immediately redirects to **`/enrollment/plans`** (PlansPage) with `replace`. So the user never sees the Contribution page.

2. **Review** (`src/pages/enrollment/Review.tsx`):

   - `if (!prerequisites.hasPlan) return <Navigate to="/enrollment/choose-plan" replace />;`
   - `if (!prerequisites.hasContribution) return <Navigate to="/enrollment/contribution" replace />;`
   - These only run when the Review page is mounted.

3. **EnrollmentInvestmentsGuard** (wraps investments step only):

   - If no plan or no contribution, redirects to `/enrollment/plans` or `/enrollment/contribution`. Does **not** wrap future-contributions.

### No “redirect to first incomplete step” in layout

- **EnrollmentLayout** and **EnrollmentStepLayout** do **not** run any `useEffect` that redirects based on step or “first incomplete step.” The only redirects are inside individual page components (Contribution, Review) or the investments guard.

---

## PHASE 4 — URL VS STATE MISMATCH

### Intended alignment

- **URL** = source of truth for which step is shown.
- **activeStep** = `pathToStep(pathname)` (0–4).
- No separate “step state” in context that could get out of sync with the URL for rendering the step content.

### Scenario that creates a mismatch (Back → Plans)

- User is on **Future Contributions** (e.g. after a **manual refresh** at `/enrollment/future-contributions`).
- **EnrollmentLayout** remounts (or re-runs), **EnrollmentProvider** remounts and re-initializes from **draft** (e.g. `loadEnrollmentDraft()`). If the draft does **not** contain `selectedPlanId` (or it was never saved from Choose Plan), then `state.selectedPlanId` is **null** for the rest of the session until they pick a plan again.
- User clicks **Back** on Future Contributions → `navigate("/enrollment/contribution")` → **Contribution** mounts.
- Contribution runs: `if (state.isInitialized && !selectedPlanId) return <Navigate to="/enrollment/plans" replace />`.
- So **URL** is `/enrollment/contribution` only briefly; the user is immediately sent to **`/enrollment/plans`**. From the user’s perspective: “Back from Future Contributions goes to Plans.”

So the mismatch is:

- **URL** (after Back): `/enrollment/contribution` (then immediately replaced by `/enrollment/plans`).
- **State:** `selectedPlanId === null` (from draft or lost context).
- **Result:** Guard on Contribution forces redirect to Plans. Step index and path are “in sync” until the guard runs; the guard is what sends them to Plans.

---

## PHASE 5 — ROOT CAUSE DIAGNOSIS

### Issue 1: “From /enrollment/contribution, clicking Continue to Auto Increase does NOT navigate”

**Possible causes:**

- **A) Continue button not calling navigate**  
  - **Relevant:** `handleNext` is the only handler; it **does** call `navigate("/enrollment/future-contributions", { state })` when it runs.
  - If the button is **disabled** (`!canContinue`), the user cannot click it. If for any reason the button were clickable while `canContinue` is false (e.g. UI bug or test), `handleNext` would **return without calling `navigate`**. So the most plausible “does NOT navigate” with no other errors is: **`canContinue` is false** (e.g. `allocationValid` false because preTax + roth + afterTax ≠ 100), so either the button is disabled and nothing happens, or the handler runs and exits early without navigating.

- **B) Navigate is called but blocked by guard**  
  - There is **no** guard on the **future-contributions** route or its parent that would block rendering that page. So this is unlikely unless some other global guard is added elsewhere.

- **C) Stepper resets route on mount**  
  - The stepper does **not** change the route; it only reads `pathname` and displays `activeStep`. No redirect on mount in EnrollmentLayout. So this is **not** the cause.

**Conclusion for Issue 1:**  
Most likely **A)** — **Continue is effectively “not navigating” because either the button is disabled (`!canContinue`) or `handleNext` is invoked with `canContinue === false` and returns without calling `navigate`.** Secondary possibility: **B)** if there is an unobserved guard or error when `navigate` runs (e.g. in a wrapper or error boundary). No evidence of C).

---

### Issue 2: “From /enrollment/future-contributions, clicking Back goes to Plans page instead of Contribution”

**What actually happens:**

- The **Back** button on Future Contributions **does** call `navigate("/enrollment/contribution")`. So the **Back handler is correct** and **does** change the route to Contribution.

- When **Contribution** mounts, it runs:

  ```ts
  if (state.isInitialized && !selectedPlanId) {
    return <Navigate to="/enrollment/plans" replace />;
  }
  ```

- So the flow is: **Back → navigate to Contribution → Contribution mounts → guard sees no `selectedPlanId` → redirect to `/enrollment/plans`.**

**Conclusion for Issue 2:**  
**D) is only partly right:** The Back **button** is not “hardcoded wrong path”; it correctly goes to **Contribution**. The behavior “Back → Plans” is caused by **Contribution’s guard**: when the user reaches Contribution (from Back), **if enrollment state has no `selectedPlanId`** (e.g. after refresh, context re-seeded from a draft that lacks `selectedPlanId`), **Contribution immediately redirects to `/enrollment/plans`.** So the root cause is **Contribution’s redirect when `!selectedPlanId`**, not the Back button’s target path.

---

## SUMMARY TABLE

| Finding | Detail |
|--------|--------|
| **Route definitions** | `/enrollment/contribution` → Contribution; `/enrollment/future-contributions` → FutureContributions; `/enrollment/plans` → PlansPage. All nested under `/enrollment` with `EnrollmentLayout`. |
| **Continue handler** | `handleNext`: checks `canContinue`, saves draft, then `navigate("/enrollment/future-contributions", { state })`. If `!canContinue`, returns without navigating. |
| **Back handler (Future Contributions)** | `handleBack`: `navigate("/enrollment/contribution")`. Correct target. |
| **Stepper logic** | `activeStep = pathToStep(pathname)` in EnrollmentLayout; no step in context; no redirect-on-mount in layout. |
| **Redirect that causes “Back → Plans”** | Contribution: `if (state.isInitialized && !selectedPlanId) return <Navigate to="/enrollment/plans" replace />`. |

---

## FINAL DIAGNOSIS

1. **Continue from Contribution “does NOT navigate”**  
   - **Primary:** **A) Continue effectively not navigating** — either the button is disabled because `canContinue` is false (e.g. source allocation doesn’t sum to 100%), or the same condition causes `handleNext` to return without calling `navigate`.  
   - **Secondary:** Possible but unconfirmed: **B)** something blocking or throwing when `navigate` is called (e.g. guard or error boundary).

2. **Back from Future Contributions goes to Plans**  
   - **Not** wrong Back path: Back correctly navigates to **Contribution**.  
   - **Cause:** **Contribution’s guard** redirects to **`/enrollment/plans`** when `selectedPlanId` is missing (e.g. after refresh, draft without plan). So step index and router path are in sync; the **guard** is what overrides the intended “Back → Contribution” experience and sends the user to Plans.

**No fix applied in this audit; diagnosis only.**

---

## NAVIGATION OVERRIDE TRACE (Layout-Level Audit)

**Date:** 2025-03-01  
**Issue:** From `/enrollment/contribution`, clicking Continue does NOT transition to `/enrollment/future-contributions` unless the page is refreshed (navigation overridden during render).

### STEP 1 — EnrollmentLayout redirect audit

- **Searched for:** `<Navigate`, `navigate(`, `useEffect(() => navigate`, redirect logic based on draft/step.
- **Result:** **No redirect logic in EnrollmentLayout.** Layout has no `<Navigate>`, no `navigate()`, no `useEffect` that navigates, no step-index or draft-based redirect. Layout is a visual wrapper only (EnrollmentProvider + EnrollmentStepLayout + Outlet).
- **Added:** `console.log("EnrollmentLayout rendering at:", location.pathname)` for trace. Comment in code: "AUDIT: No <Navigate>, no navigate(), no useEffect redirect, no step-order logic."

### STEP 2 — Step auto-correction

- **Searched for:** `if (!hasPlan) navigate(...)`, `if (!hasContribution) navigate(...)` in layout.
- **Result:** **None in layout.** Step guards exist only in step pages (Contribution → plans when no plan; Review → choose-plan/contribution; EnrollmentInvestmentsGuard → plans/contribution when used for investments route only).

### STEP 3 — Redirect “only when landing”

- **Result:** Layout has no redirect to modify. If a redirect is added later, it must run only when landing at base path (e.g. `/enrollment`) and must never override explicit child navigation.

### STEP 4 — Contribution inside form

- **Result:** Continue button is `type="button"`. Contribution page is **not** wrapped in a `<form>`. No parent form intercepts submit.

### STEP 5 — Router config

- **Result:** `future-contributions` is a static path; declared after `contribution`, before `investments`. No wildcard above it that could catch it (`manage/:planId` only matches `manage/...`). Route order is correct.

### STEP 6 — Force repro trace

- **Added:**
  - **Contribution:** `useEffect(() => { console.log("Contribution mounted at:", location.pathname); }, [location.pathname]);`
  - **FutureContributions:** `useEffect(() => { console.log("FutureContributions mounted at:", location.pathname); }, [location.pathname]);`
- **How to interpret:** Click Continue from Contribution. If "FutureContributions mounted at: /enrollment/future-contributions" appears and then "Contribution mounted at: /enrollment/contribution" appears, layout or another guard is overriding (FutureContributions mounts then unmounts). If FutureContributions never mounts, navigate is not taking effect or something redirects before the new route renders.

### STEP 7 — Findings and fix strategy

| Question | Answer |
|----------|--------|
| **Does layout contain redirect logic?** | **No.** |
| **Exact line causing override (in layout)?** | **None.** Layout has no redirect. |
| **Fix at layout level** | Layout already does not enforce step ordering. No change required in layout. |
| **Where guards live** | Contribution (→ plans if no plan), Review (→ choose-plan/contribution), EnrollmentInvestmentsGuard (→ plans/contribution for investments route only). These run only when their page is rendered. |
| **If override persists** | Use console logs: (1) "EnrollmentLayout rendering at:" — does pathname flip to future-contributions then back? (2) "Contribution mounted at:" / "FutureContributions mounted at:" — does FutureContributions mount briefly then unmount? If yes, the override is in a step page or provider that runs when FutureContributions is in the tree (e.g. a guard that redirects when prerequisites are missing). |

**Conclusion:** Root cause is not in EnrollmentLayout. Layout is visual wrapper only. Trace logs added to confirm whether override happens after navigation (FutureContributions mounts then unmounts) or navigation never commits (pathname never changes).
