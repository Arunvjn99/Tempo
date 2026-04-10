import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import * as Label from "@radix-ui/react-label";
import type { SignupFormErrors } from "../signupTypes";
import type { useSignupStateCombobox } from "./useSignupStateCombobox";

type Combobox = ReturnType<typeof useSignupStateCombobox>;

export function SignupStateCombobox({
  selectedState,
  errors,
  combo,
}: {
  selectedState: string | null;
  errors: SignupFormErrors;
  combo: Combobox;
}) {
  const { t } = useTranslation();
  const {
    stateSearchQuery,
    setStateSearchQuery,
    stateDropdownOpen,
    setStateDropdownOpen,
    stateHighlightIndex,
    setStateHighlightIndex,
    dropdownRect,
    stateDropdownRef,
    stateInputRef,
    stateListboxRef,
    filteredStates,
    selectedStateName,
    onStateKeyDown,
    selectStateAtIndex,
  } = combo;

  return (
    <div className="flex w-full flex-col gap-2 overflow-visible" ref={stateDropdownRef}>
      <Label.Root htmlFor="signup-state" className="text-sm font-medium text-[var(--color-text)]">
        {t("auth.signupState")}
      </Label.Root>
      <div className="relative">
        <input
          ref={stateInputRef}
          id="signup-state"
          type="text"
          autoComplete="off"
          role="combobox"
          aria-expanded={stateDropdownOpen}
          aria-haspopup="listbox"
          aria-controls="signup-state-listbox"
          aria-activedescendant={
            stateDropdownOpen && filteredStates[stateHighlightIndex]
              ? `signup-state-option-${filteredStates[stateHighlightIndex].code}`
              : undefined
          }
          aria-autocomplete="list"
          aria-invalid={errors.location ? true : undefined}
          aria-describedby={errors.location ? "signup-state-error" : undefined}
          placeholder={t("auth.signupStatePlaceholder")}
          value={stateDropdownOpen ? stateSearchQuery : selectedStateName}
          onChange={(e) => {
            setStateSearchQuery(e.target.value);
            setStateHighlightIndex(0);
            setStateDropdownOpen(true);
          }}
          onFocus={() => {
            setStateHighlightIndex(0);
            setStateDropdownOpen(true);
          }}
          onKeyDown={onStateKeyDown}
          className={`h-[2.75rem] w-full rounded-lg border bg-[var(--color-surface)] px-4 py-3 text-base transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
            selectedStateName ? "text-[var(--color-text)]" : "text-[var(--color-textSecondary)]"
          } ${
            errors.location
              ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20"
              : "border-[var(--color-border)]"
          }`}
        />
        {stateDropdownOpen &&
          dropdownRect &&
          createPortal(
            <ul
              ref={stateListboxRef}
              id="signup-state-listbox"
              role="listbox"
              className="z-50 max-h-60 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg"
              style={{
                position: "fixed",
                top: dropdownRect.top,
                left: dropdownRect.left,
                width: dropdownRect.width,
                minWidth: dropdownRect.width,
              }}
            >
              {filteredStates.length === 0 ? (
                <li
                  role="option"
                  aria-disabled="true"
                  className="px-4 py-3 text-sm text-[var(--color-textSecondary)]"
                >
                  {t("auth.signupNoMatchingState")}
                </li>
              ) : (
                filteredStates.map((state, index) => (
                  <li
                    key={state.code}
                    id={`signup-state-option-${state.code}`}
                    role="option"
                    aria-selected={selectedState === state.code}
                    className={`cursor-pointer px-4 py-2.5 text-sm ${
                      index === stateHighlightIndex
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                        : "text-[var(--color-text)]"
                    }`}
                    onMouseEnter={() => setStateHighlightIndex(index)}
                    onClick={() => selectStateAtIndex(index)}
                  >
                    {state.name}
                  </li>
                ))
              )}
            </ul>,
            document.body,
          )}
      </div>
      {errors.location && (
        <span id="signup-state-error" className="text-sm text-[var(--color-danger)]" role="alert">
          {errors.location}
        </span>
      )}
    </div>
  );
}
