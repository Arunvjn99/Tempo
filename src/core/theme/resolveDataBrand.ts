/**
 * Maps a company display name to a `data-brand` slug used by `brand.css`.
 * Keep in sync with selectors in `brand.css`.
 */
export function resolveDataBrand(companyName: string): string {
  const k = companyName.trim().toLowerCase();
  if (k.includes("transamerica")) return "transamerica";
  if (k.includes("congruent")) return "congruent";
  if (k.includes("lincoln")) return "lincoln";
  if (k.includes("john hancock") || k.includes("hancock")) return "john-hancock";
  return "default";
}
