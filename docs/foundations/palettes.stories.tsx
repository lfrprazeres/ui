import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@/elements/badge";
import { Button } from "@/elements/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/elements/card";
import { Input } from "@/elements/input";
import { Section } from "./token-table";

const PALETTES = [
  {
    className: "",
    name: "Base",
    note: "Neutral. Colour only, scales untouched.",
  },
  {
    className: "palette-amber",
    name: "Amber",
    note: "Warm gold on sand. Colour only.",
  },
  {
    className: "palette-cyberpunk",
    name: "Cyberpunk",
    note: "Neon on slate. Also overrides radius and the sans stack.",
  },
  {
    className: "palette-minimal",
    name: "Minimal",
    note: "Max contrast, zero chroma. Also overrides radius and spacing.",
  },
];

/**
 * Each preview is scoped by wrapping in the palette class, so all four render
 * simultaneously on one page. That only works because palettes are plain class
 * selectors over custom properties, with no global state involved.
 */
function Preview({ className, dark }: { className: string; dark: boolean }) {
  return (
    <div
      className={`${className} ${dark ? "dark" : ""} rounded-lg border border-border bg-background p-4 font-sans`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button size="sm">Primary</Button>
        <Button className="bg-secondary text-secondary-foreground" size="sm">
          Secondary
        </Button>
        <Button className="bg-tertiary text-tertiary-foreground" size="sm">
          Tertiary
        </Button>
        <Button size="sm" variant="outline">
          Outline
        </Button>
        <Button size="sm" variant="destructive">
          Destructive
        </Button>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge>Badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <span className="font-medium text-positive text-xs">+2.4%</span>
        <span className="font-medium text-negative text-xs">-1.1%</span>
      </div>
      <Input className="mb-3" placeholder="Input field" />
      <Card>
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Muted supporting copy.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-sm">Body text on card surface.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function PaletteRow({
  name,
  note,
  className,
}: {
  name: string;
  note: string;
  className: string;
}) {
  return (
    <div className="mb-8">
      <div className="mb-1 font-semibold text-foreground text-sm">{name}</div>
      <div className="mb-3 text-muted-foreground text-xs">
        {note}
        {className ? (
          <>
            {" Apply with "}
            <code className="font-mono">class="{className}"</code>.
          </>
        ) : (
          " No class needed, it lives at :root."
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Preview className={className} dark={false} />
        <Preview className={className} dark={true} />
      </div>
    </div>
  );
}

function PaletteFoundations() {
  return (
    <div className="p-6">
      <h1 className="mb-2 font-semibold text-2xl text-foreground">Palettes</h1>
      <p className="mb-6 max-w-3xl text-muted-foreground text-sm">
        A palette is a preset that redefines the semantic tier. Components never
        know which one is active, because they only ever read semantic names.
        Light and dark are shown side by side for each.
      </p>

      <Section
        description="What a palette is allowed to override. Anything outside this list stays fixed, which is what keeps presets swappable."
        title="The preset contract"
      >
        <ul className="max-w-3xl list-disc space-y-1 pl-5 text-foreground text-sm">
          <li>
            Every semantic colour role, including the{" "}
            <code className="font-mono text-xs">tertiary</code>,{" "}
            <code className="font-mono text-xs">positive</code> and{" "}
            <code className="font-mono text-xs">negative</code> extensions.
          </li>
          <li>
            <code className="font-mono text-xs">--radius</code>, which rescales
            all four derived radius steps.
          </li>
          <li>
            <code className="font-mono text-xs">--spacing</code>, which rescales
            every gap, padding and size, because Tailwind emits those as{" "}
            <code className="font-mono text-xs">calc(var(--spacing) * n)</code>.
          </li>
          <li>
            The three font stacks, via{" "}
            <code className="font-mono text-xs">--font-sans-stack</code> and
            siblings.
          </li>
        </ul>
      </Section>

      <Section title="Shipped palettes">
        {PALETTES.map((palette) => (
          <PaletteRow
            className={palette.className}
            key={palette.name}
            name={palette.name}
            note={palette.note}
          />
        ))}
      </Section>
    </div>
  );
}

const meta = {
  component: PaletteFoundations,
  parameters: { layout: "fullscreen" },
  title: "Foundations/Palettes",
} satisfies Meta<typeof PaletteFoundations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palettes: Story = {};
