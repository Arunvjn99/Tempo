# Full System Audit — US Retirement Participant Portal

**Classification:** Principal Engineer + Staff Product Designer  
**Scope:** Application architecture, user flows, UI system, AI/voice, performance, technical debt, design system extraction, product strategy, prioritized roadmap  
**Standard:** Enterprise / Series A scrutiny; production for US retirement clients  

---

## 1. APPLICATION ARCHITECTURE AUDIT

### 1.1 Project Folder Structure

**Current state:** Domain-sliced under `src/` with `components/` by feature (ai, auth, brand, dashboard, enrollment, core-ai, voice, ui, layout, pre-enrollment), `pages/`, `context/`, `enrollment/` (context + logic + types), `layouts/`, `services/`, `lib/`, `theme/`, `locales/`, `bella/`, `agent/`, `features/`.

| Issue | Severity | Why it's a problem | Recommended improvement |
|-------|----------|--------------------|-------------------------|
| **`bella/` and `core-ai/` both do AI/voice** | High | Two parallel AI surfaces (BellaScreen full-page vs CoreAssistantModal); confusion over which is canonical; Bella not routed. | Pick one primary AI surface. Either route Bella at e.g. `/voice` and deprecate modal, or remove Bella and consolidate in Core AI. |
| **Enrollment logic split across `enrollment/`, `components/enrollment/`, `pages/enrollment/`** | Medium | Wizard state in context, draft in store, steps as pages; navigation and “engine” live in layout + footer. No single enrollment orchestrator. | Introduce an enrollment engine module (e.g. `enrollment/engine.ts`) that owns step order, validation, and transitions; pages become views. |
| **`app/routes.tsx` vs `app/router.tsx`** | Low | Legacy `<Routes>` file exists; only `router.tsx` (createBrowserRouter) is used. Dead code. | Delete `app/routes.tsx` or document as legacy; avoid duplicate route definitions. |
| **Multiple stepper components** | Medium | `EnrollmentStepper`, `EnrollmentHeaderWithStepper`, `HeaderStepper`, `CustomStepper`; enrollment uses HeaderWithStepper → EnrollmentStepper; transactions reuse EnrollmentStepper with different titles. | Centralize to one `<ProgressStepper />` with variants (enrollment steps vs transaction steps); deprecate duplicates. |

### 1.2 Routing Structure

- **Mechanism:** React Router v6+ `createBrowserRouter`; root element is `RootLayout`; `Outlet` for children.
- **Enrollment:** `/enrollment` has layout + index (`EnrollmentManagement`) and step children: `choose-plan`, `contribution`, `future-contributions`, `investments`, `review`. Step order is duplicated in `ENROLLMENT_STEP_PATHS` and in `EnrollmentFooter` switch (hardcoded paths).

| Issue | Severity | Why it's a problem | Recommended improvement |
|-------|----------|--------------------|-------------------------|
| **Step order defined in two places** | High | Adding/removing/reordering steps requires editing both EnrollmentLayout and EnrollmentFooter; easy to desync. | Single source of truth: e.g. `enrollmentStepRoutes` array (path, labelKey, order); layout and footer consume it. |
| **No `/voice` or full-page AI route** | Medium | BellaScreen (full conversational UI) is never mounted; voice-first flow is inaccessible. | Add route (e.g. `/voice` or `/assistant`) and gate by feature flag if needed. |
| **Demo route unprotected** | Low | `/demo` has no ProtectedRoute; demo state can coexist with real auth; “Dashboard” link switches to /demo when demo user set. | Document intended behavior; consider clearing demo on real login or clearly separating demo vs prod. |

### 1.3 State Management Pattern

- **No Redux/Zustand.** React Context everywhere: AuthContext, UserContext, OtpContext, ThemeContext, AISettingsContext, CoreAIModalContext, NetworkContext, EnrollmentContext, InvestmentContext.
- **Enrollment draft:** `enrollmentDraftStore.ts` is sessionStorage helpers, not a store. EnrollmentLayout loads draft once and seeds EnrollmentProvider.

| Issue | Severity | Why it's a problem | Recommended improvement |
|-------|----------|--------------------|-------------------------|
| **EnrollmentContext holds 20+ fields and many setters** | High | Any state change re-renders all consumers; no selectors; heavy pages (Contribution, Review) re-render on unrelated updates. | Split into smaller contexts (e.g. PlanSelection, Contribution, Assumptions) or move to Zustand with selectors so only subscribers to changed slice re-render. |
| **OtpContext persisted in sessionStorage** | Medium | OTP “verified” survives tab close; combined with Supabase session can create confusing security model. | Align with product: either short-lived (e.g. in-memory until refresh) or document as intentional “session verified” and ensure logout clears it. |
| **Draft and context can diverge** | Medium | Draft is saved on “Save & Exit” via `getDraftSnapshot` from each step; if a step doesn’t provide a complete snapshot, data can be lost or stale. | Define a single `EnrollmentDraft` schema and one `getDraftFromContext()` in enrollment context; steps don’t supply partial snapshots. |
| **No global loading/error boundary for data** | Medium | UserContext fetches profile + company; failures set null but no retry or inline error UI in header. | Add error state and retry in UserProvider; optional small header banner or fallback logo when company fails. |

