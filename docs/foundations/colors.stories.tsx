import type { Meta, StoryObj } from "@storybook/react-vite";
import { Ramp, Section, SwatchGrid } from "./token-table";

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

const WARM_STEPS = NEUTRAL_STEPS.slice(1);

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
      <p className="mb-8 max-w-2xl text-muted-foreground text-sm">
        Three tiers. Primitives are raw ramps with no meaning. The semantic tier
        below is the public contract every component reads, and it is defined
        entirely as references into the primitives. Switch the palette in the
        toolbar to watch the semantic values change while the ramps stay put.
      </p>

      <Section
        description="Raw scales. No component references these directly."
        title="Primitive ramps"
      >
        <Ramp name="neutral" steps={NEUTRAL_STEPS} />
        <Ramp name="sand" steps={WARM_STEPS} />
        <Ramp name="amber" steps={WARM_STEPS} />
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
        description="Outside shadcn's contract. Added for gain and loss semantics, which shadcn has no opinion on."
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
