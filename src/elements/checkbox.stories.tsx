import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@/elements/checkbox";
import { Label } from "@/elements/label";

const meta = {
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Checkbox",
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms</Label>
    </div>
  ),
};
