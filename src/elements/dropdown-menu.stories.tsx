import type { Meta, StoryObj } from "@storybook/react-vite";

const OPEN_MENU = /open menu/i;
const PROFILE = /profile/i;
const SETTINGS = /settings/i;

import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/elements/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/elements/dropdown-menu";

const meta = {
  component: DropdownMenu,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/DropdownMenu",
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole("button", { name: OPEN_MENU }));

    const menu = await body.findByRole("menu");
    await expect(menu).toBeVisible();

    // Arrow keys move roving focus through the items.
    await userEvent.keyboard("{ArrowDown}");
    await expect(body.getByRole("menuitem", { name: PROFILE })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(body.getByRole("menuitem", { name: SETTINGS })).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
