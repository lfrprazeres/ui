# @lfrprazeres/ui

## 0.4.1

### Patch Changes

- d92cdde: Add the glass palette and a `Surface` component
  
  `palette-glass` is a fifth preset with translucent `--card`, `--popover` and
  `--sidebar`, and `Surface` is a new components-tier panel that owns the blur,
  the hairline top edge and elevation.
  
  The split is deliberate. Glass is `backdrop-filter`, which is a CSS property
  rather than a colour, so a palette cannot express it — palettes here are
  colour-only by contract. The components that would otherwise carry it are
  vendored from the shadcn registry and have to stay safe to re-scaffold. So
  colour goes in the palette, effect goes in a component that composes nothing
  vendored, and `shadcn add` keeps working.
  
  `Surface` degrades rather than breaks. Under `prefers-reduced-transparency:
  reduce` and under `@supports not (backdrop-filter)` it falls back to the opaque
  `--popover`, and under any non-glass palette `--card` is already opaque so it
  reads as an ordinary panel.
  
  Patch rather than minor: nothing existing changes shape, and on `0.x` this repo
  reserves minor for breaking changes.

## 0.4.0

### Minor Changes

- a1d604f: Add `loading` and `loadingLabel` to the chart layer
  
  `ChartFrame`, and through it `LineChart` and `DonutChart`, can now show that
  fresh data is on its way. The plot stays mounted and dims while a `role="status"`
  region announces the wait, rather than being swapped for a skeleton: async data
  is a chart's normal case, and remounting recharts on every refresh throws away
  the rendered SVG so a routine poll looks like a full reload.
  
  `loading` also wins over `isEmpty`, because showing "no data" before the first
  response has arrived states something the chart does not yet know.
  
  Minor rather than patch because the frame now wraps the plot in a positioned
  element, so a consumer reaching past the figure with a structural CSS selector
  will need to look one level deeper.

## 0.3.3

### Patch Changes

- 6891ae8: Fixes duplicate React keys in the chart data table.
  
  `ChartDataTable` keyed each row by its header, which is the *formatted*
  category. That is not unique: a year of daily points formats to a dozen rows all
  headed "Aug", and React warned about duplicate keys for every one of them.
  Rows now carry a `key` taken from the raw category value, separate from the text
  they display.
  
  If you build a chart on `ChartDataTable` directly, its rows now require a `key`.
  
  The regression story formats month-only on purpose, so all its points share a
  header and the collision is reproduced rather than merely described.

## 0.3.2

### Patch Changes

- 7f9f98b: Fixes charts overflowing the container they are given a height in.
  
  `className` styles the whole figure, which holds the legend and the hidden data
  table as well as the plot, so a height there never reached the plot: the
  container kept its default 16:9 ratio. In a wide card that computes far taller
  than the figure, and the axis labels paint outside the card.
  
  `LineChart` and `DonutChart` now take `chartClassName` for the plot area, which
  replaces the default aspect ratio rather than fighting it.
  
  The regression story measures the rendered plot against its frame: before the
  fix a 240px figure held a 506px plot.

## 0.3.1

### Patch Changes

- bd70d5b: Fixes the hidden data table reading raw category values.
  
  `LineChart` applied `formatX` to the axis ticks but not to the row headers of
  the text alternative, so a timestamped series rendered a readable axis above a
  table that announced `1756213200000`. The table is the only route a screen
  reader has to the numbers, which made this the one place the formatting
  actually had to be right. It now uses the same formatter as the axis.
  
  Adds `minTickGap`, so a dense category axis can stop its labels crowding.
  
  Found by a real consumer rather than by a test, which is why the regression
  story uses timestamps: with string categories the bug is invisible.

## 0.3.0

### Minor Changes

