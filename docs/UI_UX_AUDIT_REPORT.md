# Comprehensive UI/UX Audit Report
**Participant Portal Application**  
*Generated: February 2025*

---

## 1. Visual Design

### 1.1 Color palette consistency

**Strengths:**
- Centralized tokens in `src/theme/tokens.css` (surfaces, text, border, brand, status colors).
- Light/dark and enrollment-dark themes override tokens consistently.
- Tailwind config maps theme colors from CSS variables (`background`, `primary`, `danger`, etc.).

**Issues:**
- **Duplicate / overlapping systems:** Both legacy tokens (`--color-background`, `--color-text`) and newer semantic tokens (`--surface-1`, `--text-primary`, `--enroll-*`) exist. Components mix usage (e.g. Modal uses `--surface-1`, `--text-primary`; others use `--color-background`, `--color-text`), which can diverge when only one set is themed.
- **Enrollment vs global brand:** Enrollment uses `--enroll-brand: #4f46e5` (indigo) while global primary is `#3b82f6` (blue). Footer primary buttons use `--enroll-brand` in enrollment and `--color-primary` elsewhere, so the app feels like two color systems.
- **Hardcoded colors:** `.personalize-plan-slider` in `src/index.css` (lines 917–947) uses `#2563eb` and `#e5e7eb` instead of theme variables.

### 1.2 Typography hierarchy and readability

**Strengths:**
- Base font stack and display font (Outfit) defined in Tailwind.
- Body line-height 1.5 and antialiasing in `:root`.

**Issues:**
- No single type scale (e.g. text-xs through text-4xl) documented or enforced; pages use ad-hoc `text-sm`, `text-lg`, `text-xl`, `text-2xl`, leading to inconsistent hierarchy.
- `h1` in `index.css` set to `3.2em` globally is too large for many screens (e.g. card titles); no page-level overrides.
- Mix of `font-medium`, `font-semibold`, `font-bold` without clear mapping to “heading level” or “label vs body.”

### 1.3 Spacing and layout consistency

**Strengths:**
- Spacing scale in tokens (`--spacing-1` through `--spacing-20`) and Tailwind rhythm utilities (`rhythm-1`–`rhythm-4`).
- DashboardLayout uses consistent `max-w-7xl`, `px-4 sm:px-6 lg:px-8`, and main padding variants.

**Issues:**
- Many components use raw Tailwind spacing (`gap-2`, `gap-4`, `mb-6`, `mt-4`) instead of design tokens, so spacing feels inconsistent (e.g. 8px vs 12px vs 16px in similar contexts).
- Enrollment footer uses its own `enrollment-footer__*` classes in `index.css`; inline variant uses different spacing (`mt-4`, `gap-3`) than sticky footer, so the same component has two visual rhythms.

### 1.4 Component visual consistency

**Strengths:**
- Shared `.button` and `.input` base styles; `Button` and `Input` components use them.
- Card tokens and `.dashboard-card` give cards a consistent look.

**Issues:**
- **EnrollmentFooter:** Sticky variant uses `<Button>` with classes `enrollment-footer__back`, `enrollment-footer__primary`; inline variant uses raw `<button>` with `NAV_BTN_BASE` / `NAV_BTN_PRIMARY`. Same actions look and behave slightly different (e.g. focus ring, disabled state).
- **Two input systems:** `Input` (ui) uses `border-2`, `rounded-lg`, `px-3 py-2.5`; `AuthInput` uses `h-[2.75rem]`, `rounded-lg`, `border` (1px). Auth vs dashboard/enrollment inputs look different.
- **Modal:** Uses `--surface-1`, `--border-subtle`, `--text-primary` while most of the app uses `--color-*`; in dark theme both exist but can get out of sync.

---

## 2. User Experience & Flow

### 2.1 Navigation clarity and intuitiveness

**Strengths:**
- Main nav in `DashboardHeader` with clear labels (Dashboard, Retirement Plan, Transactions, Investment Portfolio, Account).
- Active state (underline + primary color) and `aria-label` on nav.
- Mobile drawer with same links; closes on route change.
- Enrollment stepper shows progress (e.g. `EnrollmentHeaderWithStepper`).

**Issues:**
- **Dashboard vs Demo:** “Dashboard” link goes to `/demo` when a demo user is active; users may not realize they’re in “demo” mode (badge exists but is easy to miss).
- **Retirement Plan** points to `/enrollment` (management); from there, starting a new enrollment is not obvious (no prominent “Start enrollment” or “Choose a plan”).
- No breadcrumbs on enrollment steps or nested transaction flows; back button helps but context (e.g. “Contribution > Review”) is only in the stepper.

### 2.2 User journey from entry to goal completion

**Strengths:**
- Linear enrollment path: choose plan → contribution → future contributions → investments → review.
- Save & Exit and draft restore reduce risk of losing progress.
- Review page summarizes plan, contribution, and allocation before submit.

