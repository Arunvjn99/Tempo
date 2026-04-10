/** Text / intent checks for guided loan chat (free-form replies). */

export function isAffirmative(input: string): boolean {
  return /^(yes|yeah|yep|sure|ok|okay|proceed|go|continue|start|next)\b/i.test(input.trim());
}

export function isNegative(input: string): boolean {
  return /^(no|nope|cancel|stop|never|not now)\b/i.test(input.trim());
}

export function parseDisbursement(input: string): "eft" | "check" | null {
  const t = input.toLowerCase();
  if (/\bcheck\b/.test(t)) return "check";
  if (/\b(bank|transfer|eft|ach|deposit|wire)\b/.test(t)) return "eft";
  return null;
}
