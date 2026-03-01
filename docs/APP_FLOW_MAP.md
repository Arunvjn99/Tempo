# Full Application Flow Map
**Participant Portal** — Route structure, user journey, component tree, state/data flow, and API usage.

---

## 1. Route Structure

Every route and its page/component file path (source: `src/app/router.tsx`).

| Path | Component | File path | Protected |
|------|-----------|-----------|-----------|
| `/` | Login | `src/pages/auth/Login.tsx` | No |
| `/verify` | VerifyCode | `src/pages/auth/VerifyCode.tsx` | No |
| `/forgot` | ForgotPassword | `src/pages/auth/ForgotPassword.tsx` | No |
| `/forgot/verify` | ForgotPasswordVerify | `src/pages/auth/ForgotPasswordVerify.tsx` | No |
| `/reset` | ResetPassword | `src/pages/auth/ResetPassword.tsx` | No |
| `/help` | HelpCenter | `src/pages/auth/HelpCenter.tsx` | No |
| `/signup` | Signup | `src/pages/auth/Signup.tsx` | No |
| `/dashboard` | PreEnrollment | `src/pages/dashboard/PreEnrollment.tsx` | Yes |
| `/demo` | DemoDashboard | `src/pages/dashboard/DemoDashboard.tsx` | No |
| `/dashboard/classic` | Dashboard | `src/pages/dashboard/Dashboard.tsx` | Yes |
| `/dashboard/post-enrollment` | PostEnrollmentDashboard | `src/pages/dashboard/PostEnrollmentDashboard.tsx` | Yes |
| `/dashboard/investment-portfolio` | InvestmentPortfolioPage | `src/pages/dashboard/InvestmentPortfolioPage.tsx` | Yes |
| `/profile` | Profile | `src/pages/profile/Profile.tsx` | Yes |
| `/enrollment` | EnrollmentLayout → index: EnrollmentManagement | `src/layouts/EnrollmentLayout.tsx`, `src/pages/enrollment/EnrollmentManagement.tsx` | Yes |
| `/enrollment/manage/:planId` | PlanDetailManagement | `src/pages/enrollment/PlanDetailManagement.tsx` | Yes |
| `/enrollment/choose-plan` | ChoosePlan | `src/pages/enrollment/ChoosePlan.tsx` | Yes |
| `/enrollment/plans` | PlansPage | `src/pages/enrollment/PlansPage.tsx` | Yes |
| `/enrollment/contribution` | Contribution | `src/pages/enrollment/Contribution.tsx` | Yes |
| `/enrollment/future-contributions` | FutureContributions | `src/pages/enrollment/FutureContributions.tsx` | Yes |
| `/enrollment/investments` | EnrollmentInvestmentsGuard → EnrollmentInvestmentsContent | `src/components/enrollment/EnrollmentInvestmentsGuard.tsx`, `EnrollmentInvestmentsContent.tsx` | Yes |
| `/enrollment/review` | EnrollmentReviewContent | `src/components/enrollment/EnrollmentReviewContent.tsx` | Yes |
| `/transactions` | TransactionIntelligenceHub | `src/features/transaction-hub/components/TransactionIntelligenceHub.tsx` | Yes |
| `/transactions/legacy` | TransactionsPage | `src/pages/transactions/TransactionsPage.tsx` | Yes |
| `/transactions/:transactionType/start` | TransactionApplicationRouter | `src/pages/transactions/applications/TransactionApplicationRouter.tsx` | Yes |
| `/transactions/:transactionType/:transactionId` | TransactionApplicationRouter | (same) | Yes |
| `/transactions/:transactionId` | TransactionAnalysis | `src/pages/transactions/TransactionAnalysis.tsx` | Yes |
| `/settings` | SettingsHub | `src/pages/settings/SettingsHub.tsx` | Yes |
| `/settings/theme` | ThemeSettings | `src/pages/settings/ThemeSettings.tsx` | Yes |
| `/investments` | InvestmentProvider → InvestmentsLayout → InvestmentsPage | `src/app/investments/layout.tsx`, `src/app/investments/page.tsx` | Yes |