**Issues:**
- No clear “estimated time” or step count (e.g. “Step 2 of 5”) in the header for first-time users.
- After submission, success modal and feedback modal flow are present but the transition from “Submit” to “Done” could be clearer (e.g. confetti or single “You’re all set” screen).
- Transaction hub has multiple entry points (withdrawal, loan, rollover, etc.); no single “start here” for new users.

### 2.3 Friction points or confusing interactions

- **Login:** Forgot password is a link; no inline validation before submit (error only after “Logging in…”).
- **Enrollment Contribution:** Many controls (slider, percentage/amount toggle, source allocation, presets); no progressive disclosure or short onboarding tip.
- **Investments step:** Allocation must total 100%; message appears in footer but the “why” (e.g. “Adjust the sliders so the total is 100%”) could be more prominent.
- **Demo panel (Login):** Opens as a custom overlay (not `Modal`); no focus trap, no Escape to close in code (only overlay click). Keyboard users can tab out of the panel.

### 2.4 Error states and empty states handling

**Strengths:**
- Form errors: `Input` and `AuthInput` show `error` with `role="alert"` and `aria-invalid` / `aria-describedby`.
- Login/network: Alert banner when server unreachable; login error in alert box.
- RouteErrorBoundary: Full-page “Something went wrong” with Dashboard and Reload.
- Empty states: `EmptyTransactionsState`, “No transactions match your filters” in TransactionHistoryTable, MessageList “Thinking…” loading state.

**Issues:**
- No shared `EmptyState` component (icon + title + description + optional CTA); each place implements its own (e.g. emoji + text in EmptyTransactionsState).
- Loading: Many pages use boolean “loading” and conditional render (e.g. return null or spinner); no shared skeleton or loading template for lists/cards.
- Validation messages: Some flows (e.g. loan steps) show a single `validationError` string; multi-field forms could benefit from inline errors per field.
- FeedbackModal typo: “Enrolment” in FEATURE_OPTIONS (line 53) should be “Enrollment.”

---

## 3. Component Quality

### 3.1 Reusability and consistency of UI components

**Strengths:**
- `Button`, `Input`, `Modal`, `Card`, `Label`, `Switch`, `Dropdown`, `OTPInput`, `PasswordInput` in `src/components/ui/`.
- Modal has focus trap, Escape, overlay click, and `role="dialog"` `aria-modal="true"`.

**Issues:**
- **Button:** No `variant` (primary / secondary / ghost / danger) or `size`; all buttons look primary. Secondary actions (e.g. “Save & Exit”) are styled ad hoc.
- **No shared secondary/outline button:** EnrollmentFooter and others reimplement `NAV_BTN_BASE`-style buttons.
- **Card:** Multiple patterns (DashboardCard, enrollment cards with `cardStyle` object, PlanSelectionCard); no single Card API used everywhere.
- **Auth vs UI:** AuthInput / AuthPasswordInput duplicate patterns from Input / PasswordInput with different styling and props.

### 3.2 Button, form, and input design patterns

**Strengths:**
- Labels associated with inputs (`htmlFor` / `id`); error and description IDs for `aria-describedby`.
- Primary button has hover/active and `:focus-visible` ring.
- OTP and password toggle patterns exist.

**Issues:**
- **Input:** Placeholder uses `--color-textSecondary` (camelCase); tokens define `--color-text-secondary`. CSS variable names are case-sensitive; `--color-textSecondary` may be undefined and break in some themes.
- **EnrollmentFooter inline:** Buttons use `style={{ color: "var(--color-text)" }}` and `style={{ background: ... }}` instead of classes, which bypasses theme consistency if tokens change.
- **No consistent “required” indicator:** Some forms mark required fields, others don’t.
- **Slider accessibility:** Contribution and allocation sliders use `aria-label` in places but not a single pattern (e.g. `aria-valuetext` with “X%” or “$Y”).

### 3.3 Loading states and feedback mechanisms

**Strengths:**
- Signup: “Creating account…”, “Loading companies…”.
- Core AI: “Thinking…” with bouncing dots in MessageList.
- Review page waits for prerequisites before rendering.

**Issues:**
- No shared `Spinner` or `LoadingDots` component; MessageList and others use inline markup.
- Buttons don’t have a standard “loading” prop (disabled + text change only).
- No global loading bar or skeleton for route transitions.

### 3.4 Modal/dialog patterns

**Strengths:**
- `Modal` (ui): portal, focus trap, Escape, overlay click, `role="dialog"` `aria-modal="true"`.
- CoreAssistantModal: `aria-label`, bottom-sheet on small screens.

**Issues:**
- **Modal (ui):** Dialog has no `aria-label` or `aria-labelledby`; screen reader users don’t get a title.
- **Login demo panel:** Implemented as a custom overlay, not `Modal`; missing `role="dialog"`, `aria-modal`, focus trap, and Escape. Div with `aria-hidden` on backdrop is good, but the panel itself is not announced as a dialog.
- **AdvisorView:** Uses its own `advisor-view__modal-overlay`; behavior (focus trap, Escape) not audited here but suggests another one-off pattern.

