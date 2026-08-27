import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Surface } from "@/components/surface";

const meta = {
  component: Surface,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  title: "Components/Surface",
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

/*
 * axe cannot judge this component. Its colour-contrast rule needs a resolvable
 * background, and a translucent surface has none until it composites against
 * whatever is behind it — so axe reports "incomplete" and the violation count
 * stays at zero whether the design is legible or not.
 *
 * These helpers composite for real, on a canvas, so the browser does the colour
 * conversion and the assertion is about pixels rather than declarations.
 */
function toPixel(colors: string[]): [number, number, number] {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("no 2d context");
  }
  for (const color of colors) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
  }
  const { data } = ctx.getImageData(0, 0, 1, 1);
  return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0];
}

function luminance([r, g, b]: [number, number, number]): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(stack: string[], text: string): number {
  const a = luminance(toPixel(stack));
  const b = luminance(toPixel([text]));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

function tokenOf(element: Element, name: string): string {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

const COPY = {
  body: "Colour comes from the palette. The blur, hairline and elevation come from Surface.",
  title: "Frosted panel",
};

function Panel() {
  return (
    <Surface className="max-w-md p-6" data-testid="surface" elevation="raised">
      <h3 className="font-semibold text-lg" data-testid="surface-title">
        {COPY.title}
      </h3>
      <p className="mt-2 text-sm">{COPY.body}</p>
    </Surface>
  );
}

/** The material, on the backdrop the palette is designed to sit on. */
export const Default: Story = {
  args: {},
  render: () => (
    <div
      className="palette-glass bg-background p-10 text-foreground"
      data-testid="scope"
    >
      <Panel />
    </div>
  ),
};

export const Dark: Story = {
  args: {},
  render: () => (
    <div
      className="palette-glass dark bg-background p-10 text-foreground"
      data-testid="scope"
    >
      <Panel />
    </div>
  ),
};

/**
 * The assertion that matters. A translucent surface has no fixed contrast, so
 * this composites the card over the darkest and lightest backdrop the palette
 * itself can produce and requires 4.5:1 at both ends.
 *
 * It does not, and cannot, promise 4.5:1 over an arbitrary photograph. That is
 * inherent to glass: a consumer who puts one over an uncontrolled image owns
 * that contrast themselves.
 */
export const ContrastAcrossBackdrops: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Collected rather than asserted in place, so a failure reports every bad
    // combination at once instead of stopping at the first.
    const failures: string[] = [];

    for (const scope of ["light", "dark"]) {
      const root = canvas.getByTestId(scope);
      const surface = within(root).getByTestId("surface");
      const card = getComputedStyle(surface).backgroundColor;
      const text = getComputedStyle(surface).color;

      // The span of backdrops this palette can put behind a Surface.
      const range =
        scope === "light"
          ? [tokenOf(root, "--slate-100"), tokenOf(root, "--slate-300")]
          : [tokenOf(root, "--slate-950"), tokenOf(root, "--slate-800")];

      for (const backdrop of range) {
        const ratio = contrast([backdrop, card], text);
        if (ratio < 4.5) {
          failures.push(`${scope} over ${backdrop}: ${ratio.toFixed(2)}:1`);
        }
      }
    }

    await expect(failures).toEqual([]);
  },
  render: () => (
    <>
      <div
        className="palette-glass bg-background p-10 text-foreground"
        data-testid="light"
      >
        <Panel />
      </div>
      <div
        className="palette-glass dark bg-background p-10 text-foreground"
        data-testid="dark"
      >
        <Panel />
      </div>
    </>
  ),
};

/**
 * Arbitrary variants fail silently: a typo produces a class that matches
 * nothing, and the fallback simply never exists. This asserts the rules were
 * actually emitted rather than trusting the class string.
 */
export const OpaqueFallbacksAreEmitted: Story = {
  args: {},
  play: async () => {
    const rules: string[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          rules.push(rule.cssText);
        }
      } catch {
        // Cross-origin sheet, nothing to read and nothing we care about.
      }
    }
    const all = rules.join("\n");
    await expect(all).toContain("prefers-reduced-transparency");
    await expect(all).toContain("backdrop-filter");
  },
  render: () => (
    <div className="palette-glass bg-background p-10 text-foreground">
      <Panel />
    </div>
  ),
};

/** Every knob, so a reviewer can see what the component actually offers. */
export const Variants: Story = {
  args: {},
  render: () => (
    <div className="palette-glass dark grid gap-4 bg-background p-10 text-foreground sm:grid-cols-3">
      {(["none", "sm", "md", "lg"] as const).map((blur) => (
        <Surface blur={blur} className="p-4 text-sm" key={blur}>
          blur: {blur}
        </Surface>
      ))}
      {(["neutral", "primary", "none"] as const).map((tint) => (
        <Surface className="p-4 text-sm" key={tint} tint={tint}>
          tint: {tint}
        </Surface>
      ))}
      {(["flat", "raised"] as const).map((elevation) => (
        <Surface className="p-4 text-sm" elevation={elevation} key={elevation}>
          elevation: {elevation}
        </Surface>
      ))}
      <Surface as="section" className="p-4 text-sm">
        as: section
      </Surface>
    </div>
  ),
};
