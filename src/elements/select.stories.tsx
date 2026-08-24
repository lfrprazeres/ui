import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/elements/select";

const meta = {
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Select",
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Pick a locale" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="pt">Portugues</SelectItem>
        <SelectItem value="es">Espanol</SelectItem>
      </SelectContent>
    </Select>
  ),
};
