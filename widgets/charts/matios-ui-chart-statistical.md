# MTS.Chart — Statistical

Four statistical chart types, all pure SVG (zero dependencies, XSS-safe), all defined in
`matios-ui-chart-statistical.js` and all extending the base `MTS.Chart` class:

| Class | `_type` | Description |
|-------|---------|-------------|
| `MTS.ChartScatter` | `scatter` | Points in a continuous X/Y space |
| `MTS.ChartBubble` | `bubble` | Scatter with a third data axis mapped to point radius (`r`) |
| `MTS.ChartHistogram` | `histogram` | Bars with bins computed by the component |
| `MTS.ChartBoxPlot` | `box-plot` | Median, Q1, Q3, whiskers and outliers per category |

Each type inherits the full base `MTS.Chart` API — the constructor, `update()` / `destroy()`,
the `on` / `onClick` events plumbing, the tooltip, the legend builder, and the responsive
`ResizeObserver`. Those are documented in [matios-ui-chart.md](matios-ui-chart.md) and are not
repeated here. This document covers only what is specific to each statistical type: its data
shape, its own options and defaults, and its `click` payload.

---

## Installation

Load the base first, then the statistical type file. `matios-ui-chart-statistical.js` throws at
load time if `MTS.Chart` is not present.

```html
<link rel="stylesheet" href="matios-ui-chart.css">

<script src="matios-ui-chart.js"></script>              <!-- base MTS.Chart (required) -->
<script src="matios-ui-chart-statistical.js"></script>  <!-- Scatter + Bubble + Histogram + BoxPlot -->
```

All four classes are registered on the global `MTS` object by the one file: `MTS.ChartScatter`,
`MTS.ChartBubble`, `MTS.ChartHistogram`, `MTS.ChartBoxPlot`.

---

## Shared base options

Every type reads the same set of container/animation options from `config.options`. The exact
per-type defaults differ only where noted in each section below.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `300` | SVG height in px. Width comes from the container. |
| `margin` | `object` | per type | `{ top, right, bottom, left }`, per side, in px. |
| `grid` | `boolean` | `true` | Draw grid lines. Set `false` to hide. |
| `animate` | `boolean` | `true` | Entrance animation. Set `false` to draw final state immediately. |
| `animateDuration` | `number` | per type | Animation duration in ms (Scatter `400`, Bubble `500`, Histogram `500`, BoxPlot `600`). |
| `legend` | `boolean` | `true` | Draw the legend. Only shown with **more than one** dataset (all four types). |
| `responsive` | `boolean` | `true` | Base option — re-render on container resize. See base doc. |

Per-dataset `color` and `label` are read on each `datasets[i]`; `color` falls back to the
internal palette by dataset index, and the legend label falls back to `Serie N`.

---

## MTS.ChartScatter

Points in continuous X/Y space. Multiple datasets are supported and overlaid in the same plot.

### Data

```js
data: {
  datasets: [
    {
      label: 'Correlation',
      color: '#3b82f6',
      values: [
        { x: 10, y: 22 },
        { x: 15, y: 31 },
        { x: 20, y: 28 },
      ],
    },
  ],
}
```

Each dataset's `values` is an array of `{ x, y }` points. Both fields are numbers. The X and Y
scales are auto-fitted to the data (nice-scale), or overridden via `xAxis` / `yAxis`.

### Type-specific options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pointRadius` | `number` | `5` | Dot radius in px. |
| `xAxis.min` / `xAxis.max` | `number` | auto (data range) | Force the X-axis range. |
| `xAxis.ticks` | `number` | `5` | Target X tick count. |
| `xAxis.formatter` | `function` | built-in | `function(value)` → X-axis / tooltip `x` text. |
| `yAxis.min` / `yAxis.max` | `number` | auto (data range) | Force the Y-axis range. |
| `yAxis.ticks` | `number` | `5` | Target Y tick count. |
| `yAxis.formatter` | `function` | built-in | `function(value)` → Y-axis / tooltip `y` text. |

Default `margin`: `{ top: 20, right: 20, bottom: 44, left: 56 }`.

