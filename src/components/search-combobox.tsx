"use client";

import { SearchIcon } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { SearchComboboxOption } from "@/components/search-combobox-option";
import { cn } from "@/lib/cn";

export interface SearchComboboxProps<T> {
  className?: string;
  /** Shown when the query returned nothing. */
  emptyLabel: ReactNode;
  /** Stable identity for each option, used for keys and aria wiring. */
  getOptionKey: (option: T) => string;
  icon?: ReactNode;
  /** Accessible name for the input. A placeholder is not a label. */
  label: string;
  /** Replaces the icon and list with a pending message. */
  loading?: boolean;
  loadingLabel?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onQueryChange: (query: string) => void;
  onSelect: (option: T) => void;
  /** Already filtered. This component matches nothing on its own. */
  options: T[];
  placeholder?: string;
  query: string;
  renderOption: (option: T, active: boolean) => ReactNode;
}

/**
 * A combobox with a listbox popup, following the ARIA authoring practices:
 * focus stays in the input and the active option is pointed at with
 * `aria-activedescendant` rather than moved.
 *
 * Controlled and source-agnostic. Filtering, fetching and what a selection
 * does all belong to the caller.
 */
export function SearchCombobox<T>({
  className,
  emptyLabel,
  getOptionKey,
  icon,
  label,
  loading = false,
  loadingLabel,
  onOpenChange,
  onQueryChange,
  onSelect,
  options,
  placeholder,
  query,
  renderOption,
}: SearchComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const changeOpen = useCallback(
    (next: boolean) => {
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        changeOpen(false);
      }
    }
    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [open, changeOpen]);

  const choose = useCallback(
    (option: T) => {
      changeOpen(false);
      onSelect(option);
    },
    [changeOpen, onSelect]
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        changeOpen(false);
        inputRef.current?.blur();
        return;
      }
      if (options.length === 0) {
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % options.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(
          (index) => (index - 1 + options.length) % options.length
        );
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const target = options[activeIndex];
        if (target) {
          choose(target);
        }
      }
    },
    [activeIndex, changeOpen, choose, options]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onQueryChange(event.target.value);
      setActiveIndex(0);
      changeOpen(true);
    },
    [changeOpen, onQueryChange]
  );

  const handleFocus = useCallback(() => changeOpen(true), [changeOpen]);

  const active = options[activeIndex];

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
        {icon ?? <SearchIcon aria-hidden="true" />}
      </span>
      <input
        // Options only exist while the listbox is open, so pointing at one
        // when it is closed leaves a dangling ARIA reference.
        aria-activedescendant={
          open && active ? `${listboxId}-${getOptionKey(active)}` : undefined
        }
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-label={label}
        autoComplete="off"
        className="h-9 w-full rounded-md border border-border bg-card pr-3 pl-9 text-foreground text-sm shadow-xs transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50"
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={inputRef}
        role="combobox"
        type="search"
        value={query}
      />
      {open ? (
        <div
          className="absolute right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-md border border-border bg-popover shadow-md"
          id={listboxId}
          role="listbox"
        >
          {loading ? (
            <p className="px-3 py-3 text-muted-foreground text-sm">
              {loadingLabel}
            </p>
          ) : null}
          {!loading && options.length === 0 ? (
            <p className="px-3 py-3 text-muted-foreground text-sm">
              {emptyLabel}
            </p>
          ) : null}
          {options.map((option, index) => (
            <SearchComboboxOption
              active={index === activeIndex}
              id={`${listboxId}-${getOptionKey(option)}`}
              index={index}
              key={getOptionKey(option)}
              onActivate={setActiveIndex}
              onChoose={choose}
              option={option}
              render={renderOption}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
