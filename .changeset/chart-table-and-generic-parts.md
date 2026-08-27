---
"@lfrprazeres/ui": minor
---

Five new parts, extracted from real duplication in a consuming app rather than
invented.

**Elements.** `Table` and `Chart` come from the shadcn registry unmodified.
`Chart` brings `recharts` in as a runtime dependency. Nothing extra to install,
and it tree-shakes away if you never import a chart: `Button` from the root
barrel measures the same 9.59 kB before and after, and a size budget now asserts
that.

**Components.**

- `DonutChart` draws a proportional breakdown on the five `--chart-*` semantic
  roles, so a palette retunes the whole ramp and the component never learns a
  literal colour. Optional legend with per-slice share.
- `FileDropzone` is a drop target that is also a button, so pointer, touch and
  keyboard all reach the same picker. It owns no upload logic and hands the
  caller the chosen files.
- `SearchCombobox` is a controlled combobox with a listbox popup, following the
  ARIA authoring practices: focus stays in the input and the active option is
  pointed at with `aria-activedescendant`. Filtering and fetching stay with the
  caller. It requires a `label`, because a placeholder is not an accessible name.

**Breaking.** `Chip` is now discriminated on `href`. The anchor branch accepts
anchor attributes, so `target` and `rel` typecheck on the element that actually
renders as a link. Passing span-only props alongside `href` no longer compiles,
which is the point.
