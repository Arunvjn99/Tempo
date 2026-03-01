# Premium Unified Retirement Plan Selection — Implementation Plan

**Design source**: Superdesign  
**Project ID**: `ed18acda-ea81-4c99-a156-e9230150c7c1`  
**Draft ID**: `cf659d6f-29d4-48df-b773-2c4cec168a6b` (Premium Unified Retirement Plan Selection)

**Note**: The design could not be fetched via CLI (`API key does not have access to this draft`). This plan is based on the existing codebase, Superdesign skill workflow, and the “premium plan selection” improvements already applied. When you have API access, run:

```bash
npx @superdesign/cli get-design --draft-id cf659d6f-29d4-48df-b773-2c4cec168a6b
```

Then align this implementation with the returned design (e.g. copy, layout, or component structure).

---

## 1. Scope

- **Pages**: Plan selection flow used by:
  - `/enrollment/choose-plan` — **ChoosePlan.tsx**
  - `/enrollment/plans` — **PlansPage.tsx** (wraps ChoosePlan)
- **Components**: EnrollmentPageContent, PlanRail (HorizontalTile), PlanDetailsPanel, CTA block.
- **Goals**:
  - Reuse **global CSS** (tokens from `src/theme/tokens.css`, `src/index.css`, `src/theme/enrollment-dark.css`).
  - **Responsive**: 390px, 768px, 1024px, 1280px, 1440px — equal-width cards, no overflow, consistent CTA.
  - **Dark & light**: All colors and surfaces from theme variables (no hardcoded hex/rgba for UI).

---

## 2. Design System (Existing)

| Token / file | Purpose |
|--------------|--------|
| `--enroll-bg` | Page background |
| `--enroll-card-bg`, `--enroll-card-border`, `--enroll-card-radius` | Card surface and radius |
| `--enroll-soft-bg` | Soft backgrounds (benefit chips, disabled state) |
| `--enroll-brand`, `--enroll-brand-rgb` | Primary actions, selected state, rings |
| `--enroll-text-primary`, `--enroll-text-secondary`, `--enroll-text-muted` | Text hierarchy |
| `--enroll-elevation-1|2|3` | Shadows |
| `src/theme/tokens.css` | Light enrollment vars (in `:root`) |
| `src/theme/dark.css` | Dark base overrides |
| `src/theme/enrollment-dark.css` | Dark overrides for enrollment (choose-plan, plan-selection-card, enrollment-footer, etc.) |

Light enrollment tokens are in `tokens.css` (~lines 166–191). Dark overrides are in `tokens.css` (.dark) and `dark.css` / `enrollment-dark.css`.

---

## 3. Implementation Checklist

### 3.1 Page shell

- [x] **EnrollmentPageContent**: Already uses `var(--enroll-bg)` and `var(--enroll-text-primary)` / `var(--enroll-text-secondary)`.
- [x] **ChoosePlan.tsx**: Uses EnrollmentPageContent + grid; no inline hardcoded colors in shell.
- [x] **PlansPage.tsx**: Renders ChoosePlan only; no extra UI.

### 3.2 Plan cards (PlanRail / HorizontalTile)

- [x] **Surfaces**: Card uses `--enroll-card-bg`, `--enroll-card-border`, gradient `from-[var(--enroll-card-bg)] to-white` with `dark:to-[var(--enroll-card-bg)]` for dark.
- [x] **Selected state**: `ring-[var(--enroll-brand)]/30`, border `var(--enroll-brand)`.
- [x] **Text**: `--color-text`, `--color-textSecondary` / `--enroll-text-secondary`.
- [ ] **Decorative background (behind cards)**: Replace hardcoded `rgba(59, 130, 246, 0.2)` with theme-based (e.g. `rgb(var(--enroll-brand-rgb) / 0.12)` or a dedicated token) so it respects light/dark.
- [x] **Benefit tags**: Use `rgb(var(--enroll-brand-rgb) / 0.08)` and border; already token-based.
- [x] **Icons**: Shield / FileText with `text-[var(--enroll-brand)]/20` — theme-aware.

