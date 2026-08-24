import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/elements/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/elements/popover";

const meta = {
  component: Popover,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Popover",
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <p className="text-sm">Anchored content, dismissed on Escape.</p>
      </PopoverContent>
    </Popover>
  ),
};
