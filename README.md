# @lfrprazeres/ui

A React design system: shadcn elements, composed components, and a three-tier
token contract with swappable palettes.

Built for React 19 and Tailwind CSS v4. ESM only.

> **Built for my own projects.** This exists so the things I build share one
> component layer instead of each rebuilding buttons and a token system. It is
> not a community project and has no roadmap beyond what I need next.
>
> That said, it is MIT licensed and genuinely usable. Install it, fork it, copy
> the bits you like. Just know that the API moves when my projects need it to,
> which is why it stays on `0.x`. Pin an exact version if that matters to you.

**[Component docs and live playground](https://lfrprazeres.github.io/ui)** ·
[Changelog](./CHANGELOG.md)

## Install

```bash
pnpm add @lfrprazeres/ui
```

`react`, `react-dom` and `tailwindcss` are peer dependencies.

`recharts` is an **optional** peer. Install it only if you import from
`@lfrprazeres/ui/charts`:

```bash
pnpm add recharts
```

## Setup

Import the stylesheet once, at your CSS entry point:

```css
@import "tailwindcss";
@import "@lfrprazeres/ui/styles.css";
```

That is the whole setup. You do **not** need a `@source` line pointing into
`node_modules`: the shipped stylesheet scans its own `dist` for class names.

On Next.js, add the package to `optimizePackageImports`. Importing from the root
barrel is ergonomic but pulls the whole module graph into the dev server's
module map, which slows cold start. This fixes it, and does not change the
production bundle either way:

```ts
// next.config.ts
export default {
  experimental: { optimizePackageImports: ["@lfrprazeres/ui"] },
};
```

## Use

```tsx
import { Button, Card, StatTile } from "@lfrprazeres/ui";
```

Or from a tier directly:

```tsx
import { Button } from "@lfrprazeres/ui/elements";
import { StatTile } from "@lfrprazeres/ui/components";
```

Charts are the exception: they ship only from their own entry point, never from
the root barrel.

```tsx
import { DonutChart } from "@lfrprazeres/ui/charts"; // needs recharts
```

Both resolve to the same bytes. `Button` measures 9.58 kB either way, and the
whole surface is 98 kB.

## What ships

**Elements** (17): Avatar, Badge, Button, Card, Checkbox, Dialog, DropdownMenu,
Input, Label, Popover, Select, Separator, Skeleton, Switch, Table, Textarea,
Toaster.

**Components** (9): Chip, FileDropzone, LanguageSwitcher, Marquee, MessageBubble,
SearchCombobox, StatTile, StreamingDots, ThemeToggle.

**Charts**, from `@lfrprazeres/ui/charts`: `Chart` (the recharts primitives),
`DonutChart`, `LineChart`, plus `ChartFrame`, `ChartDataTable` and
`ChartLegendList` for building your own. More chart types are coming; the rest
of the recharts catalogue is a later release.

### Why charts have their own entry point

`recharts` is far heavier than everything else here combined, so charts ship
from `@lfrprazeres/ui/charts` and nowhere else.

Tree-shaking alone was not enough. Bundlers did drop recharts from the output,
which is why `Button` never grew, but importing the root barrel in a runtime
that does not bundle — plain Node, an un-bundled SSR path, a script — loaded 246
recharts modules to get a `Button`. Now it loads none, and `pnpm check:charts`
walks the built module graph on every release to assert recharts is unreachable
from `.`, `/elements` and `/components`, and reachable from `/charts`.

Because it is an optional peer, nothing installs it unless you ask for it.

## Tiers

| Tier | What it is | Ships |
| --- | --- | --- |
| **elements** | Single-purpose. Composes no other exported part, carries no data shape. Taken from the shadcn registry as-is. | yes |
| **components** | Composed from two or more elements. Owns interaction, still domain-agnostic. | yes |
| **features** | Owns a typed data prop or a layout region, and knows your domain. | **no, build these in your app** |

The library never ships features. If two projects need the same one, extract the
reusable mechanism as a component and keep a thin feature on top of it in each.

`charts` is not a fourth tier. It is a packaging boundary: `Chart` is an element
and the charts built on it are components, grouped behind one entry point
because they share a dependency heavy enough to be worth opting into.

## Palettes

A palette is a preset that redefines the semantic tier. Components never know
which one is active, because they only read semantic names.

```html
<html class="palette-gold dark">
```

Four ship: `base` (no class, lives at `:root`), `palette-gold`,
`palette-cyberpunk`, `palette-minimal`. Add `dark` alongside for the dark
variant of any of them.

A palette may redefine every semantic colour role, plus `--radius`, `--spacing`
and the three font stacks. Because Tailwind emits utilities as
`calc(var(--spacing) * n)` and `var(--radius)`, redefining those rescales the
whole system at runtime with no rebuild.

To write your own, redefine the semantic tier under a class. That is the entire
theming API.

## Reduced motion

Handled at the token layer, not per component. Under
`prefers-reduced-motion: reduce` the `--motion-duration-*` tokens collapse to
zero, so anything reading them inherits the behaviour without opting in. The
animation is not disabled, because disabling it hides the outcome: the user
lands on the final state instantly instead.

Two deliberate exceptions, both loops rather than transitions. A loop has no
final state, so collapsing its duration to zero would be an infinite speed:

- `Marquee` suppresses its animation and becomes a scrollable region.
- `StreamingDots` swaps the bounce for an opacity pulse, because removing it
  outright would delete the only "something is happening" cue a sighted user
  has.

The rule: **collapse durations for transitions, suppress movement for loops.**

## One deviation from upstream shadcn

`Toaster` takes `theme` as a prop. Upstream reads it with `useTheme()` from
`next-themes`, which would put a Next-only dependency inside a
framework-agnostic package. If you re-scaffold that file with the shadcn CLI,
the import comes back and needs re-inverting.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm storybook` | Component docs on :6006 |
| `pnpm test` | Every story as a browser test, axe violations fail |
| `pnpm build` | Builds the package with tsdown |
| `pnpm check:rsc` | Fails if a `"use client"` directive was lost in the build |
| `pnpm check:package` | publint plus are-the-types-wrong |
| `pnpm check:charts` | Fails if recharts is reachable from a non-chart entry point |
| `pnpm check:size` | size-limit budgets |

## Notes on the build

Built unbundled, preserving module structure. That is load-bearing rather than a
preference: bundling hoists or strips the `"use client"` directives twenty-two
modules depend on, and React Server Components then break with no error at all.
`pnpm check:rsc` compares source against the build and fails if any went
missing.

`verify/` holds a minimal Next App Router consumer that installs the packed
tarball and proves the contract from outside. See `verify/README.md`.

## Contributing

Mostly for my own future reference, see [CONTRIBUTING.md](./CONTRIBUTING.md).
Every change that ships needs a changeset, and CI enforces it.

## Licence

MIT. See [LICENSE](./LICENSE).
