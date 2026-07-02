# MTS.ChartAreaStacked — Stacked Area

`MTS.ChartAreaStacked` draws stacked (cumulative) area charts as pure SVG (zero
dependencies, XSS-safe). It extends the base `MTS.Chart` class: each dataset is stacked on
top of the previous one, so the top edge of the last dataset traces the running total at
each label.

It inherits the full base `MTS.Chart` API (common `options`, the `{ labels, datasets }`
data structure, `update()` / `destroy()`, tooltip, legend, responsive resize, and the
events API). Those are documented in [matios-ui-chart.md](matios-ui-chart.md) and are not
repeated in full here.

Values are assumed non-negative: the renderer applies `Math.abs()` to every value before
stacking. There is no percent/normalized stacking mode — bands are stacked with their raw
absolute magnitudes.

---

## Installation

`MTS.ChartAreaStacked` requires the base `matios-ui-chart.js` to be loaded first (it throws
if `MTS.Chart` is not present).

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-area-stacked.js"></script>
```

---

## Data structure

Same `{ labels, datasets }` shape as the base class. Each dataset carries its `values`
array (one value per label) plus the per-dataset options below.

```js
data: {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    {
      label:  'Product A',
      values: [30, 42, 38, 55],
      color:  '#3b82f6',
    },
    {
      label:  'Product B',
      values: [20, 28, 24, 32],
      color:  '#10b981',
    },
  ],
}
```

Datasets are drawn in array order: `datasets[0]` sits on the zero baseline, `datasets[1]`
stacks on top of it, and so on. The legend is shown (unless `options.legend` is `false`)
using a circular dot per dataset.

---

## Stacking behavior

Verified against the code:

- The Y-axis maximum is the **sum of all datasets** at each label. For every label, the
  renderer computes `stackTotal = Σ |datasets[d].values[i]|`, then the axis scales to the
  largest stack total (passed through the shared nice-scale). `yAxis.max` overrides this.
- Each band is filled between its own cumulative top edge and the top edge of the dataset
  below it (the previous cumulative baseline), producing contiguous stacked bands.
- A stroke line is drawn along the top edge of each band in the dataset color.
- Missing or `null` values are treated as `0` for that label.
- There is **no** percent/100%-stacking mode; band heights are the raw absolute values.

---

## Per-dataset options

These options are read **per dataset** (on each `datasets[i]` object), not on `options`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | `string` | internal palette | Band fill and top-line color. Falls back to the auto palette by dataset index |
| `lineWidth` | `number` | `1.5` | Stroke width of the band's top line, in px |
| `smooth` | `boolean` | `true` | Catmull-Rom smoothed edges. `false` = straight segments |
| `fillOpacity` | `number` | `0.55` | Band fill opacity, 0–1 |
| `label` | `string` | `Serie N` | Dataset name shown in the legend |
| `values` | `number[]` | `[]` | The data points, one per label (absolute value used) |

---

## Chart options (inherited from `MTS.Chart`)

Set on `options`. Read by the stacked-area renderer; all come from the shared base
contract — see [matios-ui-chart.md](matios-ui-chart.md) for the full reference.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `300` | SVG height in px (width comes from the container) |
| `animate` | `boolean` | `true` | Animate the top lines and band fade-in on render |
| `animateDuration` | `number` | `700` | Animation duration in ms |
| `grid` | `boolean` | `true` | Horizontal grid lines |
| `legend` | `boolean` | `true` | Dataset legend (circular dots) |
| `responsive` | `boolean` | `true` | Re-render on container resize (ResizeObserver) |
| `margin` | `object` | `{ top: 20, right: 24, bottom: 44, left: 56 }` | Inner margins `{ top, right, bottom, left }` |
| `yAxis.max` | `number` | auto | Manual Y-axis top (defaults to the largest stack total) |
| `yAxis.ticks` | `number` | `5` | Target tick count on the Y axis |
| `yAxis.formatter` | `function` | default formatter | `function(value)` → Y-axis label text |
| `xAxis.formatter` | `function` | identity | `function(label)` → X-axis label text |

The Y-axis is anchored at `0`; `yAxis.min` is not read by this renderer (the baseline is
always zero). With `animate` enabled, each band's top line draws in via `stroke-dashoffset`
and its fill fades from `0` to `fillOpacity`.

---

## Events

Inherited from `MTS.Chart` (`on` / `onClick` / `_emit`). `MTS.ChartAreaStacked` emits
`click` when a band (the filled area) is clicked. The payload is dataset-level, not
per-point:

```js
const chart = new MTS.ChartAreaStacked('#container', { data, options });

// Fires when a band is clicked
chart.onClick(function (e) {
  console.log(e.label);        // dataset label (ds.label)
  console.log(e.datasetIndex); // dataset index
  console.log(e.color);        // dataset color
});
```

The emitted object is `{ label, datasetIndex, color }` — `label` here is the **dataset**
label, since the whole band is the click target (there are no per-point markers).

---

## Example

```js
new MTS.ChartAreaStacked('#chart', {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label:       'Product A',
        values:      [30, 42, 38, 55, 48, 65, 58, 72, 66, 80, 88, 102],
        color:       '#3b82f6',
        fillOpacity: 0.55,
      },
      {
        label:       'Product B',
        values:      [20, 28, 24, 32, 28, 38, 34, 44, 40, 50, 56, 64],
        color:       '#10b981',
        fillOpacity: 0.55,
      },
      {
        label:       'Product C',
        values:      [12, 15, 13, 18, 16, 22, 20, 26, 24, 30, 32, 38],
        color:       '#f59e0b',
        fillOpacity: 0.55,
      },
    ],
  },
  options: {
    height: 300,
  },
});
```

---

## Related

`MTS.ChartLine` (line and single-area charts) is a separate class that also extends
`MTS.Chart`. It lives in `matios-ui-chart-line.js` and is documented in
[matios-ui-chart-line.md](matios-ui-chart-line.md).
