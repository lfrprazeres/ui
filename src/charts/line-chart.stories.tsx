import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { LineChart } from "@/charts/line-chart";

const meta = {
  component: LineChart,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  title: "Charts/LineChart",
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const LABEL = "Revenue and cost by month";

const MONTHS = [
  { cost: 2400, month: "Jan", revenue: 4000 },
  { cost: 1398, month: "Feb", revenue: 3000 },
  { cost: 3800, month: "Mar", revenue: 5200 },
  { cost: 3908, month: "Apr", revenue: 4780 },
  { cost: 4800, month: "May", revenue: 5890 },
];

const SERIES = [
  { key: "revenue", label: "Revenue" },
  { key: "cost", label: "Cost" },
];

/**
 * Also carries the cartesian accessibility assertions: one tab stop for the
 * whole chart, arrow keys to move between points, and a hidden table holding
 * the same numbers.
 */
export const Default: Story = {
  args: { data: MONTHS, label: LABEL, series: SERIES, xKey: "month" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // A cartesian chart is keyboard operable, so it is a named figure rather
    // than an image: recharts owns the surface's own role.
    await expect(
      canvas.getByRole("figure", { name: LABEL })
    ).toBeInTheDocument();

    const table = canvas.getByRole("table", { name: LABEL });
    await expect(
      within(table).getByRole("rowheader", { name: "Mar" })
    ).toBeInTheDocument();
    await expect(within(table).getByText("5,200")).toBeInTheDocument();

    // The chart is a single tab stop, not one per data point.
    const focusable = canvasElement.querySelectorAll('[tabindex="0"]');
    await expect(focusable.length).toBe(1);

    // Arrow keys walk the points. recharts moves the active index and updates
    // the tooltip, but it does not put the tooltip in a live region, so a
    // screen reader hears nothing as the selection moves. That gap is the
    // reason the hidden data table is mandatory rather than a nicety.
    const surface = focusable[0] as HTMLElement;
    surface.focus();
    await expect(surface).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(
        canvasElement.querySelector(".recharts-tooltip-wrapper")?.textContent
      ).toContain("Feb")
    );
  },
  render: (args) => (
    <div className="w-[520px]">
      <LineChart {...args} />
    </div>
  ),
};

export const WithDots: Story = {
  args: {
    data: MONTHS,
    dots: true,
    label: LABEL,
    series: SERIES,
    xKey: "month",
  },
  render: (args) => (
    <div className="w-[520px]">
      <LineChart {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    data: [],
    emptyLabel: "No revenue recorded yet",
    label: LABEL,
    series: SERIES,
    xKey: "month",
  },
};

/**
 * A price series: no grid, the value axis on the right and fitted to the data
 * rather than anchored at zero, and formatted ticks on both axes. This is the
 * shape a ticker chart needs.
 */
export const PriceSeries: Story = {
  args: {
    data: MONTHS,
    formatValue: (value: number) => `$${value.toLocaleString()}`,
    formatX: (value) => String(value).slice(0, 3).toUpperCase(),
    grid: false,
    label: "Closing price by month",
    legend: false,
    series: [{ key: "revenue", label: "Close" }],
    valueAxis: { fit: true, orientation: "right", width: 64 },
    xKey: "month",
  },
  render: (args) => (
    <div className="w-[520px]">
      <LineChart {...args} />
    </div>
  ),
};
