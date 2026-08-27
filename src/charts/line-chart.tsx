"use client";

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

export interface LineChartProps extends ChartBaseProps {
  data: ChartRow[];
  /** Draws points as well as the line. */
  dots?: boolean;
  series: ChartSeries[];
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
  className,
  data,
  dots = false,
  emptyLabel,
  formatValue,
  label,
  legend = true,
  series,
  xKey,
}: LineChartProps) {
  const { colors, columns, config, legendItems, rows } = useCartesianChart({
    data,
    formatValue,
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
      isEmpty={data.length === 0 || series.length === 0}
      label={label}
      legend={legend ? <ChartLegendList items={legendItems} /> : null}
    >
      <ChartContainer
        className="aspect-video w-full"
        config={config}
        initialDimension={{ height: 240, width: 420 }}
      >
        <RechartsLine data={data} margin={{ left: 4, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey={xKey}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis axisLine={false} tickLine={false} tickMargin={8} width={48} />
          <ChartTooltip content={<ChartTooltipContent />} />
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
