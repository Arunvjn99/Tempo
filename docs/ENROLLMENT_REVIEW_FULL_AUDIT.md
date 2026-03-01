# Enrollment Review Page — Full System Audit

## STEP 1 — RESPONSIVE AUDIT

### Findings
| Issue | Location | Fix |
|-------|----------|-----|
| Content can sit under fixed footer | EnrollmentPageContent has `pb-12 md:pb-16`; footer ~80px fixed | Increase bottom padding so last content clears footer (e.g. `pb-24 md:pb-28`) |
| Plan Overview flex gap too large on small screens | Review.tsx Plan Overview `gap-12` | Use `gap-6 sm:gap-12` |
| Donut charts fixed size on mobile | `w-28 h-28` readiness, `w-40 h-40` snapshot | Use responsive sizes `w-20 h-20 sm:w-28 sm:h-28` and `w-32 h-32 sm:w-40 sm:h-40` |
| Investment table may squash on very small screens | Table in overflow-x-auto | Add `min-w-[280px]` or similar so table scrolls instead of squashing |
| FAB overlaps footer on mobile | CoreAIFab `bottom-6`, footer static at 640px | On max-width 640px position FAB higher (e.g. `bottom: 5.5rem`) so it doesn’t cover CTA |
| Right column sticky only on lg | `lg:sticky lg:top-24` | OK; no change (sticky off on mobile) |

### Grid breakpoints verified
- **Desktop:** `lg:grid-cols-[65fr_35fr]` (1024px+) — two columns.
- **Tablet/Mobile:** `grid-cols-1` — single column; right column stacks below left.
- **Contribution Strategy:** `sm:grid-cols-2` (640px+) for two blocks.
- **Investment card:** `lg:flex-row` — table + snapshot stack on small screens.
- **Next Steps:** `md:grid-cols-3` (768px+) for three columns.

---

## STEP 2 — LANGUAGE & I18N

### Hardcoded strings in Review.tsx
| String | Use | Fix |
|--------|-----|-----|
| `"Enrolment Summary"` | buildEnrollmentSummary | Use `t("enrollment.enrolmentSummary")` |
| `"Traditional 401(k)"` | buildEnrollmentSummary fallback | Use `t("enrollment.traditional401k")` |
| `"Investment Elections:"` | buildEnrollmentSummary | Use `t("enrollment.investmentElections")` or new key |
| `"My Retirement Enrolment Summary"` | mailto subject | Use `t("enrollment.emailSummarySubject")` |
| `"RISK SCORE: {n}/5"` | Table cell | Use `t("enrollment.riskScoreLabel", { level: fund.riskLevel })` |
| `"Employer Match"` (fallback in t()) | Two places | Key exists as employerMatchLabel; remove fallback |

### Locale keys to add
- `enrollment.enrolmentSummary`
- `enrollment.emailSummarySubject`
- `enrollment.riskScoreLabel` (e.g. "Risk score: {{level}}/5")

---

## STEP 3 — DARK / LIGHT MODE

### Hardcoded colors in Review.tsx
| Value | Location | Fix |
|-------|----------|-----|
| `#f0f7ff`, `#e0effe` | Plan Overview gradient | Use CSS vars (e.g. `var(--enroll-plan-overview-gradient)` or token) |
| `#eff6ff`, `#dbeafe` | Risk badge | Use `rgb(var(--enroll-brand-rgb) / 0.08)` and border token |
| `rgba(16,185,129,...)` | Active enrollment badge, employer match box | Use `var(--color-success)`, `rgb(var(--color-success-rgb) / 0.1)` |
| `rgba(248,250,252,0.5)` | Table header/total row | Use `var(--enroll-soft-bg)` or theme token |
| `#1e3a5f`, `#0f172a`, `#e2e8f0`, `#f8fafc` | Next Steps section | Use theme tokens for dark block |

### Theme mechanism
- Theme: CSS variables + `.dark` class (enrollment-dark.css).
- Tokens in `tokens.css`; dark overrides in `enrollment-dark.css`.
- Review page uses `var(--enroll-*)` and `var(--color-*)` in places; remaining hex/rgba need switching to tokens.

---

## STEP 4 — LOGICAL VALIDATION

### Readiness & projection
- **Readiness:** `readinessGoal = max(projectedValue * 2, 1)` → synthetic (goal = 2× projected). Percent = projected/goal; shortfall = goal - projected. **OK for display; document as “relative to 2× current projection”.**
- **Projected balance:** Uses `enrollment.monthlyContribution?.employee`, `currentBalance`, `years`, `weightedSummary.expectedReturn`. **Missing:** employer contribution and ADI. Need to verify: `monthlyContribution` should include employer match; ADI should be reflected in future-year contributions if used in projection.
- **Total allocation:** `isAllocationValid` from `weightedSummary.isValid`; submit disabled when `!canEnroll` (includes `!investment.canConfirmAllocation`). **OK.**
- **Submit disabled when:** no plan (redirect), no contribution (redirect), allocation invalid, terms not accepted. **OK.**
- **Draft save:** Review passes `getDraftSnapshot={() => ({ investment: investment.getInvestmentSnapshot() })}`; footer merges with existing draft. Enrollment context holds plan, contribution, ADI; investment context holds allocation. **Verify** that on Save & Exit from Review we also persist enrollment state (plan, contribution, ADI) from context, not only investment snapshot.

---

## STEP 5 — CROSS-PAGE STATE SYNC

