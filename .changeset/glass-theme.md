---
"@lfrprazeres/ui": patch
---

Add the glass palette and a `Surface` component

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
