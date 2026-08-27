import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { expect, within } from "storybook/test";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/elements/chart";

/**
 * The recharts primitives, taken from the shadcn registry unmodified.
 *
 * These are the escape hatch: reach for them when you need a chart the library
 * does not wrap. `ChartStyle` is applied by `ChartContainer` itself, so it is
 * never rendered directly.
 */
const meta = {
  component: ChartContainer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Charts/Chart",
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const LABEL = "Desktop and mobile visits by month";

const DATA = [
  { desktop: 186, mobile: 80, month: "January" },
  { desktop: 305, mobile: 200, month: "February" },
  { desktop: 237, mobile: 120, month: "March" },
  { desktop: 273, mobile: 190, month: "April" },
];

/* Colours come from the semantic chart roles, never literals, so a palette
   retunes the whole ramp without touching the chart. */
const CONFIG = {
  desktop: { color: "var(--color-chart-1)", label: "Desktop" },
  mobile: { color: "var(--color-chart-2)", label: "Mobile" },
} satisfies ChartConfig;

export const Default: Story = {
  args: { children: <div />, config: CONFIG },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: LABEL })).toBeInTheDocument();
    // Proves the chart actually drew, rather than measuring to zero height.
    await expect(canvasElement.querySelector("svg")).not.toBeNull();
  },
  render: () => (
    <ChartContainer
      aria-label={LABEL}
      className="h-[280px] w-[520px]"
      config={CONFIG}
      initialDimension={{ height: 280, width: 520 }}
      role="img"
    >
      <BarChart data={DATA}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="month"
          tickLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};
