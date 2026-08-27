---
"@lfrprazeres/ui": patch
---

Fixes charts overflowing the container they are given a height in.

`className` styles the whole figure, which holds the legend and the hidden data
table as well as the plot, so a height there never reached the plot: the
container kept its default 16:9 ratio. In a wide card that computes far taller
than the figure, and the axis labels paint outside the card.

`LineChart` and `DonutChart` now take `chartClassName` for the plot area, which
replaces the default aspect ratio rather than fighting it.

The regression story measures the rendered plot against its frame: before the
fix a 240px figure held a 506px plot.
