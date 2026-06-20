# MTS.Chart — Pie / Donut

Pie and donut charts with SVG arc paths, label guide lines, and optional center text.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-pie.js"></script>
```

---

## Types

| Class | Description |
|-------|-------------|
| `MTS.ChartPie` | Full circular sectors |
| `MTS.ChartDonut` | Pie with center hole, optional text |

---

## Data structure

```js
data: {
  labels:   ['Product A', 'Product B', 'Product C'],
  datasets: [{ values: [45, 30, 25] }],
}

// With colors per sector:
datasets: [{ values: [45, 30, 25], colors: ['#1d4ed8', '#10b981', '#f59e0b'] }]
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `300` | SVG height in px |
| `innerRadius` | `number` | `0` | Hole radius (Donut only, 0–1) |
| `centerText` | `string` | — | Large center text (Donut only) |
| `centerSubText` | `string` | — | Center subtitle (Donut only) |
| `showLabels` | `boolean` | `true` | Show labels with guide lines |
| `showPercentage` | `boolean` | `true` | Show percentage in labels |
| `animate` | `boolean` | `true` | Rotation animation on render |
| `formatter` | `function` | — | Formats values in tooltip |

---

## Events

```js
const chart = new MTS.ChartPie('#container', { data, options });

// onClick — fires on sector click
chart.onClick(function (e) {
  console.log(e.label);      // sector name
  console.log(e.value);      // numeric value
  console.log(e.percentage); // percentage (0–100)
  console.log(e.index);      // sector index
  console.log(e.color);      // sector color
});
```

---

## Example

```js
new MTS.ChartDonut('#distribution', {
  data: {
    labels: ['Mobile', 'Desktop', 'Tablet'],
    datasets: [{ values: [58, 32, 10] }],
  },
  options: {
    height: 280,
    innerRadius: 0.6,
    centerText: '100%',
    centerSubText: 'Users',
  },
});
```
