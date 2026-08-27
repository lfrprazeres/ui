import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { ToggleGroup, ToggleGroupItem } from "@/elements/toggle-group";

const meta = {
  component: ToggleGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/ToggleGroup",
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const RANGES = ["1D", "5D", "1M", "1Y"];

/**
 * A segmented control. Reach for this instead of hand-rolling `role="tab"`
 * buttons: a tab without a tablist and a panel is an orphan role, and Radix
 * gives roving focus and correct pressed state for free.
 */
export const Default: Story = {
  args: { type: "single" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const oneMonth = canvas.getByRole("radio", { name: "1M" });

    await userEvent.click(oneMonth);
    await expect(oneMonth).toHaveAttribute("data-state", "on");
    await expect(canvas.getByText("Showing 1M")).toBeInTheDocument();
  },
  render: () => {
    const [range, setRange] = useState("1D");
    const handleChange = useCallback((value: string) => {
      if (value) {
        setRange(value);
      }
    }, []);
    return (
      <div className="space-y-3 text-center">
        <ToggleGroup
          aria-label="Chart range"
          onValueChange={handleChange}
          type="single"
          value={range}
        >
          {RANGES.map((item) => (
            <ToggleGroupItem key={item} value={item}>
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="text-muted-foreground text-sm">{`Showing ${range}`}</p>
      </div>
    );
  },
};

export const Multiple: Story = {
  args: { type: "multiple" },
  render: () => (
    <ToggleGroup aria-label="Text style" type="multiple" variant="outline">
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  ),
};
