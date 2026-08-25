import type { Meta, StoryObj } from "@storybook/react-vite";

const OPEN_POPOVER = /open popover/i;
const ANCHORED = /anchored content/i;

import { expect, userEvent, waitFor, within } from "storybook/test";
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

export const KeyboardDismiss: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole("button", { name: OPEN_POPOVER }));
    await expect(await body.findByText(ANCHORED)).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByText(ANCHORED)).toBeNull());
  },
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
