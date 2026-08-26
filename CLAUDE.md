# CLAUDE.md

Repo-specific rules for `@lfrprazeres/ui`. Release process lives in
[CONTRIBUTING.md](./CONTRIBUTING.md); this file is the invariants and the traps.

## Environment

Lives in WSL at `/home/lfrprazeres/www/lfrprazeres-ui`. Node comes from fnm, not
the Windows install, so a shell that has not picked it up will fail with
`exec: node: not found` and take the husky hooks down with it:

```
export PATH=/home/lfrprazeres/.local/share/fnm/node-versions/v24.6.0/installation/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

pnpm 11. Its settings live in `pnpm-workspace.yaml`, not the `pnpm` key in
`package.json`, which pnpm 11 ignores. It also enforces a minimum release age,
so a just-published dependency is rejected until it ages; re-resolve rather
than disabling the check.

Never commit with `Co-Authored-By: Claude`. GitHub reads it as a real
contributor and lists it on the repository.

## Invariants

These are load-bearing. Breaking one usually fails silently.

**The semantic tier is shadcn's token contract, verbatim.** `--background`,
`--primary`, `--muted` and the rest. Never invent parallel names: every
scaffolded component reads these, so a rename means the next
`npx shadcn add` produces something unstyled. Extend the set, never replace it.

**Semantic tokens reference primitives through `var()`, never a pasted
literal.** A copied colour and its ramp drift apart the first time the ramp is
retuned.

**The build stays unbundled.** Bundling hoists or strips the `"use client"`
directives fourteen modules depend on, and React Server Components then break
with no error at all. `pnpm check:rsc` compares source against the build; it is
not decoration.

**The library never ships features.** Elements compose nothing else. Components
compose elements and own interaction. Anything taking a typed domain data prop
is a feature and belongs in the consuming app. If two projects want the same
feature, extract the reusable mechanism as a component and keep a thin feature
on top in each.

**Elements come from the shadcn registry unmodified.** `pnpm dlx shadcn@latest
add <name>`, then `pnpm exec ultracite fix`. One sanctioned deviation exists:
`Toaster` takes `theme` as a prop, because upstream imports `next-themes` and
that would put a Next-only dependency in a framework-agnostic package. Re-running
the CLI on that file brings the import back and also adds `next-themes` to
dependencies. Re-invert it and remove the dependency.

## Reduced motion

Collapse durations for transitions, suppress movement for loops.

A transition has a final state, so zero duration lands the user on it. A loop
does not, so zero duration is an infinite speed. `Marquee` becomes a scrollable
region; `StreamingDots` swaps its bounce for an opacity pulse rather than
stopping, because removing it entirely deletes the only cue that something is
happening. The preference targets vestibular triggers, meaning movement, so a
cross-fade stays within it.

## Palettes

A palette redefines the semantic tier under a class. It may override every
colour role plus `--radius`, `--spacing` and the font stacks, and nothing else.
`--spacing` and `--radius` work because Tailwind emits utilities as
`calc(var(--spacing) * n)` and `var(--radius)`.

Ramps must be declared in `src/tokens/01-ramps.css` before a palette can use
them. Tailwind's own ramps cannot be referenced from CSS: it only emits a theme
variable when a utility references it, so `var(--color-teal-500)` resolves to
nothing.

## Stories

Stories are the test suite, so treat them as production code.

**Give every control an accessible name.** A bare `Checkbox` or `Switch` fails
`button-name` because Radix renders them as buttons. The deeper reason is that a
story is documentation, and an unlabelled example teaches a pattern that fails an
audit.

Overlays need keyboard `play` functions covering focus trap, Escape and roving
focus. axe does not check focus management.

A JS-driven entrance needs an assertion that it reaches its final state.
If the animation never runs, the element sits at its initial opacity and the
content is invisible with nothing thrown.

## Gates

| Command | Catches |
| --- | --- |
| `pnpm check` | Lint and formatting |
| `pnpm typecheck` | Types |
| `pnpm test` | Every story in a real browser, axe violations, keyboard behaviour |
| `pnpm build && pnpm check:rsc` | A lost `"use client"` directive |
| `pnpm check:package` | Malformed exports map, broken types |
| `pnpm check:size` | Bundle budget regressions |

`verify/` holds a Next App Router consumer that installs the packed tarball and
proves the contract from outside. Run it after anything touching the build,
exports map or stylesheet.

## Sanctioned lint exemptions

Scoped in `biome.jsonc`, each with a reason. Do not widen them:

- `noBarrelFile` on the three entry points, which a published package requires,
  and on `sonner.tsx`, which re-exports `toast` so consumers need not install
  sonner themselves.
- `noLeakedRender` and the 200-line cap on `src/elements/**`, which is vendored
  and would otherwise have to be forked.

## Storybook

Sidebar entries collapse to a single item only when the story name matches the
last segment of the title exactly. A mismatch produces a folder wrapping one
near-duplicate child, which is how `Spacing And Radius` ended up nested under
`Spacing and radius`. Set `name` explicitly on single-story docs pages.

Foundations is deliberately flat. Seven entries do not need folders, and a folder
per topic would leave single-item folders.
