import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { Chip } from "@/components/chip";
import { Marquee } from "@/components/marquee";

const meta = {
  component: Marquee,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  title: "Components/Marquee",
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  "TypeScript",
  "React",
  "Tailwind",
  "Radix",
  "Motion",
  "Storybook",
  "Vitest",
  "Rolldown",
];

function Items() {
  return (
    <>
      {ITEMS.map((item) => (
        <Chip key={item} variant="outline">
          {item}
        </Chip>
      ))}
    </>
  );
}

/**
 * Also proves the strip is actually moving. It is driven frame by frame rather
 * than by a keyframe animation, which is what lets `pauseOnHover` hold position
 * instead of snapping back to the start.
 */
export const Default: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const track = canvasElement.querySelector(".w-max") as HTMLElement;
    const before = getComputedStyle(track).transform;
    await waitFor(
      () => expect(getComputedStyle(track).transform).not.toBe(before),
      { timeout: 2000 }
    );
  },
  render: () => (
    <div className="p-6">
      <Marquee>
        <Items />
      </Marquee>
    </div>
  ),
};

export const FadedAndReversed: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-4 p-6">
      <Marquee fade>
        <Items />
      </Marquee>
      <Marquee duration={18} fade pauseOnHover reverse>
        <Items />
      </Marquee>
    </div>
  ),
};
