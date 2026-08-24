"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * The one sanctioned deviation from upstream shadcn.
 *
 * Upstream reads the active theme with `useTheme()` from next-themes, which
 * would put a Next-only dependency inside a framework-agnostic package. Here
 * `theme` is an ordinary prop, so the consumer supplies it from whatever it
 * already uses: next-themes, a media query, its own store.
 *
 * If this file is ever re-scaffolded with `shadcn add sonner`, the next-themes
 * import comes back. Re-apply this inversion.
 */
function Toaster({ theme = "system", ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      icons={{
        error: <OctagonXIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
        success: <CircleCheckIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
      }}
      style={
        {
          "--border-radius": "var(--radius)",
          "--normal-bg": "var(--popover)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--popover-foreground)",
        } as CSSProperties
      }
      theme={theme}
      {...props}
    />
  );
}

// Re-exported so consumers do not have to install sonner themselves. Under
// pnpm's strict node_modules a transitive dependency is not importable.
export { toast } from "sonner";
export { Toaster };
