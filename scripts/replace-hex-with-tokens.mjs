/**
 * One-shot helper: replace common hex literals in TS/TSX with CSS variables.
 * Run: node scripts/replace-hex-with-tokens.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "src");

/** Longer / more specific first where needed */
const REPLACEMENTS = [
  [/#ffffff/gi, "var(--surface-card)"],
  [/#f8fafc/gi, "var(--surface-section)"],
  [/#f9fafb/gi, "var(--surface-section)"],
  [/#f1f5f9/gi, "var(--surface-soft)"],
  [/#fcfcfd/gi, "var(--surface-page)"],
  [/#f3f4f6/gi, "var(--surface-soft)"],
  [/#e5e7eb/gi, "var(--border-default)"],
  [/#e2e8f0/gi, "var(--border-default)"],
  [/#ebebec/gi, "var(--border-default)"],
  [/#cbd5e1/gi, "var(--border-default)"],
  [/#e0e0e0/gi, "var(--border-default)"],
  [/#94a3b8/gi, "var(--text-secondary)"],
  [/#64748b/gi, "var(--text-secondary)"],
  [/#475569/gi, "var(--text-secondary)"],
  [/#101828/gi, "var(--text-primary)"],
  [/#1e293b/gi, "var(--text-primary)"],
  [/#0f172a/gi, "var(--text-primary)"],
  [/#2563eb/gi, "var(--color-primary)"],
  [/#3b82f6/gi, "var(--color-primary)"],
  [/#1d4ed8/gi, "var(--color-primary-hover)"],
  [/#1e40af/gi, "var(--color-primary-active)"],
  [/#dc2626/gi, "var(--color-danger)"],
  [/#ef4444/gi, "var(--color-danger)"],
  [/#b91c1c/gi, "var(--color-danger)"],
  [/#10b981/gi, "var(--color-success)"],
  [/#059669/gi, "var(--color-success)"],
  [/#34d399/gi, "var(--color-success)"],
  [/#22c55e/gi, "var(--color-success)"],
  [/#f59e0b/gi, "var(--color-warning)"],
  [/#ca8a04/gi, "var(--color-warning)"],
  [/#c2410c/gi, "var(--color-warning)"],
  [/#fb923c/gi, "var(--color-warning)"],
  [/#7c3aed/gi, "var(--color-accent)"],
  [/#e0f2fe/gi, "color-mix(in srgb, var(--color-primary) 12%, var(--surface-card))"],
  [/#fef9c3/gi, "var(--color-warning-light)"],
  [/#dfffe0/gi, "color-mix(in srgb, var(--color-success) 15%, var(--surface-card))"],
  [/#fff4ed/gi, "color-mix(in srgb, var(--color-warning) 12%, var(--surface-card))"],
  [/#fff\b/g, "var(--surface-card)"],
  /* Blue / sky tints (loan + transfer flows) */
  [/#DBEAFE/gi, "color-mix(in srgb, var(--color-primary) 22%, var(--surface-card))"],
  [/#BFDBFE/gi, "color-mix(in srgb, var(--color-primary) 28%, var(--surface-card))"],
  [/#EFF6FF/gi, "color-mix(in srgb, var(--color-primary) 10%, var(--surface-card))"],
  [/#F0F9FF/gi, "color-mix(in srgb, var(--color-primary) 10%, var(--surface-card))"],
  [/#0EA5E9/gi, "color-mix(in srgb, var(--color-primary) 55%, var(--color-accent))"],
  /* Success tints */
  [/#F0FDF4/gi, "color-mix(in srgb, var(--color-success) 8%, var(--surface-card))"],
  [/#DCFCE7/gi, "color-mix(in srgb, var(--color-success) 14%, var(--surface-card))"],
  [/#ECFDF5/gi, "color-mix(in srgb, var(--color-success) 8%, var(--surface-card))"],
  [/#BBF7D0/gi, "color-mix(in srgb, var(--color-success) 32%, var(--border-default))"],
  /* Warning / amber tints */
  [/#FFEDD5/gi, "color-mix(in srgb, var(--color-warning) 12%, var(--surface-card))"],
  [/#FFFBEB/gi, "color-mix(in srgb, var(--color-warning) 10%, var(--surface-card))"],
  [/#FED7AA/gi, "color-mix(in srgb, var(--color-warning) 28%, var(--border-default))"],
  [/#B45309/gi, "color-mix(in srgb, var(--color-warning) 65%, var(--text-primary))"],
  [/#92400E/gi, "color-mix(in srgb, var(--color-warning) 55%, var(--text-primary))"],
  /* Accent tint */
  [/#F5F3FF/gi, "color-mix(in srgb, var(--color-accent) 10%, var(--surface-card))"],
  /* Danger / rose tints */
  [/#FEF2F2/gi, "color-mix(in srgb, var(--color-danger) 8%, var(--surface-card))"],
  [/#FEE2E2/gi, "color-mix(in srgb, var(--color-danger) 12%, var(--surface-card))"],
  [/#FCA5A5/gi, "color-mix(in srgb, var(--color-danger) 35%, var(--border-default))"],
  /* Neutrals (Figma export) */
  [/#030213/gi, "var(--text-primary)"],
  [/#0a0a0a/gi, "var(--text-primary)"],
  [/#717182/gi, "var(--text-secondary)"],
  [/#99a1af/gi, "var(--text-secondary)"],
  [/#354564/gi, "var(--text-primary)"],
  [/#155DFC/gi, "var(--color-primary)"],
  [/#7F22FE/gi, "var(--color-accent)"],
  [/#fafbfc/gi, "var(--surface-page)"],
  [/#e8ecf1/gi, "var(--border-default)"],
  [/#166534/gi, "color-mix(in srgb, var(--color-success) 45%, var(--text-primary))"],
];

const SKIP = new Set(["defaultThemes.ts", "utils.ts"]);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const base = path.basename(file);
  if (SKIP.has(base)) continue;
  let s = fs.readFileSync(file, "utf8");
  const orig = s;
  for (const [re, to] of REPLACEMENTS) s = s.replace(re, to);
  if (s !== orig) {
    fs.writeFileSync(file, s);
    changed++;
    console.log("updated", path.relative(ROOT, file));
  }
}
console.log("files changed:", changed);
