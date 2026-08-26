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

## Adding a component

Components compose two or more elements, own interaction, and carry no domain
knowledge or typed data shape. If it takes a typed data prop, it is a feature
and belongs in the consuming app, not here.

Ask the two-consumer question before adding anything: does a second real project
need this, or am I guessing? Promotion later is cheap. Un-shipping a published
API is not.
