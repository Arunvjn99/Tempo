/**
 * Map Tailwind default palette utilities to design-token-backed classes.
 * Run: node scripts/replace-tailwind-palette.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "src");

const REPLACEMENTS = [
  [/\bbg-gray-50\b/g, "bg-muted"],
  [/\bbg-gray-100\b/g, "bg-muted"],
  [/\bbg-slate-50\b/g, "bg-muted"],
  [/\bbg-slate-100\b/g, "bg-muted"],
  [/\bborder-gray-100\b/g, "border-border"],
  [/\bborder-gray-200\b/g, "border-border"],
  [/\bborder-slate-200\b/g, "border-border"],
  [/\btext-gray-400\b/g, "text-muted-foreground"],
  [/\btext-gray-500\b/g, "text-muted-foreground"],
  [/\btext-gray-600\b/g, "text-muted-foreground"],
  [/\btext-gray-700\b/g, "text-foreground"],
  [/\btext-gray-800\b/g, "text-foreground"],
  [/\btext-gray-900\b/g, "text-foreground"],
  [/\btext-slate-400\b/g, "text-muted-foreground"],
  [/\btext-slate-500\b/g, "text-muted-foreground"],
  [/\btext-slate-600\b/g, "text-muted-foreground"],
  [/\btext-slate-700\b/g, "text-foreground"],
  [/\btext-slate-800\b/g, "text-foreground"],
  [/\bbg-blue-50\b/g, "bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]"],
  [/\bbg-blue-100\b/g, "bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))]"],
  [/\bbg-emerald-50\b/g, "bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))]"],
  [/\bbg-emerald-100\b/g, "bg-[color-mix(in_srgb,var(--color-success)_14%,var(--surface-card))]"],
  [/\bbg-rose-50\b/g, "bg-[color-mix(in_srgb,var(--color-danger)_8%,var(--surface-card))]"],
  [/\bbg-rose-100\b/g, "bg-[color-mix(in_srgb,var(--color-danger)_12%,var(--surface-card))]"],
  [/\bbg-teal-50\b/g, "bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))]"],
  [/\bbg-teal-100\b/g, "bg-[color-mix(in_srgb,var(--color-success)_14%,var(--surface-card))]"],
  [/\bbg-violet-50\b/g, "bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--surface-card))]"],
  [/\bbg-violet-100\b/g, "bg-[color-mix(in_srgb,var(--color-accent)_14%,var(--surface-card))]"],
  [/\btext-blue-600\b/g, "text-[var(--color-primary)]"],
  [/\btext-blue-700\b/g, "text-[var(--color-primary)]"],
  [/\btext-emerald-600\b/g, "text-[var(--color-success)]"],
  [/\btext-emerald-700\b/g, "text-[var(--color-success)]"],
  [/\btext-rose-600\b/g, "text-[var(--color-danger)]"],
  [/\btext-teal-600\b/g, "text-[var(--color-success)]"],
  [/\btext-violet-600\b/g, "text-[var(--color-accent)]"],
  [/\bbg-blue-500\b/g, "bg-[var(--color-primary)]"],
  [/\bbg-blue-600\b/g, "bg-[var(--color-primary)]"],
  [/\bborder-blue-200\b/g, "border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))]"],
  [/\bborder-emerald-200\b/g, "border-[color-mix(in_srgb,var(--color-success)_28%,var(--border-default))]"],
  [/\bring-blue-100\b/g, "ring-[color-mix(in_srgb,var(--color-primary)_18%,var(--surface-card))]"],
  [/\bfrom-blue-500\b/g, "from-[var(--color-primary)]"],
  [/\bto-blue-600\b/g, "to-[var(--color-primary)]"],
  [/\bto-indigo-600\b/g, "to-[var(--color-accent)]"],
  [/\bfrom-indigo-500\b/g, "from-[var(--color-accent)]"],
  [/\bfrom-teal-500\b/g, "from-[var(--color-success)]"],
  [/\bto-emerald-600\b/g, "to-[var(--color-success)]"],
  [/\bfrom-amber-500\b/g, "from-[var(--color-warning)]"],
  [/\bto-amber-600\b/g, "to-[var(--color-warning)]"],
  [/\bhover:from-amber-600\b/g, "hover:from-[var(--color-warning)]"],
  [/\bhover:to-amber-700\b/g, "hover:to-[color-mix(in_srgb,var(--color-warning)_75%,var(--text-primary))]"],
  [/\bfrom-white\b/g, "from-[var(--surface-card)]"],
  [/\bto-gray-50\/30\b/g, "to-[color-mix(in_srgb,var(--surface-soft)_70%,transparent)]"],
  [/\bbg-black\/20\b/g, "bg-[color-mix(in_srgb,var(--text-primary)_20%,transparent)]"],
  /* Status + misc palette cleanup (second pass) */
  [/\btext-green-500\b/g, "text-[var(--color-success)]"],
  [/\btext-green-600\b/g, "text-[var(--color-success)]"],
  [/\btext-green-700\b/g, "text-[color-mix(in_srgb,var(--color-success)_55%,var(--text-primary))]"],
  [/\btext-green-800\b/g, "text-[color-mix(in_srgb,var(--color-success)_50%,var(--text-primary))]"],
  [/\bbg-green-50\b/g, "bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))]"],
  [/\bbg-green-100\b/g, "bg-[color-mix(in_srgb,var(--color-success)_14%,var(--surface-card))]"],
  [/\bborder-green-200\b/g, "border-[color-mix(in_srgb,var(--color-success)_28%,var(--border-default))]"],
  [/\btext-red-600\b/g, "text-[var(--color-danger)]"],
  [/\btext-red-700\b/g, "text-[color-mix(in_srgb,var(--color-danger)_65%,var(--text-primary))]"],
  [/\btext-red-800\b/g, "text-[color-mix(in_srgb,var(--color-danger)_55%,var(--text-primary))]"],
  [/\bbg-red-50\b/g, "bg-[color-mix(in_srgb,var(--color-danger)_8%,var(--surface-card))]"],
  [/\bbg-red-100\b/g, "bg-[color-mix(in_srgb,var(--color-danger)_12%,var(--surface-card))]"],
  [/\bborder-red-100\b/g, "border-[color-mix(in_srgb,var(--color-danger)_22%,var(--border-default))]"],
  [/\bborder-red-200\b/g, "border-[color-mix(in_srgb,var(--color-danger)_28%,var(--border-default))]"],
  [/\btext-amber-500\b/g, "text-[var(--color-warning)]"],
  [/\btext-amber-600\b/g, "text-[var(--color-warning)]"],
  [/\btext-amber-700\b/g, "text-[color-mix(in_srgb,var(--color-warning)_65%,var(--text-primary))]"],
  [/\btext-amber-800\b/g, "text-[color-mix(in_srgb,var(--color-warning)_55%,var(--text-primary))]"],
  [/\bbg-amber-50\b/g, "bg-[color-mix(in_srgb,var(--color-warning)_10%,var(--surface-card))]"],
  [/\bbg-amber-100\b/g, "bg-[color-mix(in_srgb,var(--color-warning)_14%,var(--surface-card))]"],
  [/\bbg-amber-200\b/g, "bg-[color-mix(in_srgb,var(--color-warning)_18%,var(--surface-card))]"],
  [/\bborder-amber-100\b/g, "border-[color-mix(in_srgb,var(--color-warning)_22%,var(--border-default))]"],
  [/\bborder-amber-200\b/g, "border-[color-mix(in_srgb,var(--color-warning)_28%,var(--border-default))]"],
  [/\bborder-amber-300\b/g, "border-[color-mix(in_srgb,var(--color-warning)_32%,var(--border-default))]"],
  [/\btext-violet-500\b/g, "text-[var(--color-accent)]"],
  [/\bdark:text-violet-300\b/g, "dark:text-[color-mix(in_srgb,var(--color-accent)_75%,var(--surface-card))]"],
  [/\bbg-violet-500\/10\b/g, "bg-[color-mix(in_srgb,var(--color-accent)_12%,transparent)]"],
  [/\bbg-violet-600\b/g, "bg-[var(--color-accent)]"],
  [/\bbg-violet-200\b/g, "bg-[color-mix(in_srgb,var(--color-accent)_22%,var(--surface-card))]"],
  [/\bbg-emerald-600\b/g, "bg-[var(--color-success)]"],
  [/\bbg-emerald-200\b/g, "bg-[color-mix(in_srgb,var(--color-success)_22%,var(--surface-card))]"],
  [/\bbg-amber-600\b/g, "bg-[var(--color-warning)]"],
  [/\bbg-amber-200\b/g, "bg-[color-mix(in_srgb,var(--color-warning)_22%,var(--surface-card))]"],
  [/\bbg-indigo-50\b/g, "bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]"],
  [/\bbg-indigo-100\b/g, "bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))]"],
  [/\btext-indigo-600\b/g, "text-[var(--color-primary)]"],
  [/\bborder-indigo-200\b/g, "border-[color-mix(in_srgb,var(--color-primary)_28%,var(--border-default))]"],
  [/\bborder-indigo-300\b/g, "border-[color-mix(in_srgb,var(--color-primary)_32%,var(--border-default))]"],
  [/\bfocus:ring-indigo-500\/20\b/g, "focus:ring-[color-mix(in_srgb,var(--color-primary)_22%,transparent)]"],
  [/\bfocus:border-indigo-400\b/g, "focus:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--border-default))]"],
  [/\btext-yellow-500\b/g, "text-[var(--color-warning)]"],
  [/\btext-purple-500\b/g, "text-[var(--color-accent)]"],
  [/\btext-emerald-500\b/g, "text-[var(--color-success)]"],
  [/\bfrom-emerald-400\b/g, "from-[color-mix(in_srgb,var(--color-success)_65%,var(--surface-card))]"],
  [/\bfrom-teal-400\b/g, "from-[color-mix(in_srgb,var(--color-success)_55%,var(--surface-card))]"],
  [/\btext-rose-700\b/g, "text-[color-mix(in_srgb,var(--color-danger)_60%,var(--text-primary))]"],
  [/\bborder-rose-100\b/g, "border-[color-mix(in_srgb,var(--color-danger)_22%,var(--border-default))]"],
  [/\bfrom-rose-50\b/g, "from-[color-mix(in_srgb,var(--color-danger)_8%,var(--surface-card))]"],
  [/\bto-pink-50\b/g, "to-[color-mix(in_srgb,var(--color-danger)_6%,var(--surface-card))]"],
  [/\bborder-blue-100\b/g, "border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))]"],
  [/\bfrom-blue-50\b/g, "from-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]"],
  [/\bto-purple-50\b/g, "to-[color-mix(in_srgb,var(--color-accent)_10%,var(--surface-card))]"],
  [/\bfrom-orange-50\b/g, "from-[color-mix(in_srgb,var(--color-warning)_8%,var(--surface-card))]"],
  [/\bbg-orange-200\/10\b/g, "bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)]"],
  [/\bbg-sky-500\/10\b/g, "bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)]"],
  [/\bborder-sky-500\/20\b/g, "border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))]"],
  [/\btext-sky-400\b/g, "text-[var(--color-primary)]"],
];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith(".tsx")) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
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
