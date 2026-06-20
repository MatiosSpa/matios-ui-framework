# MTS.Chart — Line / Area

Line and area charts with smooth curves (Catmull-Rom), multi-dataset, stacked area variant.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-line.js"></script>
```

---

## Types

| Class | Description |
|-------|-------------|
| `MTS.ChartLine` | Lines, optional dots, multi-dataset |
| `MTS.ChartAreaStacked` | Stacked areas with accumulated baseline |

---

## Data structure

```js
data: {
  labels:   ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Visits',      values: [100, 140, 120, 180], color: '#1d4ed8', fill: true },
    { label: 'Conversions', values: [20, 35, 28, 50],     color: '#10b981' },
  ],
}
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `300` | SVG height in px |
| `smooth` | `boolean` | `true` | Catmull-Rom curves. `false` = straight lines |
| `fill` | `boolean` | `false` | Area under the line (per dataset or global) |
| `fillOpacity` | `number` | `0.15` | Area opacity |
| `showDots` | `boolean` | `true` | Show points on each data value |
| `dotRadius` | `number` | `4` | Dot radius in px |
| `lineWidth` | `number` | `2` | Line thickness in px |
| `animate` | `boolean` | `true` | stroke-dashoffset animation |
| `grid` | `boolean` | `true` | Grid lines |
| `legend` | `boolean` | `true` | Datasets legend |
| `yAxis.formatter` | `function` | — | Formats Y-axis labels |
| `xAxis.formatter` | `function` | — | Formats X-axis labels |
| `margin` | `object` | — | `{ top, right, bottom, left }` |

---

## Events

```js
const chart = new MTS.ChartLine('#container', { data, options });

// onClick — fires on dot click (when showDots: true)
chart.onClick(function (e) {
  console.log(e.label);        // X-axis label
  console.log(e.value);        // point value
  console.log(e.datasetIndex); // dataset index
  console.log(e.index);        // point index
  console.log(e.color);        // dataset color
});
```

For `MTS.ChartAreaStacked` the click fires on the area (path fill), with `{ label, datasetIndex, color }`.

---

## Example

```js
new MTS.ChartLine('#trend', {
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      { label: 'CPU', values: [42, 68, 55, 73, 60], color: '#7c3aed', fill: true },
      { label: 'RAM', values: [55, 60, 58, 65, 62], color: '#0f766e' },
    ],
  },
  options: { height: 280, smooth: true, showDots: true },
});
```
