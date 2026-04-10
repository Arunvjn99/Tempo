/** Normalized state option for combobox; supports string[] or { code?, name?, label?, state_name? }[] from source. */
export interface StateOption {
  code: string;
  name: string;
}

export function normalizeStateOptions(source: unknown): StateOption[] {
  const list = Array.isArray(source) ? source : [];
  return list
    .filter((item): item is NonNullable<typeof item> => item != null)
    .map((item): StateOption => {
      if (typeof item === "string") {
        return { code: item, name: item };
      }
      const obj = item as Record<string, unknown>;
      const name = (obj?.name ?? obj?.label ?? obj?.state_name ?? "").toString();
      const code = (obj?.code ?? obj?.name ?? obj?.label ?? name).toString();
      return { code: code || name, name: name || code };
    })
    .filter((s) => (s.name ?? "").trim() !== "");
}
