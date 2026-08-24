import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section, SwatchGrid } from "./token-table";

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

function SemanticTokens() {
  return (
    <div className="p-6">
      <h1 className="mb-2 font-semibold text-2xl text-foreground">
        Semantic tokens
      </h1>
      <p className="mb-8 max-w-3xl text-muted-foreground text-sm">
        The public contract. Every component reads these names and nothing else,
        which is what makes palettes swappable. Names match shadcn's contract
        verbatim, extended but never renamed. Every value is a reference into a
        primitive ramp rather than a pasted literal, so retuning a ramp moves
        the roles with it. Switch the palette in the toolbar to watch these
        change while the ramps stay put.
      </p>

      <Section
        description="Page and container surfaces, each paired with its foreground."
        title="Surfaces"
      >
        <SwatchGrid tokens={SURFACES} />
      </Section>

      <Section
        description="Interactive and emphasis roles. tertiary is an extension; shadcn's contract stops at secondary."
        title="Roles"
      >
        <SwatchGrid tokens={ROLES} />
      </Section>

      <Section
        description="Borders, field fills and the focus ring."
        title="Outlines"
      >
        <SwatchGrid tokens={OUTLINES} />
      </Section>

      <Section
        description="Categorical series for data visualisation."
        title="Charts"
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
        title="Sidebar"
      >
        <SwatchGrid tokens={SIDEBAR} />
      </Section>
    </div>
  );
}

const meta = {
  component: SemanticTokens,
  parameters: { layout: "fullscreen" },
  title: "Foundations/Colour/Semantic tokens",
} satisfies Meta<typeof SemanticTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemanticTokensPage: Story = {};
