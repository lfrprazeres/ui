/**
 * Charts entry point.
 *
 * Not a tier. `Chart` is a vendored element and the charts here are
 * component-grade; what they share is `recharts`, which is heavier than
 * everything else in the package combined and is an optional peer dependency.
 * Keeping them out of the tier barrels is what makes that optionality real:
 * importing the root barrel in a non-bundled runtime loaded 246 recharts
 * modules before this split.
 *
 * `chart.tsx` deliberately stays in `src/elements/`, because `components.json`
 * pins `aliases.ui` there and `shadcn add chart` must remain safe to re-run.
 */

export * from "../elements/chart";
export * from "./chart-data-table";
export * from "./chart-frame";
export * from "./chart-legend-list";
export * from "./chart-ramp";
export * from "./donut-chart";
export * from "./line-chart";
export * from "./types";
export * from "./use-cartesian-chart";
