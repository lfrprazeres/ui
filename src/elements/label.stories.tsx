import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@/elements/input";
import { Label } from "@/elements/label";

const meta = {
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Label",
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  args: { children: "Email" },
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="you@example.com" />
    </div>
  ),
};
