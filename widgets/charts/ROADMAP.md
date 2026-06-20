# MTS.Chart — Development Roadmap

Pure SVG · 0 dependencies · XSS-safe  
Order: simple → complex. One type at a time — close it before opening the next.

---

## Security convention (applies to all types)

- `textContent` or `createTextNode()` for all user data (labels, names, values).
- Tooltips built with `createElement` — never template strings in `innerHTML`.
- `<foreignObject>` forbidden — only native SVG `<text>`.
- `href` in SVG: do not use, or `MTS.Sanitize.html()` if strictly necessary.
- `formatter` functions are developer code (trusted); their result still goes through `textContent`.

---

## Level 1 — Fundamentals

> Shared core: linear scale, band scale, axes, grid, tooltip, resize, animation, automatic palette.

- [x] **1.1 Vertical bar** — columns, categorical X axis, linear Y axis. Base core.
- [x] **1.2 Horizontal bar** — `orientation:'horizontal'`. Inverted axes, same animation and negativeColor.
- [x] **1.3 Line** — smooth `<path>` (Catmull-Rom) or straight, optional dots, multi-dataset.
- [x] **1.4 Area** — variant of 1.3 with `fill: true` per dataset.

## Level 2 — Circular

> Angular geometry, independent core (no axes).

- [x] **2.1 Pie** — `<path>` sectors with SVG arc, labels with guide lines.
- [x] **2.2 Donut** — Pie with `innerRadius`, optional center text.

## Level 3 — Stacked / grouped variants

- [x] **3.1 Grouped Bar** — multi-dataset side-by-side. Dep: 1.1.
- [x] **3.2 Vertical Stacked Bar** — accumulated segments. Dep: 1.1.
- [x] **3.3 Horizontal Stacked Bar** — variant of 3.2. Dep: 1.2 + 3.2.
- [x] **3.4 Stacked Area** — accumulated areas, variable baseline. Dep: 1.4.

## Level 4 — Indicators / mini-charts

- [x] **4.1 Sparkline** — line with no axes or labels, inline in cards/tables. Dep: 1.3.
- [x] **4.2 Linear gauge** — progress bar with thresholds and color zones.
- [x] **4.3 Radial gauge** — 180°/270° SVG arc, needle or fill, thresholds. Dep: 2.1.

## Level 5 — Statistical

- [x] **5.1 Scatter** — points in continuous X/Y space, linear scale on both axes.
- [x] **5.2 Bubble** — Scatter with radius as third axis. Dep: 5.1.
- [x] **5.3 Histogram** — bar with bins computed by the component. Dep: 1.1.
- [x] **5.4 Box Plot** — median, Q1, Q3, min, max per category.

## Level 6 — Compositional / relational

- [x] **6.1 Heatmap** — grid of cells with color scale.
- [x] **6.2 Treemap** — nested rectangles, squarify algorithm.
- [x] **6.3 Radar / Spider** — polygon over equidistant radial axes.
- [x] **6.4 Waterfall** — accumulated deltas, variable baseline. Dep: 1.1.
- [x] **6.5 Funnel** — centered bars with conversion percentages.

## Level 7 — Financial / temporal

- [x] **7.1 Candlestick** — OHLC, body + wick, temporal X axis.
- [x] **7.2 Timeline / Gantt** — bars with start + end, temporal X axis.

## Level 8 — Flow / topology

- [x] **8.1 Sankey** — nodes + flows with proportional width, Bézier curves.
- [x] **8.2 Network** — graphs with physics simulation (Verlet integration).

---

## Component files

```
widgets/charts/
  ROADMAP.md                      ← this file
  matios-ui-chart.js              ← core + 'bar' type
  matios-ui-chart-line.js         ← 'line' + 'area'
  matios-ui-chart-pie.js          ← 'pie' + 'donut'
  matios-ui-chart-gauge.js        ← linear + radial gauge
  matios-ui-chart-statistical.js  ← scatter, bubble, histogram, box plot
  matios-ui-chart-composite.js    ← heatmap, treemap, radar, waterfall, funnel
  matios-ui-chart-temporal.js     ← candlestick, gantt
  matios-ui-chart-flow.js         ← sankey, network
  matios-ui-chart.css
  demo.html                       ← accordion, one section per type
```

## Automatic palette (no explicit `color` in the dataset)

5 families × 4 shades — same colors as MTS.ColorPicker:

```
Navy:    #0a1628  #0d2b6b  #1d4ed8  #3b82f6
Petrol:  #0c2a35  #115e59  #0f766e  #10b981
Crimson: #3b0000  #7f0000  #cc0000  #e53935
Amber:   #451a00  #92400e  #f59e0b  #ffb737
Violet:  #2e1065  #4c1d95  #7c3aed  #a78bfa
```
