---
"@lfrprazeres/ui": patch
---

Fixes the hidden data table reading raw category values.

`LineChart` applied `formatX` to the axis ticks but not to the row headers of
the text alternative, so a timestamped series rendered a readable axis above a
table that announced `1756213200000`. The table is the only route a screen
reader has to the numbers, which made this the one place the formatting
actually had to be right. It now uses the same formatter as the axis.

Adds `minTickGap`, so a dense category axis can stop its labels crowding.

Found by a real consumer rather than by a test, which is why the regression
story uses timestamps: with string categories the bug is invisible.
