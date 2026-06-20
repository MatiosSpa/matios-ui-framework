# MTS.Chart — Temporal (Candlestick · Gantt)

Financial candlestick charts and interactive Gantt diagrams with drag, resize, dependency arrows and date-based X axis.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-temporal.js"></script>
```

---

## Types

| Class | Description |
|-------|-------------|
| `MTS.ChartCandlestick` | OHLC candlesticks with wicks, categorical X axis |
| `MTS.ChartGantt` | Task bars with real dates, scales and dependencies |

---

## Candlestick — Data

```js
data: {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [{
    values: [
      { open: 100, high: 108, low: 97, close: 105 },
      { open: 105, high: 112, low: 103, close: 109 },
    ],
  }],
}
```

**Options:** `height`, `bullColor` (`'#10b981'`), `bearColor` (`'#e53935'`), `animate`, `yAxis.formatter`.

**onClick** — emits `{ label, open, high, low, close, index, color }`.

---

## Gantt — Data

```js
data: {
  tasks: [
    {
      id: 'T1', label: 'Design', start: '2026-06-01', end: '2026-06-14',
      color: '#1d4ed8', group: 'Phase 1',
    },
    {
      id: 'T2', label: 'Development', start: '2026-06-15', end: '2026-07-15',
      color: '#0f766e', group: 'Phase 1', deps: ['T1'],
    },
  ],
}
```

Dates: string `'YYYY-MM-DD'` or timestamp in ms.

---

## Gantt — Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | auto | Total SVG height |
| `rowHeight` | `number` | `36` | Height of each task row |
| `labelWidth` | `number` | `160` | Width of the labels column |
| `scale` | `string` | `'week'` | `'day'` · `'week'` · `'month'` |
| `editable` | `boolean` | `false` | Enables drag and resize |
| `onTaskMove` | `function` | — | `callback({ id, label, start, end })` |
| `onTaskResize` | `function` | — | `callback({ id, label, start, end })` |
| `onClick` | `function` | — | `callback({ id, label, start, end, color })` |

---

## Events

```js
const gantt = new MTS.ChartGantt('#project', {
  data: { tasks: [...] },
  options: {
    scale: 'week',
    editable: true,
    onTaskMove:   function(t) { console.log('Moved:', t.label, t.start, t.end); },
    onTaskResize: function(t) { console.log('Resize:', t.label, t.end); },
    onClick:      function(t) { console.log('Click:', t.id); },
  },
});

// Event API also available
gantt.onClick(function(e) { console.log(e.id); });
```

---

## Example

```js
new MTS.ChartGantt('#roadmap', {
  data: {
    tasks: [
      { id:'D', label:'Design',      start:'2026-07-01', end:'2026-07-14', color:'#7c3aed', group:'Q3' },
      { id:'F', label:'Frontend',    start:'2026-07-15', end:'2026-08-15', color:'#1d4ed8', group:'Q3', deps:['D'] },
      { id:'B', label:'Backend',     start:'2026-07-15', end:'2026-08-31', color:'#0f766e', group:'Q3', deps:['D'] },
      { id:'QA',label:'QA',          start:'2026-09-01', end:'2026-09-15', color:'#f59e0b', group:'Q4', deps:['F','B'] },
      { id:'L', label:'Launch',      start:'2026-09-16', end:'2026-09-20', color:'#10b981', group:'Q4', deps:['QA'] },
    ],
  },
  options: { scale: 'week', editable: true },
});
```
