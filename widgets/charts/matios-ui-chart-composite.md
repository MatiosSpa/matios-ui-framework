# MTS.Chart — Composite

Heatmap, treemap, radar, waterfall and funnel charts. Complex layouts in pure SVG.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-composite.js"></script>
```

---

## Types

| Class | onClick emits |
|-------|---------------|
| `MTS.ChartHeatmap` | `{ xLabel, yLabel, value, row, col }` |
| `MTS.ChartTreemap` | `{ label, value, color }` |
| `MTS.ChartRadar` | `{ label, value, datasetIndex, index, color }` |
| `MTS.ChartWaterfall` | `{ label, value, type, color }` |
| `MTS.ChartFunnel` | `{ label, value, index, color }` |

---

## Heatmap — Data

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
options: { colorLow: '#0d2b6b', colorHigh: '#3b82f6', showValues: true }
```

---

## Treemap — Data

```js
data: {
  datasets: [
    { label: 'Sales', value: 400, color: '#1d4ed8' },
    { label: 'Ops',   value: 250, color: '#0f766e' },
  ],
}
```

---

## Radar — Data

```js
data: {
  labels: ['Speed', 'Power', 'Handling', 'Comfort', 'Efficiency'],
  datasets: [
    { label: 'Model A', values: [80, 65, 90, 75, 70], color: '#1d4ed8' },
    { label: 'Model B', values: [70, 80, 75, 85, 60], color: '#10b981' },
  ],
}
options: { min: 0, max: 100, levels: 5, fillOpacity: 0.15 }
```

---

## Waterfall — Data

```js
data: {
  labels: ['Start', 'Sales', 'COGS', 'OpEx', 'Total'],
  datasets: [{
    values: [
      { value: 500, type: 'start' },  // start: initial absolute value
      { value: 300 },                  // positive delta
      { value: -120 },                 // negative delta
      { value: -80 },
      { type: 'total' },               // total: computed automatically
    ],
  }],
}
```

---

## Funnel — Data

```js
data: {
  labels: ['Visits', 'Leads', 'MQL', 'SQL', 'Closed'],
  values: [10000, 3200, 1400, 600, 180],
}
options: { showPercentage: true }
```

---

## Events

```js
const chart = new MTS.ChartHeatmap('#hm', { data, options });

chart.onClick(function (e) {
  console.log(e.xLabel, e.yLabel); // clicked cell
  console.log(e.value);            // cell value
  console.log(e.row, e.col);       // row and column indexes
});
```

---

## Example

```js
new MTS.ChartFunnel('#funnel', {
  data: {
    labels: ['Impressions', 'Clicks', 'Sign-ups', 'Payments'],
    values: [50000, 8000, 2000, 400],
  },
  options: { height: 280, showPercentage: true },
});
```