**Layout hierarchy:** All routes are under `RootLayout` (`src/layouts/RootLayout.tsx`). Protected routes are wrapped by `ProtectedRoute` (`src/components/auth/ProtectedRoute.tsx`). Enrollment routes are wrapped by `EnrollmentLayout`, which provides `EnrollmentProvider` and, for step paths, `DashboardLayout` + `DashboardHeader` + `EnrollmentHeaderWithStepper`.

---

## 2. User Journey

### 2.1 Entry points

| Entry | Path / action | Outcome |
|-------|----------------|---------|
| **Login** | User opens `/` | Renders `Login`; after success → `/verify?mode=login`, then after OTP → `/dashboard`. |
| **Direct link** | User opens a deep link (e.g. `/enrollment/contribution`) | If unauthenticated, `ProtectedRoute` redirects to `/`. If authenticated, renders that page (enrollment steps require `EnrollmentLayout` + draft/context). |
| **Demo mode** | On Login page, user clicks “Explore demo scenarios” → picks a persona | `setDemoUser(persona)`; `navigate("/demo")`. No auth; `DemoDashboard` renders. Nav “Dashboard” later points to `/demo` while demo user is set. |

### 2.2 Auth flow

1. **Login** (`/`) — `Login.tsx`  
   - Fields: email, password.  
   - Actions: Sign in (→ Supabase `signInWithPassword`), Forgot password (→ `/forgot`), Help (→ `/help`), Sign up (→ `/signup`).  
   - On success: `navigate("/verify?mode=login")`.  
   - Optional: company logo by email domain via `supabase.from("companies").select("logo_url")`.

2. **Verify OTP** (`/verify`) — `VerifyCode.tsx`  
   - Mode from query: `mode=login` | etc.  
   - User enters OTP; verification updates session; then redirect to `/dashboard` (or intended destination).  
   - Uses `OtpContext` for verification state.

3. **Forgot password** (`/forgot`) — `ForgotPassword.tsx`  
   - User enters email; reset request sent.  
   - Then `/forgot/verify` for code entry, then `/reset` for new password.  
   - Reset completes → typically back to `/` or dashboard.

4. **Signup** (`/signup`) — `Signup.tsx`  
   - Fields: name, state, company (from `companies`), email, password, confirm password.  
   - Companies loaded: `supabase.from("companies").select("id, name")`.  
   - On submit: `supabase.auth.signUp`; then sign-out and redirect (flow may continue to verify or login).

5. **Post-auth redirect**  
   - After login + OTP: `navigate("/dashboard", { replace: true })` (from `Login.tsx` effect when `user && isOtpVerified`).  
   - `/dashboard` is PreEnrollment (landing hub).

### 2.3 Main enrollment steps (step order and purpose)

Enrollment step routes and layout are defined in `EnrollmentLayout.tsx`:  
`/enrollment/choose-plan` → `/enrollment/contribution` → `/enrollment/future-contributions` → `/enrollment/investments` → `/enrollment/review`.

| Step index | Path | Page / content | Purpose | Key fields / data |
|------------|------|-----------------|---------|--------------------|
| 0 | `/enrollment/choose-plan` | ChoosePlan | Choose a plan (e.g. Traditional 401(k), Roth 401(k), Roth IRA) | `selectedPlan` (EnrollmentContext), plan cards, “Learn more”, eligibility. |
| 1 | `/enrollment/contribution` | Contribution | Set contribution type (%, $), amount, source allocation (pre-tax / Roth / after-tax), employer match, presets | `contributionType`, `contributionAmount`, `sourceAllocation`, `employerMatchEnabled`, salary, age, retirement age (from context). |
| 2 | `/enrollment/future-contributions` | FutureContributions | Future contribution settings (e.g. auto-increase, floor/ceiling) | `autoIncrease`, assumptions (EnrollmentContext). |
| 3 | `/enrollment/investments` | EnrollmentInvestmentsContent (guard: EnrollmentInvestmentsGuard) | Allocate investments per source (preTax, roth, afterTax) to funds; must total 100% per source | `investmentAllocation`, `editAllocationEnabled` (InvestmentContext); `sourceAllocation` (EnrollmentContext). |
| 4 | `/enrollment/review` | EnrollmentReviewContent | Review plan, contribution, allocation; submit enrollment | Read-only summary from EnrollmentContext + InvestmentContext; submit → success modal, feedback modal. |

