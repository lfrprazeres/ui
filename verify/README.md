# Consumer verification

A minimal Next.js App Router app that installs the packed tarball and proves the
package contract from the outside. Grepping `dist/` tells you a directive is
present; only a real consumer tells you the boundary actually holds.

## Running it

From the repo root:

```bash
pnpm build
pnpm check:charts
pnpm pack --out verify/next-consumer/lfrprazeres-ui.tgz
cd verify/next-consumer
rm -rf node_modules pnpm-lock.yaml .next   # pnpm caches file: tarballs by name
pnpm install --ignore-workspace
pnpm exec tsc --noEmit
pnpm exec next build
```

The tarball name carries no version on purpose. It used to, which is how this
fixture ended up pointing at a `0.0.0` file long after the package had moved on,
leaving the documented procedure broken.

## What it proves

**The RSC boundary.** `app/page.tsx` is deliberately a server component with no
`"use client"`, and it renders `Dialog` and `Marquee`, both of which are client
components inside the package. If the build ever stripped or hoisted those
directives, this build fails with "You're importing a component that needs
useState". A passing build is the proof.

**The entry points.** The page imports from the root barrel, from `/elements`
and from `/components`, so a broken export map fails here. `/charts` is covered
by the opt-in case described below rather than by the committed page.

**Types resolve from outside.** `tsc --noEmit` runs against the installed
tarball, not the source, so a missing or misplaced `.d.ts` surfaces.

**The stylesheet needs no `@source`.** `app/globals.css` is only two imports.
The shipped `styles.css` scans its own `dist` for class names, so consumers do
not have to add a `@source` line pointing into `node_modules`. Confirm by
grepping the built CSS for `.bg-primary` and `--gold-600`.

**recharts is absent.** This is the headline check. `app/page.tsx` imports no
chart, and `recharts` is an optional peer, so neither should exist anywhere:

```bash
test -d node_modules/recharts && echo "FAIL: installed" || echo "PASS: not installed"
grep -rl "recharts" --include='*.js' .next/static .next/server   && echo "FAIL: leaked into the build" || echo "PASS: absent"
```

The second grep is scoped to emitted JS on purpose. A bare `grep -rl "recharts"
.next` reports a leak that is not there: the shipped stylesheet contains
selectors such as `.[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground`
which style recharts' DOM without importing it, and `.next/cache/turbopack` plus
`required-server-files.json` mention it too. Those are class names and manifests,
not modules.

The first line tests the `peerDependenciesMeta.optional` flag against pnpm's
`autoInstallPeers`, which would otherwise install it anyway and make the whole
split a no-op. The second tests that no tier barrel re-exports a chart.

To prove the opposite case, add a route that imports from
`@lfrprazeres/ui/charts`, `pnpm add recharts --ignore-workspace`, and rebuild:
recharts should now appear. That confirms the absence above was real rather than
an artefact of a broken export. Revert both afterwards so the committed fixture
stays the negative case.

**Tree-shaking through the barrel.** The page imports seven parts. Search the
built client chunks for something it does not import, such as
`DropdownMenuRadioItem` or `SelectScrollUpButton`, and expect zero hits.

Note that server components such as `StatTile` are correctly absent from the
client chunks too, because they never ship to the browser. Absence there is not
evidence of a tree-shaking failure.