### 1.4 Enrollment Engine Logic

- **Flow:** Steps are URL-driven; EnrollmentLayout wraps step routes with DashboardLayout + EnrollmentHeaderWithStepper; EnrollmentFooter does back/next/save-and-exit with hardcoded paths.
- **Contribution math:** `enrollment/logic/contributionCalculator` + `deriveContribution` in context; `paychecksPerYear: 26` hardcoded in EnrollmentContext.
- **Plan selection:** ChoosePlan currently uses hardcoded plan + `getPlanRecommendation`; PlansPage/PlanCard/PlanRail can use API (`plansService.fetchPlansByCompanyId`). Inconsistent: one path uses API, one uses mock.

| Issue | Severity | Why it's a problem | Recommended improvement |
|-------|----------|--------------------|-------------------------|
| **No single enrollment “engine”** | High | Validation, step eligibility, and “can proceed” live in each page; no central place to enforce rules (e.g. “investments step requires allocation sum = 100%”). | Enrollment engine module: `canProceed(step)`, `getNextStep()`, `getPrevStep()`; pages call engine; footer uses engine for back/next. |
| **ChoosePlan hardcodes one plan** | Critical | User always sees same Roth 401(k) card; no real plan list from API; `setSelectedPlan("roth_401k")` and navigate to contribution. | Use `plansService.fetchPlansByCompanyId(user.company_id)` and render PlanRail/PlanCard from API; remove hardcoded plan object. |
| **paychecksPerYear = 26** | Low | Assumption not configurable per company/pay schedule. | Move to company or user profile; default 26; allow override in assumptions. |
| **Enrollment API only saves plan ID** | High | `enrollmentService.saveEnrollmentPlanId(planId)` upserts enrollments with status `in_progress`; contribution/allocation/investments not persisted to backend on step progression. | Backend: extend enrollments or add enrollment_snapshots table; save contribution + allocation at each step or on Save & Exit so draft is server-side too. |

### 1.5 AI Integration Flow

- **Core AI:** CoreAIFab → CoreAIModalContext → CoreAssistantModal. Modal uses flowRouter (enrollment, loan, withdrawal, vesting); intent detection → scripted flows or general AI via `sendCoreAIMessage` to `/api/core-ai` with JWT.
- **Voice:** useSpeechRecognition (browser API) and useTextToSpeech (optional backend); transcript submitted as message.
- **Bella:** Full-page BellaScreen with its own speech and TTS; not in router.

| Issue | Severity | Why it's a problem | Recommended improvement |
|-------|----------|--------------------|-------------------------|
| **AI enrollment flow does not sync with EnrollmentContext** | Critical | enrollmentFlow uses bella/agents/planEnrollmentAgent state; user can “enroll via chat” but main app wizard state is unchanged; two sources of truth. | Either: (1) AI flow only explains/guides and drives navigation + context updates, or (2) AI flow writes to same EnrollmentContext/API so modal and wizard stay in sync. |
| **Core AI backend fallback is generic message** | Medium | On network/API error, user sees “Core AI is temporarily unavailable”; no retry, no offline cue. | Add retry (e.g. 1–2 with backoff) and optional “Try again” button; consider offline message. |
| **Bella not routed** | High | Full voice experience is dead code for normal users. | Route Bella or remove it; avoid maintaining two AI UIs. |
| **useEnrollmentSafe() with require()** | Medium | CoreAssistantModal dynamically requires EnrollmentContext; works but is fragile and hides dependency. | Use normal import and optional context (e.g. `useContext(EnrollmentContext)` with null check) or ensure modal only renders inside enrollment when needed. |

### 1.6 Auth Flow

- **Supabase** for session; **ProtectedRoute** requires user + OtpContext.isOtpVerified; otherwise redirect to `/` or `/verify?mode=login`.
- **Login** → `/verify?mode=login` → after OTP → `/dashboard`. Session from `onAuthStateChange` and `getSession()`.

| Issue | Severity | Why it's a problem | Recommended improvement |
|-------|----------|--------------------|-------------------------|
| **ProtectedRoute renders null while loading** | Medium | Blank screen until auth resolves; can feel like broken app. | Show a minimal loading shell (e.g. logo + spinner) instead of null. |
| **OTP and session lifetime not documented** | Low | Security and UX expectations unclear. | Document: session refresh, OTP persistence, and logout behavior; align with compliance. |
| **Company logo fetch on login by domain** | Low | Optional; failure only logs. | Keep optional; ensure no PII in logs in production. |

### 1.7 Data Fetching Approach

- **Supabase** direct from client: AuthContext, UserContext (profiles, companies), plansService, enrollmentService, companyBrandingService, feedback insert.
- **Core AI:** fetch to `/api/core-ai` (backend with JWT).
- **No React Query/SWR:** Each provider does its own useEffect + setState; no shared cache, deduping, or retry.

