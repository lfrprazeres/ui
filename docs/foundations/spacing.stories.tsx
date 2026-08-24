import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section, useResolvedToken } from "./token-table";

const STEPS = [0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24];

const RADII = [
  { note: "calc(--radius - 4px)", token: "--radius-sm", utility: "rounded-sm" },
  { note: "calc(--radius - 2px)", token: "--radius-md", utility: "rounded-md" },
  { note: "--radius", token: "--radius-lg", utility: "rounded-lg" },
  { note: "calc(--radius + 4px)", token: "--radius-xl", utility: "rounded-xl" },
];

function SpacingRow({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-16 shrink-0 font-mono text-muted-foreground text-xs">
        {step}
      </span>
      <div
        className="h-4 rounded-sm bg-primary"
        style={{ width: `calc(var(--spacing) * ${step})` }}
      />
      <span className="font-mono text-muted-foreground text-xs">
        {step * 4}px
      </span>
    </div>
  );
}

function RadiusRow({
  token,
  utility,
  note,
}: {
  token: string;
  utility: string;
  note: string;
}) {
  const resolved = useResolvedToken(token);

  return (
    <div className="flex items-center gap-4">
      <div
        className={`size-16 shrink-0 border-2 border-primary bg-accent ${utility}`}
      />
      <div>
        <div className="font-medium font-mono text-foreground text-xs">
          {token}
        </div>
        <div className="text-muted-foreground text-xs">{note}</div>
        <div className="text-muted-foreground text-xs">{resolved}</div>
      </div>
    </div>
  );
}

function SpacingFoundations() {
  return (
    <div className="p-6">
      <h1 className="mb-2 font-semibold text-2xl text-foreground">
        Spacing and radius
      </h1>
      <p className="mb-8 max-w-2xl text-muted-foreground text-sm">
        Spacing is Tailwind's 4px base unit, unmodified. Radius is the one place
        the library adds a derivation: a single{" "}
        <code className="font-mono text-xs">--radius</code> primitive drives all
        four steps, so changing one value rescales every corner in the system.
      </p>

      <Section
        description="Every step is calc(var(--spacing) * n), where --spacing is 0.25rem."
        title="Spacing scale"
      >
        <div className="space-y-2">
          {STEPS.map((step) => (
            <SpacingRow key={step} step={step} />
          ))}
        </div>
      </Section>

      <Section
        description="All four derive from --radius, which is 0.625rem by default."
        title="Radius scale"
      >
        <div className="space-y-4">
          {RADII.map((radius) => (
            <RadiusRow
              key={radius.token}
              note={radius.note}
              token={radius.token}
              utility={radius.utility}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

const meta = {
  component: SpacingFoundations,
  parameters: { layout: "fullscreen" },
  title: "Foundations/Spacing and radius",
} satisfies Meta<typeof SpacingFoundations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpacingAndRadius: Story = {};
