# Consumer verification

A minimal Next.js App Router app that installs the packed tarball and proves the
package contract from the outside. Grepping `dist/` tells you a directive is
present; only a real consumer tells you the boundary actually holds.

## Running it

From the repo root:

```bash
pnpm build
pnpm pack --pack-destination verify/next-consumer
cd verify/next-consumer
pnpm install --ignore-workspace
pnpm exec tsc --noEmit
pnpm exec next build
```

## What it proves

**The RSC boundary.** `app/page.tsx` is deliberately a server component with no
`"use client"`, and it renders `Dialog` and `Marquee`, both of which are client
components inside the package. If the build ever stripped or hoisted those
directives, this build fails with "You're importing a component that needs
useState". A passing build is the proof.

**All three entry points.** The page imports from the root barrel, from
`/elements`, and from `/components`, so a broken export map fails here.

**Types resolve from outside.** `tsc --noEmit` runs against the installed
tarball, not the source, so a missing or misplaced `.d.ts` surfaces.

**The stylesheet needs no `@source`.** `app/globals.css` is only two imports.
The shipped `styles.css` scans its own `dist` for class names, so consumers do
not have to add a `@source` line pointing into `node_modules`. Confirm by
grepping the built CSS for `.bg-primary` and `--gold-600`.

**Tree-shaking through the barrel.** The page imports seven parts. Search the
built client chunks for something it does not import, such as
`DropdownMenuRadioItem` or `SelectScrollUpButton`, and expect zero hits.

Note that server components such as `StatTile` are correctly absent from the
client chunks too, because they never ship to the browser. Absence there is not
evidence of a tree-shaking failure.
