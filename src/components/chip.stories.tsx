import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLinkIcon, TagIcon } from "lucide-react";
import { Chip } from "@/components/chip";

const meta = {
  component: Chip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Components/Chip",
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: { children: "Chip" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip>Default</Chip>
      <Chip variant="outline">Outline</Chip>
      <Chip variant="accent">Accent</Chip>
      <Chip variant="muted">Muted</Chip>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { children: "Chip" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip icon={<TagIcon />}>Tagged</Chip>
      <Chip
        href="https://example.com"
        icon={<ExternalLinkIcon />}
        variant="accent"
      >
        Linked source
      </Chip>
      <Chip size="sm">Small</Chip>
    </div>
  ),
};
