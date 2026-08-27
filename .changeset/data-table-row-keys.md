---
"@lfrprazeres/ui": patch
---

Fixes duplicate React keys in the chart data table.

`ChartDataTable` keyed each row by its header, which is the *formatted*
category. That is not unique: a year of daily points formats to a dozen rows all
headed "Aug", and React warned about duplicate keys for every one of them.
Rows now carry a `key` taken from the raw category value, separate from the text
they display.

If you build a chart on `ChartDataTable` directly, its rows now require a `key`.

The regression story formats month-only on purpose, so all its points share a
header and the collision is reproduced rather than merely described.
