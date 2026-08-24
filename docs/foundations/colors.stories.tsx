import type { Meta, StoryObj } from "@storybook/react-vite";
import { Ramp, Section, SwatchGrid, TailwindRamp } from "./token-table";

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

const LIBRARY_NEUTRALS = ["neutral", "slate", "sand"];
const LIBRARY_CHROMATIC = [
  "gold",
  "rose",
  "emerald",
  "cyan",
  "blue",
  "violet",
  "fuchsia",
];

const TAILWIND_NEUTRALS = ["slate", "gray", "zinc", "neutral", "stone"];
const TAILWIND_CHROMATIC = [
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

const SURFACES = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
];

const ROLES = [
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--tertiary",
  "--tertiary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
];

const OUTLINES = ["--border", "--input", "--ring"];
const CHARTS = [
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
];
const EXTENSIONS = ["--positive", "--negative"];
const SIDEBAR = [
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-ring",
];

function ColourFoundations() {
  return (
    <div className="p-6">
      <h1 className="mb-2 font-semibold text-2xl text-foreground">Colour</h1>
      <p className="mb-8 max-w-3xl text-muted-foreground text-sm">
        Three tiers. Primitives are raw ramps with no meaning. The semantic tier
        is the public contract every component reads, defined entirely as
        references into primitives. Switch the palette in the toolbar to watch
        semantic values change while the ramps stay put.
      </p>

      <Section
        description="Shipped by the library as plain custom properties, so they are always available to palettes at var(--name-step). Only neutral carries a 0 step."
        title="Library ramps: neutral"
      >
        {LIBRARY_NEUTRALS.map((name) => (
          <Ramp
            key={name}
            name={name}
            steps={name === "neutral" ? NEUTRAL_STEPS : STEPS}
          />
        ))}
      </Section>

      <Section
        description="gold and sand are genuinely custom. The rest mirror Tailwind values under library-owned names, which is what lets a palette reference them from CSS."
        title="Library ramps: chromatic"
      >
        {LIBRARY_CHROMATIC.map((name) => (
          <Ramp key={name} name={name} steps={STEPS} />
        ))}
      </Section>

      <Section
        description="Tailwind's full default palette, available to any consumer as ordinary utilities such as bg-sky-500. These are NOT custom properties in the build unless something references them, so a palette cannot read them from CSS. Use the library ramps above for that."
        title="Tailwind palette: neutral"
      >
        {TAILWIND_NEUTRALS.map((name) => (
          <TailwindRamp key={name} name={name} steps={STEPS} />
        ))}
      </Section>

      <Section title="Tailwind palette: chromatic">
        {TAILWIND_CHROMATIC.map((name) => (
          <TailwindRamp key={name} name={name} steps={STEPS} />
        ))}
      </Section>

      <Section
        description="Page and container surfaces, paired with their foreground."
        title="Semantic: surfaces"
      >
        <SwatchGrid tokens={SURFACES} />
      </Section>

      <Section
        description="Interactive and emphasis roles. Every shadcn element reads these names."
        title="Semantic: roles"
      >
        <SwatchGrid tokens={ROLES} />
      </Section>

      <Section
        description="Borders, field fills and the focus ring."
        title="Semantic: outlines"
      >
        <SwatchGrid tokens={OUTLINES} />
      </Section>

      <Section
        description="Categorical series for data visualisation."
        title="Semantic: charts"
      >
        <SwatchGrid tokens={CHARTS} />
      </Section>

      <Section
        description="Outside shadcn's contract, added for gain and loss semantics."
        title="Extensions"
      >
        <SwatchGrid tokens={EXTENSIONS} />
      </Section>

      <Section
        description="Part of shadcn's contract, kept so a scaffolded Sidebar renders correctly even though the library does not ship one yet."
        title="Semantic: sidebar"
      >
        <SwatchGrid tokens={SIDEBAR} />
      </Section>
    </div>
  );
}

const meta = {
  component: ColourFoundations,
  parameters: { layout: "fullscreen" },
  title: "Foundations/Colour",
} satisfies Meta<typeof ColourFoundations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colour: Story = {};