### 3.3 CTA block (ChoosePlan)

- [x] **Back**: Secondary style with `var(--color-border)`, `var(--color-textSecondary)`.
- [x] **Continue**: `var(--enroll-brand)` / `var(--enroll-text-muted)` when disabled; shadows use Tailwind (theme-neutral).
- No hardcoded hex in CTA.

### 3.4 Dark mode

- [x] **enrollment-dark.css**: Already covers `.choose-plan__*`, `.plan-selection-card__*`, `.enrollment-footer`, stepper.
- [ ] **PlanRail decorative gradient**: Ensure the “soft radial” behind the rail uses a variable or `.dark` override so it’s subtle in dark mode (no bright blue).
- [x] **Plan card gradient**: Dark mode uses solid `--enroll-card-bg` (no white toe).

### 3.5 Responsive

- [x] **Grid**: `grid-cols-1 lg:grid-cols-12`, left `lg:col-span-7`, right `lg:col-span-5`; left column has `min-w-0`.
- [x] **Cards**: Full width in column; `p-5 sm:p-6`; header row `flex-col sm:flex-row`.
- [x] **CTA**: `flex-col sm:flex-row sm:justify-between sm:items-center`; primary first on mobile (order-1/2).
- [x] **Sticky panel**: `lg:sticky lg:top-24` on PlanDetailsPanel.

### 3.6 Global CSS reuse

- [x] **Spacing**: Prefer `--spacing-*` or Tailwind spacing (e.g. `gap-6`, `mb-8`) consistent with the rest of the app.
- [x] **Radius**: Cards use `rounded-2xl`; tokens have `--enroll-card-radius`, `--radius-*`.
- [x] **Shadows**: Card uses `shadow-md` / `shadow-lg`; enrollment tokens have `--enroll-elevation-*` for any custom shadow needs.

---

## 4. File Map

| File | Role |
|------|------|
| `src/pages/enrollment/ChoosePlan.tsx` | Page: grid, PlanRail, CTA, PlanDetailsPanel. |
| `src/pages/enrollment/PlansPage.tsx` | Wrapper; redirect when no draft; renders ChoosePlan. |
| `src/components/enrollment/PlanRail.tsx` | Rail + HorizontalTile: cards, icons, benefits, selection. |
| `src/components/enrollment/EnrollmentPageContent.tsx` | Title, subtitle, max-width, enroll-bg. |
| `src/components/enrollment/PlanDetailsPanel.tsx` | Right panel (sticky) — ensure all colors from theme. |
| `src/theme/tokens.css` | Enrollment light tokens. |
| `src/theme/dark.css` | Dark base (enrollment vars). |
| `src/theme/enrollment-dark.css` | Dark overrides for plan selection and enrollment. |
| `src/index.css` | Any legacy `.plan-selection-card` / `.choose-plan__*` classes. |

---

## 5. After Fetching the Design

1. Run `superdesign get-design --draft-id cf659d6f-29d4-48df-b773-2c4cec168a6b` (once access is available).
2. Compare layout, copy, and hierarchy with this implementation.
3. Adjust **copy** (heading, subtext, CTA labels) if the design specifies different wording.
4. Align **layout** (e.g. card order, CTA position, right panel) if the design differs.
5. Keep all colors and spacing on **theme tokens** and **global CSS**; add or extend tokens if the design introduces new semantic colors.

---

## 6. Quick reference: Superdesign workflow (for this project)

- **Init**: `.superdesign/init/` (components.md, layouts.md, routes.md, theme.md, pages.md) — present.
- **Plan selection page tree** (from pages.md): ChoosePlan → EnrollmentPageContent, PlanRail, PlanDetailsPanel, EnrollmentLayout, DashboardLayout, DashboardHeader, EnrollmentHeaderWithStepper; theme and globals.
- **Design system**: `.superdesign/design-system.md` (if present) + `src/theme/tokens.css` and `src/index.css` (or relevant sections) as context for future design iterations.
