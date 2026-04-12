/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      keyframes: {
        "bella-pulse": {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" },
          "50%": { transform: "scale(1.03)", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "palette-in": {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(-6px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "ai-assistant-breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        "hero-search-panel": {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "hero-ai-icon-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        "bella-pulse": "bella-pulse 2.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "palette-in": "palette-in 0.2s ease-out forwards",
        "ai-assistant-breathe": "ai-assistant-breathe 2.5s ease-in-out infinite",
        "hero-search-panel": "hero-search-panel 0.2s ease-out forwards",
        "hero-ai-icon-pulse": "hero-ai-icon-pulse 2s ease-in-out infinite",
      },
      colors: {
        /* Theme engine: all colors from CSS variables (branding_json + dark mode) */
        surface: {
          DEFAULT: "var(--color-surface)",
          page: "var(--surface-page)",
          card: "var(--surface-card)",
          soft: "var(--surface-soft)",
          elevated: "var(--surface-elevated)",
          section: "var(--surface-section)",
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          tertiary: "var(--surface-tertiary)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        "foreground-primary": "var(--text-primary)",
        "foreground-secondary": "var(--text-secondary)",
        "border-subtle": "var(--border-subtle)",
        "brand-primary": "var(--brand-primary)",
        "brand-hover": "var(--brand-hover)",
        "brand-active": "var(--brand-active)",
        /** Page canvas — same as body; use `bg-canvas` or `bg-background` */
        background: "var(--surface-page)",
        canvas: "var(--color-background)",
        "background-secondary": "var(--color-background-secondary)",
        "background-tertiary": "var(--color-background-tertiary)",
        card: "var(--surface-card)",
        "card-foreground": "var(--color-text)",
        "surface-muted": "var(--bg-surface-muted)",
        foreground: "var(--text-primary)",
        /** Muted surfaces (chips, wells) — pair with border/shadow for depth */
        muted: "var(--surface-muted)",
        "muted-foreground": "var(--text-secondary)",
        /** Secondary / accent surfaces (Figma Make + shadcn-style controls) */
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent-surface)",
          foreground: "var(--accent-surface-foreground)",
        },
        "input-background": "var(--input-background)",
        /** Brand CTA / links — prefer `text-brand` over `text-primary` (body = `text-primary` in token-utilities.css). */
        brand: {
          DEFAULT: "var(--brand-primary)",
          hover: "var(--brand-hover)",
          active: "var(--brand-active)",
        },
        primary: {
          DEFAULT: "var(--brand-primary)",
          hover: "var(--brand-hover)",
          active: "var(--brand-active)",
        },
        /** On-primary text (stepper, chips); maps to global --primary-foreground */
        "primary-foreground": "var(--primary-foreground)",
        border: {
          DEFAULT: "var(--border-default)",
          subtle: "var(--border-subtle)",
          muted: "var(--color-background-tertiary)",
        },
        danger: "var(--color-danger)",
        success: "var(--accent-success)",
        warning: "var(--accent-warning)",
        /** RetireWise enrollment — scoped under `.enrollment-theme`; fallbacks use dashboard surfaces */
        "enroll-bg": "var(--enroll-bg, var(--color-background))",
        "enroll-card": "var(--enroll-card, var(--color-card))",
        "enroll-text": "var(--enroll-text, var(--color-text))",
        "enroll-muted": "var(--enroll-muted, var(--color-text-secondary))",
        "enroll-border": "var(--enroll-border, var(--border-default))",
        /** Page-level semantic aliases (see tokens.css --token-*) */
        token: {
          bg: "var(--token-background)",
          card: "var(--token-card)",
          text: "var(--token-text)",
          muted: "var(--token-muted)",
          border: "var(--token-border)",
        },
      },
      backgroundImage: {
        "brand-gradient": "var(--brand-gradient)",
        "surface-gradient": "var(--surface-gradient)",
        "insight-gradient": "var(--insight-gradient)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        header: "var(--shadow-header)",
        "gradient-block": "var(--shadow-gradient-block)",
        "elevation-sm": "var(--elevation-sm)",
        "elevation-md": "var(--elevation-md)",
        "elevation-lg": "var(--shadow-lg)",
      },
      borderRadius: {
        /** Marketing dashboard blue gradient block */
        dashboard: "var(--radius-dashboard-gradient)",
        card: "var(--radius-2xl)",
        /** 12px — nested wells inside enrollment cards (Figma) */
        "enroll-inner": "var(--radius-xl)",
        button: "var(--radius-md)",
        input: "var(--radius-md)",
      },
      maxWidth: {
        /** SaaS app content column — use with `container-app` */
        app: "1200px",
        /** Default sidebar column in `layout-split` */
        sidebar: "16rem",
      },
      spacing: {
        "rhythm-1": "8px",
        "rhythm-2": "16px",
        "rhythm-3": "24px",
        "rhythm-4": "32px",
        /** Layout scale (aligned with `src/core/styles/layout-system.css`) */
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      fontSize: {
        /** Enrollment wizard — sizes from `src/core/theme/tokens.css` (--enroll-text-*) */
        "enroll-micro": ["var(--enroll-text-micro, 0.625rem)", { lineHeight: "0.875rem" }],
        "enroll-label": ["var(--enroll-text-label, 0.65rem)", { lineHeight: "1rem" }],
        "enroll-caption": ["var(--enroll-text-caption, 0.75rem)", { lineHeight: "1rem" }],
        "enroll-meta": ["var(--enroll-text-meta, 0.62rem)", { lineHeight: "1rem" }],
        "enroll-body-sm": ["var(--enroll-text-body-sm, 0.8125rem)", { lineHeight: "1.25rem" }],
        "enroll-body": ["var(--enroll-text-body, 0.875rem)", { lineHeight: "1.25rem" }],
        "enroll-body-md": ["var(--enroll-text-body-md, 0.9rem)", { lineHeight: "1.375rem" }],
        "enroll-subtitle": ["var(--enroll-text-subtitle, 0.95rem)", { lineHeight: "1.375rem" }],
        "enroll-lead": ["var(--enroll-text-lead, 1rem)", { lineHeight: "1.5rem" }],
        "enroll-stat": ["var(--enroll-text-stat, 1.05rem)", { lineHeight: "1.25rem" }],
        "enroll-back": ["var(--enroll-text-back, 0.85rem)", { lineHeight: "1.25rem" }],
        "enroll-footnote": ["var(--enroll-text-footnote, 0.8rem)", { lineHeight: "1.25rem" }],
        "enroll-hero-display": ["var(--enroll-text-hero-display, 2.6rem)", { lineHeight: "1" }],
        "enroll-metric-tiny": ["var(--enroll-text-metric-tiny, 0.6rem)", { lineHeight: "0.875rem" }],
        "enroll-link": ["var(--enroll-text-link, 0.7rem)", { lineHeight: "1rem" }],
      },
      letterSpacing: {
        "enroll-label": "var(--enroll-tracking-label, 0.04em)",
        "enroll-overline": "var(--enroll-tracking-overline, 0.05em)",
      },
      fontFamily: {
        sans: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
        /** Post-enrollment dashboard (Figma typography) */
        "dashboard-heading": ['"Montserrat"', "system-ui", "sans-serif"],
        "dashboard-body": ['"Open Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      });
    },
    /** SaaS layout: centered container + 12-col grid utilities */
    function ({ addComponents, theme }) {
      addComponents({
        ".container-app": {
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
          maxWidth: theme("maxWidth.app"),
          paddingLeft: theme("spacing.md"),
          paddingRight: theme("spacing.md"),
          "@screen md": {
            paddingLeft: theme("spacing.xl"),
            paddingRight: theme("spacing.xl"),
          },
        },
        ".layout-grid-12": {
          display: "grid",
          width: "100%",
          minWidth: "0",
          gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
          columnGap: theme("spacing.md"),
          rowGap: theme("spacing.md"),
          "@screen md": {
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            columnGap: theme("spacing.lg"),
            rowGap: theme("spacing.lg"),
          },
        },
        ".layout-page": {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minWidth: "0",
          rowGap: theme("spacing.lg"),
          "@screen md": {
            rowGap: theme("spacing.xl"),
          },
        },
        ".layout-split": {
          display: "grid",
          width: "100%",
          minWidth: "0",
          gridTemplateColumns: "minmax(0, 1fr)",
          columnGap: theme("spacing.lg"),
          rowGap: theme("spacing.lg"),
          "@screen lg": {
            gridTemplateColumns: `minmax(0, ${theme("maxWidth.sidebar")}) minmax(0, 1fr)`,
            columnGap: theme("spacing.xl"),
            alignItems: "start",
          },
        },
        ".layout-card-grid": {
          display: "grid",
          width: "100%",
          gridTemplateColumns: "minmax(0, 1fr)",
          columnGap: theme("spacing.md"),
          rowGap: theme("spacing.md"),
          "@screen sm": {
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            columnGap: theme("spacing.lg"),
            rowGap: theme("spacing.lg"),
          },
          "@screen lg": {
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          },
          "@screen xl": {
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          },
        },
      });
    },
  ],
};
