import type { Meta, StoryObj } from "@storybook/react-vite";
import { StreamingDots } from "@/components/streaming-dots";

const meta = {
  component: StreamingDots,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Components/StreamingDots",
} satisfies Meta<typeof StreamingDots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnSurfaces: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <span className="text-foreground">
        <StreamingDots />
      </span>
      <span className="rounded-md bg-primary px-3 py-2 text-primary-foreground">
        <StreamingDots />
      </span>
      <span className="text-muted-foreground">
        <StreamingDots label="Thinking" />
      </span>
    </div>
  ),
};
