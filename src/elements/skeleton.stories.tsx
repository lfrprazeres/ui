import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "@/elements/skeleton";

const meta = {
  component: Skeleton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Skeleton",
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  ),
};
