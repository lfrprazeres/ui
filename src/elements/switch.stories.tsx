import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "@/elements/switch";

const meta = {
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Switch",
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
