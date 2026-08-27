import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
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
    /*
     * Tailwind has to run here too, not just in vite.config.ts. Without it the
     * stories render unstyled: every utility class is inert, so `aspect-video`
     * gives a container zero height, ResponsiveContainer measures nothing and
     * no chart ever draws. axe was auditing unstyled DOM, which also means it
     * could never have caught a colour-contrast problem.
     */
    tailwindcss(),
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
