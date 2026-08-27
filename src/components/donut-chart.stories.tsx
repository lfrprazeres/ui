import type { Meta, StoryObj } from "@storybook/react-vite";
import { DonutChart } from "@/components/donut-chart";

const meta = {
  component: DonutChart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Components/DonutChart",
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

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
  args: { data: ALLOCATION, label: "Allocation by asset class" },
  render: (args) => (
    <div className="w-80">
      <DonutChart {...args} formatValue={currency} />
    </div>
  ),
};

export const WithoutLegend: Story = {
  args: { data: ALLOCATION, label: "Allocation by asset class", legend: false },
  render: (args) => (
    <div className="w-64">
      <DonutChart {...args} />
    </div>
  ),
};
