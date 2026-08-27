import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ChartFrameProps {
  /** The chart itself. Rendered inside the image role. */
  children: ReactNode;
  className?: string;
  /** Rendered outside the image role so assistive tech can reach it. */
  dataTable?: ReactNode;
  emptyLabel?: string;
  isEmpty?: boolean;
  label: string;
  legend?: ReactNode;
}

/**
 * The shell every chart composes: accessible name, text alternative, legend
 * and a consistent empty state.
 *
 * The nesting is load-bearing. `role="img"` collapses everything beneath it
 * into a single node for assistive technology, which is the right treatment for
 * the SVG and the wrong treatment for the data table. So the table sits beside
 * the image, not inside it.
 */
export function ChartFrame({
  children,
  className,
  dataTable,
  emptyLabel = "No data to display",
  isEmpty = false,
  label,
  legend,
}: ChartFrameProps) {
  if (isEmpty) {
    return (
      <p className={cn("text-muted-foreground text-sm", className)}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <figure className={cn("space-y-3", className)}>
      <div aria-label={label} role="img">
        {children}
      </div>
      {dataTable}
      {legend}
    </figure>
  );
}
