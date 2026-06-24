# MTS.Slider

Range slider component — single value or dual-thumb range, with label, custom formatter and step.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-slider.css">
<script src="matios-ui-slider.js"></script>
```

---

## Usage

```js
// Simple slider
const slider = new MTS.Slider('#slider-volume', {
  label:       'Volume',
  min:         0,
  max:         100,
  step:        5,
  value:       65,
  showValue:   true,
  labelFormat: function (v) { return v + '%'; },
  onChange:    function (e) { console.log(e.detail.value); }, // → number
});

// Range slider (dual thumb)
const range = new MTS.Slider('#slider-price', {
  label:       'Price range',
  range:       true,
  min:         0,
  max:         1000,
  step:        10,
  value:       [200, 700],
  showValue:   true,
  labelFormat: function (v) { return '$' + v[0] + ' – $' + v[1]; },
  onChange:    function (e) { console.log(e.detail.value); }, // → [200, 700]
});
```

The container only needs to exist in the DOM (`<div id="slider-volume"></div>`).

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `value` | `number \| array` | `min` | Initial value. Array `[min, max]` for range |
| `range` | `boolean` | `false` | Enable dual-thumb range mode |
| `label` | `string` | `''` | Label text above the slider |
| `showValue` | `boolean` | `true` | Show the current value next to the label |
| `labelFormat` | `function` | `null` | Custom value formatter — `(value) → string` |
| `onChange` | `function` | — | Fires when the value changes |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Returns the current value — `number` (simple) or `[number, number]` (range) |
| `setValue(value)` | Set the value programmatically (number or `[min, max]`) |
| `validate()` | Always `true` — a slider always holds a value, so `required` is a no-op. Provided for API uniformity ([Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `setError(msg)` / `clearError()` | Set / clear an external error (e.g. server-side) |

```js
const slider = new MTS.Slider('#my-slider', { min: 0, max: 100 });
slider.setValue(50);
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:slider:change` | `{ value }` — `number` or `[number, number]` |

```js
document.getElementById('my-slider')
  .addEventListener('mts:slider:change', function (e) { console.log(e.detail.value); });
```

---

## CSS Classes

Validation (form-field contract) - see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) - shared, single source in `base/matios-ui-base.css`.

---

## Accessibility

- Each thumb is keyboard-operable: arrow keys step by `step`, `Home`/`End` jump to min/max.
- Provide a `label` so the slider has an accessible name; `labelFormat` improves the announced value.

---

## Changelog

### 2026-06-23
- Validation contract for API uniformity: `setError`/`clearError` + `validate()` (always `true` — a slider always has a value). See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

### Initial
- Slider with single value or dual-thumb range, configurable min/max/step, label with live value, custom
  `labelFormat`, `onChange`, and `getValue` / `setValue`.
