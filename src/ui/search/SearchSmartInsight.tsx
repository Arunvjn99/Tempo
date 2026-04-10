export type SearchSmartInsightProps = {
  query: string;
};

/**
 * V4 reset: legacy enrollment wizard store lives under `src/legacy`. Insight strip disabled until V4 enrollment ships.
 */
export function SearchSmartInsight({ query }: SearchSmartInsightProps) {
  void query;
  return null;
}