---

## 4. Responsiveness & Accessibility

### 4.1 Mobile responsiveness

**Strengths:**
- Breakpoints: `sm` (640), `md` (768), `lg` (1024), `xl` (1280). Layouts switch to single column and stacked.
- Dashboard header: nav hidden below `lg`, hamburger and mobile drawer.
- Enrollment footer: stacked buttons, order reversed on small screens (`flex-col-reverse sm:flex-row`).
- CoreAssistantModal: bottom-sheet style on small screens.
- Safe area: `env(safe-area-inset-*)` in DashboardLayout header.

**Issues:**
- **index.css:** Many media queries (640, 768, 900, 1024, 1199, 1200, 1025) with different behaviors; some at 1199/1200 create a narrow “in-between” band that could be merged with 1024 or 1280 for clarity.
- **Tables:** Transaction tables may horizontal scroll on mobile; no explicit “card” layout for small screens for every table.
- **Enrollment contribution:** Dense controls (sliders, inputs, chart); on very small viewports, vertical space is tight.

### 4.2 Accessibility (contrast, labels, keyboard)

**Strengths:**
- Form labels and `aria-invalid` / `aria-describedby` / `role="alert"` on errors.
- Modal focus trap and Escape.
- `aria-label` on icon-only buttons (notifications, user menu, hamburger, close).
- `aria-live="polite"` for enrollment footer summary and review status.
- `aria-expanded` on user menu and notification panel.
- Decorative SVGs use `aria-hidden`.
- Focus visible: `focus-visible:ring-*` and `focus:outline-none` used in multiple places.
- PlanRail card: `role="button"`, `tabIndex={isEligible ? 0 : -1}`.

