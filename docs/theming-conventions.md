# Theming conventions

**All colors must use design tokens. No hardcoded values allowed.**

## Rules

1. **CSS / JSX** — Use `var(--…)` from `src/core/theme/tokens.css` (and related theme files), or token-backed utilities in `token-utilities.css` (e.g. `text-primary`, `bg-surface-page`).
2. **Tailwind** — Do not use default palette utilities (`bg-white`, `text-gray-500`, `border-slate-200`, etc.). Prefer semantic utilities (`text-primary`, `text-brand`) or arbitrary values with tokens: `bg-[var(--surface-card)]`.
3. **Hex literals** — Avoid `#rrggbb` in TypeScript/TSX strings; ESLint enforces this (`theme-guard/no-hardcoded-hex`). Seed data for theme defaults may live in `defaultThemes.ts` (excluded from that rule).
4. **Inline styles** — In development, setting raw hex/rgb/hsl in `style` attributes logs a console warning. Prefer classes and CSS variables.

## Enforcement

- ESLint plugin: `eslint-plugins/theme-guard` (`theme-guard/no-hardcoded-hex`, `theme-guard/no-tailwind-palette-colors`), applied to `src/**/*.{ts,tsx}` (not `experiments/`). Ignores: `defaultThemes.ts` (seed values), `utils.ts` (hex parsing helpers).
- Dev runtime: `src/core/theme/inlineColorDevWarning.ts` (loaded from `main.tsx` in dev only).
