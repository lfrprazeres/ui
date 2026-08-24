import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback, AvatarImage } from "@/elements/avatar";

const meta = {
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Avatar",
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage alt="" src="" />
      <AvatarFallback>LP</AvatarFallback>
    </Avatar>
  ),
};
