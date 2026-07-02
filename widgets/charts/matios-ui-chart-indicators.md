# MTS.Chart — Indicators (Sparkline · Gauge)

Compact indicator charts built on the shared `MTS.Chart` base: an inline **Sparkline** for KPI cards and tables, and two **Gauge** widgets (linear bar and radial arc) with color-zone thresholds.

This is an umbrella document — there is no `matios-ui-chart-indicators.js`. The three classes ship in two files:

- `MTS.ChartSparkline` → `matios-ui-chart-sparkline.js`
- `MTS.ChartGaugeLinear` / `MTS.ChartGaugeRadial` → `matios-ui-chart-gauge.js`

All three extend `MTS.Chart` (`matios-ui-chart.js`) and inherit its constructor, `update`/`destroy`, the event API, the tooltip, and the `ResizeObserver`. See [`matios-ui-chart.md`](matios-ui-chart.md) for that shared base API. Pure SVG, zero dependencies, XSS-safe.

---

## Installation

Load the base first, then the type files you use. Each type file throws at load time if `MTS.Chart` is missing.

```html
<link rel="stylesheet" href="matios-ui-chart.css">

<script src="matios-ui-chart.js"></script>            <!-- base MTS.Chart (required) -->
<script src="matios-ui-chart-sparkline.js"></script>  <!-- MTS.ChartSparkline -->
<script src="matios-ui-chart-gauge.js"></script>      <!-- MTS.ChartGaugeLinear + MTS.ChartGaugeRadial -->
```

---

## Classes

| Class | File | Description |
|-------|------|-------------|
| `MTS.ChartSparkline` | `matios-ui-chart-sparkline.js` | Mini line, no axes or labels. One or more series overlaid. Optional area fill and interactive dots. |
| `MTS.ChartGaugeLinear` | `matios-ui-chart-gauge.js` | Horizontal progress bar with threshold color zones and an optional value label. |
| `MTS.ChartGaugeRadial` | `matios-ui-chart-gauge.js` | 180° or 270° SVG arc with a filled value arc, threshold ticks, and center text. |

---

## Inherits the base `MTS.Chart` API

Construction, `update(patch)`, `destroy()`, `on(event, fn)` / `onClick(fn)`, the tooltip, and the resize handling all come from the base and are **not** repeated here. See [`matios-ui-chart.md`](matios-ui-chart.md).

Two base options apply to all three indicators:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `responsive` | `boolean` | `true` | When not `false`, a `ResizeObserver` re-renders on container resize. |
| `animate` | `boolean` | `true` | Entrance animation. Sparkline: line draw-on + fill fade. Gauges: fill / arc grow-in. Set `false` to render final state immediately. |

Instances are created element-first and render in place (no `.mount()`):

```js
const chart = new MTS.ChartSparkline(elementOrSelector, { data: data, options: options });
```

---

## Sparkline

### Data

Sparkline does **not** take a bare number array. Data is an object, in one of two shapes:

Shorthand (single series):

```js
data: { values: [1, 2, 3, 4], color: '#10b981' }
```

Standard (one or more series, overlaid on a shared Y scale):

```js
data: {
  datasets: [
    { values: [20, 35, 28, 45], color: '#3b82f6' },
    { values: [15, 20, 25, 22], color: '#10b981' },
  ],
}
```

| Field | Type | Description |
|-------|------|-------------|
| `values` | `number[]` | The series points. Shorthand form. |
| `color` | `string` | Series color (shorthand). Defaults to the palette. |
| `datasets` | `object[]` | Standard multi-series form. |
| `datasets[].values` | `number[]` | Points for that series. |
| `datasets[].color` | `string` | Series color. Defaults to the palette by dataset index. |

Any per-series option below may also be set on a `datasets[]` entry; it overrides the global `options` value for that series. If `data.values` is present, it wins and `datasets` is ignored.

### Options (`config.options`)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `60` | SVG height in px. Width comes from the container. |
| `padding` | `number` | `4` | Inner SVG padding in px, applied on every side. |
| `color` | `string` | palette | Line color. Per-dataset `color` overrides it. |
| `lineWidth` | `number` | `2` | Stroke width. |
| `smooth` | `boolean` | `true` | Catmull-Rom smoothing. Set `false` for straight segments. |
| `fill` | `boolean` | `false` | Fill the area under the line. |
| `fillOpacity` | `number` | `0.15` | Area fill opacity (used only when `fill: true`). |
| `showDots` | `boolean` | `false` | Draw interactive dots with tooltip and click. |
| `dotRadius` | `number` | `3` | Dot radius in px. |
| `animate` | `boolean` | `true` | Line draw-on + fill fade-in. |
| `animateDuration` | `number` | `400` | Animation duration in ms. |

### Events

`onClick` fires **only when `showDots: true`** (dots are the clickable targets). Detail:

```js
new MTS.ChartSparkline('#spark', {
  data: { values: [12, 18, 14, 22] },
  options: { showDots: true },
}).onClick(function (e) {
  console.log(e.value);        // clicked point value
  console.log(e.datasetIndex); // series index
  console.log(e.index);        // point index within the series
  console.log(e.color);        // resolved color
});
```

Nothing is clickable without `showDots`.

---

## GaugeLinear

A horizontal bar from `min` to `max`. Value is passed in `options` (not `data`).

