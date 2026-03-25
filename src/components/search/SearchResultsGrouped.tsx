import { forwardRef, Fragment } from "react";
import type { PaletteRowItem } from "@/core/search/suggestionEngine";

export type SearchResultGroup = {
  label: string;
  items: PaletteRowItem[];
};

export type SearchResultsGroupedProps = {
  groups: SearchResultGroup[];
  listId: string;
  activeDescendantId: string | undefined;
  onSelect: (item: PaletteRowItem) => void;
};

/**
 * Command palette listbox with section headers (commands vs actions).
 */
export const SearchResultsGrouped = forwardRef<HTMLUListElement, SearchResultsGroupedProps>(
  function SearchResultsGrouped({ groups, listId, activeDescendantId, onSelect }, ref) {
    return (
      <div className="ai-command-results-wrap">
        <ul
          ref={ref}
          id={listId}
          role="listbox"
          aria-label="Search suggestions"
          className="ai-command-results ai-command-results--grouped"
        >
          {groups.map((group) => (
            <Fragment key={group.label}>
              <li role="presentation" className="ai-command-results__section">
                <span className="ai-command-results__section-label">{group.label}</span>
              </li>
              {group.items.map((item) => {
                const optionId = `${listId}-opt-${item.id}`;
                const isActive = activeDescendantId === optionId;
                return (
                  <li key={item.id} role="presentation">
                    <button
                      type="button"
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
                    </button>
                  </li>
                );
              })}
            </Fragment>
          ))}
        </ul>
      </div>
    );
  },
);
