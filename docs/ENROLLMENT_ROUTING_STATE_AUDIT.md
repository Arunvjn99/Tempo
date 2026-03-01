# Enrollment Routing & State Flow — Technical Audit

**Scope:** Flow between `/enrollment/choose-plan`, `/enrollment/contribution`, `/enrollment/future-contributions`, `/enrollment/investments`, `/enrollment/review`.  
**No fixes or code changes — analysis and report only.**

---

## PHASE 1 — ROUTER STRUCTURE

### Full router tree for `/enrollment`

```
RootLayout
└── ProtectedRoute
    └── EnrollmentLayout                    ← element for path "/enrollment"
        └── EnrollmentProvider
            └── EnrollmentStepLayout
                └── (conditional) DashboardLayout + Outlet **or** div + Outlet
                    └── Outlet (key=location.pathname) renders:
                        • index → EnrollmentManagement
                        • manage/:planId → PlanDetailManagement
                        • choose-plan → ChoosePlan
                        • plans → PlansPage
                        • contribution → Contribution
                        • future-contributions → FutureContributions
                        • investments → EnrollmentInvestmentsGuard → EnrollmentInvestmentsContent
                        • review → EnrollmentReviewContent
```

- **Path:** `/enrollment` with **children** (index, choose-plan, contribution, future-contributions, investments, review, etc.).
- **Element:** `ProtectedRoute` → `EnrollmentLayout`. No nested layout inside enrollment; one layout, one `Outlet` for children.
- **Basename:** Not used. `createBrowserRouter([...])` is called with no `basename` option.

### EnrollmentProvider mount count

- **Mounted once.** Only usage: `EnrollmentLayout` renders `<EnrollmentProvider><EnrollmentStepLayout /></EnrollmentProvider>`.
- No other file wraps routes or trees with `EnrollmentProvider`. No duplicate provider.

### Routes nested correctly?

- Yes. Enrollment routes are children of `path: "/enrollment"` with a single `EnrollmentLayout` element. Sibling children are flat (no nested path segments for the step flow).

### Duplicate routes?

- No duplicate paths under `/enrollment`. Each of choose-plan, contribution, future-contributions, investments, review appears once.

---

## PHASE 2 — PROVIDER INITIALIZATION

**File:** `src/enrollment/context/EnrollmentContext.tsx` (provider lives here; there is no separate `EnrollmentProvider.tsx`).

### How state is initialized

- **Initial state:** `useState<EnrollmentState>(DEFAULT_STATE)`.
- `DEFAULT_STATE` has `isInitialized: false` and default values (e.g. `contributionAmount: 0`, `selectedPlan: null`, `salary: 0`, etc.).
- No props are passed from the layout; the provider accepts only `children`.

### Draft load: sync vs async

- **Synchronous.** In a `useEffect(() => { ... }, [])`:
  - `loadEnrollmentDraft()` is called (reads `sessionStorage.getItem` + `JSON.parse` — no async API).
  - If draft exists, `setState` is called with a merge of `prev` and draft-mapped fields.
  - If no draft, `setState(prev => ({ ...prev, isInitialized: true }))`.
- So: draft is loaded **synchronously inside an effect**, i.e. after first commit. It is not async (no Promise).

### When `isInitialized` becomes true

- Only inside the same `useEffect`:
  - With draft: when `setState({ ...merged, isInitialized: true })` runs.
  - Without draft: when `setState(prev => ({ ...prev, isInitialized: true }))` runs.
- So: **after** the first render (effect runs after paint), in the next state update.

### Do pages render before initialization?

- **No.** The provider renders:
  - `{state.isInitialized ? children : null}`.
  - So `EnrollmentStepLayout` and the `Outlet` (and thus step pages) render only when `isInitialized === true`.
  - Until then, the layout’s tree under the provider sees no children (null). No step page mounts before initialization.

### Is state overwritten after navigation?

- **No.** There is no effect that re-loads draft on route change. Draft is loaded only once in the single `useEffect([])`. Subsequent navigations (e.g. contribution → future-contributions) do not re-run that effect; state is only updated by user actions and normal setters. So state is **not** overwritten by a second hydration after navigation.

---

## PHASE 3 — REDIRECT LOGIC

### Contribution.tsx

