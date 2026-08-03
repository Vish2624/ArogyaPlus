import { Search } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { createPortal } from "react-dom";

import { fuzzySearch } from "@/utils/fuzzyMatch";

export interface AutocompleteSuggestion {
  id: number | string;
  label: string;
  subtitle?: string | null;
}

interface SearchAutocompleteProps<T extends AutocompleteSuggestion> {
  value: string;
  onChange: (value: string) => void;
  items: T[];
  onSelect?: (item: T) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  emptyLabel?: string;
  /** Change this value (e.g. a slide index) to force the dropdown closed, such as when content around the input reflows. */
  closeSignal?: number | string;
  /** Fires true when the input gains focus and false when it loses focus (clicking a suggestion doesn't blur it). */
  onActiveChange?: (active: boolean) => void;
}

export default function SearchAutocomplete<T extends AutocompleteSuggestion>({
  value,
  onChange,
  items,
  onSelect,
  placeholder = "Search...",
  className = "",
  inputClassName = "form-input pl-10",
  iconClassName = "left-3.5 h-4 w-4 text-slate-500",
  emptyLabel = "No matches. Try a different spelling.",
  closeSignal,
  onActiveChange,
}: SearchAutocompleteProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => fuzzySearch(value, items, (i) => i.label, 8), [value, items]);
  const showDropdown = open && value.trim().length > 0;

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideWrapper = wrapperRef.current?.contains(target);
      const insideDropdown = dropdownRef.current?.contains(target);
      if (!insideWrapper && !insideDropdown) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Closes on any layout shift the dropdown can't track on its own (auto-sliding hero content, etc).
  useEffect(() => {
    setOpen(false);
  }, [closeSignal]);

  const updateRect = () => {
    const el = wrapperRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    setRect({ top: box.bottom + 6, left: box.left, width: box.width });
  };

  useLayoutEffect(() => {
    if (!showDropdown) return;
    updateRect();
    // Scrolling closes the dropdown outright rather than chasing the anchor's new position -
    // repositioning lagged behind fast scrolls and left a detached list floating on screen.
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", updateRect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDropdown]);

  const selectSuggestion = (item: T) => {
    if (onSelect) onSelect(item);
    else onChange(item.label);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const dropdown =
    showDropdown && rect
      ? createPortal(
          <div ref={dropdownRef} style={{ position: "fixed", top: rect.top, left: rect.left, width: rect.width }} className="z-[100]">
            {suggestions.length > 0 ? (
              <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 text-left shadow-elevated">
                {suggestions.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectSuggestion(item)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                        index === activeIndex ? "bg-primary-50 text-primary-800" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate font-medium">{item.label}</span>
                      {item.subtitle && <span className="shrink-0 text-xs font-semibold text-slate-400">{item.subtitle}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            ) : items.length > 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-500 shadow-elevated">
                {emptyLabel}
              </div>
            ) : null}
          </div>,
          document.body
        )
      : null;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <Search className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${iconClassName}`} aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          onActiveChange?.(true);
        }}
        onBlur={() => onActiveChange?.(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={showDropdown && suggestions.length > 0}
        aria-autocomplete="list"
        className={inputClassName}
      />
      {dropdown}
    </div>
  );
}