**Entry into enrollment steps:**  
- From **Enrollment management** (`/enrollment`): “Enroll” on an eligible plan → `navigate("/enrollment/choose-plan")`; “Manage” on enrolled plan → `navigate("/enrollment/manage/:planId")`.  
- From **Dashboard (classic)** hero: “Start enrollment” opens `PersonalizePlanModal` (wizard); completion may lead to plan choice / enrollment (implementation-dependent).  
- **Save & Exit** on any step saves draft via `saveEnrollmentDraft(...)` and `navigate("/dashboard")`. Draft is restored on re-entry by `EnrollmentLayout` / `EnrollmentProvider` from `loadEnrollmentDraft()`.

### 2.4 Post-enrollment / confirmation

- **Review** submit: triggers success UI (e.g. `SuccessEnrollmentModal`) and feedback (`FeedbackModal`).  
- Feedback is sent to Supabase: `supabase.from("feedback").insert({...})` (`FeedbackModal.tsx`).  
- After confirmation, user can be sent to dashboard or enrollment management; exact redirect depends on implementation (e.g. `/dashboard/post-enrollment` or `/enrollment`).

### 2.5 Dashboard views

| Path | View | Description |
|------|------|-------------|
| `/dashboard` | PreEnrollment | Pre-enrollment hub: HeroSection, LearningSection, AdvisorSection. No sidebar; header only. |
| `/dashboard/classic` | Dashboard | Main dashboard: HeroEnrollmentCard, LearningResourcesCarousel, PersonalizedScoreCard, advisors, value props. “Start enrollment” opens PersonalizePlanModal. |
| `/dashboard/post-enrollment` | PostEnrollmentDashboard | Post-enrollment experience (post-enrollment specific cards/sections). |
| `/dashboard/investment-portfolio` | InvestmentPortfolioPage | Investment portfolio view. |
| `/demo` | DemoDashboard | Demo persona dashboard (no auth). |

Nav link “Dashboard” points to `/demo` when a demo user is active, otherwise to `/dashboard` (PreEnrollment). “Retirement Plan” → `/enrollment` (EnrollmentManagement).

---

## 3. Component Tree (major pages)

### 3.1 Login (`/`)

- **AuthLayout** (split layout: left panel + right form)
  - **AuthLeftPanel** / **LeftPanelCarousel**
  - **AuthFormShell** (headerSlot, title, bodySlot)
    - **Logo**
    - **AuthInput** (email), **AuthPasswordInput** (password)
    - **AuthButton** (Log in)
    - Error alert, links (Forgot password, Sign up, Help)
  - Optional: portaled “Explore demo scenarios” button → custom demo panel (not shared Modal)

### 3.2 Verify OTP (`/verify`)

- **AuthLayout** → **AuthFormShell**
  - **AuthOTPInput** (or OTP component)
  - Verify button, resend, back

### 3.3 PreEnrollment (`/dashboard`)

- **DashboardLayout** (header only)
  - **DashboardHeader**
  - **HeroSection**, **LearningSection**, **AdvisorSection**

### 3.4 Dashboard classic (`/dashboard/classic`)

- **DashboardLayout** + **DashboardHeader**
  - **SaveToast**
  - **HeroEnrollmentCard** (opens **PersonalizePlanModal**)
  - **ScrollIndicator**
  - **LearningResourcesCarousel** → **LearningResourceCard**
  - **PersonalizedScoreCard**
  - **DashboardSection** (Meet advisors) → **AdvisorList** → **AdvisorCard**
  - **ValuePropGrid** → **ValuePropCard**

### 3.5 Enrollment step (e.g. Contribution, Choose Plan, Review)

- **DashboardLayout** (header + subHeader)
  - **DashboardHeader**
  - **EnrollmentHeaderWithStepper** (step indicator)
  - **Outlet** → step page
- **Contribution**: **EnrollmentPageContent**, contribution slider, presets, source allocation, projection chart, **EnrollmentFooter** (inline)
- **ChoosePlan**: **EnrollmentPageContent**, **PlanRail** (plan cards), **EnrollmentFooter** (inline)
- **FutureContributions**: **EnrollmentPageContent**, future contribution controls, **EnrollmentFooter**
- **Investments**: **EnrollmentInvestmentsContent** (allocation UI), **InvestmentsFooter** (uses **EnrollmentFooter** inline)
- **Review**: **EnrollmentReviewContent** (summary, submit), **EnrollmentFooter**, **AIAdvisorModal**, **SuccessEnrollmentModal**, **FeedbackModal**

