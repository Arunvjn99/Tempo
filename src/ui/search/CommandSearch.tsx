import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { groupPaletteRows, suggestionsToPaletteRows } from "@/core/search/suggestionEngine";
import { useSearch } from "@/core/hooks/useSearch";
import { openKnowMoreForQuickAnswer } from "@/core/search/knowMoreFromQuickAnswer";
import { SearchOverlay } from "./SearchOverlay";
import { SearchInput } from "./SearchInput";
import { SearchResultsGrouped } from "./SearchResultsGrouped";
import { EmptyState } from "./EmptyState";
import { AiFallbackCard } from "./AiFallbackCard";
import { InlineAnswerCard } from "./InlineAnswerCard";
import { SearchDiscoveryPanel } from "./SearchDiscoveryPanel";
import { SearchAITrustStrip } from "./SearchAITrustStrip";
import { SearchSmartInsight } from "./SearchSmartInsight";

export type CommandSearchProps = {
  onClose: () => void;
  initialQuery?: string;
};

type UiPhase = "idle" | "focused" | "typing" | "results" | "no-results";

function useDebouncedTyping(query: string, ms: number) {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setTyping(true);
    const t = window.setTimeout(() => setTyping(false), ms);
    return () => window.clearTimeout(t);
  }, [query, ms]);

  return typing;
}

/**
 * Global command palette: scripted scenarios + Core AI fallback (same engine as hero search).
 */
