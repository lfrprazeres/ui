import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "@/elements/textarea";

const meta = {
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Textarea",
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Notes", placeholder: "Write something" },
};
export const Disabled: Story = {
  args: { "aria-label": "Notes", disabled: true, placeholder: "Disabled" },
};
