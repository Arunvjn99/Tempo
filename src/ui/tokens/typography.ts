/**
 * Semantic type scale — use these classes for headings and body copy instead of ad-hoc `text-[Npx]`.
 * (Marketing hero uses the larger h1 scale; enrollment Figma flow uses Tailwind scale in components.)
 */
export const typography = {
  h1: "text-[40px] leading-[48px] font-semibold tracking-tight text-foreground",
  h2: "text-[32px] leading-[40px] font-semibold tracking-tight text-foreground",
  body: "text-[16px] leading-[24px] text-foreground",
  bodyMuted: "text-[16px] leading-[24px] text-muted-foreground",
} as const;
