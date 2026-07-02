# MTS.ChartPie — Pie / Donut

`MTS.ChartPie` renders a pie or donut chart as pure SVG (zero dependencies, XSS-safe).
A donut is just a pie with `innerRadius > 0` — there is no separate class.

`MTS.ChartPie` extends `MTS.Chart`, so it **inherits the base `MTS.Chart` API**
(tooltip, `ResizeObserver` responsiveness, `update()`, `destroy()`, `on()` / `onClick()` events).
This document covers only the pie-specific data shape, options, and behavior.
See [`matios-ui-chart.md`](matios-ui-chart.md) for the shared base API.

---

## Installation

`matios-ui-chart-pie.js` requires the base `matios-ui-chart.js` to be loaded first,
otherwise it throws at load time.

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-pie.js"></script>
```

---

## Data structure

A pie uses a **single dataset** — only `datasets[0]` is read; any further datasets are ignored.
Each value maps to one sector; `labels[i]` names the sector at the same index.

```js
data: {
  labels: ['Product A', 'Product B', 'Product C'],
  datasets: [
    {
      values: [45, 30, 25],
    },
  ],
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `labels` | `string[]` | No | Name of each sector. Missing entries render as empty. |
| `datasets[0].values` | `number[]` | Yes | Value of each sector. Sectors use `Math.abs(value)`; sign is ignored for sizing. |
| `datasets[0].colors` | `string[]` | No | Color per sector. If omitted (or an entry is missing) the internal palette is used. |

Sweep is proportional to each value over the total (`abs(value) / sum(abs(values))`).
If there are no datasets, no values, or the total is `0`, nothing is drawn.

```js
// With explicit colors per sector:
datasets: [
  {
    values: [45, 30, 25],
    colors: ['#1d4ed8', '#10b981', '#f59e0b'],
  },
]
```

---

## Options (pie-specific)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `320` | Total SVG height in px. Width is taken from the container. |
| `innerRadius` | `number` | `0` | Hole radius. `> 0` turns the pie into a donut. A value `≥ 1` is absolute px; a value in the range `0`–`1` is a fraction of the outer radius (e.g. `0.55` = 55%). Clamped to `radius - 4`. |
| `centerText` | `string` | `''` | Main text drawn in the donut center. Only rendered when `innerRadius > 0`. |
| `centerSubText` | `string` | `''` | Sub-text drawn under `centerText` in the donut center. Only rendered when `innerRadius > 0`. |
| `labels` | `boolean` \| `object` | `true` | `false` hides the external callout labels (guide line + text). An object keeps callouts and can carry a `formatter`. |
| `labels.formatter` | `function` | — | `fn(value, label, pct)` → `string`. `pct` is the `0`–`1` fraction. Default renders `label · NN%` (or just `NN%` when there is no label). |
| `legend` | `boolean` | `true` | Show the bottom legend (one round dot + label per sector). |
| `animate` | `boolean` | `true` | Sweep (clockwise reveal) animation on render. |
| `animateDuration` | `number` | `600` | Animation duration in ms. |
| `responsive` | `boolean` | `true` | Re-render on container resize (base `MTS.Chart` option). |

Notes on labels:

- Callouts are only drawn for sectors whose share is `≥ 4%`; smaller sectors are skipped to avoid overlap.
- A sector that reaches 100% is drawn as a full circle (SVG arcs cannot span exactly 360°).

---

## Events (pie-specific detail)

`MTS.ChartPie` uses the inherited `on()` / `onClick()` API. The `click` detail for a pie sector is:

```js
const chart = new MTS.ChartPie('#container', { data: data, options: options });

// onClick — fires on sector click
chart.onClick(function (detail) {
  console.log(detail.label); // sector name
  console.log(detail.value); // numeric value
  console.log(detail.index); // sector index
  console.log(detail.color); // sector color
  console.log(detail.pct);   // share as a 0–1 fraction (× 100 for percent)
});
```

The tooltip on hover shows the sector `label` and its `value` (formatted via the base
`options.tooltip.formatter` if provided — see the base doc).

---

## Example

```js
// Donut with center text — a single dataset per pie.
new MTS.ChartPie('#distribution', {
  data: {
    labels: ['Completed', 'In progress', 'Pending'],
    datasets: [
      {
        values: [62, 23, 15],
        colors: ['#10b981', '#3b82f6', '#94a3b8'],
      },
    ],
  },
  options: {
    height: 320,
    innerRadius: 0.60,
    centerText: '62%',
    centerSubText: 'Completed',
  },
});
```

Switch data at runtime with the inherited `update()`:

```js
chart.update({ data: newData });
```