| Item | Finding |
|------|--------|
| **&lt;Navigate /&gt;** | None. No `Navigate` import or usage in the file. |
| **useEffect that navigates** | One: `useEffect(() => { if (state.isInitialized && !selectedPlanId) { navigate("/enrollment/choose-plan", { replace: true }); } }, [state.isInitialized, selectedPlanId, navigate]);` |
| **Condition** | Redirect runs when **initialized and no selected plan** (`!selectedPlanId`). |
| **Depends on uninitialized state?** | No. Redirect is gated on `state.isInitialized`; it only runs after initialization. |

### FutureContributions.tsx

| Item | Finding |
|------|--------|
| **&lt;Navigate /&gt;** | None. No `Navigate` in this file. |
| **useEffect that navigates** | None. No `useEffect` that calls `navigate`. |
| **Conditional UI that navigates** | When `!hasValidContribution`, the page renders a message and a button; the button’s `onClick` is `() => navigate("/enrollment/contribution")`. This is user-driven, not an automatic redirect. |
| **Depends on uninitialized state?** | N/A for redirect. `hasValidContribution` is derived from `contributionPct`, which comes from context (and a fallback to `locationState?.contributionPct` — see Phase 6). |

### Other enrollment redirect logic

| File | Behavior |
|------|----------|
| **EnrollmentInvestmentsGuard.tsx** | Renders **&lt;Navigate to="/enrollment/plans" replace /&gt;** if `!state.isInitialized \|\| !state.selectedPlan`. Renders **&lt;Navigate to="/enrollment/contribution" replace /&gt;** if `state.contributionAmount <= 0`. Conditional redirect in **render** (no useEffect). |
| **Review (EnrollmentReviewContent)** | Renders **&lt;Navigate to="/enrollment/choose-plan" replace /&gt;** if `!prerequisites.hasPlan`, and **&lt;Navigate to="/enrollment/contribution" replace /&gt;** if `!prerequisites.hasContribution`. Prerequisites depend on `enrollment.state`. |

### Path inconsistency

- **Contribution** redirects to **`/enrollment/choose-plan`** when there is no plan.
- **EnrollmentInvestmentsGuard** redirects to **`/enrollment/plans`** when there is no plan or not initialized.
- So “no plan” sends users to different routes depending on which component redirects.

---

## PHASE 4 — NAVIGATION LOGIC

### Contribution.tsx

| Handler | Behavior |
|---------|----------|
| **handleBack** | `navigate("/enrollment/choose-plan")` — absolute path, no state. |
| **handleNext** | Loads draft, merges contribution/source allocation, `saveEnrollmentDraft(...)`, then `navigate("/enrollment/future-contributions")`. No second argument (no `state`). Draft is saved before navigate. |
| **handleSaveAndExit** | Loads draft, merges contribution, saves, sets `ENROLLMENT_SAVED_TOAST_KEY`, then `navigate("/dashboard")`. |

- Paths: all absolute (`/enrollment/...`, `/dashboard`). No navigation state passed.

### FutureContributions.tsx

| Handler | Behavior |
|---------|----------|
| **handleBack** | `navigate(-1)` — history back. Not a hardcoded path. |
| **handleContinue** | Loads draft; if `!draft?.contributionAmount` then `navigate("/enrollment/contribution")` and return. Otherwise saves draft (with `autoIncrease`) then `navigate("/enrollment/investments")`. Draft saved before navigate when continuing. |
| **handleSaveAndExit** | Loads draft, merges `autoIncrease`, saves, sets toast key, `navigate("/dashboard")`. |

- Paths: absolute. No navigation state passed.

### ChoosePlan.tsx

- **handleContinue:** Saves draft (plan, age, salary, etc.) then `navigate("/enrollment/contribution")`. No state passed.

### Summary

- **Back:** Contribution uses a fixed path to choose-plan; Future Contributions uses `navigate(-1)`.
- **Continue / Next:** All use absolute paths; no `navigate(..., { state: ... })`. Draft is written before navigate on the flows that persist (Contribution → Future Contributions, Future Contributions → Investments).

---

## PHASE 5 — REFRESH VS NAVIGATION BEHAVIOR

### Scenario A: Direct visit to `/enrollment/future-contributions`

1. Router mounts `EnrollmentLayout` → `EnrollmentProvider` → `EnrollmentStepLayout` → `Outlet` (key = pathname).
2. Provider’s initial state: `DEFAULT_STATE` with `isInitialized: false`. Children are `null`, so no page component mounts yet.
3. Effect runs: `loadEnrollmentDraft()` reads sessionStorage. If user had previously saved (e.g. from Contribution or a prior session), draft exists.
4. `setState` merges draft into state and sets `isInitialized: true`.
5. Children render; `FutureContributions` mounts. It reads `state.contributionAmount`, `state.autoIncrease`, etc. from context — all from the draft that was just merged.
6. **Result:** `state.selectedPlanId` (and related), `state.contributionAmount`, `state.autoIncrease` reflect draft. `isInitialized` is true. Page works if draft was valid.

