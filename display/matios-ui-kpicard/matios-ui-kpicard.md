# MTS.KPICard

KPI metric card with trend indicator, sparkline mini-chart, icon and variants. Supports real-time updates via `update()`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-kpicard.css">
<script src="matios-ui-kpicard.js"></script>
```

---

## Usage

### JavaScript

```js
// Basic — with trend
new MTS.KPICard('#kpi-revenue', {
  label:      'Total Revenue',
  value:      48500,
  unit:       '$',
  trend:      12.4,            // positive → up arrow
  trendLabel: 'vs last month',
  variant:    'success',
});

// With sparkline
new MTS.KPICard('#kpi-visits', {
  label:     'Page visits',
  value:     '12,847',
  trend:     -3.2,            // negative → down arrow
  sparkline: [45, 52, 38, 65, 48, 72, 61, 83, 55, 90],
  variant:   'primary',
});

// With icon
new MTS.KPICard('#kpi-users', {
  label: 'Active users', value: 1284, trend: 8.1, icon: '<svg>...</svg>', variant: 'primary',
});

// Clickable
new MTS.KPICard('#kpi-orders', {
  label:     'Orders',
  value:     342,
  trend:     5.7,
  clickable: true,
  onClick:   function (e) { router.push('/orders'); },
});
```

### CSS only (no JS)

```html
<!-- Embedded KPI card without its own frame, with a top accent strip -->
<div class="mts-kpicard mts-kpicard--no-frame mts-kpicard--primary">
  <div class="mts-kpicard__header">
    <div class="mts-kpicard__label">My sales</div>
  </div>
  <div class="mts-kpicard__value-wrap">
    <div class="mts-kpicard__value">$48,500</div>
  </div>
</div>
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | `''` | Metric label |
| `value` | `string \| number` | `0` | Main value |
| `unit` | `string` | `''` | Unit suffix: `%`, `$`, `km`, … |
| `trend` | `number` | `null` | Trend % (positive = up, negative = down) |
| `trendLabel` | `string` | `''` | Label next to the trend |
| `sparkline` | `number[]` | `[]` | Data array for the mini chart |
| `variant` | `string` | `'default'` | `'default'` · `'primary'` · `'success'` · `'warning'` · `'danger'` |
| `icon` | `string` | `null` | SVG icon string |
| `clickable` | `boolean` | `false` | Make the card clickable |
| `onClick` | `function` | — | Fires when the card is clicked |

---

## API

| Method | Description |
|--------|-------------|
| `update(options)` | Update values at runtime (value, trend, sparkline, …) and re-render |
| `on(event, cb)` / `off(event, cb)` | Register / remove listeners (`'click'`) |

```js
const kpi = new MTS.KPICard('#my-kpi', { label: 'Revenue', value: 0 });
kpi.update({ value: 52300, trend: 8.2, sparkline: [50, 60, 45, 70, 55, 80] });
kpi.on('click', function (e) { console.log(e.detail.kpi); });
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onClick(fn)` / `on('click', fn)` | `{ kpi }` | A clickable card is clicked |

Also dispatched as a DOM event:

```js
document.getElementById('my-kpi')
  .addEventListener('mts:kpicard:click', function (e) { console.log(e.detail.kpi); });
```

---

## CSS Classes

| Class | Effect |
|-------|--------|
| `.mts-kpicard` | Base KPI card |
| `.mts-kpicard--primary / --success / --warning / --danger` | Paints the 3px top accent strip in the matching color |
| `.mts-kpicard--no-frame` | Removes the visual frame (background + border + radius) but **keeps** the inner padding, the `::before` accent strip and the typography. Useful when embedded in a container that already provides the frame (e.g. `MTS.DashboardGrid`, drawer, sidebar). Combinable with the color modifiers |

---

## Accessibility

- For a `clickable` card, ensure the activation target is reachable by keyboard (handle `Enter`/`Space` in your
  `onClick` consumer, or wrap the card in a real control).
- The sparkline is decorative; the `value` + `trend` carry the meaning.

---

## Changelog

### Initial
- KPI card with label/value/unit, trend indicator, sparkline mini-chart, icon, color variants, `clickable`, and
  real-time `update()`. CSS modifiers `--no-frame` and color top-accent for embedded usage.
