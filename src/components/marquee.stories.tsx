import type { Meta, StoryObj } from "@storybook/react-vite";
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

export const Default: Story = {
  args: { children: null },
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
      <Marquee duration={18} fade reverse>
        <Items />
      </Marquee>
    </div>
  ),
};
