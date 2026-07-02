# MTS.Chart — base + Bar

`MTS.Chart` is the base class every chart type inherits. It owns the tooltip, the legend, the `ResizeObserver`, the animation loop, the public `update`/`destroy`/event API, and a set of shared drawing utilities. Chart-type files (Bar, Stacked, Grouped, …) extend it and only implement the drawing (`_render`).

Pure SVG, zero dependencies, XSS-safe (all user data goes in through `textContent`).

This document covers the shared base API plus the **Bar** family: `MTS.ChartBar` (vertical / horizontal), `MTS.ChartBarGrouped`, `MTS.ChartBarStacked`, `MTS.ChartBarStackedH`.

---

## Installation

Load the base first, then the chart-type files you use. Every type file throws at load time if `MTS.Chart` is missing.

```html
<link rel="stylesheet" href="matios-ui-chart.css">

<script src="matios-ui-chart.js"></script>              <!-- base MTS.Chart (required) -->
<script src="matios-ui-chart-bar.js"></script>          <!-- MTS.ChartBar -->
<script src="matios-ui-chart-bar-grouped.js"></script>  <!-- MTS.ChartBarGrouped -->
<script src="matios-ui-chart-bar-stacked.js"></script>  <!-- MTS.ChartBarStacked + MTS.ChartBarStackedH -->
```

---

## Classes

| Class | File | Description |
|-------|------|-------------|
| `MTS.Chart` | `matios-ui-chart.js` | Base class. Not instantiated directly; shared API + utilities. |
| `MTS.ChartBar` | `matios-ui-chart-bar.js` | Vertical bars (default), or horizontal via `options.orientation`. Multiple datasets are overlaid at the same position. |
| `MTS.ChartBarGrouped` | `matios-ui-chart-bar-grouped.js` | Multiple datasets drawn side-by-side per category. |
| `MTS.ChartBarStacked` | `matios-ui-chart-bar-stacked.js` | Vertical stacked segments per category. Uses `Math.abs` on every value. |
| `MTS.ChartBarStackedH` | `matios-ui-chart-bar-stacked.js` | Horizontal variant of the stacked chart. Uses `Math.abs` on every value. |

---

## Constructor

```js
const chart = new MTS.Chart(elementOrSelector, config);
```

- `elementOrSelector` — a DOM element or a CSS selector string. Throws `MTS.Chart: element not found` if it resolves to nothing.
- `config` — `{ data, options }` (see below). Both keys are optional; missing data renders nothing.

The instance is created element-first and renders in place. There is no separate `.mount()` call.

---

## Data structure

All chart types share the same data shape:

```js
data: {
  labels: ['Jan', 'Feb', 'Mar'],   // one entry per category
  datasets: [
    { label: 'Series A', values: [10, 20, 15], color: '#1d4ed8' },
    { label: 'Series B', values: [8,  12, 18], color: '#10b981' },
  ],
}
```

| Field | Type | Description |
|-------|------|-------------|
| `labels` | `string[]` | Category labels. Drive the category axis and tooltip label. |
| `datasets` | `object[]` | One or more series. |
| `datasets[].label` | `string` | Series name. Shown in the legend and the multi-series tooltip. Legend falls back to `'Serie N'` when absent. |
| `datasets[].values` | `number[]` | Values, aligned to `labels` by index. |
| `datasets[].color` | `string` | Series color. Defaults to the internal palette (by dataset index). |
| `datasets[].negativeColor` | `string` | Bar / Grouped only — fill for negative values. Default `'#e53935'`. |

> Chart text is data-driven. There is no i18n file for charts: axis and legend labels come straight from `data.labels` and `datasets[].label`. Number formatting is controlled by the `formatter` options below.

---

## Shared base options (`config.options`)

