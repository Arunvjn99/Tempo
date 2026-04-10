import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
} from "react";
import { US_STATES } from "@/core/constants/usStates";
import { normalizeStateOptions } from "../signupStateOptions";
import type { SignupFormErrors } from "../signupTypes";

export function useSignupStateCombobox(
  selectedState: string | null,
  setSelectedState: (v: string | null) => void,
  setErrors: Dispatch<SetStateAction<SignupFormErrors>>,
) {
  const [stateSearchQuery, setStateSearchQuery] = useState("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateHighlightIndex, setStateHighlightIndex] = useState(0);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const stateInputRef = useRef<HTMLInputElement>(null);
  const stateListboxRef = useRef<HTMLUListElement>(null);

  const stateOptions = useMemo(() => normalizeStateOptions(US_STATES), []);

  const filteredStates = useMemo(() => {
    const q = (stateSearchQuery ?? "").trim().toLowerCase();
    if (!q) return stateOptions;
    return stateOptions.filter((s) => (s?.name ?? "").toLowerCase().includes(q));
  }, [stateSearchQuery, stateOptions]);

  const selectedStateName = selectedState
    ? (stateOptions.find((s) => s?.code === selectedState)?.name ?? "")
    : "";

  useLayoutEffect(() => {
    if (!stateDropdownOpen || !stateInputRef.current) return;
    const el = stateInputRef.current;
    const updateRect = () => {
      const rect = el.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };
    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [stateDropdownOpen, stateSearchQuery, filteredStates.length]);

  useEffect(() => {
    if (!stateDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (stateDropdownRef.current?.contains(target) || stateListboxRef.current?.contains(target)) {
        return;
      }
      setStateDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [stateDropdownOpen]);

  const selectStateAtIndex = (index: number) => {
    const option = filteredStates[index];
    if (option) {
      setSelectedState(option.code);
      setStateSearchQuery("");
      setStateDropdownOpen(false);
      setErrors((prev) => ({ ...prev, location: undefined }));
    }
  };

  const onStateKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!stateDropdownOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setStateDropdownOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setStateHighlightIndex((i) => (i < filteredStates.length - 1 ? i + 1 : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setStateHighlightIndex((i) => (i > 0 ? i - 1 : filteredStates.length - 1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      selectStateAtIndex(stateHighlightIndex);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setStateDropdownOpen(false);
      setStateSearchQuery("");
    }
  };

  return {
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
  };
}
