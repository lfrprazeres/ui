import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section, useResolvedToken } from "./token-table";

const SIZES = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];

const STACKS = [
  { label: "Sans, body text", token: "--font-sans", utility: "font-sans" },
  { label: "Serif, headings", token: "--font-serif", utility: "font-serif" },
  { label: "Mono, figures", token: "--font-mono", utility: "font-mono" },
];

function Stack({
  token,
  label,
  utility,
}: {
  token: string;
  label: string;
  utility: string;
}) {
  const resolved = useResolvedToken(token);

  return (
    <div className="mb-6 border-border border-b pb-6 last:border-b-0">
      <div className="mb-1 flex items-baseline gap-3">
        <span className="font-medium font-mono text-foreground text-xs">
          {token}
        </span>
        <span className="text-muted-foreground text-xs">{label}</span>
      </div>
      <p className={`${utility} mb-2 text-2xl text-foreground`}>
        The quick brown fox jumps over the lazy dog
      </p>
      <p className="break-all text-muted-foreground text-xs">{resolved}</p>
    </div>
  );
}

function TypographyFoundations() {
  return (
    <div className="p-6">
      <h1 className="mb-2 font-semibold text-2xl text-foreground">
        Typography
      </h1>
      <p className="mb-8 max-w-2xl text-muted-foreground text-sm">
        The library declares three font stacks and reads them. It never fetches
        or bundles a font. Each stack starts with an indirection, so a consumer
        can inject a framework-loaded font by setting the matching{" "}
        <code className="font-mono text-xs">-app</code> variable, and gets the
        quoted fallback if they set nothing.
      </p>

      <Section title="Stacks">
        {STACKS.map((stack) => (
          <Stack
            key={stack.token}
            label={stack.label}
            token={stack.token}
            utility={stack.utility}
          />
        ))}
      </Section>

      <Section
        description="Tailwind's default type scale, unmodified."
        title="Scale"
      >
        <div className="space-y-3">
          {SIZES.map((size) => (
            <div className="flex items-baseline gap-4" key={size}>
              <span className="w-16 shrink-0 font-mono text-muted-foreground text-xs">
                text-{size}
              </span>
              <span className={`text-${size} text-foreground`}>
                Design systems outlive the products that spawn them
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

const meta = {
  component: TypographyFoundations,
  parameters: { layout: "fullscreen" },
  title: "Foundations/Typography",
} satisfies Meta<typeof TypographyFoundations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Typography: Story = {};
