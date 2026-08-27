import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { DonutChart } from "@/charts/donut-chart";

const meta = {
  component: DonutChart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Charts/DonutChart",
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const LABEL = "Allocation by asset class";

const ALLOCATION = [
  { label: "Equities", name: "equities", value: 52_400 },
  { label: "Funds", name: "funds", value: 21_800 },
  { label: "Fixed income", name: "fixed-income", value: 14_250 },
  { label: "Cash", name: "cash", value: 6100 },
];

const currency = (value: number) =>
  value.toLocaleString("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  });

export const Default: Story = {
  args: { data: ALLOCATION, formatValue: currency, label: LABEL },
  render: (args) => (
    <div className="w-80">
      <DonutChart {...args} />
    </div>
  ),
};

export const WithoutLegend: Story = {
  args: { data: ALLOCATION, label: LABEL, legend: false },
  render: (args) => (
    <div className="w-64">
      <DonutChart {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: { data: [], emptyLabel: "Nothing to allocate yet", label: LABEL },
};

/**
 * The accessibility contract every chart inherits.
 *
 * A pie chart gets no accessibility layer from recharts, so the hidden data
 * table is the only route to the numbers. Asserting its cells also catches a
 * chart that silently renders nothing, which axe would never see.
 */
export const AccessibleByDefault: Story = {
  args: { data: ALLOCATION, formatValue: currency, label: LABEL },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The SVG is one named image, not a pile of unlabelled shapes.
    await expect(canvas.getByRole("img", { name: LABEL })).toBeInTheDocument();

    // The text alternative exists, is a real table, and carries the data.
    const table = canvas.getByRole("table", { name: LABEL });
    await expect(table).toBeInTheDocument();
    await expect(
      within(table).getByRole("rowheader", { name: "Equities" })
    ).toBeInTheDocument();
    await expect(within(table).getByText("$52,400")).toBeInTheDocument();
    await expect(within(table).getByText("55.4%")).toBeInTheDocument();

    // Every slice is named in text, in order, so colour is not the only
    // carrier of meaning.
    const headers = within(table)
      .getAllByRole("rowheader")
      .map((cell) => cell.textContent);
    await expect(headers).toEqual(ALLOCATION.map((slice) => slice.label));
  },
  render: (args) => (
    <div className="w-80">
      <DonutChart {...args} />
    </div>
  ),
};
