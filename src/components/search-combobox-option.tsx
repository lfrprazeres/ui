"use client";

import type { ReactNode } from "react";
import { useCallback } from "react";
import { cn } from "@/lib/cn";

export interface SearchComboboxOptionProps<T> {
  active: boolean;
  id: string;
  index: number;
  onActivate: (index: number) => void;
  onChoose: (option: T) => void;
  option: T;
  render: (option: T, active: boolean) => ReactNode;
}

/** Internal to SearchCombobox: holds the per-option handlers so they are stable. */
export function SearchComboboxOption<T>({
  active,
  id,
  index,
  onActivate,
  onChoose,
  option,
  render,
}: SearchComboboxOptionProps<T>) {
  const handleClick = useCallback(() => onChoose(option), [onChoose, option]);
  const handleMouseEnter = useCallback(
    () => onActivate(index),
    [index, onActivate]
  );

  return (
    <button
      aria-selected={active}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground"
      )}
      id={id}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role="option"
      type="button"
    >
      {render(option, active)}
    </button>
  );
}