| Issue | Severity | Why it's a problem | Recommended improvement |
|-------|----------|--------------------|-------------------------|
| **No request deduplication** | Medium | Multiple components can trigger same Supabase query (e.g. company) on same screen. | Introduce a small data layer (React Query or SWR) for profiles, company, plans; single source and cache. |
| **Over-fetching in UserContext** | Low | Fetches full company row including branding_json; not all pages need it. | Split: minimal company (id, name, logo_url) for header; full branding when theme/settings need it. |
| **Plans fetched per screen** | Medium | Plans fetched where needed (e.g. PlansPage) but not shared with ChoosePlan; ChoosePlan doesn’t use API. | Unify: fetch plans once (e.g. in EnrollmentLayout or a plan cache) and pass down; use in both list and choose-plan. |

### 1.8 Component Hierarchy & Separation of Concerns

- **Layouts:** RootLayout → Outlet; EnrollmentLayout → EnrollmentProvider → EnrollmentStepLayout → DashboardLayout (for steps) or bare Outlet.
- **Enrollment steps:** Each step page (ChoosePlan, Contribution, etc.) owns its UI and calls useEnrollment; footer receives onPrimary and summary from page. Business logic (e.g. contribution math) in enrollment/logic; context holds state.

| Issue | Severity | Why it's a problem | Recommended improvement |
|-------|----------|--------------------|-------------------------|
| **Footer knows step index and paths** | High | EnrollmentFooter switch(step) with navigate(...); couples footer to route structure. | Footer receives `onBack` and `onNext` (or just `onPrimary`) from layout or engine; layout derives from step config. |
| **Heavy inline styles in places** | Medium | Review.tsx and others use `style={{ color: "var(--enroll-text-primary)" }}` and cardStyle objects; harder to theme and audit. | Prefer Tailwind + design tokens (e.g. `text-[var(--enroll-text-primary)]`) or shared class names; avoid inline style objects for tokens. |
| **Business logic in UI** | Medium | e.g. formatCurrency, getRiskColor, ASSET_CLASS_KEYS in Review.tsx; should live in shared utils or enrollment/logic. | Move formatters and constants to `enrollment/logic` or `lib/format`; keep pages thin. |

---

## 2. USER FLOW AUDIT (END-TO-END)

### 2.1 Authentication

| Aspect | Finding | Flow health |
|--------|--------|-------------|
| **Broken transitions** | Login → verify → dashboard is clear; Forgot password and Signup are separate; no “remember me” or SSO visible. | — |
| **Duplicated logic** | Auth layout and input styling (AuthInput vs Input) differ; OTP and session checks only in ProtectedRoute. | — |
| **UX friction** | No inline validation before submit; error only after “Logging in…”; demo panel is custom overlay (no focus trap, no Escape). | — |
| **Emotional flat zones** | Post-OTP jump straight to PreEnrollment; no short “Welcome back” moment. | — |
| **Missing feedback** | Loading = null in ProtectedRoute; no skeleton on login. | — |
| **Unclear CTAs** | Primary CTA is clear; “Explore demo scenarios” can distract from main login. | — |
| **Abandonment risk** | OTP step adds friction; no visible “Resend code” timing or retry limit. | — |

**Flow health score: 6/10** — Works but feels utilitarian; demo and OTP need polish.

### 2.2 Pre-enrollment

| Aspect | Finding |
|--------|--------|
| **Broken transitions** | HeroSection CTAs → “Start enrollment” opens PersonalizePlanModal; “Explore options” and nav to Retirement Plan → /enrollment (EnrollmentManagement). Entry to wizard can be via modal completion or “Enroll” on eligible plan. |
| **Duplicated logic** | Hero and dashboard classic both have “Start enrollment”; modal vs direct to choose-plan is two paths. |
| **UX friction** | No single “Start here” for first-time users; Learning and Advisor sections are passive. |
| **Emotional flat zones** | Hero is generic “build your future”; no personalization (e.g. name) until deeper in flow. |
| **Missing feedback** | Skeleton components exist (HeroSkeleton, LearningSkeleton, AdvisorSkeleton); good. |
| **Abandonment risk** | Low; pre-enrollment is low-commitment. |

**Flow health score: 7/10** — Coherent but entry points could be simpler and more guided.

### 2.3 Enrollment Wizard (Manual)

| Aspect | Finding |
|--------|--------|
| **Broken transitions** | Back button in footer uses hardcoded paths; if step order changes, back can be wrong. ChoosePlan “Continue” sets plan and navigates to contribution; no guard that plan is actually selected when API-driven. |
| **Duplicated logic** | Step index derived from path in layout; footer also has step-based switch; draft save logic per step via getDraftSnapshot. |
| **UX friction** | Contribution step is dense (slider, %, source allocation, presets); no progressive disclosure. Investments step: “total 100%” message in footer, not always prominent. |
| **Emotional flat zones** | Stepper is functional; no celebration on step completion; review is summary-heavy, not “you’re almost there” framing. |
| **Missing feedback** | No “Step 2 of 5” in header; no estimated time; saving draft shows toast (ENROLLMENT_SAVED_TOAST_KEY) but no inline “Saving…” on Save & Exit. |
| **Unclear CTAs** | Primary CTA label changes per step; “Continue” vs “Review” vs “Submit” is clear; “Save & Exit” is clear. |
| **Abandonment risk** | High on Contribution (complexity) and Investments (allocation confusion); Save & Exit helps but server-side draft would reduce loss. |

