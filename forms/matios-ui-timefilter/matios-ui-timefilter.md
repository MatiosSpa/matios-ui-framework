# MTS.TimeFilter

A Kibana-style **time-window filter**: a trigger that shows the active range and opens a popover with three modes — **Relative** ("Last N minutes/hours/days/weeks"), **Absolute** (from / to dates) and **Quick** (presets).

It does **not** filter data itself. It resolves a `{ from, to }` range and hands it back through `onChange` / `get()`; the consumer decides what to do with it (querystring, query, etc.).

> Not to be confused with `MTS.DatePicker.DateRange` (a two-date calendar). `MTS.TimeFilter` is the *time-window* control with a relative mode and presets.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-popover.css">
<link rel="stylesheet" href="matios-ui-numberinput.css">
<link rel="stylesheet" href="matios-ui-select.css">
<link rel="stylesheet" href="matios-ui-date-picker.css">
<link rel="stylesheet" href="matios-ui-timefilter.css">

<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-popover.js"></script>
<script src="matios-ui-numberinput.js"></script>
<script src="matios-ui-select.js"></script>
<script src="matios-ui-date-picker-base.js"></script>
<script src="matios-ui-date-picker-date.js"></script>
<!-- optional: matios-ui-toast.js (used for the "invalid range" notice) -->
<script src="matios-ui-timefilter-i18n.js"></script>
<script src="matios-ui-timefilter.js"></script>
```

`MTS.TimeFilter` composes `MTS.Popover`, `MTS.NumberInput`, `MTS.Select` and `MTS.DatePicker.Date` (or `MTS.DatePicker.DateTime` when `withTime` is on). Make sure those are loaded before it.

---

## Usage

```html
<div id="filter"></div>
```

```js
var tf = new MTS.TimeFilter('#filter', {
  value: { mode: 'relative', n: 1, unit: 'h' },   // initial range
  quickRanges: [
    { n: 15, unit: 'm' }, { n: 1, unit: 'h' }, { n: 24, unit: 'h' },
    { preset: 'today' }, { preset: 'yesterday' }, { preset: 'thisWeek' }
  ],
  onChange: function (range) {
    // range = { mode, n, unit, preset, from, to, fromIso, toIso, label }
    fetch('/api/logs?' + tf.query());             // from=<iso>&to=<iso>
    console.log(range.label, range.fromIso, range.toIso);
  }
});

// swap the presets at runtime:
tf.setQuickRanges([{ preset: 'thisMonth' }, { preset: 'lastMonth' }]);