Read by the base class regardless of chart type:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `responsive` | `boolean` | `true` | When not `false`, a `ResizeObserver` re-renders on container resize. |
| `tooltip.formatter` | `function` | — | `function(value, label)` returning the tooltip value string. Falls back to the built-in formatter (`1.2K` / `3.4M` / rounded). |

The base also provides the tooltip element, the legend builder, and the click plumbing. Options that control axes, grid, spacing, and animation are read by the chart-type `_render` (see the Bar tables below).

---

## Public methods

| Method | Returns | Description |
|--------|---------|-------------|
| `on(event, fn)` | `this` | Subscribe to an event. Currently the only emitted event is `'click'`. |
| `onClick(fn)` | `this` | Shorthand for `on('click', fn)`. |
| `update(patch)` | `void` | Re-render with a patch. `patch.data` replaces the data; `patch.options` **replaces** the whole options object (it is not merged). Then re-renders. |
| `destroy()` | `void` | Disconnect the `ResizeObserver`, cancel any animation frame, remove the SVG / legend / tooltip, and drop all listeners. |

There is no `off` method — listeners live until `destroy()`.

---

## Events

Only `'click'` is emitted (on bar click). The detail object:

```js
const chart = new MTS.ChartBar('#container', { data: data, options: options });

chart.onClick(function (detail) {
  console.log(detail.label);        // category label
  console.log(detail.value);        // clicked value
  console.log(detail.datasetIndex); // dataset index
  console.log(detail.index);        // value index within the dataset
  console.log(detail.color);        // resolved bar color
  // Stacked charts also include detail.total (category sum)
});

// Generic form:
chart.on('click', function (detail) { /* ... */ });
```

---

## Bar options (`MTS.ChartBar`)

Read by `MTS.ChartBar._render`. Applies to both vertical and horizontal.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `orientation` | `string` | `'vertical'` | `'horizontal'` or `'h'` switches to horizontal bars. Any other value is vertical. |
| `height` | `number` | `300` (V) \| `n * 40 + 60` (H) | SVG height in px. Horizontal default scales with the number of categories `n`. |
| `animate` | `boolean` | `true` | Animate bars in from the zero baseline. |
| `animateDuration` | `number` | `500` | Animation duration in ms. |
| `grid` | `boolean` | `true` | Draw grid lines along the value axis. |
| `legend` | `boolean` | `true` | Draw the legend. Only shown when there is more than one dataset. |
| `paddingInner` | `number` | `0.25` | Fraction of the band used as gap between bars (0–1). |
| `paddingOuter` | `number` | `0.05` | Fraction of the plot used as outer padding (0–1). |
| `margin` | `object` | see below | `{ top, right, bottom, left }`, per-side, in px. |

Value-axis options — `yAxis` for vertical, `xAxis` for horizontal (whichever carries the numeric scale):

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `min` | `number` | auto (`min(0, data)`) | Force the axis minimum. |
| `max` | `number` | auto (data max) | Force the axis maximum. |
| `ticks` | `number` | `5` | Target tick count (passed to the nice-scale algorithm). |
| `formatter` | `function` | built-in | `function(value)` for the numeric axis labels. |

The category axis (`xAxis` for vertical, `yAxis` for horizontal) reads only `formatter`, `function(label)`, defaulting to the identity.

Default `margin`:

| Side | Vertical | Horizontal |
|------|----------|------------|
| top | `20` | `16` |
| right | `16` | `24` |
| bottom | `44` | `36` |
| left | `56` | `120` |

**Negative values.** When a value is `< 0` the bar is filled with the dataset's `negativeColor` (default `'#e53935'`) and extends the other way from the zero baseline. If the scale spans zero, a zero line is drawn.

---

## Grouped bar options (`MTS.ChartBarGrouped`)

Same shared/base options, same `yAxis`/`xAxis` (vertical layout), plus grouping controls. Negative values still use the dataset `negativeColor`. The legend is drawn whenever `legend !== false` (not gated on dataset count).

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `innerGroupPadding` | `number` | `0.12` | Fraction of gap between bars **within** a group. |
| `paddingInner` | `number` | `0.20` | Fraction of gap **between** groups (note: different default from `ChartBar`). |
| `paddingOuter` | `number` | `0.05` | Outer padding fraction. |

