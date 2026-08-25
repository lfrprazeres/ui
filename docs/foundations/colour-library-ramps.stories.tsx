import type { Meta, StoryObj } from "@storybook/react-vite";
import { Ramp, Section } from "./token-table";

const NEUTRAL_STEPS = [
  "0",
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

const STEPS = NEUTRAL_STEPS.slice(1);

const NEUTRALS = ["neutral", "slate", "sand"];
const CHROMATIC = [
  "gold",
  "rose",
  "emerald",
  "cyan",
  "blue",
  "violet",
  "fuchsia",
];

function LibraryRamps() {
  return (
    <div className="p-6">
      <h1 className="mb-2 font-semibold text-2xl text-foreground">
        Library ramps
      </h1>
      <p className="mb-8 max-w-3xl text-muted-foreground text-sm">
        Raw scales with no meaning attached. No component references these
        directly and no palette is obliged to use all of them. They ship as
        plain custom properties, which is the whole point: a palette can read
        them from CSS as{" "}
        <code className="font-mono text-xs">var(--cyan-500)</code>. Tailwind's
        own ramps cannot be used this way. See the Tailwind palette page for
        why.
      </p>

      <Section
        description="Achromatic and near-achromatic. Only neutral carries a 0 step, for pure white."
        title="Neutral"
      >
        {NEUTRALS.map((name) => (
          <Ramp
            key={name}
            name={name}
            steps={name === "neutral" ? NEUTRAL_STEPS : STEPS}
          />
        ))}
      </Section>

      <Section
        description="gold and sand are genuinely custom. The other five mirror Tailwind values under library-owned names, verified identical, which is what lets a palette reference them."
        title="Chromatic"
      >
        {CHROMATIC.map((name) => (
          <Ramp key={name} name={name} steps={STEPS} />
        ))}
      </Section>

      <Section title="Adding a ramp">
        <p className="max-w-3xl text-muted-foreground text-sm">
          A palette that wants a hue this list does not carry, teal or indigo or
          lime, needs it added to{" "}
          <code className="font-mono text-xs">src/tokens/01-ramps.css</code>{" "}
          first. Referencing Tailwind's equivalent directly resolves to nothing.
        </p>
      </Section>
    </div>
  );
}

const meta = {
  component: LibraryRamps,
  parameters: { layout: "fullscreen" },
  title: "Foundations/Colour/Library ramps",
} satisfies Meta<typeof LibraryRamps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LibraryRampsPage: Story = { name: "Library ramps" };
