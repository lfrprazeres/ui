/** Shared prop shapes for the chart layer. */

export interface ChartSlice {
  /** Overrides this slice's position in the chart ramp. */
  color?: string;
  /** Display text, when it differs from the identity. */
  label?: string;
  /** Stable identity, and the default display text. */
  name: string;
  value: number;
}

/** One plotted series in a cartesian chart, keyed into each row. */
export interface ChartSeries {
  color?: string;
  key: string;
  label?: string;
}

export type ChartRow = Record<string, number | string | null | undefined>;

/** Every chart takes these. `label` is required on purpose. */
export interface ChartBaseProps {
  className?: string;
  /** Message shown instead of the chart when there is nothing to draw. */
  emptyLabel?: string;
  /** Formats values in the tooltip, legend and data table. */
  formatValue?: (value: number) => string;
  /**
   * Accessible name for the chart. Required because a chart with no name is
   * announced as "image" and nothing else.
   */
  label: string;
  legend?: boolean;
}
