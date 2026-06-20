# MTS.Chart — Indicators (Sparkline · Gauge)

Mini inline charts and gauge indicators. Sparkline for KPI cards and tables. Gauges with thresholds and color zones.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-sparkline.js"></script>
<script src="matios-ui-chart-gauge.js"></script>
```

---

## Types

| Class | Description |
|-------|-------------|
| `MTS.ChartSparkline` | Mini line without axes, ideal in cards and tables |
| `MTS.ChartGaugeLinear` | Progress bar with thresholds and zones |
| `MTS.ChartGaugeRadial` | 180° or 270° SVG arc with center text |

---

## Sparkline — Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `60` | SVG height in px |
| `color` | `string` | auto | Line color |
| `lineWidth` | `number` | `2` | Line width |
| `smooth` | `boolean` | `true` | Catmull-Rom curves |
| `fill` | `boolean` | `false` | Area under the line |
| `fillOpacity` | `number` | `0.15` | Area opacity |
| `showDots` | `boolean` | `false` | Interactive dots with tooltip |
| `dotRadius` | `number` | `3` | Dot radius |
| `animate` | `boolean` | `true` | Entrance animation |

**Data shorthand:** `data: { values: [1,2,3], color: '#hex' }`

**onClick** — only when `showDots: true`. Emits `{ value, datasetIndex, index, color }`.

---

## GaugeLinear — Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `number` | `0` | Current value (required) |
| `min` / `max` | `number` | `0` / `100` | Range |
| `thresholds` | `array` | `[]` | `[{ value, color }, ...]` color zones |
| `trackHeight` | `number` | `12` | Bar height in px |
| `showLabel` | `boolean` | `true` | Show value below the bar |
| `showTicks` | `boolean` | `true` | Marks at each threshold |
| `formatter` | `function` | — | Formats the displayed value |
| `animate` | `boolean` | `true` | Fill animation |

**onClick** — click on the whole gauge. Emits `{ value, min, max, color }`.

---

## GaugeRadial — Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `number` | `0` | Current value (required) |
| `min` / `max` | `number` | `0` / `100` | Range |
| `angle` | `number` | `180` | `180` or `270` degrees |
| `trackWidth` | `number` | `16` | Arc width in px |
| `thresholds` | `array` | `[]` | Color zones |
| `centerText` | `string` | value | Large center text |
| `centerSubText` | `string` | — | Center subtitle |
| `showTicks` | `boolean` | `true` | Marks at the thresholds |
| `formatter` | `function` | — | Formats the value |
| `animate` | `boolean` | `true` | stroke-dashoffset animation |

**onClick** — click on the whole gauge. Emits `{ value, min, max, color }`.

---

## Events

```js
const gauge = new MTS.ChartGaugeRadial('#indicator', { options: { value: 72 } });

gauge.onClick(function (e) {
  console.log(e.value); // 72
  console.log(e.min);   // 0
  console.log(e.max);   // 100
  console.log(e.color); // active fill color
});
```

---

## Example

```js
// Inline sparkline in a card
new MTS.ChartSparkline('#spark-sales', {
  data: { values: [12, 18, 14, 22, 19, 26], color: '#10b981' },
  options: { height: 40, fill: true, animate: true },
});

// Radial gauge with thresholds
new MTS.ChartGaugeRadial('#temperature', {
  options: {
    value: 68,
    min: 0, max: 100,
    angle: 270,
    centerSubText: 'CPU Temp',
    thresholds: [
      { value: 60, color: '#10b981' },
      { value: 80, color: '#f59e0b' },
      { value: 100, color: '#e53935' },
    ],
  },
});
```