**Flow health score: 6/10** — Linear and restorable, but dense steps and duplicate step logic hurt.

### 2.4 Plan Selection

| Aspect | Finding |
|--------|--------|
| **Broken transitions** | ChoosePlan hardcodes one plan and always navigates to contribution with roth_401k; PlansPage and PlanRail exist for multi-plan but aren’t used in main ChoosePlan. |
| **Duplicated logic** | Plan recommendation (getPlanRecommendation) used in ChoosePlan; PlanCard/PlanRail used elsewhere; two ways to “choose” a plan. |
| **UX friction** | User cannot actually choose another plan on the main wizard path; “Learn more” and “Ask AI” are good. |
| **Abandonment risk** | Low if only one plan; medium if we expose multiple and don’t guide. |

**Flow health score: 4/10** — Current ChoosePlan is a single-plan stub; real plan selection exists in code but not wired.

### 2.5 Contribution Selection

| Aspect | Finding |
|--------|--------|
| **Broken transitions** | Contribution → future-contributions → investments; footer and validation per step. |
| **Duplicated logic** | deriveContribution in context; PAYCHECKS_PER_YEAR in Contribution page and 26 in context. |
| **UX friction** | Slider + toggle + source allocation + employer match; no short tooltip or “Why this matters.” |
| **Missing feedback** | Per-paycheck and monthly summary help; no “match maximized” or “recommended” badge. |

**Flow health score: 6/10** — Powerful but dense; needs progressive disclosure and one source for pay frequency.

### 2.6 Investment Election (Default / Manual / Advisor)

| Aspect | Finding |
|--------|--------|
| **Broken transitions** | EnrollmentInvestmentsGuard → EnrollmentInvestmentsContent with InvestmentProvider; allocation must sum to 100%; footer shows error. |
| **Duplicated logic** | InvestmentContext used in enrollment and standalone /investments; different entry points, same allocation logic. |
| **UX friction** | 100% rule can be unclear; no “Recommended” or “One-click” default allocation. |
| **Abandonment risk** | Medium; users can get stuck on allocation. |

**Flow health score: 6/10** — Guard and context are correct; UX and defaults need work.

### 2.7 Review Step

| Aspect | Finding |
|--------|--------|
| **Broken transitions** | Submit → SuccessEnrollmentModal → FeedbackModal; then redirect (implementation-dependent). |
| **Duplicated logic** | Summary built from EnrollmentContext + InvestmentContext; large inline helpers (formatCurrency, getRiskColor, ASSET_CLASS_KEYS) in Review.tsx. |
| **Emotional flat zones** | Success modal exists but no confetti or strong “You’re all set”; transition to dashboard could be clearer. |
| **Missing feedback** | Submit loading state; no “Submitting…” on button. |

**Flow health score: 7/10** — Review is comprehensive; success moment and submit feedback can be stronger.

### 2.8 Post-Enrollment Dashboard

| Aspect | Finding |
|--------|--------|
| **Broken transitions** | After enrollment completion, user can land on /dashboard/post-enrollment or /enrollment; not fully consistent. |
| **UX friction** | PostEnrollmentTopBanner and cards; nav still shows “Retirement Plan” to /enrollment (management). |
| **Flow health score** | 6/10 — Functional; post-enrollment “home” could be more clearly the default. |

### 2.9 Voice AI Full Enrollment Flow

| Aspect | Finding |
|--------|--------|
| **Broken transitions** | Core AI enrollment flow runs inside modal with planEnrollmentAgent; it does not update EnrollmentContext or navigate the main wizard. Completing “enrollment” in chat does not persist to app state. |
| **Duplicated logic** | Full enrollment logic duplicated in bella/agents/planEnrollmentAgent vs enrollment/context + pages. |
| **State syncing** | Voice/manual state not synced; two parallel enrollment experiences. |
| **Abandonment risk** | High if user believes they enrolled via voice but app shows no enrollment. |

**Flow health score: 3/10** — Voice flow is a demo only; not production-ready without sync to main app.

### 2.10 Quick Actions (Loan, Withdrawal, Rollover, Rebalance, Transfer)

| Aspect | Finding |
|--------|--------|
| **Transitions** | Transaction hub and TransactionApplicationRouter; loan/withdrawal/vesting flows in Core AI and in transaction apps. |
| **Duplicated logic** | Scripted flows in core-ai (loanFlow, withdrawalFlow, vestingFlow) vs transaction application steps. |
| **Flow health score** | 6/10 — Multiple entry points; need single source of truth for “what’s available” and “what’s in progress.” |

---

## 3. UI SYSTEM AUDIT (Premium SaaS Standard)

### 3.1 Typography Scale

- **Issue:** No single type scale documented; ad-hoc `text-sm`, `text-lg`, `text-xl`, `text-2xl`; global `h1` at 3.2em is too large for many screens.
- **Recommendation:** Define a type scale (e.g. text-xs → display-xl) in Tailwind and tokens; map heading levels to tokens.

### 3.2 Spacing System

