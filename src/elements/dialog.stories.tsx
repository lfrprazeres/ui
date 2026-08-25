import type { Meta, StoryObj } from "@storybook/react-vite";

const OPEN_DIALOG = /open dialog/i;
const DELETE_PROJECT = /delete project/i;

import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/elements/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/elements/dialog";

const meta = {
  component: Dialog,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Dialog",
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This cannot be undone. The project and its history are removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Focus management is the part axe cannot check. A dialog that traps focus and
 * dismisses on Escape is the difference between usable and merely valid.
 */
export const KeyboardDismiss: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole("button", { name: OPEN_DIALOG }));

    const dialog = await body.findByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      body.getByRole("heading", { name: DELETE_PROJECT })
    ).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};
