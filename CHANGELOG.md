# @lfrprazeres/ui

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
