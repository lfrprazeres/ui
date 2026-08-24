import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "@/elements/separator";

const meta = {
  component: Separator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Separator",
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm">Above</p>
      <Separator className="my-3" />
      <p className="text-sm">Below</p>
    </div>
  ),
};
