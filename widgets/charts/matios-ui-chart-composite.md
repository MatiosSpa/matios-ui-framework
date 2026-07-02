# MTS.Chart — Composite

Five composite chart types, each a pure-SVG class (zero dependencies, XSS-safe):

| Class | What it draws |
|-------|---------------|
| `MTS.ChartHeatmap` | Grid of cells with a low→high color scale |
| `MTS.ChartTreemap` | Nested rectangles sized by value (squarify algorithm) |
| `MTS.ChartRadar` | Polygon over equidistant radial axes |
| `MTS.ChartWaterfall` | Cumulative deltas with a variable baseline |
| `MTS.ChartFunnel` | Centered trapezoids with conversion percentages |

All five `extend MTS.Chart`, so they **inherit the base `MTS.Chart` API**
(tooltip, `ResizeObserver` responsiveness via `options.responsive`, `update()`, `destroy()`,
`on()` / `onClick()` events, and `options.tooltip.formatter`).
This document covers only the type-specific data shapes, options, and behavior.
See [`matios-ui-chart.md`](matios-ui-chart.md) for the shared base API.

Note: these types do **not** all use the base `{ labels, datasets }` structure — heatmap and
funnel take their own shapes (see below).

---

## Installation

`matios-ui-chart-composite.js` requires the base `matios-ui-chart.js` to be loaded first,
otherwise it throws at load time.

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-composite.js"></script>
```

---

## onClick detail per type

Each type uses the inherited `on()` / `onClick()` API. The `click` detail shape differs by type:

| Class | `onClick` detail |
|-------|------------------|
| `MTS.ChartHeatmap` | `{ xLabel, yLabel, value, row, col }` |
| `MTS.ChartTreemap` | `{ label, value, color }` |
| `MTS.ChartRadar` | `{ label, value, datasetIndex, index, color }` |
| `MTS.ChartWaterfall` | `{ label, value, type, color }` |
| `MTS.ChartFunnel` | `{ label, value, index, color }` |

---

## Heatmap — `MTS.ChartHeatmap`

### Data

```js
data: {
  xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  yLabels: ['Morning', 'Afternoon', 'Night'],
  values: [
    [10, 20, 15, 30, 25],
    [18, 35, 28, 40, 33],
    [5,  12, 8,  18, 14],
  ],
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `xLabels` | `string[]` | Yes | Column labels, drawn across the top. |
| `yLabels` | `string[]` | Yes | Row labels, drawn down the left. |
| `values` | `number[][]` | Yes | Matrix indexed `[row][col]`. Missing cells are treated as `0`. |

Nothing is drawn if `xLabels`, `yLabels`, or `values` is empty.
The color scale is computed from the global min/max across the whole matrix.

### Options (heatmap-specific)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `colorLow` | `string` | `'#0d2b6b'` | Color at the matrix minimum. |
| `colorHigh` | `string` | `'#3b82f6'` | Color at the matrix maximum. Cells interpolate linearly between low and high. |
| `cellPadding` | `number` | `2` | Gap in px between cells (also spaces rows vertically). |
| `cellHeight` | `number` | `min(cellW, 40)` | Cell height in px. When omitted, derived from the auto cell width, capped at 40 and floored at 8. |
| `showValues` | `boolean` | `false` | Draw the numeric value inside each cell (only when the cell is wider than 28px and taller than 14px). |
| `formatter` | `function` | base `defaultFmt` | `fn(value)` → `string` used for the in-cell value label. |
| `height` | `number` | auto | Total SVG height in px. Auto = `24 + rows × (cellHeight + cellPadding) + 8`. |
| `animate` | `boolean` | `true` | Fade-in of cells on render. |
| `animateDuration` | `number` | `500` | Fade-in duration in ms. |

Cell width is derived automatically from the container width (`(width − 56) / columns`, min 8px).

### onClick detail

```js
chart.onClick(function (e) {
  console.log(e.xLabel, e.yLabel); // labels of the clicked cell
  console.log(e.value);            // cell value
  console.log(e.row, e.col);       // row / column indexes
});
```

### Example

```js
new MTS.ChartHeatmap('#heatmap', {
  data: {
    xLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
    yLabels: ['2022', '2023', '2024', '2025'],
    values: [
      [82, 76, 91, 88],
      [74, 85, 79, 93],
      [68, 90, 87, 95],
      [71, 83, 92, 97],
    ],
  },
  options: {
    colorLow: '#451a00',
    colorHigh: '#f59e0b',
    cellHeight: 44,
    showValues: true,
    formatter: function (v) {
      return v + '%';
    },
  },
});
```

---

## Treemap — `MTS.ChartTreemap`

### Data

Uses `data.datasets` as a flat list of leaf nodes. Only nodes with `value > 0` are drawn;
nothing renders if none qualify. Tile sizing uses the squarify algorithm.

```js
data: {
  datasets: [
    { label: 'Sales', value: 400, color: '#1d4ed8' },
    { label: 'Ops',   value: 250, color: '#0f766e' },
    { label: 'R&D',   value: 180 },
  ],
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `datasets[].label` | `string` | No | Tile label. Drawn inside the tile only when it is wider than 30px and taller than 18px. |
| `datasets[].value` | `number` | Yes | Tile area weight. Nodes with `value ≤ 0` are dropped. |
| `datasets[].color` | `string` | No | Tile fill. Falls back to the internal palette by index. |

### Options (treemap-specific)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `320` | Total SVG height in px. Width is taken from the container. |
| `padding` | `number` | `2` | Inner gap in px around each tile. |
| `showValues` | `boolean` | `true` | Draw `value (NN%)` under the label — only when the tile is taller than 40px. |
| `formatter` | `function` | base `defaultFmt` | `fn(value)` → `string` for the value sub-label. |
| `animate` | `boolean` | `true` | Fade-in (0 → 0.85 opacity) on render. |
| `animateDuration` | `number` | `500` | Fade-in duration in ms. |

### onClick detail

```js
chart.onClick(function (e) {
  console.log(e.label); // tile label
  console.log(e.value); // tile value
  console.log(e.color); // tile color
});
```

### Example

```js
new MTS.ChartTreemap('#treemap', {
  data: {
    datasets: [
      { label: 'Frontend', value: 420, color: '#3b82f6' },
      { label: 'Backend',  value: 380, color: '#10b981' },
      { label: 'Mobile',   value: 260, color: '#7c3aed' },
      { label: 'DevOps',   value: 180, color: '#f59e0b' },
    ],
  },
  options: {
    height: 320,
    showValues: true,
  },
});
```

---

## Radar — `MTS.ChartRadar`

### Data

Uses the base `{ labels, datasets }` structure. Each label is one radial axis;
each dataset is one polygon. **Requires at least 3 labels** and at least one dataset —
otherwise nothing is drawn.

```js
data: {
  labels: ['Speed', 'Power', 'Handling', 'Comfort', 'Efficiency'],
  datasets: [
    { label: 'Model A', values: [80, 65, 90, 75, 70], color: '#1d4ed8' },
    { label: 'Model B', values: [70, 80, 75, 85, 60], color: '#10b981' },
  ],
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `labels` | `string[]` | Yes (≥ 3) | One radial axis per entry. |
| `datasets[].values` | `number[]` | Yes | One value per axis. Clamped to the `[min, max]` range. |
| `datasets[].label` | `string` | No | Series name, shown in the tooltip and legend. |
| `datasets[].color` | `string` | No | Polygon color. Falls back to the internal palette by index. |

### Options (radar-specific)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `min` | `number` | `0` | Value mapped to the center. |
| `max` | `number` | `100` | Value mapped to the outer ring. |
| `levels` | `number` | `5` | Number of concentric grid rings. |
| `fillOpacity` | `number` | `0.15` | Opacity of each polygon fill. |
| `height` | `number` | `min(width, 380)` | Total SVG height in px. |
| `legend` | `boolean` | `true` | Shown only when there is more than one dataset. Set `false` to hide. |
| `animate` | `boolean` | `true` | Fade-in of fills, strokes and dots on render. |
| `animateDuration` | `number` | `600` | Fade-in duration in ms. |

### onClick detail

Fires on the vertex dots (one per axis per dataset):

```js
chart.onClick(function (e) {
  console.log(e.label);        // axis label
  console.log(e.value);        // value at that vertex
  console.log(e.datasetIndex); // dataset index
  console.log(e.index);        // axis index
  console.log(e.color);        // series color
});
```

### Example

```js
new MTS.ChartRadar('#radar', {
  data: {
    labels: ['Speed', 'Accuracy', 'Stamina', 'Strength', 'Agility', 'Technique'],
    datasets: [
      { label: 'Team A', color: '#3b82f6', values: [85, 72, 90, 68, 78, 82] },
      { label: 'Team B', color: '#10b981', values: [70, 88, 65, 92, 85, 74] },
      { label: 'Team C', color: '#f59e0b', values: [60, 65, 80, 75, 60, 95] },
    ],
  },
  options: {
    height: 340,
    fillOpacity: 0.12,
  },
});
```

---

## Waterfall — `MTS.ChartWaterfall`

### Data

Reads **only `data.datasets[0].values`** (further datasets are ignored) plus `data.labels`.
Each entry is either a plain number (a delta) or an object `{ value, type }`.
Nothing is drawn if `labels` or the values array is empty.

```js
data: {
  labels: ['Start', 'Sales', 'COGS', 'OpEx', 'Total'],
  datasets: [{
    values: [
      { value: 500, type: 'start' },  // 'start' — sets the running total to this absolute value
      { value: 300 },                 // delta (positive)
      { value: -120 },                // delta (negative)
      -80,                            // plain number = delta
      { type: 'total' },              // 'total' — a bar at the current running total
    ],
  }],
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `labels` | `string[]` | Yes | One label per bar (X axis). |
| `datasets[0].values` | `(number \| { value, type })[]` | Yes | Bars in order. |
| `values[].value` | `number` | For `delta`/`start` | Amount. For a bare number this is the delta. |
| `values[].type` | `'delta' \| 'start' \| 'total'` | No | Bar kind. Default `'delta'`. |

Bar type behavior:

- **`delta`** (default) — floats from the running total by `value`; running total then advances by `value`. Colored `positiveColor` / `negativeColor` by sign.
- **`start`** — a bar from `0` to `value`; **resets** the running total to `value`. Colored by sign.
- **`total`** — a bar from `0` to the current running total (its own `value` is ignored). Colored `totalColor`.

### Options (waterfall-specific)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `positiveColor` | `string` | `'#10b981'` | Fill for positive deltas / positive start bars. |
| `negativeColor` | `string` | `'#e53935'` | Fill for negative deltas / negative start bars. |
| `totalColor` | `string` | `'#3b82f6'` | Fill for `total` bars. |
| `connector` | `boolean` | `true` | Dashed line linking each bar to the next. |
| `height` | `number` | `320` | Total SVG height in px. |
| `grid` | `boolean` | `true` | Horizontal grid lines at Y ticks. |
| `margin` | `object` | `{ top: 24, right: 16, bottom: 44, left: 64 }` | Plot margins in px (each side overridable). |
| `paddingOuter` | `number` | `0.04` | Outer band padding as a fraction of chart width. |
| `paddingInner` | `number` | `0.25` | Inner band padding (bar gap) as a fraction of the band step. |
| `yAxis.formatter` | `function` | base `defaultFmt` | `fn(value)` → `string` for Y-axis ticks and value labels. |
| `yAxis.min` | `number` | auto | Force the Y-scale minimum (before "nice" rounding). |
| `yAxis.max` | `number` | auto | Force the Y-scale maximum (before "nice" rounding). |
| `yAxis.ticks` | `number` | `5` | Target number of Y-axis ticks. |
| `animate` | `boolean` | `true` | Bars grow from their baseline on render. |
| `animateDuration` | `number` | `500` | Grow duration in ms. |

A zero line is drawn when the Y scale spans negative and positive.
Per-bar value labels (with a `+` prefix for positives) appear when the bar is taller than 8px.

### onClick detail

```js
chart.onClick(function (e) {
  console.log(e.label); // bar label
  console.log(e.value); // bar value (the running total for a 'total' bar)
  console.log(e.type);  // 'delta' | 'start' | 'total'
  console.log(e.color); // bar color
});
```

### Example

```js
new MTS.ChartWaterfall('#waterfall', {
  data: {
    labels: ['Start', 'Sales', 'Returns', 'Costs', 'Taxes', 'Result'],
    datasets: [{
      values: [
        { value: 0, type: 'start' },
        { value: 500 },
        { value: -80 },
        { value: -150 },
        { value: -60 },
        { type: 'total' },
      ],
    }],
  },
  options: {
    height: 320,
    yAxis: {
      formatter: function (v) {
        return '$' + v + 'K';
      },
    },
  },
});
```

---

## Funnel — `MTS.ChartFunnel`

### Data

Takes its own shape: `data.labels` and `data.values` (no `datasets`).
Stages are drawn top to bottom, one trapezoid per stage. The number of stages is
`min(labels.length, values.length)`; nothing is drawn if either is empty.

```js
data: {
  labels: ['Visits', 'Leads', 'MQL', 'SQL', 'Closed'],
  values: [10000, 3200, 1400, 600, 180],
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `labels` | `string[]` | Yes | Stage names, drawn on the left of each stage. |
| `values` | `number[]` | Yes | Stage values. Widths are proportional to `values[0]` (the widest stage). |

### Options (funnel-specific)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `colors` | `string[]` | palette | Per-stage fill. Missing entries fall back to the internal palette by index. |
| `showPercentage` | `boolean` | `true` | Append `(NN%)` — the step conversion vs. the previous stage — to each value label (skipped on the first stage). |
| `formatter` | `function` | base `defaultFmt` | `fn(value)` → `string` for the value label. |
| `height` | `number` | `stages × 56 + 32` | Total SVG height in px. |
| `margin` | `object` | `{ top: 16, right: 16, bottom: 16, left: 16 }` | Plot margins in px (each side overridable). |
| `animate` | `boolean` | `true` | Fade-in (0 → 0.85 opacity) on render. |
| `animateDuration` | `number` | `600` | Fade-in duration in ms. |

The tooltip on hover shows the stage `label`, its `value`, and the step conversion percentage
(`100%` on the first stage).

### onClick detail

```js
chart.onClick(function (e) {
  console.log(e.label); // stage label
  console.log(e.value); // stage value
  console.log(e.index); // stage index
  console.log(e.color); // stage color
});
```

### Example

```js
new MTS.ChartFunnel('#funnel', {
  data: {
    labels: ['Leads', 'Contacted', 'Demos', 'Proposals', 'Closed'],
    values: [3200, 1400, 620, 290, 115],
  },
  options: {
    height: 280,
    colors: ['#1d4ed8', '#0f766e', '#7c3aed', '#f59e0b', '#10b981'],
    formatter: function (v) {
      return v.toLocaleString();
    },
  },
});
```

---

## Runtime updates

All five types inherit `update()` from the base — swap data or options and the chart re-renders:

```js
chart.update({ data: newData });
```
