import { branding } from "../config/branding";

/**
 * Minimal global footer shown on all pages.
 * Centered copyright line: "© {year} CORE All rights reserved."
 */
export const GlobalFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto flex w-full flex-shrink-0 justify-center px-4 py-8"
      role="contentinfo"
      style={{ background: "var(--surface-primary, #fff)" }}
    >
      <p
        className="text-center text-sm font-normal"
        style={{ color: "var(--color-text-secondary, #64748b)" }}
      >
        © {year} {branding.authAppName} All rights reserved.
      </p>
    </footer>
  );
};
