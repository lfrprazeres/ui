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

// Radix renders the checkbox as a button, so it needs an accessible name.
// Every story supplies one, either through a Label or aria-label, because a
// story without one teaches a pattern that fails an audit.
export const Default: Story = {
  args: { "aria-label": "Accept terms" },
};

export const Checked: Story = {
  args: { "aria-label": "Accept terms", defaultChecked: true },
};

export const Disabled: Story = {
  args: { "aria-label": "Accept terms", disabled: true },
};

export const WithLabel: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms</Label>
    </div>
  ),
};