- **Tokens:** `--spacing-1` through `--spacing-20` exist; many components use raw Tailwind (gap-2, gap-4, mb-6) leading to inconsistency.
- **Recommendation:** Prefer spacing tokens or Tailwind spacing scale consistently; document “card padding,” “section gap,” etc.

### 3.3 Button Hierarchy

- **Issue:** Single `Button` component; no variant (primary/secondary/ghost/danger) or size; secondary actions styled ad hoc (e.g. enrollment footer back/save-exit use same Button with different classes).
- **Recommendation:** Add `variant` and `size` to Button; introduce `<PrimaryCTA />`, `<SecondaryButton />` in design system.

### 3.4 Color Usage

- **Issue:** Two systems: legacy (`--color-background`, `--color-text`) and semantic (`--surface-1`, `--text-primary`, `--enroll-*`); enrollment uses `--enroll-brand` (indigo) vs global `--color-primary` (blue); components mix them.
- **Recommendation:** Unify on one semantic set; map enrollment to global primary or document “enrollment theme” as intentional sub-theme.

### 3.5 Depth System (Shadows, Layering)

- **Strengths:** `--shadow-sm` to `--shadow-xl`; `--enroll-elevation-1/2/3`; `.elevation-1/2/3` in index.css.
- **Issue:** Some cards use Tailwind shadow-2xl; others use token; modal uses --surface-1.
- **Recommendation:** Standardize cards and modals on elevation tokens; avoid one-off shadow classes.

### 3.6 Border Radius

- **Tokens:** `--radius-xs` to `--radius-full`; `--enroll-card-radius: 16px`; Heroui tokens.
- **Issue:** Mixed usage (rounded-lg, rounded-xl, rounded-2xl, var(--enroll-card-radius)); personalize-plan-slider uses hardcoded values.
- **Recommendation:** Use radius tokens everywhere; one “card radius” token for all cards.

### 3.7 Component Padding & Card Consistency

- **Issue:** Multiple card patterns (DashboardCard, enrollment cardStyle object, PlanSelectionCard); padding and borders differ.
- **Recommendation:** Single `<Card />` or `<PremiumCard />` with consistent padding and border from tokens.

### 3.8 Modal Consistency

- **Issue:** Shared Modal has focus trap and Escape; Login demo panel is custom overlay (no focus trap, no aria-label); AdvisorBookingModal and others may have their own overlay patterns.
- **Recommendation:** All overlays as Modal or a Modal-based wrapper; ensure aria-label/aria-labelledby on every dialog.

### 3.9 CTA Alignment & Header Hierarchy

- **Issue:** Core product logo (CORE) vs client logo (company.logo_url) both in header; branding.ts has core logo; UserContext provides company logo. Hierarchy (which is primary) depends on implementation.
- **Recommendation:** Define and document: “Core product identity” vs “Client (company) identity”; align CTAs (primary = one style, secondary = outline/ghost).

### 3.10 Visual Density & Accessibility