export function CommandSearch({ onClose, initialQuery = "" }: CommandSearchProps) {
  const { query, setQuery, suggestions, answer, handleSelect, submitWithSuggestionRows, submitFreeform } = useSearch({
    initialQuery,
  });
  const [inputFocused, setInputFocused] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const titleId = useId();
  const listId = useId();
  const emptyHeadingId = useId();

  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const paletteRows = useMemo(() => suggestionsToPaletteRows(safeSuggestions), [safeSuggestions]);
  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;
  const { ordered: matches, groups } = useMemo(
    () => groupPaletteRows(paletteRows, hasQuery),
    [paletteRows, hasQuery],
  );

  /** Same order as grouped list rows — required for `submitWithSuggestionRows` / Enter submit. */
  const suggestionRows = useMemo(
    () =>
      (Array.isArray(matches) ? matches : []).map((m) => ({
        scenarioId: m.scenarioId,
        label: m.title,
      })),
    [matches],
  );

  const isTyping = useDebouncedTyping(query, 240);

  const showQuickAnswer = Boolean(answer && trimmed.length > 0);
  const noLocalMatches = trimmed.length > 0 && matches.length === 0;
  const showTypingDots = isTyping && trimmed.length > 0;
  const showNoResults = !isTyping && noLocalMatches;

  const uiPhase: UiPhase = useMemo(() => {
    if (showTypingDots) return "typing";
    if (showNoResults) return "no-results";
    if (matches.length > 0) return "results";
    if (inputFocused) return "focused";
    return "idle";
  }, [showTypingDots, showNoResults, matches.length, inputFocused]);

  const listOptionIds = useMemo(
    () => matches.map((m) => `${listId}-opt-${m.id}`),
    [matches, listId],
  );

  const activeDescendantId = activeIndex >= 0 && activeIndex < listOptionIds.length ? listOptionIds[activeIndex] : undefined;

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.classList.add("global-search-open");
    return () => {
      document.body.classList.remove("global-search-open");
    };
  }, []);

  useEffect(() => {
    const onKey = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const runSubmit = useCallback(() => {
    if (activeIndex < 0 && !query.trim()) return;
    submitWithSuggestionRows(activeIndex, suggestionRows);
    onClose();
  }, [query, activeIndex, suggestionRows, submitWithSuggestionRows, onClose]);

  const activateItem = useCallback(
    (item: (typeof matches)[number]) => {
      handleSelect(item.scenarioId, item.title);
      onClose();
    },
    [handleSelect, onClose],
  );

  const scrollActiveIntoView = useCallback(
    (index: number) => {
      const el = listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(listOptionIds[index] ?? "")}`);
      el?.scrollIntoView({ block: "nearest" });
    },
    [listOptionIds],
  );

  const onFormKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLFormElement>) => {
      if (showNoResults) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => {
          const next = i < matches.length - 1 ? i + 1 : 0;
          requestAnimationFrame(() => scrollActiveIntoView(next));
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => {
          const next = i <= 0 ? matches.length - 1 : i - 1;
          requestAnimationFrame(() => scrollActiveIntoView(next));
          return next;
        });
      } else if (e.key === "Enter" && activeIndex >= 0 && matches[activeIndex]) {
        e.preventDefault();
        activateItem(matches[activeIndex]);
      }
    },
    [showNoResults, matches, activeIndex, activateItem, scrollActiveIntoView],
  );

  const showDiscovery = !hasQuery && !showTypingDots && matches.length > 0 && !showNoResults;

  const overlay = (
    <SearchOverlay onClose={onClose} labelId={titleId}>
      <div
        className="ai-command-stage-inner animate-palette-in"
        data-ui-phase={uiPhase}
      >
        <h2 id={titleId} className="sr-only">
          AI command search
        </h2>
        <form
          className="ai-command-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (showNoResults) {
              if (trimmed) submitFreeform(trimmed);
              onClose();
              return;
            }
            if (activeIndex >= 0 && matches[activeIndex]) {
              activateItem(matches[activeIndex]);
              return;
            }
            runSubmit();
          }}
          onKeyDown={onFormKeyDown}
        >
          <SearchInput
            id={`${titleId}-input`}
            value={query}
            onChange={setQuery}
            onClear={() => {
              setQuery("");
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            inputRef={inputRef}
            placeholder="Search or ask anything about your account…"
            aria-controls={showNoResults ? undefined : listId}
            aria-activedescendant={showNoResults ? undefined : activeDescendantId}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />

          <SearchAITrustStrip />

          {hasQuery && !showTypingDots ? <SearchSmartInsight query={query} /> : null}

          {showTypingDots ? (
            <div className="ai-command-typing" aria-hidden>
              <span className="ai-command-typing__dot" />
              <span className="ai-command-typing__dot" />
              <span className="ai-command-typing__dot" />
            </div>
          ) : (
            <div className="ai-command-typing ai-command-typing--placeholder" aria-hidden />
          )}

          <div className="ai-command-panel ai-command-panel--discovery">
            {showQuickAnswer && answer ? (
              <InlineAnswerCard
                question={answer.question}
                shortAnswer={answer.answer}
                containerClassName="search-palette-quick-answer search-palette-quick-answer--in-panel"
                onKnowMore={() => {
                  openKnowMoreForQuickAnswer(answer, trimmed);
                  onClose();
                }}
              />
            ) : null}

            {showDiscovery ? (
              <SearchDiscoveryPanel
                className="search-discovery-panel--in-panel"
                onFillSearch={(text) => {
                  setQuery(text);
                  setActiveIndex(-1);
                  requestAnimationFrame(() => inputRef.current?.focus());
                }}
                onRunScenario={(scenarioId, label) => {
                  handleSelect(scenarioId, label);
                  onClose();
                }}
              />
            ) : null}

            {showNoResults ? (
              <>
                <EmptyState query={query} listLabelId={emptyHeadingId} />
                <AiFallbackCard
                  query={query}
                  onActivate={() => {
                    if (trimmed) submitFreeform(trimmed);
                  }}
                />
              </>
            ) : matches.length > 0 ? (
              <SearchResultsGrouped
                ref={listRef}
                groups={groups}
                listId={listId}
                activeDescendantId={activeDescendantId}
                onSelect={activateItem}
              />
            ) : null}
          </div>
        </form>
      </div>
    </SearchOverlay>
  );

  return createPortal(overlay, document.body);
}