### Behavior

- Dots render at `0.8` opacity, `1` on hover.
- Tooltip shows the dataset label (when set) plus `x` and `y` rows, formatted with the axis
  formatters.

### Click payload

```js
{ x, y, datasetIndex, index, color }
```

### Example (matches the demo)

```js
new MTS.ChartScatter('#chart-s1', {
  data: {
    datasets: [{
      label: 'Correlation',
      color: '#3b82f6',
      values: [
        {x:10,y:22},{x:15,y:31},{x:20,y:28},{x:25,y:45},{x:30,y:38},
        {x:35,y:52},{x:40,y:49},{x:45,y:61},{x:50,y:58},{x:55,y:70},
        {x:60,y:65},{x:65,y:78},{x:70,y:74},{x:75,y:85},{x:80,y:91},
      ],
    }],
  },
  options: { height: 300 },
});
```

With axis formatters:

```js
new MTS.ChartScatter('#chart-s3', {
  data: {
    datasets: [{
      label: 'Revenue vs Employees',
      color: '#7c3aed',
      values: [
        {x:50,y:1.2},{x:120,y:2.8},{x:200,y:4.1},{x:350,y:7.5},{x:500,y:9.8},
        {x:750,y:15.2},{x:1000,y:18.9},{x:1500,y:24.3},{x:2000,y:31.1},
      ],
    }],
  },
  options: {
    height: 300,
    pointRadius: 7,
    xAxis: { formatter: function (v) { return v + ' emp'; } },
    yAxis: { formatter: function (v) { return '$' + v + 'M'; } },
  },
});
```

---

## MTS.ChartBubble

Scatter with a third data value (`r`) mapped to the point radius.

### Data

```js
data: {
  datasets: [
    {
      label: 'Markets',
      color: '#3b82f6',
      values: [
        { x: 10, y: 20, r: 5 },
        { x: 25, y: 35, r: 15 },
        { x: 40, y: 15, r: 30 },
      ],
    },
  ],
}
```

Each point is `{ x, y, r }`. `r` is a **data value**, not a pixel radius — the component
linearly maps the data `r` range onto the `rMin`…`rMax` pixel range. If a point has no `r`
(or `r == null`), it renders at the mid pixel radius `(rMin + rMax) / 2`.

### Type-specific options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rMin` | `number` | `4` | Minimum bubble radius in px (maps to the smallest data `r`). |
| `rMax` | `number` | `24` | Maximum bubble radius in px (maps to the largest data `r`). |
| `xAxis.min` / `xAxis.max` | `number` | auto (data range) | Force the X-axis range. |
| `xAxis.ticks` | `number` | `5` | Target X tick count. |
| `xAxis.formatter` | `function` | built-in | `function(value)` → X-axis / tooltip `x` text. |
| `yAxis.min` / `yAxis.max` | `number` | auto (data range) | Force the Y-axis range. |
| `yAxis.ticks` | `number` | `5` | Target Y tick count. |
| `yAxis.formatter` | `function` | built-in | `function(value)` → Y-axis / tooltip `y` text. |

Default `margin`: `{ top: 20, right: 24, bottom: 44, left: 56 }`. There is no `pointRadius`
option (that is Scatter only).

### Behavior

- Bubbles render at `0.55` opacity (`0.8` on hover) with a matching-color stroke.
- Tooltip adds an `r` row (the raw data `r`, default-formatted) below `x` and `y`.

### Click payload

```js
{ x, y, r, datasetIndex, index, color }
```

### Example (matches the demo)

```js
new MTS.ChartBubble('#chart-s4', {
  data: {
    datasets: [{
      label: 'Markets',
      color: '#3b82f6',
      values: [
        {x:10,y:20,r:5},{x:25,y:35,r:15},{x:40,y:15,r:30},
        {x:55,y:45,r:10},{x:70,y:30,r:50},{x:85,y:60,r:20},
      ],
    }],
  },
  options: { height: 300, rMin: 6, rMax: 30 },
});
```

---

## MTS.ChartHistogram

