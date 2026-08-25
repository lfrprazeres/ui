"use client";

import { GlobeIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/elements/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/elements/dropdown-menu";
import { cn } from "@/lib/cn";

export interface LanguageOption {
  /** Optional leading adornment, such as a flag emoji. */
  icon?: ReactNode;
  label: string;
  /** Locale code, shown on the trigger. */
  value: string;
}

export interface LanguageSwitcherProps {
  className?: string;
  /** Accessible name for the trigger. */
  label?: string;
  onValueChange: (value: string) => void;
  options: LanguageOption[];
  value: string;
}

/** Controlled. Wires to next-intl, i18next or anything else from the outside. */
export function LanguageSwitcher({
  options,
  value,
  onValueChange,
  label = "Language",
  className,
}: LanguageSwitcherProps) {
  const active = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={label}
          className={cn("gap-1.5", className)}
          size="sm"
          variant="ghost"
        >
          <GlobeIcon aria-hidden="true" />
          <span className="font-medium uppercase tracking-wide">
            {active?.value ?? value}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup onValueChange={onValueChange} value={value}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.icon ? (
                <span aria-hidden="true">{option.icon}</span>
              ) : null}
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
