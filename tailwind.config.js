/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
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
        "surface-primary": "var(--surface-primary)",
        "surface-secondary": "var(--surface-secondary)",
        "foreground-primary": "var(--text-primary)",
        "foreground-secondary": "var(--text-secondary)",
        "border-subtle": "var(--border-subtle)",
        "brand-primary": "var(--brand-primary)",
        "brand-hover": "var(--brand-hover)",
        "brand-active": "var(--brand-active)",
        background: "var(--color-background)",
        "background-secondary": "var(--color-background-secondary)",
        "background-tertiary": "var(--color-background-tertiary)",
        card: "var(--card-bg)",
        "card-foreground": "var(--color-text)",
        surface: "var(--color-surface)",
        "surface-muted": "var(--bg-surface-muted)",
        foreground: "var(--color-text)",
        muted: "var(--color-text-secondary)",
        "muted-foreground": "var(--color-text-tertiary)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          active: "var(--color-primary-active)",
        },
        /** On-primary text (stepper, chips); maps to global --primary-foreground */
        "primary-foreground": "var(--primary-foreground)",
        border: {
          DEFAULT: "var(--color-border)",
          subtle: "var(--border-subtle)",
          muted: "var(--color-background-tertiary)",
        },
        danger: "var(--color-danger)",
        success: "var(--accent-success)",
        warning: "var(--accent-warning)",
      },
      backgroundImage: {
        "brand-gradient": "var(--brand-gradient)",
        "surface-gradient": "var(--surface-gradient)",
        "insight-gradient": "var(--insight-gradient)",
      },
      boxShadow: {
        "elevation-sm": "var(--elevation-sm)",
        "elevation-md": "var(--elevation-md)",
      },
      borderRadius: {
        card: "var(--radius-2xl)",
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