Bars whose bins are computed by the component from raw values.

### Data

Two accepted shapes. Single distribution via the `values` shorthand:

```js
data: {
  values: [23, 45, 12, 67, 34, 51, 29, 38],  // raw numbers
  label: 'Sample',                            // optional
}
```

Or multiple distributions via `datasets` (bars drawn side by side per bin):

```js
data: {
  datasets: [
    { label: 'Control Group',   color: '#3b82f6', values: [/* raw numbers */] },
    { label: 'Treatment Group', color: '#10b981', values: [/* raw numbers */] },
  ],
}
```

Note: for a histogram, `datasets[].values` is a **flat array of raw numbers** (the component
computes bin counts), not pre-binned data and not `{x,y}` points. When `datasets` is present it
takes precedence; otherwise `values` is wrapped into a single dataset.

### Binning

The bin count is `opts.bins` when provided, otherwise auto:
`Math.max(5, Math.min(40, Math.ceil(Math.log2(n) + 1)))` — Sturges' rule clamped to the range
5–40, where `n` is the largest dataset length. All datasets share the same bins, computed over
the combined data range (or `xAxis.min` / `xAxis.max` when set). Each bin is
`{ lo, hi, count }`.

### Type-specific options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bins` | `number` | auto (Sturges, clamped 5–40) | Number of bins. |
| `xAxis.min` / `xAxis.max` | `number` | auto (data range) | Force the value range used for binning. |
| `xAxis.formatter` | `function` | built-in | `function(value)` → X-axis tick / tooltip range text. |
| `yAxis.ticks` | `number` | `5` | Target count-axis tick count. |
| `yAxis.formatter` | `function` | rounds to integer | `function(count)` → Y-axis / count label text. |

Default `margin`: `{ top: 20, right: 16, bottom: 44, left: 56 }`. `xAxis.ticks` is **not** used
(X labels are derived from bin edges at a fixed step). The Y (count) axis always starts at 0.

### Behavior

- Bars render at `0.85` opacity (`1` on hover).
- Tooltip label is the bin range `lo – hi` (formatted with `xAxis.formatter`), value is the
  bin `count`.

### Click payload

```js
{ lo, hi, count, datasetIndex, index, color }
```

### Example (matches the demo)

```js
// bins = automatic (Sturges)
new MTS.ChartHistogram('#chart-s6', {
  data: { values: sample },   // array of raw numbers
  options: { height: 300, color: '#3b82f6' },
});
```

Fixed bins, multi-dataset:

```js
new MTS.ChartHistogram('#chart-s7', {
  data: {
    datasets: [
      { label: 'Control Group',   color: '#3b82f6', values: controlSample },
      { label: 'Treatment Group', color: '#10b981', values: treatmentSample },
    ],
  },
  options: { height: 300, bins: 20 },
});
```

---

## MTS.ChartBoxPlot

Median, Q1, Q3, whiskers and outliers per category. Supports grouped multi-dataset (boxes drawn
side by side within each category band). The container gets the CSS class `mts-chart--box-plot`.

### Data

`labels` drive the categories. Each dataset supplies either raw values per category, or
pre-computed stats per category.

Raw values (one array of numbers per category, aligned to `labels`):

```js
data: {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [{
    label: 'Response time (ms)',
    color: '#3b82f6',
    values: [
      [120, 145, 132, 98, 167, 88, 201, 115],  // category Q1
      [95, 110, 88, 142, 76, 165, 102, 118],    // category Q2
      [180, 210, 195, 165, 240, 175, 220, 190], // category Q3
      [145, 160, 138, 175, 125, 190, 152, 168], // category Q4
    ],
  }],
}
```

When `values[c]` is a raw array, the component computes the stats: sorted quartiles
(`q1 = sorted[floor(n*0.25)]`, `q3 = sorted[floor(n*0.75)]`, median), IQR whiskers
(`q1 − 1.5·IQR` … `q3 + 1.5·IQR`), and outliers (points outside the whiskers).

Pre-computed stats (skip the raw arrays and supply the numbers directly):

