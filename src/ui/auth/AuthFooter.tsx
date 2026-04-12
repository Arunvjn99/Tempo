import { CoreLogo } from "@/components/ui/CoreLogo";
import { branding } from "@/core/config/branding";

/** Footer for auth pages: copyright (left), Privacy (center), CORE mark (right). */
export const AuthFooter = () => {
  const { copyright, privacyLink } = branding.footer;

  return (
    <footer
      className="flex w-full flex-shrink-0 items-center justify-center bg-transparent px-4 py-6 md:px-8 lg:px-12"
      role="contentinfo"
    >
      <div className="flex w-full max-w-[420px] flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0 md:max-w-[520px] lg:max-w-[560px]">
        <p className="text-center text-xs text-[var(--color-textSecondary)] sm:text-left">
          {copyright}
        </p>
        <a
          href={privacyLink.href}
          className="text-center text-xs text-[var(--color-textSecondary)] no-underline hover:underline"
        >
          {privacyLink.label}
        </a>
        <div className="flex shrink-0 items-center justify-center sm:justify-end">
          <CoreLogo className="h-6 w-auto max-h-6 max-w-[120px] object-contain object-center" />
        </div>
      </div>
    </footer>
  );
};
