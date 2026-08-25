import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

/**
 * Runs every story as a real browser test.
 *
 * The stories are the test suite, so there is no second set of fixtures to keep
 * in sync. `a11y: { test: "error" }` in the preview turns axe-core violations
 * into failures, which is what makes accessibility a gate rather than a panel
 * someone might remember to open.
 *
 * Storybook 10.3+ applies the preview annotations automatically, so no setup
 * file is needed.
 */
export default defineConfig({
  plugins: [
    storybookTest({
      configDir: fileURLToPath(new URL("./.storybook", import.meta.url)),
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: "chromium" }],
      provider: playwright(),
    },
  },
});