**Issues:**
- **Skip link:** No “Skip to main content” link; keyboard users must tab through header every time.
- **Modal title:** `Modal` dialog has no `aria-label` or `aria-labelledby`; first heading inside should be referenced.
- **Demo panel (Login):** Not a proper dialog (see 3.4); focus can leave the panel.
- **Color contrast:** Secondary text uses `--color-text-secondary` (e.g. #6b7280 on white). WCAG AA requires 4.5:1 for normal text; 6b7280 on #ffffff is about 4.5:1 (borderline). Dark mode and small font sizes (e.g. `text-xs text-[var(--color-textSecondary)]`) may fail in some themes; not fully audited.
- **DashboardHeader mobile nav:** Container has `role="dialog"` and `aria-label`; good, but focus is not trapped when opened (user can tab to content behind).
- **`--color-textSecondary` typo:** Used in multiple files; tokens define `--color-text-secondary`. Unmatched variable can lead to missing color (inherited or initial), affecting contrast and consistency.

### 4.3 Touch target sizes

**Strengths:**
- Icon buttons in header: `h-9 w-9` (36px); meets 44px in some cases when padding is considered, or close.
- Enrollment footer buttons: `py-2.5` + `px-5`/`px-6` give reasonable height.

**Issues:**
- **OTP input:** `input-otp` cells are `h-9 w-9` (36px); below the common 44px minimum for touch. Small screens may need larger tap targets.
- **ThemeToggle:** `h-9 w-9` (36px); same as above.
- **Dropdown items:** `px-3 py-2` (32px height) can be under 44px.
- **Mobile nav links:** `py-2.5` ≈ 40px; slightly under 44px.
- **Close and secondary controls in modals:** Some use `h-8 w-8` (32px); too small for touch.

---

## 5. Performance & Polish

### 5.1 Animations and transitions

**Strengths:**
- Tailwind keyframes: `bella-pulse`, `float`, `fade-in`; used for emphasis and loading.
- Framer Motion used in FeedbackModal, Contribution, Review (e.g. AnimatePresence, motion divs).
- Review page: count-up animation for numbers.
- Button and input transitions: 0.2s ease for border/background.

**Issues:**
- No shared transition tokens (e.g. `--transition-duration-fast/normal/slow`); 0.2s and 0.3s used ad hoc.
- Some motion could be reduced for `prefers-reduced-motion`; no audit of `prefers-reduced-motion` in codebase.

### 5.2 Micro-interactions

**Strengths:**
- Hover on nav links, buttons, cards.
- Demo button on Login: hover lift and shadow.
- Focus rings on buttons and inputs.

**Issues:**
- No consistent hover elevation on cards (some use shadow, others don’t).
- No loading state on primary buttons (e.g. spinner inside button).
- Success states (e.g. after enrollment submit) could use a short confirmation animation.

### 5.3 Overall “feel”

- **Positive:** Clear layout, theme support, enrollment flow is structured, error and empty states exist in key places.
- **Needs improvement:** Inconsistent tokens (two naming styles, two color systems), mixed component patterns (Auth vs UI, raw buttons vs Button), and several one-off modals/overlays reduce consistency and maintainability.

---

## 6. Specific Issues Found (with file and line)

| # | Severity | File | Line(s) | Issue |
|---|----------|------|---------|--------|
| 1 | **Critical** | `src/components/ui/Input.tsx` | 53, 64 | Uses `--color-textSecondary` (camelCase); tokens use `--color-text-secondary`. Undefined variable can break placeholder/description color and contrast. |
| 2 | **Critical** | `src/components/GlobalFooter.tsx` | 18 | Uses `var(--color-textSecondary, #64748b)`; token is `--color-text-secondary`. Fallback works but naming is wrong; dark theme may not override. |
| 3 | **Major** | `src/components/ui/Modal.tsx` | 107–116 | Dialog has `role="dialog"` and `aria-modal="true"` but no `aria-label` or `aria-labelledby`; screen readers don’t get a title. |
| 4 | **Major** | `src/pages/auth/Login.tsx` | 260–353 | Demo scenario picker is a custom overlay: no `role="dialog"`, no focus trap, no Escape key. Fails dialog accessibility. |
| 5 | **Major** | `src/components/dashboard/DashboardHeader.tsx` | 298 | Uses `bg-[var(--color-secondary)]` for active mobile nav; `--color-secondary` is from theme utils and may be undefined if no branding. |
| 6 | **Major** | `src/components/enrollment/EnrollmentFooter.tsx` | 85–114 | Inline variant uses raw `<button>` and inline `style={{ color: "...", background: "..." }}` instead of shared Button and tokens; inconsistent with sticky variant. |
| 7 | **Major** | Multiple (see grep) | Various | Many files use `--color-textSecondary` (camelCase) instead of `--color-text-secondary` (e.g. Login 206, 212, 276, 283, 328, 345; MessageList 56–59; PersonalizePlanModal; CoreAssistantModal; AuthFooter; etc.). |
| 8 | **Minor** | `src/index.css` | 917–947 | `.personalize-plan-slider` uses hardcoded `#2563eb`, `#e5e7eb` instead of theme variables. |
| 9 | **Minor** | `src/components/feedback/FeedbackModal.tsx` | 53 | “Enrolment” should be “Enrollment” in FEATURE_OPTIONS. |
| 10 | **Minor** | `src/components/transactions/EmptyTransactionsState.tsx` | 1–12 | Imports `useNavigate` but doesn’t use it (dead code). |
| 11 | **Minor** | RootLayout / app | N/A | No “Skip to main content” link; hurts keyboard accessibility. |
| 12 | **Minor** | `src/components/dashboard/DashboardHeader.tsx` | 287–319 | Mobile nav has `role="dialog"` but no focus trap; focus can leave the drawer. |
| 13 | **Minor** | `src/components/ui/Button.tsx` | — | No `variant` or `size` props; all buttons look primary; secondary/ghost need ad hoc classes. |
| 14 | **Minor** | `src/theme/tokens.css` | — | Two naming conventions: `--color-*` vs `--surface-*` / `--text-primary`; Modal uses surface/text, rest use color-*. |
| 15 | **Minor** | OTP / ThemeToggle / Dropdown | 52, 10, 116 | Touch targets (h-9 w-9, py-2) may be below 44px; consider min 44px for interactive elements on touch devices. |

---

## 7. Quick Wins (top 5)

1. **Fix CSS variable name: `--color-textSecondary` → `--color-text-secondary`**  
   - **Impact:** Restores correct secondary text and placeholder color everywhere; fixes potential contrast/readability.  
   - **Where:** Global find-and-replace `--color-textSecondary` with `--color-text-secondary` in TSX/JSX/CSS (and remove any duplicate fallbacks like `var(--color-textSecondary, #64748b)` in favor of token).  
   - **Files:** Input.tsx, GlobalFooter.tsx, Login.tsx, MessageList.tsx, PersonalizePlanModal.tsx, CoreAssistantModal.tsx, AuthFooter.tsx, and any other file from the grep list.

2. **Add `aria-label` or `aria-labelledby` to Modal dialog**  
   - **Impact:** Screen reader users get a dialog title; better accessibility with minimal code.  
   - **How:** Add optional `titleId` / `ariaLabelledBy` prop to `Modal` and set `aria-labelledby={titleId}` on the dialog div, or require an `aria-label` prop and pass it to the dialog. Ensure the first visible heading in modal content has the matching `id` when using `aria-labelledby`.

3. **Use shared `Modal` for Login demo panel and add Escape + focus trap**  
   - **Impact:** Demo panel becomes keyboard-accessible and consistent with other dialogs.  
   - **How:** Replace the custom overlay in `Login.tsx` (lines 260–353) with `<Modal isOpen={showDemoPanel} onClose={() => setShowDemoPanel(false)}>…</Modal>`, move panel content inside, and add an `aria-label` (e.g. “Choose demo scenario”). Optionally add focus trap if not using Modal (e.g. focus first focusable, trap Tab, close on Escape).

4. **Introduce a single secondary/outline button style and use it in EnrollmentFooter**  
   - **Impact:** Consistent look for “Back” and “Save & Exit” across enrollment and fewer one-off classes.  
   - **How:** Add a `variant` prop to `Button` (e.g. `primary` | `secondary` | `ghost`) and map `secondary` to border + background transparent (or `--color-background-secondary`). Use `<Button variant="secondary">` in EnrollmentFooter for Back and Save & Exit (both sticky and inline), and remove inline `style` and `NAV_BTN_BASE` for those.

5. **Add a “Skip to main content” link at the top of the layout**  
   - **Impact:** Keyboard and screen reader users can jump to main content without tabbing through the whole header.  
   - **How:** In `RootLayout.tsx` (or the first focusable wrapper), add a focusable link (e.g. `<a href="#main" className="sr-only focus:not-sr-only focus:absolute ...">Skip to main content</a>`) and add `id="main"` to the main content container (e.g. the `<main>` that wraps `<Outlet />`). Style so it’s visible only on focus (e.g. Tailwind `sr-only focus:not-sr-only`).

---

# PART 2 — Expanded Audit (Exhaustive)

## 1. Critical Issues (breaks functionality or accessibility)

| # | File | Line(s) | Exact problem | Exact fix |
|---|------|---------|----------------|-----------|
| C1 | `src/components/ui/Input.tsx` | 52, 53, 64, 65 | Uses CSS variable `--color-textSecondary` (camelCase). Tokens define only `--color-text-secondary` (hyphen). Variable is undefined; placeholder and description text can lose color/contrast. | Replace every occurrence in this file: `--color-textSecondary` → `--color-text-secondary`. Line 52: `placeholder:text-[var(--color-text-secondary)]`. Line 53: same in the `cn()` string. Line 64: `text-[var(--color-text-secondary)]`. Line 65: no change (danger). |
| C2 | `src/components/GlobalFooter.tsx` | 18 | Uses `var(--color-textSecondary, #64748b)`. Token name is wrong; in themes that only set `--color-text-secondary`, the fallback is used and dark theme may not override. | Use the correct token: `style={{ color: "var(--color-text-secondary)" }}` and remove the fallback, or keep fallback as `var(--color-text-secondary, #64748b)` for safety. |

**Exact code fixes:**

**C1 — Input.tsx**
```tsx
// BEFORE (line 52-53)
"w-full rounded-lg border-2 border-[var(--color-border)] bg-transparent px-3 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-textSecondary)] outline-none ..."
// AFTER
"w-full rounded-lg border-2 border-[var(--color-border)] bg-transparent px-3 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] outline-none ..."
```
```tsx
// BEFORE (line 64)
<p id={descId} className="mt-1.5 text-xs text-[var(--color-textSecondary)]">
// AFTER
<p id={descId} className="mt-1.5 text-xs text-[var(--color-text-secondary)]">
```

**C2 — GlobalFooter.tsx**
```tsx
// BEFORE (line 18)
style={{ color: "var(--color-textSecondary, #64748b)" }}
// AFTER
style={{ color: "var(--color-text-secondary)" }}
```

---

## 2. Major Issues (significantly hurts UX)

| # | File | Line(s) | Exact problem | Exact fix |
|---|------|---------|----------------|-----------|
| M1 | `src/components/ui/Modal.tsx` | 107–116 | Dialog div has `role="dialog"` and `aria-modal="true"` but no `aria-label` or `aria-labelledby`. Screen reader users do not hear a dialog title. | Add optional prop `ariaLabel?: string` (or `aria-labelledby`). Pass it to the dialog div: `aria-label={ariaLabel}` (or `aria-labelledby={titleId}` and ensure a heading inside has that id). |
| M2 | `src/pages/auth/Login.tsx` | 259–354 | Demo scenario picker is a custom overlay (div + backdrop). Missing: `role="dialog"`, `aria-modal="true"`, focus trap, Escape key handler. Keyboard users can tab out; screen readers don’t announce a dialog. | Replace the custom overlay with the shared `<Modal isOpen={showDemoPanel} onClose={() => setShowDemoPanel(false)} ariaLabel={t("auth.exploreScenarios")}>` and move the panel content (header, list, footer) inside Modal. Remove the outer `fixed inset-0` wrapper and backdrop div. |
| M3 | `src/components/dashboard/DashboardHeader.tsx` | 298 | Active mobile nav link uses `bg-[var(--color-secondary)]`. `--color-secondary` is only set by theme utils from branding; base tokens do not define it. When no branding, background can be transparent/wrong. | Use a defined token: e.g. `bg-[var(--color-background-secondary)]` or add to `tokens.css` in :root: `--color-secondary: var(--color-background-secondary);`. In DashboardHeader: change to `bg-[var(--color-background-secondary)]`. |
| M4 | `src/components/enrollment/EnrollmentFooter.tsx` | 85–114 | Inline variant uses raw `<button>` and inline `style={{ color: "var(--color-text)" }}` / `style={{ background: ... }}` instead of shared `Button` and class-based tokens. Inconsistent with sticky variant and harder to theme. | Use shared `Button` for Back and Save & Exit with a secondary variant (e.g. `variant="secondary"`), or add classes that use tokens (e.g. `className="... bg-[var(--color-background)] text-[var(--color-text)]"`) and remove inline `style`. For primary button keep or add `className="... bg-[var(--enroll-brand)]"` and remove `style={{ background: ... }}`. |
| M5 | All files in “Design Token Inconsistencies” below | Various | Use of `--color-textSecondary` (camelCase) instead of `--color-text-secondary`. Same as C1/C2: wrong variable name, can break appearance/contrast. | In each file, replace `--color-textSecondary` with `--color-text-secondary` (and `var(--color-textSecondary)` with `var(--color-text-secondary)`). |

**Exact code fixes:**

**M1 — Modal.tsx**
```tsx
// BEFORE
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  ...
}
// AFTER
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Accessible dialog title for screen readers */
  ariaLabel?: string;
  ...
}
```
```tsx
// BEFORE (dialog div, line 107-116)
<div
  ref={modalRef}
  className={...}
  role="dialog"
  aria-modal="true"
  tabIndex={-1}
>
// AFTER
<div
  ref={modalRef}
  className={...}
  role="dialog"
  aria-modal="true"
  aria-label={ariaLabel}
  tabIndex={-1}
>
```
And in the component signature: `export const Modal = ({ isOpen, onClose, children, closeOnOverlayClick = true, dialogClassName, wizard = false, ariaLabel }: ModalProps) => {`

**M3 — DashboardHeader.tsx**
```tsx
// BEFORE (line 298)
? "text-[var(--color-primary)] bg-[var(--color-secondary)]"
// AFTER
? "text-[var(--color-primary)] bg-[var(--color-background-secondary)]"
```

---

## 3. Minor Issues (polish and consistency)

| # | File | Line(s) | Exact problem | Exact fix |
|---|------|---------|----------------|-----------|
| N1 | `src/index.css` | 917–947 | `.personalize-plan-slider` uses hardcoded `#2563eb`, `#e5e7eb` for thumb/track. Not theme-aware. | Replace with tokens: e.g. `accent-color: var(--color-primary);`, track `background: var(--color-border);` or `var(--slider-track-unfilled);`, thumb `background: var(--color-primary);`. |
| N2 | `src/components/feedback/FeedbackModal.tsx` | 53 | FEATURE_OPTIONS label "Enrolment" is misspelled (US: "Enrollment"). | Change to `label: "Enrollment"`. |
| N3 | `src/components/transactions/EmptyTransactionsState.tsx` | 1–2, 11 | Imports `useNavigate` but never uses it (dead code). | Remove `useNavigate` from the import and remove any unused variable if present. |
| N4 | `src/layouts/RootLayout.tsx` | 24–28 | No "Skip to main content" link. Keyboard users must tab through entire header on every page. | Add at the top of the layout (first focusable): `<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-[var(--color-surface)] focus:text-[var(--color-text)]">Skip to main content</a>`. Add `id="main"` to the `<main>` that wraps `<Outlet />`. |
| N5 | `src/components/dashboard/DashboardHeader.tsx` | 287–319 | Mobile nav has `role="dialog"` and `aria-label` but no focus trap. When open, Tab can move focus to page content behind. | Implement focus trap when `mobileMenuOpen`: on open, focus first focusable in the drawer; on Tab from last focusable, move to first; on Shift+Tab from first, move to last. Or render mobile nav in a portal and use the same focus-trap pattern as `Modal.tsx`. |
| N6 | `src/components/ui/Button.tsx` | — | No `variant` or `size` props. All buttons look primary; secondary/outline require ad hoc classes. | Add `variant?: 'primary' | 'secondary' | 'ghost'` and optional `size`. Map `secondary` to border + transparent background using tokens; use in EnrollmentFooter and elsewhere. |
| N7 | `src/components/dashboard/HeroEnrollmentCard.tsx` | 35 | Badge text default "+ ENROLMENT OPEN" uses British spelling. | Change to "+ ENROLLMENT OPEN" or use i18n key. |

**Exact code fixes:**

**N2 — FeedbackModal.tsx**
```tsx
// BEFORE (line 53)
{ value: "enrollment", label: "Enrolment", icon: "📝" },
// AFTER
{ value: "enrollment", label: "Enrollment", icon: "📝" },
```

**N3 — EmptyTransactionsState.tsx**
```tsx
// BEFORE
import { useNavigate } from "react-router-dom";
...
export const EmptyTransactionsState = () => {
  const navigate = useNavigate();
// AFTER
// Remove useNavigate import and the const navigate = useNavigate(); line if navigate is not used elsewhere in the component.
```

**N4 — RootLayout.tsx**
```tsx
// BEFORE
return (
  <CoreAIModalProvider>
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
// AFTER
return (
  <CoreAIModalProvider>
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-[var(--color-surface)] focus:text-[var(--color-text)]">Skip to main content</a>
      <main id="main" className="flex-1">
```

---

## 4. Top 5 Quick Wins (ranked by impact vs effort)

### 1. Fix `--color-textSecondary` → `--color-text-secondary` everywhere (Impact: High, Effort: Low)

- **Impact:** Restores correct secondary text and placeholder color; fixes contrast and theme consistency.
- **Effort:** Global find-replace in TSX/JS/CSS.

**What to change:** In every file that uses `--color-textSecondary` or `var(--color-textSecondary)` or `text-[var(--color-textSecondary)]`, replace with `--color-text-secondary` / `var(--color-text-secondary)` / `text-[var(--color-text-secondary)]`.

**Before (example — Input.tsx line 52):**
```tsx
placeholder:text-[var(--color-textSecondary)]
```
**After:**
```tsx
placeholder:text-[var(--color-text-secondary)]
```

**Before (example — GlobalFooter.tsx line 18):**
```tsx
style={{ color: "var(--color-textSecondary, #64748b)" }}
```
**After:**
```tsx
style={{ color: "var(--color-text-secondary)" }}
```

(Apply same replacement in all files listed in Section 5 below.)

---

### 2. Add `aria-label` to Modal (Impact: High for a11y, Effort: Low)

- **File:** `src/components/ui/Modal.tsx`
- **Change:** Add optional `ariaLabel?: string` to props; pass to dialog div.

**Before (lines 5–14, 107–116):**
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnOverlayClick?: boolean;
  dialogClassName?: string;
  wizard?: boolean;
}
// ...
<div
  ref={modalRef}
  className={[...]}
  role="dialog"
  aria-modal="true"
  tabIndex={-1}
