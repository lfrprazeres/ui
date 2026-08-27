# Contributing

Notes to my future self, mostly.

## The release rule

**Every change that ships must carry a changeset, and the README must stay true
at the moment of release.** Not afterwards, not "next time".

```bash
pnpm changeset
```

Pick the bump, describe the change in terms a consumer cares about. That file is
what writes `CHANGELOG.md` and moves the version, so a release with no changeset
produces a silent version bump with an empty entry.

CI fails a pull request that touches `src/` without a changeset. That is
deliberate: a rule nobody enforces is a rule that lapses on the first busy day.

### What counts as a consumer-facing change

Anything a `pnpm update` could surprise someone with:

- a new or removed export
- a prop added, renamed or given a different default
- a token added, renamed or retuned
- a palette added or its values changed
- a peer or runtime dependency changed
- behaviour changed under `prefers-reduced-motion`

Docs-only edits, story tweaks and CI changes do not need one. Use
`pnpm changeset --empty` if CI asks and you are sure.

### Bump sizes on 0.x

While the version is `0.x`, a **minor** is a breaking change and a **patch** is
everything else. There is no major until a second real consumer has exercised
the API. Do not reach for major to signal importance.

### The README is part of the release

Before versioning, check the README still matches reality:

- the **What ships** lists, if a part was added or removed
- the **Palettes** section, if one was added or renamed
- the **Scripts** table, if a script changed
- any measurement quoted in prose, such as the `Button` size

A README that drifts is worse than a thin one, because it is confidently wrong.

## Releasing

1. `pnpm changeset` on each shipping change, as you go.
2. Merge to `main`.
3. The release workflow opens a "version packages" pull request that consumes
   the changesets, bumps the version and writes `CHANGELOG.md`.
4. Review that pull request, especially the changelog wording.
5. Merge it. The workflow publishes to npm with provenance.

`prepublishOnly` runs the build plus the RSC, package and size gates, so a
broken artifact cannot reach the registry even if something upstream is missed.

## Gates

Run before pushing, or let CI do it:

| Command | Catches |
| --- | --- |
| `pnpm check` | Lint and formatting |
| `pnpm typecheck` | Types |
| `pnpm test` | Every story in a real browser, axe violations, keyboard behaviour |
| `pnpm build && pnpm check:rsc` | A `"use client"` directive lost in the build |
| `pnpm check:package` | Malformed exports map, broken types |
| `pnpm check:size` | Bundle budget regressions |

## Adding an element

Elements come from the shadcn registry, taken as-is:

```bash
pnpm dlx shadcn@latest add <name>
pnpm exec ultracite fix
```

Then add a story with the variant matrix. Do not hand-edit an element unless
there is no alternative; if you must, record it in the README under the
deviation section, the way `Toaster` is.

**Give every control in a story an accessible name.** The a11y gate will catch a
bare `Checkbox` or `Switch`, but the deeper reason is that a story is
documentation, and an unlabelled example teaches a pattern that fails an audit.

**A `play` function is a test on a story, not a reason for a new one.** If the
rendered output is identical, attach the assertions to the existing story rather
than adding a `KeyboardFoo` twin beside it. A sidebar entry should mean "there is
something different to look at here"; four stories once existed purely to hold a
play function and showed the reader nothing new.

## Adding a chart

A chart is an element or a component like any other; the tier rules do not
change. What changes is the entry point.

1. Write it in `src/charts/`. The vendored `Chart` primitives are the exception
   and stay in `src/elements/chart.tsx`.
2. **Do not** add it to `src/elements/index.ts` or `src/components/index.ts`.
   Add it to `src/charts/index.ts` instead.
3. Compose `ChartFrame`, and give it a `ChartDataTable`. That table is the only
   text alternative a screen reader gets, and for the pie family it is the only
   route to the numbers at all.
4. Title its story `Charts/<Name>`.
5. Run `pnpm build && pnpm check:charts`. It fails if recharts became reachable
   from `.`, `/elements` or `/components`.

**The re-scaffold trap.** `components.json` sets `aliases.ui` to `@/elements`,
so `pnpm dlx shadcn@latest add chart` always writes `src/elements/chart.tsx`
regardless of the exports map. That is exactly why the file was never moved into
`src/charts/`: moving it would make every future re-scaffold create an
unexported duplicate. Do not "fix" this by changing `aliases.ui` — that alias is
what makes `shadcn add` work for the other seventeen elements.

**The two-consumer rule is suspended for charts.** A visualisation catalogue is
the product, not speculative surface, so chart types may be added ahead of a
second consumer. Nothing else in the library gets that exemption.

## Adding a component

Components compose two or more elements, own interaction, and carry no domain
knowledge or typed data shape. If it takes a typed data prop, it is a feature
and belongs in the consuming app, not here.

Ask the two-consumer question before adding anything: does a second real project
need this, or am I guessing? Promotion later is cheap. Un-shipping a published
API is not.
