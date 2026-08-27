"use client";

import type { ComponentProps } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLine,
  XAxis,
  YAxis,
} from "recharts";
import { ChartDataTable } from "@/charts/chart-data-table";
import { ChartFrame } from "@/charts/chart-frame";
import { ChartLegendList } from "@/charts/chart-legend-list";
import type { ChartBaseProps, ChartRow, ChartSeries } from "@/charts/types";
import { useCartesianChart } from "@/charts/use-cartesian-chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/elements/chart";
import { cn } from "@/lib/cn";

export interface LineChartValueAxis {
  /** Scale to the data range instead of anchoring at zero. */
  fit?: boolean;
  orientation?: "left" | "right";
  width?: number;
}

export interface LineChartProps extends ChartBaseProps {
  /**
   * Sizing for the plot area itself. `className` styles the whole figure, which
   * also holds the legend and the text alternative, so a height there does not
   * reach the plot: the container keeps its default aspect ratio and overflows.
   * Pass the height here instead.
   */
  chartClassName?: string;
  data: ChartRow[];
  /** Draws points as well as the line. */
  dots?: boolean;
  /** Formats the category axis ticks, e.g. a timestamp into a date. */
  formatX?: (value: string | number) => string;
  /** Draw the background grid. */
  grid?: boolean;
  /** Minimum pixels between category ticks, to stop a dense axis crowding. */
  minTickGap?: number;
  series: ChartSeries[];
  /** Replaces the default tooltip content entirely. */
  tooltip?: ComponentProps<typeof ChartTooltip>["content"];
  /** Value-axis options, or false to hide it. */
  valueAxis?: false | LineChartValueAxis;
  /** Key on each row holding the category or time value. */
  xKey: string;
}

/**
 * A trend over an ordered axis.
 *
 * recharts turns its accessibility layer on by default from v3, so the chart is
 * a single tab stop and arrow keys move between points. Do not add per-point
 * tab stops: that forces keyboard users through every value to get past the
 * chart.
 */
export function LineChart({
  chartClassName,
  className,
  data,
  dots = false,
  emptyLabel,
  formatValue,
  formatX,
  grid = true,
  label,
  loading = false,
  loadingLabel,
  minTickGap,
  legend = true,
  series,
  tooltip,
  valueAxis,
  xKey,
}: LineChartProps) {
  const axis = valueAxis === false ? null : (valueAxis ?? {});
  const { colors, columns, config, legendItems, rows } = useCartesianChart({
    data,
    formatValue,
    formatX,
    series,
    xKey,
  });

  return (
    <ChartFrame
      className={className}
      dataTable={
        <ChartDataTable caption={label} columns={columns} rows={rows} />
      }
      emptyLabel={emptyLabel}
      interactive
      isEmpty={!loading && (data.length === 0 || series.length === 0)}
      label={label}
      legend={legend ? <ChartLegendList items={legendItems} /> : null}
      loading={loading}
      loadingLabel={loadingLabel}
    >
      <ChartContainer
        className={cn(chartClassName ?? "aspect-video", "w-full")}
        config={config}
        initialDimension={{ height: 240, width: 420 }}
      >
        <RechartsLine data={data} margin={{ left: 4, right: 8, top: 8 }}>
          {grid ? (
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
          ) : null}
          <XAxis
            axisLine={false}
            dataKey={xKey}
            minTickGap={minTickGap}
            tickFormatter={formatX}
            tickLine={false}
            tickMargin={8}
          />
          {axis ? (
            <YAxis
              axisLine={false}
              domain={axis.fit ? ["dataMin", "dataMax"] : undefined}
              orientation={axis.orientation ?? "left"}
              tickFormatter={formatValue}
              tickLine={false}
              tickMargin={8}
              width={axis.width ?? 48}
            />
          ) : null}
          <ChartTooltip content={tooltip ?? <ChartTooltipContent />} />
          {series.map((entry, index) => (
            <Line
              dataKey={entry.key}
              dot={dots}
              key={entry.key}
              stroke={colors[index]}
              strokeWidth={2}
              type="monotone"
            />
          ))}
        </RechartsLine>
      </ChartContainer>
    </ChartFrame>
  );
}