### Scenario B: Navigate from Contribution → Future Contributions

1. User is on Contribution; context already has plan, contribution, etc. (from initial draft load and/or user edits).
2. User clicks Continue. `handleNext` runs: draft is updated with current contribution/source allocation and saved, then `navigate("/enrollment/future-contributions")`.
3. Router updates; **EnrollmentLayout (and thus EnrollmentProvider) does not unmount** — same parent segment. Only the `Outlet`’s child changes (Contribution unmounts, FutureContributions mounts).
4. FutureContributions mounts with the **same** context instance; state is whatever it was on Contribution (plus any in-memory updates). Draft was just written, but FutureContributions does not re-read draft on mount; it relies on context.
5. **Result:** `state.contributionAmount` and `state.autoIncrease` should match what was on Contribution (and what was just saved). No second hydration; state is not overwritten by a new draft load.

### Scenario C: Refresh on Future Contributions

- Same as Scenario A: full mount of layout and provider, effect runs, draft loaded and merged, then children render. So after refresh, state comes entirely from draft.

### Differences (by scenario)

| Scenario | selectedPlanId / plan | contributionAmount | autoIncrease | isInitialized |
|----------|-----------------------|--------------------|--------------|----------------|
| **A – Direct visit** | From draft (if any) | From draft | From draft | true after effect |
| **B – From Contribution** | Unchanged from context (already set) | Unchanged from context (just saved to draft) | Unchanged from context | Already true |
| **C – Refresh** | From draft | From draft | From draft | true after effect |

- **B vs A/C:** On navigation, state is **in-memory** (no re-run of draft effect). On direct visit or refresh, state is **from draft only** (effect ran once and merged). So any bug that makes “navigation” state wrong (e.g. stale or zero) would not occur on refresh, because refresh re-hydrates from draft.

---

## PHASE 6 — ROOT CAUSE IDENTIFICATION

### 1. Why might the page “work after refresh but not during navigation”?

- **From the code:**  
  - Provider mounts once and does not remount on in-enrollment navigation.  
  - Draft is loaded once at provider mount; children do not render until `isInitialized` is true.  
  - So in theory, after navigating from Contribution, context should already hold the correct contribution and plan; FutureContributions just reads that state.

- **Plausible causes if “works after refresh but not on navigation” are still observed:**  
  - **Stale reference / bug in FutureContributions:** `contributionPct` uses a fallback `(locationState?.contributionPct ?? 0)`. In the current codebase, `locationState` is **not defined** (the variable and `useLocation` were removed earlier). So that expression is always `0` when `contributionFromContext` is falsy. If for any reason `contributionFromContext` is 0 or non-finite on first render after navigation (e.g. timing or a single render before context has updated), then `contributionPct` becomes 0, `hasValidContribution` is false, and the user sees the “set contribution to continue” UI instead of the main flow. After refresh, draft is loaded and merged, so `state.contributionAmount` is set and `contributionFromContext` is positive; then the broken fallback is not used and the page works.  
  - **Draft not saved before navigate in some path:** If in any code path “Continue” navigates without writing the latest contribution to the draft, then a later visit or another component that reads from draft could see old data. Current code paths for Contribution → Future Contributions and Future Contributions → Investments do save before navigate.  
  - **Guard redirect before step page:** EnrollmentInvestmentsGuard uses **&lt;Navigate /&gt;** in render. If a user is sent to investments before state is ready, the guard could redirect based on `!state.selectedPlan` or `state.contributionAmount <= 0`. That does not by itself explain “Future Contributions works after refresh but not on navigation,” but it can cause unexpected redirects when state is briefly wrong.

So the only **code-level bug** identified that directly fits “works after refresh but not on navigation” is the **use of `locationState` in FutureContributions when `locationState` is not defined**, which can force `contributionPct` to 0 and trigger the “invalid contribution” UI when context is still correct.

### 2. Why might Back “sometimes go to Plans”?