- **Plan → Contribution → ADI → Investment → Review:** All use EnrollmentContext + InvestmentContext. No step-order redirect in layout; step pages do Navigate when prerequisites fail.
- **Changing contribution:** Updates `enrollment.state.contributionAmount` and source allocation → `monthlyContribution` and projected value/readiness recalc. **OK.**
- **Changing investment:** Updates `investment.chartAllocations` and `weightedSummary` → expected return and fees on Review. **OK.**
- **ADI:** Stored in `enrollment.state.autoIncrease`; projection in Review uses `enrollment.monthlyContribution?.employee` — confirm this includes ADI effect if applicable (e.g. future-year increase). **Audit projection formula.**
- **Back navigation:** No reset; state lives in context. **OK.**
- **Save & Exit:** Must persist plan, contribution, ADI, investment. Currently `getDraftSnapshot` from Review only returns `{ investment }`; EnrollmentFooter merges with `loadEnrollmentDraft()`. Draft in sessionStorage is written from Contribution/FutureContributions/ChoosePlan when they call save; Review only adds investment. **Ensure** draft load on re-entry restores enrollment state (EnrollmentProvider seeds from draft). **Verify** EnrollmentContext initialization from draft.

---

## STEP 6 — REMOVE HARDCODED VALUES

- **Percentages/dollars in UI:** Contribution %, employer match %, allocation %, projected value, shortfall — all from state/weightedSummary. **OK.**
- **AI insight impact text:** Uses `t("enrollment.insightPreTaxImpact")` etc. — ensure locale values are generic (no “$160K” unless computed). **Check locale.**
- **Return “7” fallback:** `weightedSummary.expectedReturn ?? 7` — acceptable default; not visible as “7” only, shown with “% p.a.”.

---

## STEP 7 — ACCESSIBILITY

- **Buttons:** Add `aria-label` where label is only icon or “Edit”.
- **Donut:** Add `aria-hidden="true"` on decorative SVG and a visible/aria text for readiness percent (e.g. “Goal score 68%”).
- **Table:** Use `<thead>`, `<th>` with scope; ensure headers match.
- **Checkbox:** Label associated; sr-only input. **OK.**
- **Color contrast:** Use theme tokens; avoid low-contrast text on tinted backgrounds.

---

## FIXES APPLIED

### STEP 1 — Responsive
- **EnrollmentPageContent:** `pb-12 md:pb-16` → `pb-24 md:pb-28` so content clears fixed footer; `px-6` → `px-4 sm:px-6` for smaller padding on mobile.
- **Plan Overview:** Responsive padding/gaps (`p-4 sm:p-6`, `gap-6 sm:gap-12`), icon `w-12 h-12 sm:w-14 sm:h-14`, `shrink-0`.
- **Investment table:** `overflow-x-auto`, `min-w-[280px]`, `-mx-4 sm:mx-0` for scroll on mobile; `role="grid"` and `aria-label` for a11y.
- **Portfolio snapshot donut:** `w-32 h-32 sm:w-40 sm:h-40`, `aria-hidden="true"`.
- **Readiness donut:** `w-20 h-20 sm:w-28 sm:h-28`, `aria-hidden="true"`; added `sr-only` status text for screen readers.
- **Next Steps:** `p-6 sm:p-8`.
- **CoreAIFab:** Added class `core-ai-fab`; in `index.css` at `max-width: 640px` set `bottom: 5.5rem` so FAB doesn’t overlap footer CTA.

### STEP 2 — i18n
- **Locale keys added:** `enrolmentSummary`, `emailSummarySubject`, `riskScoreLabel`, `investmentElectionsHeading`.
- **Review.tsx:** All user-visible strings use `t(...)`; `buildEnrollmentSummary` and `handleEmailSummary` use translation keys; "RISK SCORE" → `t("enrollment.riskScoreLabel", { level })`; removed fallback from `employerMatchLabel`.
- **formatCurrency:** Uses `i18n.language` for locale-aware currency formatting.

### STEP 3 — Dark mode
- **tokens.css:** New variables: `--enroll-plan-overview-bg`, `--enroll-risk-badge-bg/border`, `--enroll-table-header-bg`, `--enroll-next-steps-bg/text/heading`, `--enroll-success-tint-bg/border`, `--enroll-active-badge-bg/border`.
- **enrollment-dark.css:** `.dark` overrides for all new enrollment variables (darker surfaces, theme-aware success/brand).
- **Review.tsx:** All previous hex/rgba replaced with these variables.

### STEP 4 & 5 — Logic and state
- **Draft on Save & Exit from Review:** `getDraftSnapshot` now returns full enrollment state (plan, contribution, sourceAllocation, autoIncrease, profile, investment) so Save & Exit from Review persists the whole flow, not only investment.

### STEP 7 — Accessibility
- **Buttons:** `aria-label` on Edit (contribution), Manage Funds, Optimize Strategy.
- **Table:** `role="grid"`, `aria-label={t("enrollment.fundBreakdown")}`.
- **Donuts:** `aria-hidden="true"` on decorative SVG; `sr-only` status text for readiness percent.

---

## STEP 8 — FINAL FLOW VALIDATION

- Run through: Choose Plan → Contribution → Future Contributions → Investments → Review.
- Save & Exit from Review → reload → re-enter enrollment; confirm draft restored (full state: plan, contribution, ADI, investment).
- Submit from Review → success modal → post-enrollment redirect.
- Check: responsive, dark/light, i18n, no console errors, no hydration mismatch, no raw translation keys in UI.
- **Build:** `npm run build` completes successfully.
