import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section, TailwindRamp } from "./token-table";

const STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
];

const NEUTRALS = ["slate", "gray", "zinc", "neutral", "stone"];

const CHROMATIC = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

function TailwindPalette() {
  return (
    <div className="p-6">
      <h1 className="mb-2 font-semibold text-2xl text-foreground">
        Tailwind palette
      </h1>
      <p className="mb-4 max-w-3xl text-muted-foreground text-sm">
        Tailwind's full default palette, available to any consumer as ordinary
        utilities such as <code className="font-mono text-xs">bg-sky-500</code>.
        Shown here as a reference for what you can reach for without adding
        anything.
      </p>
      <div className="mb-8 max-w-3xl rounded-md border border-border bg-muted p-3">
        <p className="text-foreground text-sm">
          These are <strong>not</strong> custom properties in the build.
          Tailwind only emits a theme variable when something references it, so{" "}
          <code className="font-mono text-xs">var(--color-sky-500)</code> from a
          palette resolves to nothing. Use the library ramps for palettes, and
          these for one-off utility classes in an app.
        </p>
      </div>

      <Section
        description="Five neutral families, varying in temperature."
        title="Neutral"
      >
        {NEUTRALS.map((name) => (
          <TailwindRamp key={name} name={name} steps={STEPS} />
        ))}
      </Section>

      <Section title="Chromatic">
        {CHROMATIC.map((name) => (
          <TailwindRamp key={name} name={name} steps={STEPS} />
        ))}
      </Section>
    </div>
  );
}

const meta = {
  component: TailwindPalette,
  parameters: { layout: "fullscreen" },
  title: "Foundations/Colour/Tailwind palette",
} satisfies Meta<typeof TailwindPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TailwindPalettePage: Story = {};
