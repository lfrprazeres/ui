import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@/elements/badge";

const meta = {
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Badge",
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: { children: "Badge" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