```js
data: {
  labels: ['Q1', 'Q2'],
  datasets: [{
    label: 'Latency',
    color: '#3b82f6',
    stats: [
      { min, q1, median, q3, max, whiskerLo, whiskerHi, outliers },  // category Q1
      { min, q1, median, q3, max, whiskerLo, whiskerHi, outliers },  // category Q2
    ],
  }],
}
```

Per category, `stats[c]` (if present) takes precedence over `values[c]`. The stat fields the
renderer reads are `min`, `max`, `q1`, `q3`, `median`, `whiskerLo`, `whiskerHi` and `outliers`
(an array; may be empty/omitted).

### Type-specific options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `paddingOuter` | `number` | `0.05` | Fraction of plot width used as outer padding. |
| `paddingInner` | `number` | `0.30` | Fraction of each category band used as gap. |
| `yAxis.min` / `yAxis.max` | `number` | auto (data range) | Force the value-axis range. |
| `yAxis.ticks` | `number` | `5` | Target Y tick count. |
| `yAxis.formatter` | `function` | built-in | `function(value)` → Y-axis / tooltip value text. |

Default `margin`: `{ top: 20, right: 16, bottom: 44, left: 56 }`. The category (X) axis is
labelled directly from `data.labels`; there is no `xAxis` option here.

### Behavior

- The box (Q1–Q3) renders at `0.3` opacity (`0.5` on hover) with a stroke and a thicker median
  line. Whiskers are dashed with solid caps; outliers are small hollow circles.
- Tooltip header is `datasetLabel · category` (or just the category with one dataset) followed
  by `Max`, `Q3`, `Mediana`, `Q1`, `Min` rows, each run through `yAxis.formatter`.

### Click payload

Emitted on box click:

```js
{ label, min, max, q1, q3, median, datasetIndex, index, color }
```

### Example (matches the demo)

```js
new MTS.ChartBoxPlot('#chart-s8', {
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Response time (ms)',
      color: '#3b82f6',
      values: [
        [120,145,132,98,167,88,201,115,140,155,92,178,110,130,125],
        [95,110,88,142,76,165,102,118,95,130,72,155,108,122,99],
        [180,210,195,165,240,175,220,190,160,230,170,200,185,215,195],
        [145,160,138,175,125,190,152,168,142,183,130,172,148,162,155],
      ],
    }],
  },
  options: {
    height: 320,
    yAxis: { formatter: function (v) { return v + 'ms'; } },
  },
});
```

Grouped multi-dataset — two datasets share the `labels`, boxes drawn side by side per category:

```js
new MTS.ChartBoxPlot('#chart-s9', {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'API v1', color: '#3b82f6', values: [/* one array per label */] },
      { label: 'API v2', color: '#10b981', values: [/* one array per label */] },
    ],
  },
  options: {
    height: 340,
    yAxis: { formatter: function (v) { return v + 'ms'; } },
  },
});
```

---

## Events

All four types use the inherited `on` / `onClick` API from `MTS.Chart`. Only `click` is emitted;
the payload shape differs per type (see each section above). Example with Scatter:

```js
var chart = new MTS.ChartScatter('#chart-s10', {
  data: {
    datasets: [
      { label: 'Product A', color: '#1d4ed8', values: [
        {x:12,y:38},{x:18,y:52},{x:25,y:44},{x:31,y:67},{x:40,y:59},{x:48,y:72},{x:55,y:81},
      ]},
      { label: 'Product B', color: '#10b981', values: [
        {x:10,y:25},{x:20,y:30},{x:28,y:48},{x:35,y:55},{x:45,y:63},{x:52,y:70},{x:60,y:75},
      ]},
    ],
  },
  options: {
    height: 260,
    xAxis: { formatter: function (v) { return v + ' wk'; } },
    yAxis: { formatter: function (v) { return '$' + v + 'k'; } },
  },
});

chart.onClick(function (e) {
  console.log(e.datasetIndex, e.x, e.y, e.color);
});
```

For `update()`, `destroy()`, the responsive resize, and the full events contract, see
[matios-ui-chart.md](matios-ui-chart.md).