### 3.6 Enrollment management (`/enrollment`)

- **DashboardLayout** + **DashboardHeader**
  - **EnrollmentManagement**: filter tabs, plan cards, **Button** (Enroll / Manage) → navigate to `/enrollment/choose-plan` or `/enrollment/manage/:planId`

### 3.7 Transactions hub (`/transactions`)

- **TransactionIntelligenceHub** (feature component)
  - Transaction type cards/tabs, **TransactionHistoryTable**, **EmptyTransactionsState**, etc.
  - Start flow → `/transactions/:transactionType/start` → **TransactionApplicationRouter**

### 3.8 Transaction application (`/transactions/:type/:id`)

- **TransactionApplicationRouter** → **TransactionApplication**
  - Step components by type: e.g. **EligibilityStep**, **LoanAmountStep**, **RepaymentTermsStep**, **ReviewStep** (loan); **WithdrawalEligibilityStep**, etc. (withdrawal); **RolloverEligibilityStep**, etc. (rollover); **TransferEligibilityStep**, etc. (transfer)
  - **TransactionFlowFooter** (Back / Next / Submit)

### 3.9 Investments (`/investments`)

- **InvestmentProvider** → **InvestmentsLayout** (hero, grid, **AllocationSummary**, **InvestmentsFooter**)
  - **InvestmentsPage** (content)
  - When in enrollment flow, footer is **InvestmentsFooter** (wraps **EnrollmentFooter** inline)

---

## 4. State & Data Flow

### 4.1 Contexts (provider → consumers)

| Context | File | Purpose |
|---------|------|---------|
| **AuthContext** | `src/context/AuthContext.tsx` | Session (user), loading, signIn, signUp, signOut. Used by ProtectedRoute, Login, Signup, header. |
| **OtpContext** | `src/context/OtpContext.tsx` | OTP verification state (`isOtpVerified`), reset. Used by Login redirect, VerifyCode. |
| **UserContext** | `src/context/UserContext.tsx` | profile, company, loading. Fetches after auth: profiles + companies (Supabase). Used by header, dashboard, profile, theme. |
| **ThemeContext** | `src/context/ThemeContext.tsx` | Theme mode, company branding (from UserContext/company), setCompanyBranding. Applies CSS vars from branding. |
| **EnrollmentProvider** | `src/enrollment/context/EnrollmentContext.tsx` | Single enrollment state: selectedPlan, salary, contributionType/Amount, sourceAllocation, assumptions, autoIncrease, currentAge, retirementAge, investmentProfile, etc. Setters and derived (monthlyContribution, perPaycheck, estimatedRetirementBalance). Seeds from `loadEnrollmentDraft()`. Consumed by ChoosePlan, Contribution, FutureContributions, Review, PlanDetailManagement. |
| **InvestmentContext** | `src/context/InvestmentContext.tsx` | investmentAllocation (per source), editAllocationEnabled, getFundsForSource, updateSourceAllocation, addFundToSource, removeFundToSource, weightedSummary, chartAllocations, canConfirmAllocation. Used by investments step, AllocationSummary, InvestmentsFooter. Wraps **InvestmentProvider** only on `/investments` route. Enrollment investments content may use same or enrollment-scoped allocation. |
| **CoreAIModalContext** | `src/context/CoreAIModalContext.tsx` | Open Core AI modal with optional initial prompt. Used by CoreAIFab, PlanRail “Ask AI”, etc. |
| **AISettingsContext** | `src/context/AISettingsContext.tsx` | coreAIEnabled, etc. Used by RootLayout to show/hide CoreAIFab. |

### 4.2 Draft persistence (enrollment)

