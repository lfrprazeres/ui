import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/elements/button";
import { Toaster, toast } from "@/elements/sonner";

/**
 * The one sanctioned deviation from upstream shadcn: `theme` is a prop rather
 * than a `useTheme()` call, so the package stays framework-agnostic. This story
 * wires it to the toolbar's scheme global instead of importing next-themes, and
 * is the artefact that documents the inversion. Re-scaffolding this file with
 * the shadcn CLI brings the next-themes import back.
 */
const meta = {
  component: Toaster,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Toaster",
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAVED = "Portfolio saved";
const DURATION = 1500;

/* Hoisted so they are stable references, not new closures on every render. */
const showSuccess = () => toast.success(SAVED, { duration: DURATION });
const showError = () =>
  toast.error("Could not reach the market feed", { duration: DURATION });
const showWarning = () =>
  toast.warning("Quotes are delayed", { duration: DURATION });

export const Default: Story = {
  /*
   * sonner portals to document.body and is a module-level singleton, so the
   * assertions query the body rather than the canvas, and the story waits for
   * the toast to clear so it cannot bleed into whichever story runs next.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole("button", { name: "Show success" }));
    // Presence, not visibility: sonner animates the toast in, so a visibility
    // assertion races the transition rather than testing anything real.
    await expect(await body.findByText(SAVED)).toBeInTheDocument();

    await waitFor(() => expect(body.queryByText(SAVED)).toBeNull(), {
      timeout: DURATION + 1500,
    });
  },
  render: (args, { globals }) => (
    <div className="flex flex-wrap items-center gap-2">
      <Toaster {...args} theme={globals.scheme === "dark" ? "dark" : "light"} />
      <Button onClick={showSuccess} variant="outline">
        Show success
      </Button>
      <Button onClick={showError} variant="outline">
        Show error
      </Button>
      <Button onClick={showWarning} variant="outline">
        Show warning
      </Button>
    </div>
  ),
};
