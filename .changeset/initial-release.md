---
"@lfrprazeres/ui": minor
---

First release.

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
