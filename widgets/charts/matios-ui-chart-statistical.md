# MTS.Chart — Statistical

Statistical charts: scatter, bubble, histogram with auto-binning, and box plot with outlier detection.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-statistical.js"></script>
```

---

## Types

| Class | Description |
|-------|-------------|
| `MTS.ChartScatter` | Points in continuous X/Y space |
| `MTS.ChartBubble` | Scatter with radius as a third axis (`r`) |
| `MTS.ChartHistogram` | Bars with automatically computed bins |
| `MTS.ChartBoxPlot` | Median, Q1, Q3, whiskers, outliers per category |

---

## Scatter / Bubble — Data

```js
data: {
  datasets: [
    {
      label: 'Group A',
      color: '#1d4ed8',
      values: [
        { x: 10, y: 20 },       // Scatter
        { x: 10, y: 20, r: 8 }, // Bubble (r = radius in px)
      ],
    },
  ],
}
```

**onClick** — emits `{ x, y, r?, datasetIndex, index, color }`.

---

## Histogram — Data

```js
data: {
  values: [23, 45, 12, 67, 34, ...], // array of values
  // or with multiple datasets:
  datasets: [
    { label: 'Group A', values: [...], color: '#1d4ed8' },
  ],
}
```

**onClick** — emits `{ lo, hi, count, datasetIndex, index, color }`.

---

## BoxPlot — Data

```js
data: {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [
    {
      label: 'Sales',
      color: '#7c3aed',
      values: [
        [10, 20, 15, 30, 25, 18],  // array of raw values per category
        [12, 22, 19, 35, 28, 20],
        [8,  18, 14, 26, 22, 16],
      ],
    },
  ],
}
```

**onClick** — emits `{ label, min, max, q1, q3, median, datasetIndex, index, color }`.

---

## Options — common

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `300` | SVG height in px |
| `animate` | `boolean` | `true` | Entrance animation |
| `grid` | `boolean` | `true` | Grid lines |
| `legend` | `boolean` | `true` | Legend |
| `margin` | `object` | — | `{ top, right, bottom, left }` |
| `xAxis.formatter` | `function` | — | Formats the X axis |
| `yAxis.formatter` | `function` | — | Formats the Y axis |

**Histogram extra:** `bins` {number} — number of bins. Default: auto (Sturges).

---

## Events

```js
const chart = new MTS.ChartScatter('#scatter', { data, options });

chart.onClick(function (e) {
  console.log(e.x, e.y);       // point coordinates
  console.log(e.datasetIndex); // dataset index
  console.log(e.color);        // dataset color
});
```

---

## Example

```js
new MTS.ChartHistogram('#distribution', {
  data: { values: [18,22,25,28,30,22,19,26,24,31,27,23,20,29,25] },
  options: {
    height: 280,
    bins: 8,
    yAxis: { formatter: function(v) { return v + ' obs'; } },
  },
});
```
