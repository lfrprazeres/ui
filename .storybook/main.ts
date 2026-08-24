import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: ["../docs/**/*.stories.@(ts|tsx)", "../src/**/*.stories.@(ts|tsx)"],
  typescript: { reactDocgen: "react-docgen-typescript" },
};

export default config;