// at any time, a single get() returns everything (relative recomputes to=now):
var r = tf.get();
// { mode, n, unit, preset, from, to, fromIso, toIso, label }
```

Element-first, like the rest of the framework: `new MTS.TimeFilter(domElement|selector, options)` renders in place. There is no `.mount()`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `object` | `{ mode:'relative', n:1, unit:'h' }` | Initial range. Relative (`mode/n/unit`) or absolute (`mode:'absolute', from, to`). |
| `quickRanges` | `array` | `[{n:15,unit:'m'},{n:1,unit:'h'},{n:6,unit:'h'},{n:24,unit:'h'},{n:7,unit:'d'}]` | Presets for the Quick tab. Each entry is **relative** (`{n, unit, label?}`) or **semantic** (`{preset, label?}` — see below). `label` is optional (relative auto-generates `n`+`unit`; semantic uses its localized name). |
| `units` | `array` | `['m','h','d','w']` | Enabled units in the Relative tab (in display order). |
| `withTime` | `boolean` | `false` | If `true`, Absolute uses `MTS.DatePicker.DateTime` (takes time); if `false`, day granularity (`00:00` → `23:59`). |
| `position` | `string` | `'bottom'` | Popover position (passed to `MTS.Popover`). |
| `width` | `string` | `'360px'` | Popover width. |
| `texts` | `object` | `{}` | Text overrides — these win over the i18n catalog (see CSS Variables / i18n below). |
| `defaultTab` | `string` | `'relative'` | Active tab when opened — `'relative'` · `'absolute'` · `'quick'`. |
| `onChange` | `function` | — | `function(range)` on Apply / Quick pick (see API for the shape). |
| `onOpen` / `onClose` | `function` | — | Popover lifecycle callbacks. |

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `get()` | `RangeResult` | The whole range in one call. In relative mode `from/to` are computed at call time (`now − n·unit`). |
| `getValue()` | `RangeResult` | Alias of `get()`. |
| `set(range)` | `this` | Set the range (`{mode,n,unit}` or `{mode:'absolute',from,to}`) and refresh the label. Does **not** fire `onChange`. |
| `apply(range?)` | `this` | Optionally set, then fire `onChange`. |
| `setQuickRanges(ranges)` | `this` | Replace the Quick-tab presets at runtime (re-renders the panel if it is open on the Quick tab). |
| `open()` / `close()` | `this` | Open / close the popover. |
| `query()` | `string` | Shortcut: `"from=<iso>&to=<iso>"` ready for a querystring (URL-encoded). |
| `destroy()` | — | Remove listeners + popover and clear the host. |

### `RangeResult` — what `get()` returns

```js
{
  mode:    'relative' | 'absolute',
  n:       15,          // amount (relative only; null in absolute)
  unit:    'm',         // 'm'|'h'|'d'|'w' (relative only; null in absolute)
  preset:  null,        // semantic key ('today'|'yesterday'|…) when picked from a semantic Quick preset; else null
  from:    Date,        // resolved start (always present)
  to:      Date,        // resolved end (always present; in relative = now)
  fromIso: '2026-06-19T13:00:00.000Z',  // from.toISOString() (UTC)
  toIso:   '2026-06-19T14:00:00.000Z',  // to.toISOString()   (UTC)
  label:   'Last 1 hour'                // human label of the active range (singular when n === 1)
}
```

> **Relative auto-advance:** in relative mode every `get()` recomputes `to = now` and `from = now − n·unit`. If the consumer calls `get()` inside an auto-refresh loop, the window moves on its own.

---

## Quick presets

The Quick tab accepts two kinds of entry, freely mixed:

```js
new MTS.TimeFilter('#filter', {
  quickRanges: [
    { n: 15, unit: 'm' },                 // relative — "Last 15 minutes"
    { n: 1,  unit: 'h', label: '1h' },    // relative with explicit label
    { preset: 'today' },                  // semantic — resolves to an absolute range
    { preset: 'yesterday' },
    { preset: 'thisWeek', label: 'WTD' }  // semantic with custom label
  ]
});
```

**Relative** entries (`{n, unit, label?}`) produce a sliding window. **Semantic** entries (`{preset, label?}`) resolve to a fixed absolute range at click time and carry their own label:

| `preset` | Resolves to |
|----------|-------------|
| `today` | start of today `00:00` → now |
| `yesterday` | yesterday `00:00` → `23:59:59` |
| `thisWeek` | Monday `00:00` of the current week → now |
| `lastWeek` | the previous Monday–Sunday |
| `thisMonth` | day 1 `00:00` of the current month → now |
| `lastMonth` | the previous calendar month |

Semantic labels come from the i18n `presets.*` keys (overridable via `texts.presets`). When a semantic preset is active, `get().preset` returns its key and `get().mode` is `'absolute'`.

Swap the presets at runtime with `setQuickRanges(ranges)`.

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` / `on('change', fn)` | `mts:timefilter:change` | `RangeResult` |
| `onOpen` / `on('open', fn)` | `mts:timefilter:open` | — |
| `onClose` / `on('close', fn)` | `mts:timefilter:close` | — |

```js
document.getElementById('filter')
  .addEventListener('mts:timefilter:change', function (e) { console.log(e.detail.fromIso); });
```

---

## CSS Variables

Uses the global design tokens — no component-specific variables. The stylesheet reads:

| Token | Used for |
|-------|----------|
| `--mts-space-1` · `--mts-space-2` · `--mts-space-3` | Internal spacing (tabs, rows, actions) |
| `--mts-font-size-sm` | Inline-error text size |
| `--mts-color-danger` | Inline invalid-range message (fallback when `MTS.Toast` is absent) |

Theming follows `data-mts-mode` and `data-mts-accent`.

### i18n / text overrides

Two sources, in priority order: **`options.texts` → i18n catalog (`MTS.TimeFilter` namespace) → built-in fallback**.

```js
new MTS.TimeFilter('#filter', {
  texts: {
    tabRelative: 'Relative', tabAbsolute: 'Absolute', tabQuick: 'Quick',
    amount: 'Amount', unit: 'Unit', from: 'From', to: 'To',
    apply: 'Apply', lastN: 'Last', invalidRange: 'Invalid range.',
    units:    { m: 'minutes', h: 'hours', d: 'days', w: 'weeks' },   // plural (n !== 1)
    unitsOne: { m: 'minute', h: 'hour', d: 'day', w: 'week' },       // singular (n === 1)
    presets:  { today: 'Today', yesterday: 'Yesterday', thisWeek: 'This week',
                lastWeek: 'Last week', thisMonth: 'This month', lastMonth: 'Last month' }
  }
});
```

Each key in `texts` wins over the i18n catalog; anything omitted falls through to the catalog and then to the built-in English fallback. The shipped catalog (`matios-ui-timefilter-i18n.js`) registers the `MTS.TimeFilter` namespace for `es` / `en` / `pt` (default `es`).

The active language is global: set it once with `MTS.setLanguage('es'|'en'|'pt')` (read back with `MTS.getLanguage()`). There is **no** per-instance `locale` option.

---

## Accessibility

- Trigger is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded`.
- Panel is `role="dialog"`; focus moves to the first control on open and `Esc` closes it (provided by `MTS.Popover`).
- Tabs use `role="tablist"` / `role="tab"` with `aria-selected`, and `←` / `→` move between them.
