# @lfrprazeres/ui

A React design system. shadcn elements, composed components, and a three-tier
token contract with swappable palettes.

Built for React 19 and Tailwind CSS v4. ESM only.

## Install

```bash
pnpm add @lfrprazeres/ui
```

`react`, `react-dom` and `tailwindcss` are peer dependencies.

## Setup

Import the stylesheet once, at your CSS entry point:

```css
@import "tailwindcss";
@import "@lfrprazeres/ui/styles.css";
```

That is the whole setup. You do **not** need a `@source` line pointing into
`node_modules`: the shipped stylesheet scans its own `dist` for class names.

If you are on Next.js, add the package to `optimizePackageImports`. Importing
from the root barrel is ergonomic but pulls the whole module graph into the dev
server's module map, which slows cold start. This fixes it, and does not affect
production bundle size either way:

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

Both resolve to the same bytes. Verified: `Button` measures 9.59 kB either way.

## What ships

**Elements** (16): Avatar, Badge, Button, Card, Checkbox, Dialog, DropdownMenu,
Input, Label, Popover, Select, Separator, Skeleton, Switch, Textarea, Toaster.

**Components** (7): Chip, LanguageSwitcher, Marquee, MessageBubble, StatTile,
StreamingDots, ThemeToggle.

## Tiers

| Tier | What it is | Ships |
| --- | --- | --- |
| **elements** | Single-purpose. Composes no other exported part, carries no data shape. Taken from the shadcn registry as-is. | yes |
| **components** | Composed from two or more elements. Owns interaction, still domain-agnostic. | yes |
| **features** | Owns a typed data prop or a layout region, and knows your domain. | **no, build these in your app** |

The library never ships features. If two of your projects need the same one,
extract the reusable mechanism as a component and keep a thin feature on top of
it in each.

## Palettes

A palette is a preset that redefines the semantic tier. Components never know
which one is active, because they only read semantic names.

```html
<html class="palette-gold dark">
```

Four ship: `base` (no class, lives at `:root`), `palette-gold`,
`palette-cyberpunk`, `palette-minimal`. Add `dark` alongside for the dark
variant of any of them.

A palette may override every semantic colour role, plus `--radius`, `--spacing`
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

One exception, and it is deliberate. A loop has no final state, so a zero
duration would be an infinite speed. `Marquee` therefore suppresses its
animation entirely and becomes an ordinary scrollable region. The rule:
**collapse durations for transitions, suppress the animation for loops.**

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
| `pnpm check:size` | size-limit budgets |

## Notes on the build

Built unbundled, preserving module structure. That is load-bearing rather than a
preference: bundling hoists or strips the `"use client"` directives ten of the
elements depend on, and React Server Components then break with no error at all.
`pnpm check:rsc` compares source against the build and fails if any went
missing.

`verify/` holds a minimal Next App Router consumer that installs the packed
tarball and proves the contract from outside. See `verify/README.md`.

## Licence

MIT
