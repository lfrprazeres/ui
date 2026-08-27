"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartDataTable } from "@/charts/chart-data-table";
import { ChartFrame } from "@/charts/chart-frame";
import { ChartLegendList } from "@/charts/chart-legend-list";
import { rampColor } from "@/charts/chart-ramp";
import type { ChartBaseProps, ChartSlice } from "@/charts/types";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/elements/chart";
import { cn } from "@/lib/cn";

export interface DonutChartProps extends ChartBaseProps {
  /**
   * Sizing for the plot area itself. `className` styles the whole figure, which
   * also holds the legend and the text alternative, so a height there does not
   * reach the plot: the container keeps its default aspect ratio and overflows.
   * Pass the height here instead.
   */
  chartClassName?: string;
  data: ChartSlice[];
}

function share(value: number, total: number): string {
  if (total === 0) {
    return "0%";
  }
  return `${((value / total) * 100).toFixed(1)}%`;
}

/**
 * A proportional breakdown.
 *
 * Pie charts get no accessibility layer from recharts, so the data table that
 * `ChartFrame` renders is the only text alternative. That is why it is not
 * optional here.
 */
export function DonutChart({
  chartClassName,
  className,
  data,
  emptyLabel,
  formatValue,
  label,
  legend = true,
}: DonutChartProps) {
  const total = useMemo(
    () => data.reduce((sum, slice) => sum + slice.value, 0),
    [data]
  );

  const config = useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        data.map((slice, index) => [
          slice.name,
          {
            color: rampColor(index, slice.color),
            label: slice.label ?? slice.name,
          },
        ])
      ),
    [data]
  );

  const format = formatValue ?? ((value: number) => value.toLocaleString());

  return (
    <ChartFrame
      className={className}
      dataTable={
        <ChartDataTable
          caption={label}
          columns={["Category", "Value", "Share"]}
          rows={data.map((slice) => ({
            cells: [format(slice.value), share(slice.value, total)],
            header: slice.label ?? slice.name,
            key: slice.name,
          }))}
        />
      }
      emptyLabel={emptyLabel}
      isEmpty={data.length === 0}
      label={label}
      legend={
        legend ? (
          <ChartLegendList
            items={data.map((slice, index) => ({
              color: rampColor(index, slice.color),
              label: slice.label ?? slice.name,
              share: share(slice.value, total),
              value: format(slice.value),
            }))}
          />
        ) : null
      }
    >
      <ChartContainer
        className={cn(chartClassName ?? "aspect-square max-h-56", "mx-auto")}
        config={config}
        initialDimension={{ height: 224, width: 224 }}
      >
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent hideLabel nameKey="name" />}
          />
          <Pie
            data={data}
            dataKey="value"
            innerRadius="55%"
            nameKey="name"
            outerRadius="85%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((slice, index) => (
              <Cell fill={rampColor(index, slice.color)} key={slice.name} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </ChartFrame>
  );
}
