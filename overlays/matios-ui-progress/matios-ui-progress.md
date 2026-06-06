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
  type: 'bar', value: 65, variant: 'primary', showValue: true,
  onChange: function (e) { console.log(e.detail.pct); },
});

// Striped and animated
new MTS.Progress('#progress-striped', { type: 'bar', value: 80, variant: 'success', striped: true, animated: true });

// Circle
new MTS.Progress('#progress-circle', { type: 'circle', value: 75, radius: 48, strokeWidth: 8, showValue: true });

// Indeterminate loading
new MTS.Progress('#progress-loading', { type: 'indeterminate', variant: 'primary' });

// Custom label
new MTS.Progress('#progress-label', {
  type: 'bar', value: 3, max: 10, showLabel: true,
  labelFormat: function (value, pct) { return value + ' of 10 steps'; },
});
```

### CSS only (no JS)

```html
<div class="mts-progress">
  <div class="mts-progress__fill mts-progress__fill--primary" style="width:65%"></div>
</div>
```

(The fill width / `--mts-progress-pct` is a runtime value and is set inline by design.)

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `string` | `'bar'` | `'bar'` · `'circle'` · `'indeterminate'` |
| `value` | `number` | `0` | Initial value |
| `min` / `max` | `number` | `0` / `100` | Value bounds |
| `variant` | `string` | `'default'` | `'default'` · `'primary'` · `'success'` · `'warning'` · `'danger'` · `'info'` |
| `size` | `string` | `'md'` | `'xs'` · `'sm'` · `'md'` · `'lg'` |
| `showLabel` | `boolean` | `false` | Show the label text |
| `showValue` | `boolean` | `false` | Show the percentage value |
| `striped` | `boolean` | `false` | Striped fill pattern |
| `animated` | `boolean` | `false` | Animate the stripes |
| `rounded` | `boolean` | `true` | Rounded corners |
| `label` | `string` | `''` | Label text |
| `labelFormat` | `function` | `null` | `(value, pct) → string` custom label |
| `radius` | `number` | `40` | Circle radius in px (`type: 'circle'`) |
| `strokeWidth` | `number` | `6` | Circle stroke width in px (`type: 'circle'`) |
| `onChange` | `function` | — | `({ value, pct })` on value change |
| `onComplete` | `function` | — | Fires when the value reaches max |

---

## API

| Method | Description |
|--------|-------------|
| `setValue(n[, animate])` | Set the value (animates by default; pass `false` to skip) |
| `increment(n)` / `decrement(n)` | Adjust the value |
| `reset()` | Reset to min |
| `setVariant(name)` | Change the variant at runtime |
| `setIndeterminate(bool)` | Toggle indeterminate mode |
| `on(event, cb)` / `off(event, cb)` | Listen to `'change'` / `'complete'` |

```js
const prog = new MTS.Progress('#my-progress', { value: 0 });
prog.setValue(75);
prog.increment(10);
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:progress:change` | `{ value, pct }` |
| `onComplete` | `mts:progress:complete` | `{ value }` |

```js
el.addEventListener('mts:progress:change', function (e) { console.log(e.detail.value); });
```

---

## Accessibility

- Expose the value via `role="progressbar"` with `aria-valuenow/min/max` (or `aria-busy` for indeterminate) so
  assistive tech can announce progress.

---

## Changelog

### Initial
- Progress bar + circle + indeterminate, 6 variants, sizes, striped/animated fills, custom label, smooth
  transitions, `setValue` / `increment` / `decrement` / `reset` / `setVariant` / `setIndeterminate`, and CSS-only usage.
