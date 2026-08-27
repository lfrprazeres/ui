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

export type ThemeToggleLabels = Record<ThemeMode, string>;

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
  /**
   * Accessible name for the group. Supply a translated string in a localised
   * app, since the default is English.
   */
  groupLabel?: string;
  /**
   * Per-mode names, used for the tooltip and the accessible name of each
   * button. Defaults to English; override to localise.
   */
  labels?: Partial<ThemeToggleLabels>;
  onValueChange: (value: ThemeMode) => void;
  /** The active mode. This component is controlled and holds no state. */
  value: ThemeMode;
}

/** Controlled. Holds no state and reads no theme provider. */
export function ThemeToggle({
  value,
  onValueChange,
  className,
  groupLabel = "Colour theme",
  labels,
}: ThemeToggleProps) {
  return (
    <fieldset
      aria-label={groupLabel}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border bg-card p-1",
        className
      )}
    >
      {MODES.map((mode) => (
        <ThemeToggleOption
          active={mode.value === value}
          key={mode.value}
          mode={
            labels?.[mode.value]
              ? { ...mode, label: labels[mode.value] as string }
              : mode
          }
          onSelect={onValueChange}
        />
      ))}
    </fieldset>
  );
}
