import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ChartFrameProps {
  /** The chart itself. Rendered inside the image role. */
  children: ReactNode;
  className?: string;
  /** Rendered outside the image role so assistive tech can reach it. */
  dataTable?: ReactNode;
  emptyLabel?: string;
  /**
   * True when the chart itself is keyboard operable. recharts gives cartesian
   * charts a tab stop and `role="application"`, and wrapping a focusable,
   * interactive thing in `role="img"` both hides it from assistive tech and
   * lies about what it is.
   */
  interactive?: boolean;
  isEmpty?: boolean;
  label: string;
  legend?: ReactNode;
  /** Dims the plot and overlays `loadingLabel` without unmounting it. */
  loading?: boolean;
  loadingLabel?: string;
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
  interactive = false,
  isEmpty = false,
  label,
  legend,
  loading = false,
  loadingLabel = "Loading chart",
}: ChartFrameProps) {
  if (isEmpty) {
    return (
      <p className={cn("text-muted-foreground text-sm", className)}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <figure aria-label={label} className={cn("space-y-3", className)}>
      <div className="relative">
        <div
          aria-busy={loading}
          className={cn("transition-opacity", loading && "opacity-40")}
        >
          {interactive ? (
            children
          ) : (
            <div aria-label={label} role="img">
              {children}
            </div>
          )}
        </div>
        {loading ? (
          <output className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            {loadingLabel}
          </output>
        ) : null}
      </div>
      {dataTable}
      {legend}
    </figure>
  );
}