>
```
**After:**
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnOverlayClick?: boolean;
  dialogClassName?: string;
  wizard?: boolean;
  ariaLabel?: string;
}
// ...
<div
  ref={modalRef}
  className={[...]}
  role="dialog"
  aria-modal="true"
  aria-label={ariaLabel}
  tabIndex={-1}
>
```
Update destructuring: `const Modal = ({ ..., ariaLabel }: ModalProps) => {`. Every caller that opens an important dialog should pass `ariaLabel` (e.g. "Choose demo scenario", "Feedback").

---

### 3. Use shared Modal for Login demo panel (Impact: High for a11y/keyboard, Effort: Medium)

- **File:** `src/pages/auth/Login.tsx` (lines 258–354)
- **Change:** Replace custom overlay with `<Modal>`, add Escape and focus trap via Modal.

**Before (conceptual):**
```tsx
{showDemoPanel && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50 ..." onClick={() => setShowDemoPanel(false)} aria-hidden />
    <div className="relative z-10 w-full max-w-md ...">
      {/* header, list, footer */}
    </div>
  </div>
)}
```
**After:**
```tsx
<Modal
  isOpen={showDemoPanel}
  onClose={() => setShowDemoPanel(false)}
  ariaLabel={t("auth.exploreScenarios")}
  dialogClassName="max-w-md"
>
  <div className="flex flex-col max-h-[90vh]">
    <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
      {/* same header content, but remove the close button's wrapper if Modal provides one - or keep for UX */}
    </div>
    <div className="max-h-[60vh] overflow-y-auto p-3">{/* persona list */}</div>
    <div className="border-t ... px-5 py-3">{/* footer */}</div>
  </div>
</Modal>
```
Remove the outer `fixed inset-0` div and the backdrop div; Modal provides overlay, focus trap, and Escape.

