"use client";

import { type LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/elements/button";
import { cn } from "@/lib/cn";

export type ThemeMode = "light" | "dark" | "system";

interface Mode {
  icon: LucideIcon;
  label: string;
  value: ThemeMode;
}

const MODES = [
  { icon: SunIcon, label: "Light", value: "light" },
  { icon: MoonIcon, label: "Dark", value: "dark" },
  { icon: MonitorIcon, label: "System", value: "system" },
] satisfies Mode[];

function ThemeToggleOption({
  mode,
  active,
  onSelect,
}: {
  mode: Mode;
  active: boolean;
  onSelect: (value: ThemeMode) => void;
}) {
  const handleClick = useCallback(
    () => onSelect(mode.value),
    [mode.value, onSelect]
  );
  const Icon = mode.icon;

  return (
    <Button
      aria-label={mode.label}
      aria-pressed={active}
      className={cn("size-8", active && "bg-accent text-accent-foreground")}
      onClick={handleClick}
      size="icon-sm"
      title={mode.label}
      variant="ghost"
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}

export interface ThemeToggleProps {
  className?: string;
  onValueChange: (value: ThemeMode) => void;
  /** The active mode. This component is controlled and holds no state. */
  value: ThemeMode;
}

/**
 * Controlled theme switcher.
 *
 * Deliberately holds no state and reads no theme provider, so it works with
 * next-themes, a media query, or any store. The consumer owns the value.
 */
export function ThemeToggle({
  value,
  onValueChange,
  className,
}: ThemeToggleProps) {
  return (
    <fieldset
      aria-label="Colour theme"
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border bg-card p-1",
        className
      )}
    >
      {MODES.map((mode) => (
        <ThemeToggleOption
          active={mode.value === value}
          key={mode.value}
          mode={mode}
          onSelect={onValueChange}
        />
      ))}
    </fieldset>
  );
}
