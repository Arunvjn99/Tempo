import { forwardRef } from "react";
import { Button } from "@/ui/components/Button";
import type { PaletteRowItem } from "@/core/search/suggestionEngine";

export type SearchResultsProps = {
  items: PaletteRowItem[];
  listId: string;
  activeDescendantId: string | undefined;
  onSelect: (item: PaletteRowItem) => void;
  /** Announced section label */
  sectionLabel: string;
};

/**
 * Glass floating list of command matches (keyboard via parent `aria-activedescendant`).
 */
export const SearchResults = forwardRef<HTMLUListElement, SearchResultsProps>(function SearchResults(
  { items, listId, activeDescendantId, onSelect, sectionLabel },
  ref,
) {
  return (
    <div className="ai-command-results-wrap">
      <p className="ai-command-results__hint">{sectionLabel}</p>
      <ul
        ref={ref}
        id={listId}
        role="listbox"
        aria-label={sectionLabel}
        className="ai-command-results"
      >
        {items.map((item) => {
          const optionId = `${listId}-opt-${item.id}`;
          const isActive = activeDescendantId === optionId;
          return (
            <li key={item.id} role="presentation">
              <Button
                type="button"
                variant="custom"
                size="custom"
                id={optionId}
                role="option"
                aria-selected={isActive}
                className="ai-command-results__row"
                data-active={isActive ? "true" : undefined}
                onClick={() => onSelect(item)}
              >
                <span className="ai-command-results__title">{item.title}</span>
                {item.subtitle ? (
                  <span className="ai-command-results__subtitle">{item.subtitle}</span>
                ) : null}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
