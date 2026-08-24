import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatTile } from "@/components/stat-tile";

const meta = {
  component: StatTile,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Components/StatTile",
} satisfies Meta<typeof StatTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Active users", value: "12,480" },
};

export const Directions: Story = {
  args: { label: "Active users", value: "12,480" },
  render: () => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatTile
        delta={{ direction: "up", label: "+12.4% vs last month" }}
        label="Revenue"
        value="R$ 84,200"
      />
      <StatTile
        delta={{ direction: "down", label: "-3.1% vs last month" }}
        label="Churn"
        value="2.4%"
      />
      <StatTile
        caption="Unchanged for 3 weeks"
        delta={{ direction: "flat", label: "0.0%" }}
        label="Open tickets"
        value="17"
      />
    </div>
  ),
};
