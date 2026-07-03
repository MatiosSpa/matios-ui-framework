# MTS.KPICard

KPI metric card with trend indicator, sparkline mini-chart, unit suffix, icon and color variants. Supports real-time updates via `update()`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-kpicard.css">
<script src="matios-ui-kpicard.js"></script>
```

`MTS.Sanitize` (`matios-ui-sanitize.js`) is optional — when present, the `icon` SVG string is passed through `MTS.Sanitize.html()` before injection.

---

## Usage

Element-first: `new MTS.KPICard(el | selector, options)`. The component renders in place into the given element. If the element is not found the constructor returns without building.

```js
new MTS.KPICard('#kpi-revenue', {
  label:      'Revenue',
  value:      '$24.8K',
  trend:      12,
  trendLabel: 'vs last month',
  sparkline:  [12, 18, 14, 20, 19, 24, 22]
});

new MTS.KPICard('#kpi-visits', {
  label:      'Visits',
  value:      '148K',
  trend:      8,
  trendLabel: 'this week',
  variant:    'primary',
  sparkline:  [8, 10, 12, 11, 14, 15, 16]
});

new MTS.KPICard('#kpi-users', {
  label:      'New users',
  value:      '1,248',
  trend:      -4,
  trendLabel: 'vs previous week',
  variant:    'warning',
  sparkline:  [20, 18, 19, 17, 16, 15, 14]
});
```

Clickable card (a card becomes clickable simply by having a `click` listener):

```js
new MTS.KPICard('#kpi-clickable', {
  label:   'Open tickets',
  value:   '28',
  trend:   3,
  variant: 'primary',
  onClick: function () {
    document.getElementById('kpi-result').textContent = 'clicked';
  }
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | `''` | Metric label (rendered in the header) |
| `value` | `string \| number` | `0` | Main value |
| `unit` | `string` | `''` | Unit suffix rendered next to the value: `%`, `$`, `km`, … |
| `trend` | `number` | `null` | Trend number. `>= 0` shows an up arrow (success color); `< 0` shows a down arrow (danger color). Rendered as `Math.abs(trend) + '%'`. When `null` the trend row is omitted |
| `trendLabel` | `string` | `''` | Text shown next to the trend |
| `sparkline` | `number[]` | `[]` | Data array for the mini chart. Rendered only when it has more than one point |
| `variant` | `string` | `'default'` | `'default'` \| `'primary'` \| `'success'` \| `'warning'` \| `'danger'` |
| `icon` | `string` | `null` | SVG icon string rendered in the header (sanitized via `MTS.Sanitize.html()` when available) |
| `onClick` | `function` | — | Registered as a `click` listener. Its presence makes the card clickable (pointer cursor + `--clickable` class) |

There is no `clickable` option — clickability is derived from whether a `click` listener is registered (via the `onClick` option or `on('click', fn)`).

---

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `update(options)` | `this` | Assigns each key of `options` onto the instance, then re-renders. Use for value/trend/sparkline/variant changes at runtime |
| `on(event, cb)` | `this` | Register a listener. Only `'click'` is emitted |
| `off(event, cb)` | `this` | Remove a previously registered listener |

```js
var kpi = new MTS.KPICard('#my-kpi', { label: 'ARR', value: '$11.2K', trend: 4, sparkline: [8, 10, 11, 10, 12, 11, 13] });
kpi.update({ value: '$13.4K', trend: 15, variant: 'success', sparkline: [10, 12, 13, 14, 15, 16, 18] });
kpi.on('click', function (e) { console.log(e.detail.kpi); });
```

---

## Events

| Event | Register with | Payload | When |
|-------|---------------|---------|------|
| `click` | `onClick` option or `on('click', fn)` | `{ type: 'click', detail: { kpi } }` | A clickable card is clicked |

The same event is also dispatched as a bubbling DOM `CustomEvent`:

```js
document.getElementById('my-kpi')
  .addEventListener('mts:kpicard:click', function (e) { console.log(e.detail.kpi); });
```

---

## CSS Classes

Applied automatically by the component; listed for reference when styling.

| Class | Effect |
|-------|--------|
| `.mts-kpicard` | Base KPI card (surface, border, radius, padding, 3px top accent strip via `::before`) |
| `.mts-kpicard--default / --primary / --success / --warning / --danger` | Variant. `--primary/--success/--warning/--danger` paint the top accent strip in the matching color |
| `.mts-kpicard--clickable` | Added when a `click` listener exists; adds hover shadow + primary border |

---

## i18n

Namespace: `MTS.KPICard` (registered in `matios-ui-kpicard-i18n.js` for `es` / `en` / `pt`).

The component itself renders **no** built-in chrome text: the label, value, unit, `trendLabel` and icon are all developer-supplied, and the trend arrow is a glyph (`↑` / `↓`), not a localized string. The `MTS.KPICard` i18n namespace only holds strings used by the demo page (`demo.*`), not by the component.

Language is set globally, once, at startup:

```js
MTS.setLanguage('en'); // 'es' | 'en' | 'pt'
```

There is no per-instance `locale` option and no `getMessages` / `setLocale` / `getLocale` API.

---

## Accessibility

- For a clickable card, ensure the activation target is reachable by keyboard (handle `Enter`/`Space` in your `onClick` consumer, or wrap the card in a real control) — the component sets a pointer cursor but adds no `role`/`tabindex`.
- The sparkline is decorative (`fill: none`, `stroke: currentColor`); the `value` + `trend` carry the meaning.