- **Issue:** Some forms dense (Contribution); secondary text contrast borderline (e.g. #6b7280 on white); `--color-textSecondary` typo (should be `--color-text-secondary`) can break theme.
- **Recommendation:** Audit contrast (WCAG AA); fix variable name; consider “compact” vs “comfortable” density mode.

### 3.11 Emotional Tone (Fintech Premium vs Generic)

- **Issue:** Mix of generic gradients and solid tokens; hero is “build your future”; some screens feel MVP (ChoosePlan single plan, dense Contribution).
- **Recommendation:** Introduce subtle motion (already using Framer Motion in places), clearer hierarchy, and one “premium” card/CTA pattern used consistently.

### Summary: Repeated UI Inconsistencies

- Two color systems (legacy + semantic); enrollment vs global primary.
- Button: no variants; secondary implemented ad hoc.
- Cards: multiple patterns; no single Card API.
- Modals: shared Modal vs custom overlays (demo, advisor).
- Spacing and radius: tokens exist but not consistently applied.
- Typography: no enforced scale; h1 too large.

### Design System Drift

- Enrollment uses `--enroll-*`; dashboard uses `--color-*` and `.elevation-*`; auth uses `--auth-*`. Three “sub-themes” without a single design-system doc.

### Components to Centralize

- Card (all card-like surfaces).
- Button variants (primary, secondary, ghost, danger) and sizes.
- Section header (title + subtitle + optional action).
- Progress stepper (single component, enrollment + transaction variants).
- Empty state (icon + title + description + CTA).
- Loading/skeleton (lists, cards, forms).

### Areas That Feel MVP vs Premium Fintech

- ChoosePlan: single hardcoded plan.
- Contribution: overwhelming controls without guidance.
- Login: no skeleton; null loading in ProtectedRoute.
- Success moment: could be more celebratory.
- No global “command center” feel (despite transaction hub naming).

**Overall UI maturity score: 5/10** — Tokens and some patterns exist; consistency, hierarchy, and premium feel need work.

---

## 4. AI + VOICE SYSTEM AUDIT

### 4.1 CoreAssistantModal (Primary Voice Surface)

- **Structure:** Modal with MessageList, MessageInput, useSpeechRecognition, useTextToSpeech; flowStateRef holds active scripted flow; handleSend runs flowRouter then general AI (sendCoreAIMessage).
- **Input bar:** MessageInput with text + mic; mic triggers speech recognition; transcript sent as message.

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| **Flow state in ref** | Medium | flowStateRef is correct to avoid re-renders; ensure no stale closures when respond() is called from interactive components. |
| **initialPrompt and onInitialPromptSent** | Low | Used for “Ask AI about this plan”; clear when sent; good. |
| **User context for general AI** | Good | userContext (isEnrolled, isInEnrollmentFlow, currentRoute, selectedPlan, contributionAmount) passed to backend; improves relevance. |

### 4.2 Input Bar Architecture

- **MessageInput:** Single component; voice is “click mic to speak”; no separate “voice mode” vs “text mode” in UI.
- **Recommendation:** Keep unified input; ensure mic state (listening/error) is clearly visible and accessible.

### 4.3 AI API Call Pipeline

- **sendCoreAIMessage(message, context, accessToken)** → POST /api/core-ai with JWT.
- **On error:** catch returns fallback message; console.warn in production.
- **No retry:** Single attempt.

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| **No retry** | Medium | Add 1–2 retries with backoff; “Try again” button on failure. |
| **Token handling** | Good | Session from useAuth(); token passed explicitly; no token in logs. |
| **Filtered/fallback** | Good | Response has filtered and isFallback; UI can adapt. |

### 4.4 Error Handling

- **Modal:** Error message shown in chat (fallback reply).
- **Speech:** useSpeechRecognition and useTextToSpeech have DEV console warnings; no user-visible “mic failed” or “TTS failed” in modal.
- **Recommendation:** Surface “Couldn’t start microphone” or “Voice playback failed” with retry where applicable.

### 4.5 State Syncing (Voice vs Manual)

- **Critical:** AI enrollment flow (planEnrollmentAgent) does not write to EnrollmentContext or enrollment API. Completing enrollment in chat does not update app state or persist.
- **Recommendation:** Either (1) make AI flow drive context + API (single source of truth), or (2) make AI flow “guide only” and navigate user to wizard with pre-filled suggestions.

### 4.6 AI Mirroring Manual Logic

- **Current:** enrollmentFlow uses bella/agents/planEnrollmentAgent (separate state machine and steps); manual flow uses EnrollmentContext + pages. Logic is not shared (e.g. contribution math, plan options).
- **Recommendation:** Shared business rules (e.g. contributionCalculator, plan eligibility) in one module; AI flow and wizard both consume.

### 4.7 Security & Race Conditions

- **Security:** JWT sent to /api/core-ai; no sensitive data in client context beyond what’s needed. PII in messages is a backend responsibility.
- **Race conditions:** If user sends multiple messages quickly, flowStateRef and message order must stay consistent; handleSend should serialize or disable send while loading.
- **Recommendation:** Disable input (and mic) while isLoading; queue or ignore rapid double-sends.

### 4.8 Token Handling & Retry

- **Token:** Passed from session; not stored in component state.
- **Retry:** None on API or TTS; add for API and optional for TTS.

### Summary: Technical Fragility

- **Fragility:** AI enrollment and manual enrollment are two code paths; easy for them to diverge.
- **Redundant API calls:** Each Core AI message is one request; no batching (acceptable for chat).
- **Tight coupling:** Modal depends on flowRouter, enrollmentFlow, loanFlow, etc.; flowRouter imports all flow handlers.
- **Modularize:** Extract “flow runner” interface; each flow (enrollment, loan, etc.) implements same interface; intent detection and flow start/continue in one place.

---

## 5. PERFORMANCE & SCALABILITY REVIEW

| Risk | Finding | Recommendation |
|------|--------|----------------|
| **Large re-renders** | EnrollmentContext value is one object; any setState updates the whole value and re-renders all useEnrollment consumers (ChoosePlan, Contribution, Review, etc.). | Split context or use Zustand with selectors. |
| **Unmemoized heavy logic** | deriveContribution is in useMemo with correct deps; Review has many inline helpers (formatCurrency, getRiskColor) called in render. | Memoize derived data per section or move to useMemo. |
| **Unnecessary context usage** | Many components use useEnrollment or useUser when they only need one field. | Selectors or split contexts so components subscribe to minimal state. |
| **Hydration** | React 19 + Vite; no obvious SSR; hydration N/A for current SPA. | If moving to SSR, audit theme and session on first paint. |
| **Supabase usage** | Direct client calls; no request caching. | Add React Query or SWR for profiles, company, plans. |
| **Over-fetching** | UserContext fetches full company with branding_json on every load. | Split minimal company vs full branding. |
| **Blocking in render** | No heavy sync work in render; Framer Motion and RAF used for animation. | Keep logic in useMemo/useCallback. |
| **Bundle bloat** | MUI, Emotion, Framer Motion, Recharts, i18n, Supabase; multiple entry points (Bella, core-ai flows). | Audit imports; lazy-load routes and heavy flows (e.g. enrollmentFlow, Bella). |

**Performance risk level: Medium** — Main risks are context-driven re-renders and lack of request caching; no critical blocking work in render.

---

## 6. TECHNICAL DEBT REPORT

| Category | Examples |
|----------|----------|
| **Hardcoded values** | FALLBACK_AGE 30, FALLBACK_RETIREMENT_AGE 65, FALLBACK_SALARY 50000 (ChoosePlan); paychecksPerYear 26 (EnrollmentContext); PAYCHECKS_PER_YEAR in Contribution; max 75, step 1, default 6 in enrollmentFlow AmountSlider. |
| **Magic numbers** | 600px and 1024px in EnrollmentHeaderWithStepper (useCompactStepper, useDesktopStepper); padding 20, 32, 56 in Review chart; 0.08, 0.12 stagger in HeroSection. |
| **Repeated logic** | formatCurrency in multiple files; step path arrays and back navigation in footer; ASSET_CLASS_KEYS and risk formatting in Review. |
| **Poor naming** | cardStyle object in Review; NAV_BTN_BASE / NAV_BTN_PRIMARY in enrollment footer (if present); getDraftSnapshot naming (could be getEnrollmentDraftSnapshot). |
| **Inconsistent patterns** | AuthInput vs Input; EnrollmentFooter Button vs raw button in inline variant; Modal vs custom overlays. |
| **Dead files** | app/routes.tsx (legacy Routes); BellaScreen not routed; HeaderStepper and CustomStepper may be unused or redundant with EnrollmentStepper. |
| **Temporary hacks** | useEnrollmentSafe with require(); flowStateRef + respond callback injection in enrollmentFlow. |
| **Console logs in prod** | Many `if (import.meta.env.DEV) console.*` (acceptable); some unconditional: UserContext “[logo-audit]”, Signup “US_STATES first item”, useDemoUser “Active Demo Persona”, BellaScreen and useTextToSpeech many logs, companyBrandingService console.error, RouteErrorBoundary console.error, coreAiService console.warn. Remove or gate all non-DEV logs; use proper logger for errors. |

---

## 7. DESIGN SYSTEM EXTRACTION POTENTIAL

### 7.1 Components to Introduce

| Component | Source / rationale |
|-----------|--------------------|
| **&lt;PremiumCard /&gt;** | Unify PlanCard, PlanSelectionCard, dashboard cards, Review cards; one API: title, subtitle, children, variant (elevated/outline), padding. |
| **&lt;SectionHeader /&gt;** | “Your plan”, “Contribution”, “Review” patterns: title (h1/h2), optional subtitle, optional action; consistent spacing and typography. |
| **&lt;PrimaryCTA /&gt;** | Primary button with loading state, size (md/lg), fullWidth option; replace ad-hoc “Continue”/“Submit” styling. |
| **&lt;ProgressStepper /&gt;** | Single component; steps array (label, optional status); compact/desktop; used by EnrollmentHeaderWithStepper and transaction flows. |
| **&lt;FinancialMetricCard /&gt;** | Summary blocks (monthly contribution, estimated balance, per paycheck); icon + label + value + optional trend; used in Review and Contribution. |
| **&lt;GamifiedProgressRing /&gt;** | If desired for “match maximized” or “on track” visuals; not present today but fits fintech premium. |

### 7.2 What to Abstract

- **Contribution controls:** Slider + percentage/dollar toggle + presets as a single &lt;ContributionInput /&gt; with validation and accessibility.
- **Source allocation:** Pre-tax/Roth/after-tax editor as &lt;SourceAllocationEditor /&gt; (used in Contribution and possibly Review).
- **Empty state:** Icon + title + description + CTA as &lt;EmptyState /&gt; (transactions, plans list, etc.).
- **Loading:** &lt;PageSkeleton /&gt; and &lt;CardSkeleton /&gt; for consistent loading UX.

### 7.3 What to Tokenize

- **Button:** primary/secondary/ghost/danger; sm/md/lg.
- **Card:** padding, radius, border, shadow (elevation-1/2/3).
- **Input:** height, border, focus ring, error state.
- **Section spacing:** section gap, card gap, header margin-bottom.
- **Typography:** heading levels and body scale; map to existing or new tokens.

---

## 8. PRODUCT STRATEGY ALIGNMENT

**Current feel: B) Mid-level SaaS with pockets of MVP and pockets of premium.**