---

### 4. Add Skip to main content link (Impact: Medium for a11y, Effort: Low)

- **File:** `src/layouts/RootLayout.tsx`
- **Change:** Add one link, add `id="main"` on main.

**Before:**
```tsx
<div className="flex min-h-screen flex-col">
  <main className="flex-1">
    <RouteErrorBoundary>
```
**After:**
```tsx
<div className="flex min-h-screen flex-col">
  <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:left-4 focus:top-4 focus:p-4 focus:rounded-lg focus:bg-[var(--color-surface)] focus:text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)]">Skip to main content</a>
  <main id="main" className="flex-1">
    <RouteErrorBoundary>
```

---

### 5. Fix active mobile nav background token (Impact: Medium for theme, Effort: Low)

- **File:** `src/components/dashboard/DashboardHeader.tsx` (line 298)
- **Change:** Use a defined token so active state is visible when branding doesn’t set `--color-secondary`.

**Before:**
```tsx
? "text-[var(--color-primary)] bg-[var(--color-secondary)]"
```
**After:**
```tsx
? "text-[var(--color-primary)] bg-[var(--color-background-secondary)]"
```

---

## 5. Design Token Inconsistencies

Every place a wrong or missing CSS token is used. Correct token for secondary text is `--color-text-secondary` (hyphen). Wrong form used in codebase: `--color-textSecondary` (camelCase).

