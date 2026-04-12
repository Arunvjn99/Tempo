/** Base path for the Figma Make enrollment flow (nested under app router). */
export const ENROLLMENT_BASE = "/enrollment" as const;

/** Build absolute path under `/enrollment/...` (matches source app routes like `/plan`). */
export function ep(segment: string): string {
  const s = segment.replace(/^\//, "");
  if (!s) return ENROLLMENT_BASE;
  return `${ENROLLMENT_BASE}/${s}`;
}
