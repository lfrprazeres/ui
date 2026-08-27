---
"@lfrprazeres/ui": minor
---

Add `loading` and `loadingLabel` to the chart layer

`ChartFrame`, and through it `LineChart` and `DonutChart`, can now show that
fresh data is on its way. The plot stays mounted and dims while a `role="status"`
region announces the wait, rather than being swapped for a skeleton: async data
is a chart's normal case, and remounting recharts on every refresh throws away
the rendered SVG so a routine poll looks like a full reload.

`loading` also wins over `isEmpty`, because showing "no data" before the first
response has arrived states something the chart does not yet know.

Minor rather than patch because the frame now wraps the plot in a positioned
element, so a consumer reaching past the figure with a structural CSS selector
will need to look one level deeper.
