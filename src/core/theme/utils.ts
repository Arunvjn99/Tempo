/**
 * Theme utility functions for the multi-tenant theming system.
 * Handles color manipulation and dark theme generation; brand hues are static in `brand.css`.
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  font: string;
  logo: string;
}

export interface CompanyTheme {
  light: ThemeColors;
  dark: ThemeColors;
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function adjustColor(
  hex: string,
  lightnessDelta: number,
  saturationDelta = 0,
): string {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex(h, s + saturationDelta, l + lightnessDelta);
}

/**
 * Algorithmically generates a dark theme from a light theme.
 * Preserves brand hue/tone while adjusting for dark backgrounds.
 */
export function generateDarkTheme(light: ThemeColors): ThemeColors {
  const primaryHSL = hexToHSL(light.primary);
  const darkPrimary = hslToHex(
    primaryHSL.h,
    Math.min(primaryHSL.s + 5, 100),
    Math.min(primaryHSL.l + 10, 75),
  );

  const accentHSL = hexToHSL(light.accent);
  const darkAccent = hslToHex(
    accentHSL.h,
    Math.min(accentHSL.s + 5, 100),
    Math.min(accentHSL.l + 8, 70),
  );

  // Derive dark neutrals from the light background's hue so the dark theme
  // feels cohesive with the brand instead of always being slate-blue.
  const bgHSL = hexToHSL(light.background);
  const bgHue = bgHSL.s > 5 ? bgHSL.h : hexToHSL(light.primary).h;

  return {
    primary: darkPrimary,
    secondary: adjustColor(light.primary, -55, -10),
    accent: darkAccent,
    background: hslToHex(bgHue, 20, 9),
    surface: hslToHex(bgHue, 18, 14),
    textPrimary: hslToHex(bgHue, 15, 95),
    textSecondary: hslToHex(bgHue, 12, 64),
    border: hslToHex(bgHue, 16, 24),
    success: adjustColor(light.success, 8),
    warning: adjustColor(light.warning, 5),
    danger: adjustColor(light.danger, 8),
    font: light.font,
    logo: light.logo,
  };
}

/** Figma User Flow — tertiary surface (wells / nested panels); light/dark fixed neutrals. */
function _figmaSurfaceTertiary(colors: ThemeColors): string {
  const card = colors.surface.replace(/\s/g, "").toUpperCase();
  const page = colors.background.replace(/\s/g, "").toUpperCase();
  if (card === "#F8FAFC" || card === "#FFFFFF") return "#F1F5F9";
  if (page === "#0B1220" || page === "#FFFFFF") return "#1F2937";
  return adjustColor(colors.surface, -8);
}

const BRAND_HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** True when `value` is a usable brand primary/accent hex (Supabase / JSON may omit or corrupt fields). */
export function isValidBrandHex(value: string | undefined): boolean {
  return typeof value === "string" && BRAND_HEX_PATTERN.test(value.trim());
}

/**
 * Brand-only input. Structural tokens (`--surface-*`, `--text-*`, `--border-default`, etc.)
 * always come from `tokens.css` — never supplied from Supabase.
 */
/**
 * Validates a theme JSON structure.
 * Returns null if valid, or an error message string.
 */
export function validateThemeJSON(
  json: unknown,
): string | null {
  if (!json || typeof json !== "object") {
    return "Theme must be a JSON object.";
  }

  const obj = json as Record<string, unknown>;
  if (!obj.light || typeof obj.light !== "object") {
    return 'Theme must contain a "light" object.';
  }

  const requiredKeys: (keyof ThemeColors)[] = [
    "primary",
    "secondary",
    "accent",
    "background",
    "surface",
    "textPrimary",
    "textSecondary",
    "border",
    "success",
    "warning",
    "danger",
  ];

  const light = obj.light as Record<string, unknown>;
  for (const key of requiredKeys) {
    if (!light[key] || typeof light[key] !== "string") {
      return `light.${key} is required and must be a color string.`;
    }
  }

  const hexPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  for (const key of requiredKeys) {
    if (!hexPattern.test(light[key] as string)) {
      return `light.${key} must be a valid hex color (e.g. #0052CC).`;
    }
  }

  return null;
}
