# MTS.Chart — Temporal (Candlestick · Gantt-style timeline)

`matios-ui-chart-temporal.js` defines **two** chart classes, both pure SVG (zero
dependencies, XSS-safe) and both `extends MTS.Chart`:

| Class | Description |
|-------|-------------|
| `MTS.ChartCandlestick` | OHLC candlesticks (body + wick) on a categorical X axis |
| `MTS.ChartGantt` | Lightweight Gantt-style timeline: date-based task bars, month/scale header, dependency arrows, optional drag & resize |

Both inherit the full base `MTS.Chart` API (`update()` / `destroy()`, the `on` / `onClick`
events API, tooltip, and responsive resize via `ResizeObserver`). Those are documented in
[matios-ui-chart.md](matios-ui-chart.md) and are not repeated here — this page covers only
what these two temporal types add or override.

> **Not the boards Gantt.** `MTS.ChartGantt` here is a compact *timeline chart* built on
> the chart base. It is **not** `MTS.GanttChart`, the full-featured project-board component
> in `widgets/boards/matios-ui-gantt-chart/` (with its own toolbar, editing panel, columns,
> etc.). Different class name, different file, different feature set. Document and use only
> what `MTS.ChartGantt` below actually supports.

---

## Installation

Both classes require the base `matios-ui-chart.js` to be loaded **first** — the file throws
`MTS.Chart no encontrado` if `MTS.Chart` is not present.

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-temporal.js"></script>
```

---

# MTS.ChartCandlestick

OHLC candlesticks: a thin wick from `low` to `high`, and a filled body between `open` and
`close`. Bars are colored `bullColor` when `close >= open`, otherwise `bearColor`. The X
axis is categorical (one band per label); the Y axis is a nice-scaled numeric axis.

## Data structure

`labels` is an array of category strings. The candle values live on the **first** dataset
only (`datasets[0].values`) as an array of OHLC objects. The chart renders
`min(labels.length, values.length)` candles; if that count is `0` it renders nothing.

```js
data: {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [{
    values: [
      { open: 100, high: 108, low: 97,  close: 105 },
      { open: 105, high: 112, low: 103, close: 109 },
    ],
  }],
}
```

Each value object reads exactly these four numeric fields:

| Field | Type | Description |
|-------|------|-------------|
| `open` | `number` | Opening price (body edge) |
| `high` | `number` | Session high (top of wick) |
| `low` | `number` | Session low (bottom of wick) |
| `close` | `number` | Closing price (body edge); `close >= open` is bullish |

The X-axis label for candle `i` comes from `labels[i]`. Labels are thinned automatically
(one every `ceil(n / 10)`) so a long series stays readable.

## Options

Set on `options`. Defaults are exactly as read by the code.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bullColor` | `string` | `'#10b981'` | Body/wick color when `close >= open` |
| `bearColor` | `string` | `'#e53935'` | Body/wick color when `close < open` |
| `wickWidth` | `number` | `1.5` | Wick stroke width in px |
| `paddingInner` | `number` | `0.25` | Gap fraction between candle bands (`0`–`1`) |
| `paddingOuter` | `number` | `0.04` | Outer padding fraction on each side of the plot |
| `height` | `number` | `320` | SVG height in px (width comes from the container) |
| `margin` | `object` | `{ top: 20, right: 16, bottom: 44, left: 64 }` | Inner margins `{ top, right, bottom, left }` |
| `grid` | `boolean` | `true` | Horizontal grid lines (set `false` to hide) |
| `animate` | `boolean` | `true` | Grow bodies from their midline on render |
| `animateDuration` | `number` | `500` | Entry animation duration in ms |
| `yAxis.min` / `yAxis.max` | `number` | auto | Manual Y range (defaults to data `low`/`high`) |
| `yAxis.ticks` | `number` | `5` | Target tick count on the Y axis |
| `yAxis.formatter` | `function` | default formatter | `function(value)` → Y-axis **and tooltip** value text |
| `responsive` | `boolean` | `true` | Re-render on container resize (base `MTS.Chart`) |

