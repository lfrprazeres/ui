---
"@lfrprazeres/ui": minor
---

Parts a real consumer turned out to need.

**`ToggleGroup` and `Toggle`**, from the shadcn registry. A segmented control
was being hand-rolled as `role="tab"` buttons with no tablist and no panel,
which is an orphan role: assistive technology announces a tab that belongs to
nothing. Radix gives roving focus and correct pressed state instead.

**`LineChart` gained the options a price chart needs**, so it can be used for
more than a demo:

- `formatX` for category-axis ticks, such as a timestamp rendered as a date
- `valueAxis` for orientation, width, and `fit` to scale to the data range
  instead of anchoring at zero
- `grid` to turn the background grid off
- `tooltip` to replace the tooltip content entirely

Defaults are unchanged, so existing usage keeps working.