**Why:**

- **MVP-like:** ChoosePlan is a single hardcoded plan; enrollment via AI does not persist; Bella is unreachable; some flows (e.g. plan selection) are stubbed or split between API and mock.
- **Mid-level SaaS:** Routing, auth, enrollment wizard, transaction hub, and Core AI exist and are structured; design tokens and layouts are in place; i18n and theme support are present.
- **Premium fintech gaps:** No single design system doc; button/card hierarchy inconsistent; success and emotional moments underplayed; voice and main app state not aligned; no “premium” narrative (e.g. progress ring, match maximizer, “you’re on track”).

To reach **C) Premium fintech-grade retirement platform:** unify plan selection with API, sync AI and manual enrollment state, consolidate UI to a clear design system, add one or two signature “premium” moments (e.g. post-enrollment celebration, match meter), and remove or route Bella and clean technical debt (logs, dead code, duplicate steppers).

---

## 9. PRIORITIZED FIX ROADMAP

### Top 10 Critical Improvements

1. **Wire ChoosePlan to real plans API** — Use plansService.fetchPlansByCompanyId; render PlanRail/PlanCard from API; remove hardcoded plan and always-set roth_401k.
2. **Sync AI enrollment flow with app state** — Either have AI flow write to EnrollmentContext/API or make it “guide only” and open wizard with suggestions; document and implement one model.
3. **Single source of truth for enrollment step order** — Define enrollmentStepRoutes (path, labelKey, order); use in EnrollmentLayout and EnrollmentFooter; remove duplicated paths and switch(step).
4. **Persist full enrollment draft server-side** — Extend enrollment API to save contribution + allocation (and optionally investments) on step or Save & Exit; reduce data loss risk.
5. **Fix production console usage** — Remove or gate all non-DEV console.log/warn/error; use a logger for errors; keep DEV-only diagnostics behind import.meta.env.DEV.
6. **ProtectedRoute loading state** — Show minimal loading shell (logo + spinner) instead of null while auth is loading.
7. **Enrollment engine module** — canProceed(step), getNextStep(), getPrevStep(); validation and navigation in one place; footer and layout consume it.
8. **Split or optimize EnrollmentContext** — Reduce re-renders (smaller contexts or Zustand with selectors) so Contribution and Review don’t re-render on unrelated updates.
9. **Route or remove Bella** — Either add /voice (or /assistant) and use Bella, or remove it and rely on Core AI modal only.
10. **One ProgressStepper component** — Replace EnrollmentStepper, EnrollmentHeaderWithStepper, HeaderStepper, CustomStepper with a single configurable ProgressStepper used by enrollment and transactions.