- **FutureContributions:** Back is `navigate(-1)`. So it goes to the previous history entry. If the user came Contribution → Future Contributions, history is […, contribution, future-contributions]; Back should go to Contribution. If instead they landed on Future Contributions directly (e.g. bookmark or redirect from somewhere else), previous entry might be Plans or another route, so Back would go there. So “Back goes to Plans” is consistent with **history stack**, not with a hardcoded “back to contribution” rule.  
- **Contribution:** Back is hardcoded to `/enrollment/choose-plan`. So from Contribution, Back never goes to Plans.  
- **EnrollmentInvestmentsGuard:** Redirects to `/enrollment/plans` when there is no plan. So if the user hits the investments route without a plan (e.g. manual URL or stale state), they are sent to **plans**, not choose-plan. That can look like “Back” behavior if they then use the browser back button from Plans and end up on a step that redirects again.

So: **Back** from Future Contributions is history-based; “going to Plans” can be from (a) history stack (e.g. direct visit to future-contributions then Back) or (b) guard redirect to `/enrollment/plans` when prerequisites fail, not from Contribution’s Back button.

### 3. Provider duplication

- **None.** Only one `EnrollmentProvider` in the app, inside `EnrollmentLayout`.

### 4. Redirect loops

- **No loop identified.**  
  - Contribution’s redirect runs only when `isInitialized && !selectedPlanId` and goes to choose-plan once.  
  - Guard’s `<Navigate />` is conditional on `!isInitialized || !selectedPlan` or `contributionAmount <= 0`; it does not depend on the current path in a way that would re-enter the same route and redirect again in a loop.  
  - Review’s `<Navigate />` is based on prerequisites; same idea.  
- **Caveat:** If `isInitialized` or `selectedPlan` / `contributionAmount` flip-flop (e.g. due to strict mode or multiple state updates), multiple redirects could occur; no such logic was found in the code.

### 5. State hydration timing

- **Initialization timing is correct:** Children of the provider do not render until `isInitialized` is true, and that is set only after the single draft-load effect runs. So no step page reads state before hydration.  
- **After navigation:** There is no “re-hydration” on route change; state is whatever it was. So timing issues would be about **when** the context was updated (e.g. on Contribution) and whether FutureContributions ever reads before that update — and the only suspicious part there is the **undefined `locationState`** fallback, which can make the page show “invalid contribution” even when context has valid data.

---

## SUMMARY TABLES

### Router findings

| Finding | Status |
|---------|--------|
| Enrollment tree under one layout, one provider | Yes |
| EnrollmentProvider mounted once | Yes |
| Routes nested correctly | Yes |
| Duplicate routes | None |
| Basename used | No |

### Provider findings

| Finding | Status |
|---------|--------|
| Draft loaded in effect (after first paint) | Yes |
| Draft load synchronous | Yes |
| isInitialized set only after draft handling | Yes |
| Children not rendered until isInitialized | Yes |
| State overwritten after navigation | No |

### Redirect findings

| Page / Component | &lt;Navigate /&gt; | useEffect redirect | Condition |
|-------------------|---------------------|--------------------|-----------|
| Contribution | No | Yes → choose-plan | isInitialized && !selectedPlanId |
| FutureContributions | No | No | — |
| EnrollmentInvestmentsGuard | Yes → plans, Yes → contribution | No | !isInitialized \|\| !selectedPlan; contributionAmount <= 0 |
| Review | Yes → choose-plan, Yes → contribution | No | !hasPlan; !hasContribution |

### Navigation findings

| Page | handleBack | handleContinue / Next | Paths | Nav state | Draft saved before navigate |
|------|------------|------------------------|-------|-----------|-----------------------------|
| Contribution | choose-plan (absolute) | future-contributions (absolute) | Absolute | No | Yes |
| FutureContributions | navigate(-1) | investments or contribution | Absolute | No | Yes when continuing |

### Root cause summary

| Question | Answer |
|----------|--------|
| Why works after refresh but not on navigation? | Most likely: **FutureContributions** uses `locationState?.contributionPct` while `locationState` is **undefined**, so when context is briefly or incorrectly 0, `contributionPct` becomes 0 and the page shows “set contribution” instead of the main flow. After refresh, draft hydrates state so the fallback is not needed. |
| Why does Back sometimes go to Plans? | **Back** from Future Contributions is **history-based** (`navigate(-1)`). If the user didn’t come from Contribution, Back can go to Plans or elsewhere. **Guard** also sends users to **/enrollment/plans** when plan is missing, which can look like “Back” behavior. |
| Provider duplication? | **No.** |
| Redirect loops? | **None** identified. |
| State hydration timing wrong? | **No.** Render is blocked until `isInitialized`; hydration runs once. The issue is the **invalid fallback** (`locationState`) in FutureContributions, not initialization order. |

---

*End of audit. No code was modified.*
