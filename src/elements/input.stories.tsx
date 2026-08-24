import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@/elements/input";

const meta = {
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Input",
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "you@example.com" } };
export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled" },
};
export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "not-an-email" },
};
