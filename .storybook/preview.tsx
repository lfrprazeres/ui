import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

const PALETTE_CLASS = "palette-amber";
const DARK_CLASS = "dark";

const THEMES = {
  "amber-dark": { dark: true, palette: true },
  "amber-light": { dark: false, palette: true },
  "base-dark": { dark: true, palette: false },
  "base-light": { dark: false, palette: false },
} satisfies Record<string, { dark: boolean; palette: boolean }>;

type ThemeName = keyof typeof THEMES;

function applyTheme(name: ThemeName) {
  const root = document.documentElement;
  const theme = THEMES[name] ?? THEMES["base-light"];

  root.classList.toggle(DARK_CLASS, theme.dark);
  root.classList.toggle(PALETTE_CLASS, theme.palette);
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      applyTheme(context.globals.theme as ThemeName);
      return <Story />;
    },
  ],
  globalTypes: {
    theme: {
      description: "Palette and colour scheme",
      toolbar: {
        dynamicTitle: true,
        icon: "paintbrush",
        items: [
          { title: "Base light", value: "base-light" },
          { title: "Base dark", value: "base-dark" },
          { title: "Amber light", value: "amber-light" },
          { title: "Amber dark", value: "amber-dark" },
        ],
      },
    },
  },
  initialGlobals: { theme: "base-light" },
  parameters: {
    a11y: { test: "error" },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
