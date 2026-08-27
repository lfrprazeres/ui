"use client";

import { useMemo } from "react";
import { rampColor } from "@/charts/chart-ramp";
import type { ChartRow, ChartSeries } from "@/charts/types";
import type { ChartConfig } from "@/elements/chart";

export interface CartesianChartInput {
  data: ChartRow[];
  formatValue?: (value: number) => string;
  series: ChartSeries[];
  xKey: string;
}

/**
 * Derives everything the cartesian charts share: the recharts config, the
 * resolved ramp colours, the legend entries and the rows of the text
 * alternative.
 *
 * The axes and grid are deliberately *not* abstracted into a component.
 * recharts inspects its direct children by type to work out what to render, so
 * wrapping `XAxis` and friends in a helper component makes them invisible to
 * it. They stay inline in each chart on purpose.
 */
export function useCartesianChart({
  data,
  formatValue,
  series,
  xKey,
}: CartesianChartInput) {
  const format = useMemo(
    () => formatValue ?? ((value: number) => value.toLocaleString()),
    [formatValue]
  );

  const colors = useMemo(
    () => series.map((entry, index) => rampColor(index, entry.color)),
    [series]
  );

  const config = useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        series.map((entry, index) => [
          entry.key,
          {
            color: rampColor(index, entry.color),
            label: entry.label ?? entry.key,
          },
        ])
      ),
    [series]
  );

  const legendItems = useMemo(
    () =>
      series.map((entry, index) => ({
        color: rampColor(index, entry.color),
        label: entry.label ?? entry.key,
      })),
    [series]
  );

  const columns = useMemo(
    () => [xKey, ...series.map((entry) => entry.label ?? entry.key)],
    [series, xKey]
  );

  const rows = useMemo(
    () =>
      data.map((row) => ({
        cells: series.map((entry) => {
          const value = row[entry.key];
          return typeof value === "number"
            ? format(value)
            : String(value ?? "");
        }),
        header: String(row[xKey] ?? ""),
      })),
    [data, format, series, xKey]
  );

  return { colors, columns, config, legendItems, rows };
}