- b610a93: Parts a real consumer turned out to need.
  
  **`ToggleGroup` and `Toggle`**, from the shadcn registry. A segmented control
  was being hand-rolled as `role="tab"` buttons with no tablist and no panel,
  which is an orphan role: assistive technology announces a tab that belongs to
  nothing. Radix gives roving focus and correct pressed state instead.
  
  **`LineChart` gained the options a price chart needs**, so it can be used for
  more than a demo:
  
  - `formatX` for category-axis ticks, such as a timestamp rendered as a date
  - `valueAxis` for orientation, width, and `fit` to scale to the data range
    instead of anchoring at zero
  - `grid` to turn the background grid off
  - `tooltip` to replace the tooltip content entirely
  
  Defaults are unchanged, so existing usage keeps working.

## 0.2.0

### Minor Changes

- b38527d: New parts, a new entry point for charts, and fixes to five colour-contrast
  failures in the existing palettes.
  
  **Elements.** `Table` and `Chart` come from the shadcn registry unmodified.
  
  **Components.** `FileDropzone` is a drop target that is also a button, so
  pointer, touch and keyboard all reach the same picker; it owns no upload logic.
  `SearchCombobox` is a controlled combobox with a listbox popup following the
  ARIA authoring practices, where focus stays in the input and the active option
  is pointed at with `aria-activedescendant`. It requires a `label`, because a
  placeholder is not an accessible name.
  
  **Charts ship from their own entry point.** `Chart`, `DonutChart`, `LineChart`
  and the `ChartFrame` / `ChartDataTable` / `ChartLegendList` building blocks are
  exported from `@lfrprazeres/ui/charts`, never from the root barrel, and
  `recharts` is an **optional** peer dependency:
  
  ```bash
  pnpm add recharts
  ```
  
  Bundlers were already tree-shaking recharts away, but non-bundled runtimes were
  not: importing the root barrel in plain Node loaded 246 recharts modules to get
  a `Button`. It now loads none. A new `check:charts` gate walks the built module
  graph on every release and fails if recharts becomes reachable from `.`,
  `/elements` or `/components`. The root barrel's budget drops from 195 kB back to
  the 110 kB ceiling it had before charts existed.
  
  Every chart renders a visually hidden data table beside the plot. An SVG is an
  image to assistive technology however much ARIA it carries, and recharts moves
  the active point on arrow keys without announcing it, so that table is the only
  route to the numbers rather than a nicety.
  
  **Colour contrast.** Five tokens failed WCAG AA and now pass. `--positive` and
  `--negative` move one shade darker, as does `--muted-foreground`, which was
  4.34:1 against `--muted` and affected every muted surface. `cyberpunk`'s
  `--secondary` darkens. `minimal`'s dark `--destructive` was pure white, and
  because shadcn's destructive button hardcodes `text-white` over
  `dark:bg-destructive/60`, the label was effectively invisible at 2.71:1.
  
  **Also.** `Marquee` gains `pauseOnHover`, which holds position rather than
  restarting, and pauses on focus so keyboard users can reach links inside it.
  `ThemeToggle` gains `labels` and `groupLabel`, so it can be used in a localised
  app instead of hardcoding English.
  
  **Breaking.** `Chip` is now discriminated on `href`. The anchor branch accepts
  anchor attributes, so `target` and `rel` typecheck on the element that actually
  renders as a link. Passing span-only props alongside `href` no longer compiles.

## 0.1.0

### Minor Changes

- ac50a3d: First release.
  
  Sixteen elements taken from the shadcn registry, seven composed components, and a
  three-tier token contract whose semantic tier matches shadcn's names verbatim so
  `npx shadcn add` keeps working against it.
  
  Four palettes ship (base, gold, cyberpunk, minimal). A palette may redefine every
  semantic role plus `--radius`, `--spacing` and the font stacks, which rescales
  the system at runtime without a rebuild.
  
  Reduced motion is handled at the token layer, with `Marquee` as the documented
  exception: a loop has no final state, so it suppresses its animation rather than
  collapsing a duration to zero.
  
  Built unbundled so the `"use client"` directives survive, verified by a gate that
  compares source against the build, and by a Next App Router consumer that
  installs the packed tarball.