Notes verified against the code:

- The tooltip lists `Open` / `High` / `Low` / `Close` and formats each value with
  `yAxis.formatter`. There is **no** `tooltip.formatter` path for candlesticks — the Y-axis
  formatter is the single formatter used.
- Bars are keyed off `close >= open`, so a doji (`open === close`) renders as bullish.

## Click event

Emitted via the inherited events API (`on('click', …)` / `onClick(…)`) when a candle body
is clicked. Payload:

```js
{ label, open, high, low, close, index, color }
```

`label` is the category label, `index` is the candle's position, `color` is the resolved
bull/bear color of that candle.

## Example

```js
new MTS.ChartCandlestick('#chart', {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      values: [
        { open: 42.10, high: 45.80, low: 40.20, close: 44.50 },
        { open: 44.50, high: 47.20, low: 43.10, close: 46.80 },
        { open: 46.80, high: 48.00, low: 43.50, close: 44.20 },
        { open: 44.20, high: 46.10, low: 41.80, close: 45.60 },
        { open: 45.60, high: 50.20, low: 44.90, close: 49.30 },
        { open: 49.30, high: 51.00, low: 46.80, close: 47.90 },
      ],
    }],
  },
  options: {
    height:    300,
    bullColor: '#10b981',
    bearColor: '#7c3aed',
    yAxis: {
      formatter: function (v) { return '$' + v.toFixed(2); },
    },
  },
});
```

---

# MTS.ChartGantt

A date-based timeline. Each task becomes a horizontal bar positioned by its `start` / `end`
dates; the header shows a month row plus a scale row (weeks / days / months); optional
dependency arrows curve from a predecessor's right edge to a successor's left edge; with
`editable: true`, bars can be dragged and their edges resized.

## Data structure

Tasks live on `data.tasks`. If `tasks` is empty the chart renders nothing.

```js
data: {
  tasks: [
    {
      id:    'T1',
      label: 'Design',
      start: '2026-06-01',
      end:   '2026-06-14',
      color: '#1d4ed8',
      group: 'Phase 1',
    },
    {
      id:    'T2',
      label: 'Development',
      start: '2026-06-15',
      end:   '2026-07-15',
      color: '#0f766e',
      group: 'Phase 1',
      deps:  ['T1'],
    },
  ],
}
```

Fields read from each task object:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `string` | random | Task identity; referenced by other tasks' `deps` |
| `label` | `string` | `''` | Row label (left column) and inner bar label |
| `start` | `string` \| `number` | — | Start date. `'YYYY-MM-DD'` string or timestamp in ms |
| `end` | `string` \| `number` | — | End date, same formats as `start` |
| `color` | `string` | auto palette | Bar fill; falls back to the base palette by task index |
| `group` | `string` | `null` | Optional group; a group header row is inserted before its first task |
| `deps` | `string[]` | `[]` | IDs of predecessor tasks; each draws a dependency arrow into this bar |

Date notes verified against the code:

- A `'YYYY-MM-DD'` string is parsed as **local** midnight (`new Date(y, m-1, d)`); any other
  string form falls back to `new Date(s)`. A `number` is used directly as a millisecond
  timestamp.
- Group headers are emitted in first-seen order as tasks are iterated; a task with no
  `group` simply has no header row above it.
- Dependency arrows are drawn only when the referenced predecessor `id` exists among the
  rendered tasks; unknown IDs are skipped silently.

## Options

