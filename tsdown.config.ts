import { fileURLToPath } from "node:url";
import { defineConfig } from "tsdown";

/**
 * `unbundle` is the load-bearing option.
 *
 * Bundling this library into one file would hoist or strip the "use client"
 * directives that nine of the elements depend on, which breaks React Server
 * Components silently: no error, just a component that stops working in an App
 * Router app. Preserving the module structure keeps each directive attached to
 * the module it belongs to, and gives the consumer's bundler finer granularity
 * to tree-shake.
 */
export default defineConfig({
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
  },
  clean: true,
  copy: [
    { from: "src/tokens", to: "dist" },
    { from: "src/styles.css", to: "dist" },
  ],
  dts: true,
  entry: ["src/index.ts", "src/elements/index.ts", "src/components/index.ts"],
  external: ["react", "react-dom", "react/jsx-runtime", "tailwindcss"],
  format: "esm",
  platform: "neutral",
  unbundle: true,
});