### 5.1 Wrong token: `--color-textSecondary` (camelCase)

Replace with `--color-text-secondary` in all of the following:

| File | Line(s) | Current usage |
|------|---------|----------------|
| `src/components/ui/Input.tsx` | 52, 64 | `placeholder:text-[var(--color-textSecondary)]`, `text-[var(--color-textSecondary)]` |
| `src/components/GlobalFooter.tsx` | 18 | `var(--color-textSecondary, #64748b)` |
| `src/pages/enrollment/Contribution.tsx` | 568 | `placeholder-[var(--color-textSecondary)]` |
| `src/components/enrollment/PlanRail.tsx` | 95, 116, 139, 161 | `text-[var(--color-textSecondary)]` (4 places) |
| `src/pages/enrollment/ChoosePlan.tsx` | 155 | `text-[var(--color-textSecondary)]` |
| `src/components/core-ai/CoreAssistantModal.tsx` | 319, 332, 363 | `text-[var(--color-textSecondary)]` (3 places) |
| `src/components/pre-enrollment/HeroSection.tsx` | 64, 90, 112 | `text-[var(--color-textSecondary)]` (3 places) |
| `src/components/dashboard/NotificationPanel.tsx` | 87 | `text-[var(--color-textSecondary)]` |
| `src/pages/auth/Login.tsx` | 206, 212, 276, 283, 328, 345 | `text-[var(--color-textSecondary)]` (6 places) |
| `src/components/auth/AuthFooter.tsx` | 13, 18 | `text-[var(--color-textSecondary)]`, `text-[var(--color-textSecondary)]` |
| `src/components/enrollment/PersonalizePlanModal.tsx` | 166, 200, 274, 289, 301, 313, 344, 380, 385, 394, 590, 597, 650, 667, 668 | Multiple `text-[var(--color-textSecondary)]` and `placeholder-[var(--color-textSecondary)]` |
| `src/components/core-ai/MessageList.tsx` | 53, 54, 55, 56, 57 | `bg-[var(--color-textSecondary)]`, `text-[var(--color-textSecondary)]` (loading dots and "Thinking...") |
| `src/pages/auth/VerifyCode.tsx` | 94 | `text-[var(--color-textSecondary)]` |
| `src/components/auth/AuthFormShell.tsx` | 33 | `text-[var(--color-textSecondary)]` |
| `src/pages/auth/Signup.tsx` | 344, 371, 428, 528 | `text-[var(--color-textSecondary)]` (4 places) |
| `src/pages/enrollment/EnrollmentManagement.tsx` | 78 | `text-[var(--color-textSecondary)]` (in getStatusStyles) |
| `src/components/ui/FuturisticSearch.tsx` | 212, 238 | `placeholder-[var(--color-textSecondary)]`, `text-[var(--color-textSecondary)]` / hover |
| `src/components/auth/AuthPasswordInput.tsx` | 46, 54 | `placeholder:text-[var(--color-textSecondary)]`, `text-[var(--color-textSecondary)]` (toggle button) |