Set on `options`. Defaults are exactly as read by the code.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scale` | `string` | `'week'` | Timeline unit: `'day'` · `'week'` · `'month'`. Drives header labels and drag snapping |
| `editable` | `boolean` | `false` | Enables drag (move) and edge resize. Strictly `=== true` |
| `rowHeight` | `number` | `36` | Height of each row (task or group) in px |
| `labelWidth` | `number` | `160` | Width of the left label column in px |
| `height` | `number` | auto | Total SVG height. Defaults to `rows * rowHeight + header + 4` |
| `animate` | `boolean` | `true` | Grow bars from width `0` on render |
| `animateDuration` | `number` | `600` | Entry animation duration in ms |
| `onTaskMove` | `function` | — | Called on drag end: `function({ id, label, start, end })` |
| `onTaskResize` | `function` | — | Called on resize end: `function({ id, label, start, end })` |
| `onClick` | `function` | — | Called on bar click: `function({ id, label, start, end, color })` |
| `responsive` | `boolean` | `true` | Re-render on container resize (base `MTS.Chart`) |

There is no `grid` or `yAxis` option here — the vertical grid/columns and the header are
built from `scale`. The left column header cell shows a fixed label.

## Editing behavior (`editable: true`)

- **Move**: drag the bar body. The task snaps to the current `scale` unit and is clamped
  inside the visible date range.
- **Resize**: drag the left or right edge (an 8px hit zone). The opposite edge stays fixed;
  a bar cannot shrink below one `scale` unit.
- On drag/resize end, the task's `start` / `end` are written back to **`'YYYY-MM-DD'`
  strings** on both the internal task and the original source object you passed in, then the
  relevant callback/event fires.

## Events

`MTS.ChartGantt` fires three things. Two are delivered **both** through the inherited events
API (`on(name, …)`) **and** through the matching `options` callback:

| Trigger | Event name (`on`) | `options` callback | Payload |
|---------|-------------------|--------------------|---------|
| Bar click | `click` | `onClick` | `{ id, label, start, end, color }` |
| Drag end | `taskMove` | `onTaskMove` | `{ id, label, start, end }` |
| Resize end | `taskResize` | `onTaskResize` | `{ id, label, start, end }` |

Note the `taskMove` / `taskResize` payloads carry **no** `color` (only the `click` payload
does), and `start` / `end` in the move/resize payloads are the newly written
`'YYYY-MM-DD'` strings.

```js
const gantt = new MTS.ChartGantt('#project', {
  data: { tasks: [/* … */] },
  options: {
    scale:    'week',
    editable: true,
    onTaskMove: function (t) {
      console.log('Moved:', t.label, t.start, '/', t.end);
    },
    onTaskResize: function (t) {
      console.log('Resized:', t.label, t.start, '/', t.end);
    },
    onClick: function (t) {
      console.log('Clicked:', t.id, t.color);
    },
  },
});

// The same three events are also available through the base events API:
gantt.on('taskMove', function (e) { console.log(e.id, e.start, e.end); });
gantt.onClick(function (e) { console.log(e.id, e.color); });
```

## Example

```js
new MTS.ChartGantt('#roadmap', {
  data: {
    tasks: [
      { id: 'A1', label: 'Kick-off',     group: 'Start',       start: '2026-05-04', end: '2026-05-11', deps: [] },
      { id: 'A2', label: 'Discovery',    group: 'Start',       start: '2026-05-04', end: '2026-05-25', deps: [] },
      { id: 'B1', label: 'Architecture', group: 'Design',      start: '2026-05-18', end: '2026-06-08', deps: ['A1', 'A2'] },
      { id: 'C1', label: 'DB & APIs',    group: 'Development', start: '2026-06-01', end: '2026-07-06', deps: ['B1'] },
      { id: 'D1', label: 'Testing',      group: 'Quality',     start: '2026-07-13', end: '2026-08-03', deps: ['C1'] },
      { id: 'E1', label: 'Go-live',      group: 'Closure',     start: '2026-08-17', end: '2026-08-24', deps: ['D1'] },
    ],
  },
  options: {
    scale:      'week',
    editable:   true,
    rowHeight:  34,
    labelWidth: 160,
    onTaskMove: function (t) {
      console.log('Moved:', t.label, t.start, '/', t.end);
    },
  },
});
```

---

## Related

`MTS.ChartCandlestick` and `MTS.ChartGantt` are the two classes in
`matios-ui-chart-temporal.js`. Other chart types (line, bar, pie, statistical, flow,
composite, indicators) live in their own `matios-ui-chart-*.js` files and are documented
separately. The shared base contract is in [matios-ui-chart.md](matios-ui-chart.md).
