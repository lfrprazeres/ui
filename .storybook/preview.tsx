import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

const DARK_CLASS = "dark";

/**
 * Palette classes are mutually exclusive. The base palette is the absence of a
 * class, since it lives at :root.
 */
const PALETTE_CLASSES = [
  "palette-amber",
  "palette-cyberpunk",
  "palette-minimal",
] as const;

const PALETTES = ["base", "amber", "cyberpunk", "minimal"] as const;
const SCHEMES = ["light", "dark"] as const;

type Palette = (typeof PALETTES)[number];
type Scheme = (typeof SCHEMES)[number];

function applyTheme(palette: Palette, scheme: Scheme) {
  const root = document.documentElement;

  root.classList.remove(...PALETTE_CLASSES);

  if (palette !== "base") {
    root.classList.add(`palette-${palette}`);
  }

  root.classList.toggle(DARK_CLASS, scheme === "dark");
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      applyTheme(
        (context.globals.palette as Palette) ?? "base",
        (context.globals.scheme as Scheme) ?? "light"
      );
      return <Story />;
    },
  ],
  globalTypes: {
    palette: {
      description: "Colour palette preset",
      toolbar: {
        dynamicTitle: true,
        icon: "paintbrush",
        items: [
          { title: "Base", value: "base" },
          { title: "Amber", value: "amber" },
          { title: "Cyberpunk", value: "cyberpunk" },
          { title: "Minimal", value: "minimal" },
        ],
      },
    },
    scheme: {
      description: "Colour scheme",
      toolbar: {
        dynamicTitle: true,
        icon: "contrast",
        items: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
      },
    },
  },
  initialGlobals: { palette: "base", scheme: "light" },
  parameters: {
    a11y: { test: "error" },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
