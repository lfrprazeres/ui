import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      defaultTheme: "light",
      themes: { dark: "dark", light: "" },
    }),
  ],
  parameters: {
    a11y: { test: "error" },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
