---
"@lfrprazeres/ui": minor
---

Redesign `base` as ink on paper

`base` and `minimal` were near-indistinguishable: both achromatic, differing
only in radius and spacing. Since `base` is the default, the library's first
impression was the least characterful thing in it.

It is now near-black on warm paper with a single vermilion accent. Two new ramps
back it: `--ink-*`, warm like `--sand-*` but at a third of its chroma so `base`
and `gold` do not share a ground, and `--vermilion-*` at hue 33-38, clear of
`--rose-*` (12-17) and `--gold-*` (76-78).

Minor rather than patch: `base` is the class-less default, so every consumer
that has not opted into a palette sees a different product. Consumers wanting
the old achromatic look should apply `palette-minimal`, which is unchanged apart
from already being square and tighter.

Contrast verified by compositing rather than by eye: eleven role pairs across
both schemes, worst case 6.7:1.
