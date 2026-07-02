# MTS.ChartLine — Line / Area

`MTS.ChartLine` draws line and area charts as pure SVG (zero dependencies, XSS-safe).
It extends the base `MTS.Chart` class and adds line-specific per-dataset rendering:
smooth Catmull-Rom curves, point markers, and an optional area fill under the line.

It inherits the full base `MTS.Chart` API (common `options`, the `{ labels, datasets }`
data structure, `update()` / `destroy()`, tooltip, legend, responsive resize, and the
events API). Those are documented in [matios-ui-chart.md](matios-ui-chart.md) and are not
repeated in full here.

---

## Installation

`MTS.ChartLine` requires the base `matios-ui-chart.js` to be loaded first (it throws if
`MTS.Chart` is not present).

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-line.js"></script>
```

---

## Data structure

Same `{ labels, datasets }` shape as the base class. Each dataset carries its `values`
array (one value per label) plus the line-specific options below.

```js
data: {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    {
      label:  'Visits',
      values: [100, 140, 120, 180],
      color:  '#1d4ed8',
      fill:   true,
    },
    {
      label:  'Conversions',
      values: [20, 35, 28, 50],
    },
  ],
}
```

When more than one dataset is present, the legend is shown (unless `options.legend` is
`false`), and the tooltip includes the dataset label.

---

## Line-specific dataset options

These options are read **per dataset** (on each `datasets[i]` object), not on `options`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | `string` | internal palette | Line, dot stroke and area color. Falls back to the auto palette by dataset index |
| `lineWidth` | `number` | `2` | Stroke width in px |
| `smooth` | `boolean` | `true` | Catmull-Rom smoothed curve. `false` = straight segments |
| `showDots` | `boolean` | `true` | Render a point marker at each value |
| `dotRadius` | `number` | `4` | Dot radius in px (grows by 2px on hover) |
| `fill` | `boolean` | `false` | Fill the area between the line and the zero baseline |
| `fillOpacity` | `number` | `0.12` | Area fill opacity, 0–1 (only when `fill: true`) |
| `label` | `string` | `Serie N` | Dataset name shown in legend and tooltip |
| `values` | `number[]` | `[]` | The data points, one per label |

Notes verified against the code:

- The area fill (`fill: true`) closes the path down to the chart's zero line, so with
  negative values the fill spans above and below zero. A dedicated zero line is drawn only
  when the data range crosses zero (`min < 0 && max > 0`).
- With `animate` enabled, the line draws in via `stroke-dashoffset`, the area fades in from
  `0` to `fillOpacity`, and dots fade in from `0` to `1`.

---

## Chart options (inherited from `MTS.Chart`)

Set on `options`. Read by the line renderer; all come from the shared base contract — see
[matios-ui-chart.md](matios-ui-chart.md) for the full reference.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `300` | SVG height in px (width comes from the container) |
| `animate` | `boolean` | `true` | Animate line/area/dots on render |
| `animateDuration` | `number` | `600` | Animation duration in ms |
| `grid` | `boolean` | `true` | Horizontal grid lines |
| `legend` | `boolean` | `true` | Dataset legend (shown only with 2+ datasets) |
| `responsive` | `boolean` | `true` | Re-render on container resize (ResizeObserver) |
| `margin` | `object` | `{ top: 20, right: 24, bottom: 44, left: 56 }` | Inner margins `{ top, right, bottom, left }` |
| `yAxis.min` / `yAxis.max` | `number` | auto | Manual Y-axis range (defaults to data range, with `min` clamped to include 0) |
| `yAxis.ticks` | `number` | `5` | Target tick count on the Y axis |
| `yAxis.formatter` | `function` | default formatter | `function(value)` → Y-axis label text |
| `xAxis.formatter` | `function` | identity | `function(label)` → X-axis label text |
| `tooltip.formatter` | `function` | default formatter | `function(value, label)` → tooltip value text |

---

## Events

Inherited from `MTS.Chart` (`on` / `onClick` / `_emit`). `MTS.ChartLine` emits `click` when
a dot is clicked, so click events require `showDots: true`.

```js
const chart = new MTS.ChartLine('#container', { data, options });

// Fires on dot click
chart.onClick(function (e) {
  console.log(e.label);        // X-axis label
  console.log(e.value);        // point value
  console.log(e.datasetIndex); // dataset index
  console.log(e.index);        // point index within the dataset
  console.log(e.color);        // dataset color
});
```

---

## Example

```js
new MTS.ChartLine('#chart', {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label:       'Revenue',
        values:      [42, 58, 51, 70, 65, 88],
        color:       '#10b981',
        fill:        true,
        fillOpacity: 0.12,
        lineWidth:   2.5,
      },
    ],
  },
  options: {
    height: 280,
  },
});
```

Multi-line, no area fill:

```js
new MTS.ChartLine('#trend', {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: '2024', values: [42, 58, 51, 70, 65, 88], color: '#3b82f6' },
      { label: '2025', values: [55, 70, 62, 80, 78, 98], color: '#10b981' },
    ],
  },
  options: {
    height: 300,
  },
});
```

---

## Related

`MTS.ChartAreaStacked` (stacked, cumulative areas) is a separate class that also extends
`MTS.Chart`. It lives in `matios-ui-chart-area-stacked.js` and is documented separately —
it is not part of `matios-ui-chart-line.js`.