### Top 10 UI Upgrades

1. **Button variants and sizes** — Primary, secondary, ghost, danger; sm/md/lg; use everywhere (footer, auth, dashboard).
2. **Unify color system** — Single semantic set (e.g. surface, text, primary, success, danger); map enrollment and auth to it or document sub-themes.
3. **Single Card component** — PremiumCard or Card with tokens; replace cardStyle objects and ad-hoc card markup.
4. **SectionHeader component** — Consistent title + subtitle + optional action across enrollment and dashboard.
5. **Type scale** — Document and apply text-xs → display; fix global h1; use scale in SectionHeader and cards.
6. **Modal consistency** — All overlays via Modal (or Modal-based wrapper); demo panel and advisor modals get focus trap and aria-label.
7. **Empty state component** — Reuse across transactions, plans, and other lists.
8. **Spacing and radius consistency** — Prefer design tokens in Tailwind; audit and replace raw gap/margin/rounded-* with token-based classes.
9. **Success moment** — Post-enrollment: confetti or clear “You’re all set” screen and single CTA to dashboard.
10. **Contribution step progressive disclosure** — Collapse “advanced” (source allocation, employer match) or add short “Why this matters” and “Match maximized” cues.

### Top 5 Architectural Refactors

1. **Enrollment engine** — Central module for step order, validation, next/prev, and draft shape; layout and footer depend on it.
2. **Data layer** — React Query or SWR for profiles, company, plans; single cache and request deduping.
3. **Flow router modularization** — Flow runner interface; each flow (enrollment, loan, withdrawal, vesting) implements same contract; intent detection and routing in one place.
4. **Draft from context only** — Single getDraftFromContext() in EnrollmentContext; steps don’t supply getDraftSnapshot; Save & Exit always saves from context.
5. **Plan data** — Fetch plans once (e.g. in EnrollmentLayout or plan cache); pass to ChoosePlan and PlansPage; no duplicate fetches or mock in ChoosePlan.

### Top 5 Emotional UX Upgrades

1. **Post-enrollment celebration** — Confetti or strong “You’re all set” with one clear next step.
2. **Stepper progress** — “Step 2 of 5” and optional “About 3 min left” in enrollment header.
3. **Match maximized / recommended** — On Contribution, show when user is at employer match cap or at recommended %.
4. **Welcome back** — Short “Welcome back, {name}” or “Good morning” after login (HeroSection has greeting; ensure it’s visible on first dashboard load).
5. **Success and error feedback** — “Saving…” on Save & Exit; “Submitting…” on Review submit; clear “Couldn’t save” with retry where applicable.

### What to Fix Before Showing Leadership Again

1. **ChoosePlan uses real plans** — No demo with a single hardcoded plan; show at least 2–3 plans from API (or clearly labeled demo data).
2. **No production console noise** — Strip or gate all console.* except in DEV; fix logo-audit and demo persona logs.
3. **ProtectedRoute loading** — Replace null with a small loading shell so the app never looks broken on first load.
4. **One clear “Start enrollment” path** — From PreEnrollment or dashboard classic, one primary CTA that goes to choose-plan (or personalize modal that then goes to choose-plan); document and implement.
5. **AI enrollment vs app** — Either disable “enroll via chat” in production until it syncs with app, or implement sync and document it; avoid “I enrolled in chat but my dashboard doesn’t show it.”

---

*End of audit. Use this document to drive backlog, architecture ADRs, and design system work.*
