# MTS.Progress

Progress bar and circle indicator with variants, striped/animated fills, indeterminate mode and smooth value transitions.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-progress.css">
<script src="matios-ui-progress.js"></script>
```

---

## Usage

```js
// Basic bar
const bar = new MTS.Progress('#my-progress', {
  type: 'bar',
  value: 65,
  variant: 'primary',
  showValue: true,
  onChange: function (e) { console.log(e.detail.pct); }
});

// Striped and animated
new MTS.Progress('#progress-striped', {
  type: 'bar',
  value: 80,
  variant: 'success',
  striped: true,
  animated: true
});

// Circle
new MTS.Progress('#progress-circle', {
  type: 'circle',
  value: 75,
  radius: 48,
  strokeWidth: 8,
  showValue: true
});

// Indeterminate loading
new MTS.Progress('#progress-loading', {
  type: 'indeterminate',
  variant: 'primary'
});

// Custom label
new MTS.Progress('#progress-label', {
  type: 'bar',
  value: 3,
  max: 10,
  showLabel: true,
  label: 'Onboarding',
  labelFormat: function (value, max, pct) { return value + ' of ' + max + ' steps'; }
});
```

The first argument is a CSS selector string or a DOM element; the component builds itself in place.

### CSS only (no JS)

```html
<div class="mts-progress__track mts-progress__track--md mts-progress__track--rounded">
  <div class="mts-progress__fill mts-progress__fill--primary mts-progress__fill--rounded" style="width:65%"></div>
</div>
```

The fill width is a runtime value and is set inline by design.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `string` | `'bar'` | `'bar'` \| `'circle'` \| `'indeterminate'` |
| `value` | `number` | `0` | Initial value |
| `min` | `number` | `0` | Lower bound |
| `max` | `number` | `100` | Upper bound |
| `variant` | `string` | `'default'` | `'default'` \| `'primary'` \| `'success'` \| `'warning'` \| `'danger'` \| `'info'` |
| `size` | `string` | `'md'` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` (bar track height) |
| `showLabel` | `boolean` | `false` | Render the header/center label area |
| `showValue` | `boolean` | `false` | Show value as `value / max` instead of the percentage |
| `striped` | `boolean` | `false` | Striped fill pattern |
| `animated` | `boolean` | `false` | Animate the stripes |
| `rounded` | `boolean` | `true` | Rounded corners |
| `label` | `string` | `''` | Label text (above the bar / below the circle) |
| `labelFormat` | `function` | `null` | `(value, max, pct) → string` custom label text |
| `radius` | `number` | `40` | Circle radius in px (`type: 'circle'` only) |
| `strokeWidth` | `number` | `6` | Circle stroke width in px (`type: 'circle'` only) |
| `onChange` | `function` | — | `({ value, pct }) → void` on value change |
| `onComplete` | `function` | — | `({ value }) → void` when the value reaches `max` |

**Label text.** When neither `labelFormat` nor `showValue` is set, the label shows `{pct}%`. With `showValue: true` it shows `{value} / {max}`. `labelFormat`, when provided, overrides both and receives `(value, max, pct)`.

---

## API

| Method | Description |
|--------|-------------|
| `setValue(n[, animate])` | Set the value, clamped to `[min, max]` (animates by default; pass `false` to skip). Returns `this` |
| `increment(n)` | Add `n` to the value (default `1`). Returns `this` |
| `decrement(n)` | Subtract `n` from the value (default `1`). Returns `this` |
| `reset()` | Reset to `min`. Returns `this` |
| `setVariant(name)` | Change the color variant at runtime. Returns `this` |
| `setIndeterminate(bool)` | Toggle indeterminate mode on a bar. Returns `this` |
| `on(event, cb)` | Listen to `'change'` / `'complete'`. Returns `this` |
| `destroy()` | Empty the host element |

```js
const prog = new MTS.Progress('#my-progress', { value: 0 });
prog.setValue(75);
prog.increment(10);
```

---

## Events

Each callback option has a matching bubbling DOM event dispatched on the host element.

| Callback | DOM event | Payload |
|----------|-----------|---------|
| `onChange` | `mts:progress:change` | `{ value, pct }` |
| `onComplete` | `mts:progress:complete` | `{ value }` |

```js
el.addEventListener('mts:progress:change', function (e) {
  console.log(e.detail.value, e.detail.pct);
});
```

`complete` fires from `setValue` whenever the resulting value is `>= max`.

---

## Localization

`MTS.Progress` renders **no translatable runtime strings** — its only label text is numeric (`{pct}%` or `{value} / {max}`), so nothing needs a locale.

The `matios-ui-progress-i18n.js` file that ships next to the component holds **demo-only** strings (section titles, echo messages) under the `MTS.Progress` namespace; it is not required to use the component. If you load it, register the shared i18n first (`base/matios-ui-i18n.js`), then set the language once at startup with `MTS.setLanguage('es' | 'en' | 'pt')`. There is no per-instance `locale` option.
