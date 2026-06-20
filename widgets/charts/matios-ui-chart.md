# MTS.Chart — Bar

Vertical and horizontal bar charts, single or multi-dataset. Pure SVG, zero dependencies.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
```

---

## Types

| Class | Description |
|-------|-------------|
| `MTS.ChartBar` | Vertical bars |
| `MTS.ChartBar` (horizontal) | `options.orientation: 'horizontal'` |

---

## Data structure

```js
data: {
  labels:   ['Jan', 'Feb', 'Mar'],       // X axis
  datasets: [
    { label: 'Series A', values: [10, 20, 15], color: '#1d4ed8' },
    { label: 'Series B', values: [8,  12, 18], color: '#10b981' },
  ],
}
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `300` | SVG height in px |
| `orientation` | `string` | `'vertical'` | `'vertical'` · `'horizontal'` |
| `negativeColor` | `string` | `'#e53935'` | Color for negative values |
| `animate` | `boolean` | `true` | Animate on render |
| `animateDuration` | `number` | `500` | Animation duration in ms |
| `grid` | `boolean` | `true` | Show grid lines |
| `legend` | `boolean` | `true` | Show dataset legend |
| `paddingInner` | `number` | `0.20` | Spacing between bars (0–1) |
| `paddingOuter` | `number` | `0.04` | Outer margin (0–1) |
| `yAxis.formatter` | `function` | — | Formats Y axis labels |
| `yAxis.min` / `yAxis.max` | `number` | auto | Manual Y axis range |
| `margin` | `object` | — | `{ top, right, bottom, left }` |
| `tooltip` | `boolean` | `true` | Show tooltip on hover |

---

## Events

```js
const chart = new MTS.ChartBar('#container', { data, options });

// onClick — fires on bar click
chart.onClick(function (e) {
  console.log(e.label);        // X axis label
  console.log(e.value);        // bar value
  console.log(e.datasetIndex); // dataset index
  console.log(e.index);        // bar index within the dataset
  console.log(e.color);        // bar color
});

// Generic events API
chart.on('click', handler);
chart.off('click', handler);
```

---

## Example

```js
new MTS.ChartBar('#sales', {
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      { label: '2024', values: [120, 180, 150, 200], color: '#1d4ed8' },
      { label: '2025', values: [140, 160, 190, 220], color: '#10b981' },
    ],
  },
  options: {
    height: 320,
    animate: true,
    yAxis: { formatter: function(v) { return '$' + v; } },
  },
});
```