---

## Stacked bar options (`MTS.ChartBarStacked` / `MTS.ChartBarStackedH`)

Segments accumulate per category; the value axis maximum is the per-category sum. Both variants apply `Math.abs` to every value, so they assume non-negative data (there is no `negativeColor`). The legend is drawn whenever `legend !== false`.

- Vertical (`MTS.ChartBarStacked`): value axis is `yAxis` (`max`, `ticks`, `formatter`); `height` default `300`.
- Horizontal (`MTS.ChartBarStackedH`): value axis is `xAxis` (`max`, `ticks`, `formatter`); `height` default `n * 40 + 60`.
- Shared: `grid`, `legend`, `animate`, `animateDuration`, `paddingInner` (`0.25`), `paddingOuter` (`0.05`), `margin`. Click detail includes `total`.

---

## Example

Copy-paste, vertical bar with a value formatter (matches the Bar demo):

```js
new MTS.ChartBar('#chart', {
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'EBITDA',
      values: [120, 245, 198, 310],
      color: '#10b981',
    }],
  },
  options: {
    height: 280,
    paddingInner: 0.45,
    paddingOuter: 0.12,
    yAxis: {
      formatter: function (v) { return '$' + v + 'K'; },
    },
  },
});
```

Horizontal bar with negative values and a custom `negativeColor`:

```js
new MTS.ChartBar('#chart', {
  data: {
    labels: ['App', 'Web', 'API', 'Support', 'Marketing', 'Ops'],
    datasets: [{
      label: 'Monthly change %',
      values: [14, -6, 22, -11, 8, -3],
      color: '#3b82f6',
      negativeColor: '#e53935',
    }],
  },
  options: {
    orientation: 'horizontal',
    height: 300,
    xAxis: {
      formatter: function (v) { return v + '%'; },
    },
  },
});
```

Grouped, stacked, and stacked-horizontal:

```js
new MTS.ChartBarGrouped('#chart', {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: '2023', values: [30, 45, 38, 52, 41, 60], color: '#7c3aed' },
      { label: '2024', values: [42, 58, 51, 70, 65, 88], color: '#3b82f6' },
      { label: '2025', values: [55, 70, 62, 80, 78, 98], color: '#10b981' },
    ],
  },
  options: { height: 300 },
});

new MTS.ChartBarStacked('#chart', {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Product A', values: [30, 45, 38, 52, 41, 60], color: '#3b82f6' },
      { label: 'Product B', values: [20, 28, 22, 35, 30, 42], color: '#10b981' },
      { label: 'Product C', values: [12, 15, 18, 20, 16, 24], color: '#f59e0b' },
    ],
  },
  options: { height: 300 },
});
```

---

## Live update

```js
const chart = new MTS.ChartBar('#chart', {
  data: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [{ label: '2025', values: [210, 340, 285, 430] }] },
  options: { height: 280 },
});

// Replace data and re-render:
chart.update({ data: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [{ label: '2024', values: [180, 260, 310, 390] }] } });
```

Note: `update({ options })` replaces the entire options object, so pass the full option set you want, not just the keys that changed.

---

## Shared utilities (advanced / internal)

The base exposes `MTS.Chart._utils` for chart-type files to build on. Not part of the public consumer API — documented only for reference:

```js
MTS.Chart._utils = {
  svgEl,       // (tag, attrs) => namespaced SVG element
  niceScale,   // (min, max, tickCount) => { min, max, ticks }
  defaultFmt,  // (value) => '1.2K' | '3.4M' | rounded string
  easeOut,     // (t) => eased 0..1 (cubic ease-out)
  PALETTE,     // string[] default color palette
};
```