**BellaScreen.tsx**: Grep reported matches in BellaScreen (many lines) and AuthPasswordInput; apply same replacement in those files for any `--color-textSecondary` or `var(--color-textSecondary)`.

### 5.2 Potentially undefined token: `--color-secondary`

| File | Line(s) | Usage | Fix |
|------|---------|--------|-----|
| `src/components/dashboard/DashboardHeader.tsx` | 298 | `bg-[var(--color-secondary)]` for active mobile nav link | Use `bg-[var(--color-background-secondary)]` or define `--color-secondary` in `tokens.css` as alias to `--color-background-secondary`. |
| `src/components/ui/FuturisticSearch.tsx` | 149, 190, 238 | `bg-[var(--color-secondary)]`, `hover:bg-[var(--color-secondary)]` | Same: use `--color-background-secondary` or define `--color-secondary` in base theme. |

### 5.3 Hardcoded colors (no token)

| File | Line(s) | Current | Fix |
|------|---------|---------|-----|
| `src/index.css` | 917–947 | `.personalize-plan-slider` accent/track/thumb `#2563eb`, `#e5e7eb` | Use `var(--color-primary)`, `var(--color-border)` or `var(--slider-track-unfilled)`. |

### 5.4 Correct token usage (no change needed)

- **index.css** and **theme/** files use `--color-text-secondary` (hyphen) in many places; those are correct.
- **ThemeToggle.tsx** uses `--color-text-secondary` (correct).

---

*End of expanded audit. Implement fixes in order of priority (Critical → Major → Quick Wins → Minor).*