- **Store:** `src/enrollment/enrollmentDraftStore.ts` — `loadEnrollmentDraft()`, `saveEnrollmentDraft(draft)`, `clearEnrollmentDraft()`, key `"enrollment-draft"` in **sessionStorage**.
- **Shape:** `EnrollmentDraft`: currentAge, retirementAge, annualSalary, selectedPlanId, contributionType, contributionAmount, sourceAllocation, investmentProfile, investmentProfileCompleted, investment (snapshot from InvestmentContext), etc.
- **When saved:** “Save & Exit” in **EnrollmentFooter** (and equivalent in Contribution/Investments) calls `getDraftSnapshot?()` then `saveEnrollmentDraft(merge(draft, snapshot))` and navigates to `/dashboard`.
- **When loaded:** **EnrollmentLayout** calls `loadEnrollmentDraft()` and passes fields into **EnrollmentProvider** as initial* props. **InvestmentProvider** (when used in enrollment flow) can also seed from draft.

### 4.3 Transaction application state

- **transactionStore** (`src/data/transactionStore.ts`): in-memory store (e.g. Map) for draft and active transactions. **TransactionApplicationRouter** uses `transactionStore.createDraft(type)`, `transactionStore.getTransaction(id)`, `transactionStore.updateTransaction(id, updates)`. No Supabase in router; submission is local update. Success → `navigate("/transactions", { state: { success: { type, amount } } })`.

### 4.4 Demo user

- **useDemoUser** / **setDemoUser** / **clearDemoUser** (e.g. `src/hooks/useDemoUser.ts`): stores demo persona in sessionStorage (or similar). Login demo panel sets it and navigates to `/demo`. Header and nav use it to show “Dashboard” → `/demo` and demo badge.

---

## 5. API Calls (endpoints and steps)

Supabase is used for auth and data. Other APIs are fetch to app endpoints or external LLM/voice.

### 5.1 Supabase (Auth)

| Where | Call | Purpose |
|-------|------|---------|
| **AuthContext** | `supabase.auth.getSession()` | Initial session on load. |
| **AuthContext** | `supabase.auth.onAuthStateChange(...)` | Subscribe to session changes. |
| **AuthContext** | `supabase.auth.signInWithPassword({ email, password })` | Login. |
| **AuthContext** | `supabase.auth.signUp({ email, password, options })` | Signup. |
| **AuthContext** | `supabase.auth.signOut()` | Logout. |
| **Signup** | `supabase.auth.signOut()` | After signup (flow-specific). |

### 5.2 Supabase (Data – tables)

| Where | Table | Operation | Purpose |
|-------|--------|-----------|---------|
| **Login** | `companies` | `.select("logo_url").eq("domain", domain)` | Company logo by email domain. |
| **Signup** | `companies` | `.select("id, name")` | List companies for signup form. |
| **UserContext** | `profiles` | `.select("id, name, company_id, location, role").eq("id", user.id).single()` | Profile after login. |
| **UserContext** | `companies` | `.select("id, name, primary_color, secondary_color, branding_json, logo_url").eq("id", company_id).single()` | Company and branding after profile load. |
| **FeedbackModal** | `feedback` | `.insert({...})` | Submit feedback (e.g. post-enrollment). |
| **companyBrandingService** | `company_branding` | `.select("branding_json").eq("company_id", ...)` | Get theme branding. |
| **companyBrandingService** | `company_branding` | `.upsert({ company_id, branding_json, updated_at }, { onConflict: "company_id" }).select(...)` | Save theme editor branding. |

### 5.3 Other APIs (fetch)

| Where | Endpoint / usage | Purpose |
|-------|-------------------|---------|
| **coreAiService** | `POST /api/core-ai` | Core AI chat. |
| **useTextToSpeech** | `POST /api/voice/tts` | Text-to-speech. |
| **useSpeechToText** | `POST /api/voice/stt` | Speech-to-text. |
| **LLMEnhancer** (agent) | `${LLM_API_ENDPOINT}/normalize`, `/polish` | LLM normalization/polish. |

### 5.4 By user step (summary)

- **Login:** Supabase auth signIn; optional companies (logo by domain).  
- **Signup:** Companies list; Supabase signUp (and possibly signOut).  
- **After login (UserContext):** profiles by user id, then companies by company_id.  
- **Theme (optional):** company_branding get/upsert when using theme editor or applying branding.  
- **Enrollment flow:** No Supabase for wizard state (context + sessionStorage draft only).  
- **Post-enrollment feedback:** feedback insert.  
- **Transaction flows:** No Supabase in TransactionApplicationRouter (local store only).

---

*End of App Flow Map.*