### Options (`config.options`)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `number` | `0` | Current value. The main input. |
| `min` | `number` | `0` | Range minimum. |
| `max` | `number` | `100` | Range maximum. |
| `thresholds` | `object[]` | `[]` | Color zones: `[{ value, color }, ...]`. See below. |
| `color` | `string` | `PALETTE[0]` (`#3b82f6`) | Fill color when there are no thresholds. |
| `trackHeight` | `number` | `12` | Bar height in px. |
| `showLabel` | `boolean` | `true` | Show the formatted value below the bar. |
| `showTicks` | `boolean` | `true` | Draw a divider at each interior threshold (needs 2+ thresholds). |
| `formatter` | `function` | built-in | `function(value)` for the label. Falls back to `1.2K` / `3.4M` / rounded. |
| `height` | `number` | auto | SVG height in px. Auto = `8 + trackHeight + (showLabel ? 26 : 0) + 8`. |
| `animate` | `boolean` | `true` | Grow the fill from the left. |
| `animateDuration` | `number` | `600` | Animation duration in ms. |

### Thresholds

`thresholds` is an array of `{ value, color }` sorted low → high. With thresholds, the bar is filled zone by zone (each zone drawn in its color up to its `value`), and interior dividers appear when `showTicks` is on. Without thresholds the whole fill uses `color`.

The reported fill color (in the click detail) is the first threshold whose `value >= value`; if the value exceeds every threshold, the last threshold's color is used.

### Events

`onClick` fires on a click anywhere on the gauge. Detail: `{ value, min, max, color }` (`color` is the active fill color).

---

## GaugeRadial

A 180° or 270° arc. Value is passed in `options`.

### Options (`config.options`)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `number` | `0` | Current value. |
| `min` | `number` | `0` | Range minimum. |
| `max` | `number` | `100` | Range maximum. |
| `angle` | `number` | `180` | Arc sweep. Only `270` selects the 270° arc; any other value is `180`. |
| `thresholds` | `object[]` | `[]` | Color zones: `[{ value, color }, ...]`. Same shape as GaugeLinear. |
| `color` | `string` | `PALETTE[0]` (`#3b82f6`) | Arc fill color when there are no thresholds. |
| `trackWidth` | `number` | `16` | Arc stroke thickness in px. |
| `centerText` | `string` \| `false` | formatted value | Large center text. Defaults to `formatter(value)`. Pass `false` to hide the whole center block (text and subtext). |
| `centerSubText` | `string` | — | Smaller subtitle under the center text. |
| `showTicks` | `boolean` | `true` | Draw a tick at each interior threshold (needs 2+ thresholds). |
| `formatter` | `function` | built-in | `function(value)`, used for the default center text. |
| `height` | `number` | auto | SVG height in px. Auto is derived from container width, `angle`, and `trackWidth`. |
| `animate` | `boolean` | `true` | Grow the value arc via `stroke-dashoffset`. |
| `animateDuration` | `number` | `700` | Animation duration in ms. |

Width comes from the container; if the computed radius is below 10px the gauge renders nothing.

### Thresholds

Same `{ value, color }` shape and color-selection rule as GaugeLinear: the arc fill color is the first threshold whose `value >= value`, falling back to the last threshold's color when the value exceeds all of them. When there are no thresholds, the arc uses `color`.

### Events

`onClick` fires on a click anywhere on the gauge. Detail: `{ value, min, max, color }`.

---

## Examples

Sparkline in KPI cards (matches demo section 1):

```js
new MTS.ChartSparkline('#chart-a', {
  data: { values: [18, 22, 19, 30, 27, 35, 32, 40, 38, 45, 50, 48] },
  options: {
    color: '#10b981',
    height: 48,
  },
});
```

Sparkline with area fill (demo section 2):

```js
new MTS.ChartSparkline('#chart-b', {
  data: { values: [80, 95, 110, 105, 130, 140, 128, 155, 162, 170, 180, 185] },
  options: {
    color: '#7c3aed',
    fill: true,
    fillOpacity: 0.2,
    height: 60,
  },
});
```

Multi-series sparkline (demo section 3):

```js
new MTS.ChartSparkline('#chart-c', {
  data: {
    datasets: [
      { values: [20, 35, 28, 45, 40, 55, 50, 65, 60, 75, 70, 80], color: '#3b82f6' },
      { values: [15, 20, 25, 22, 30, 28, 35, 32, 40, 38, 45, 42], color: '#10b981' },
      { values: [50, 45, 42, 48, 40, 38, 35, 30, 28, 32, 25, 20], color: '#e53935' },
    ],
  },
  options: {
    height: 80,
    lineWidth: 1.5,
  },
});
```

Linear gauge with thresholds (demo section 5):

```js
var TH = [
  { value: 33,  color: '#10b981' },
  { value: 66,  color: '#f59e0b' },
  { value: 100, color: '#e53935' },
];

new MTS.ChartGaugeLinear('#chart-d', {
  options: {
    value: 74,
    max: 100,
    thresholds: TH,
    trackHeight: 16,
  },
});
```

Radial gauge 270° with thresholds, center subtext, and a custom formatter (demo section 8):

```js
var TH = [
  { value: 40,  color: '#10b981' },
  { value: 70,  color: '#f59e0b' },
  { value: 100, color: '#e53935' },
];

new MTS.ChartGaugeRadial('#chart-e', {
  options: {
    value: 78,
    angle: 270,
    thresholds: TH,
    centerSubText: 'CPU',
    formatter: function (v) {
      return v + '%';
    },
  },
});
```

Gauge click event (demo section 9):

```js
var gauge = new MTS.ChartGaugeRadial('#gauge', {
  options: {
    value: 58,
    thresholds: TH,
    centerSubText: 'CPU',
  },
});

gauge.onClick(function (e) {
  console.log('Value: ' + e.value + '  Range: ' + e.min + '-' + e.max + '  Color: ' + e.color);
});
```
