"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/elements/chart";
import { cn } from "@/lib/cn";

export interface DonutSlice {
  /** Overrides this slice's position in the chart ramp. */
  color?: string;
  /** Display text, when it differs from the identity. */
  label?: string;
  /** Stable identity, and the default display text. */
  name: string;
  value: number;
}

export interface DonutChartProps {
  className?: string;
  data: DonutSlice[];
  /** Formats values in the tooltip and the legend. */
  formatValue?: (value: number) => string;
  /** Accessible name for the chart. */
  label: string;
  legend?: boolean;
}

/*
 * The five chart roles are part of the semantic tier, so a palette retunes the
 * whole ramp and this component never learns a literal colour.
 */
const RAMP = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function sliceColor(slice: DonutSlice, index: number): string {
  // The modulo keeps this in range; the literal only satisfies the checker.
  return slice.color ?? RAMP[index % RAMP.length] ?? "var(--color-chart-1)";
}

export function DonutChart({
  className,
  data,
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
          { color: sliceColor(slice, index), label: slice.label ?? slice.name },
        ])
      ),
    [data]
  );

  if (data.length === 0) {
    return null;
  }

  const format = formatValue ?? ((value: number) => value.toLocaleString());

  return (
    <div className={cn("space-y-3", className)}>
      <ChartContainer
        aria-label={label}
        className="mx-auto aspect-square max-h-56"
        config={config}
        role="img"
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
              <Cell fill={sliceColor(slice, index)} key={slice.name} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      {legend ? (
        <ul className="space-y-1.5">
          {data.map((slice, index) => (
            <li className="flex items-center gap-2 text-sm" key={slice.name}>
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: sliceColor(slice, index) }}
              />
              <span className="flex-1 truncate text-foreground">
                {slice.label ?? slice.name}
              </span>
              <span className="text-muted-foreground tabular-nums">
                {format(slice.value)}
              </span>
              <span className="w-12 text-right text-muted-foreground tabular-nums">
                {total === 0
                  ? "0%"
                  : `${((slice.value / total) * 100).toFixed(1)}%`}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
