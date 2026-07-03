# MTS.Slider

Range slider component — single value or dual-thumb range, with an optional label, a live value display, custom formatter and step.

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
  onChange:    function (e) { console.log(e.detail.value); }
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
  onChange:    function (e) { console.log(e.detail.value); }
});
```

The container only needs to exist in the DOM (`<div id="slider-volume"></div>`).
The constructor accepts a CSS selector string or an element.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `value` | `number \| array` | `min` (simple) / `[min, max]` (range) | Initial value. Array `[low, high]` when `range` is `true` |
| `range` | `boolean` | `false` | Enable dual-thumb range mode |
| `label` | `string` | `''` | Label text above the slider |
| `showValue` | `boolean` | `true` | Show the current value in the header |
| `labelFormat` | `function` | `null` | Custom value formatter — `(value) => string`. Receives a `number` (simple) or `[low, high]` (range) |
| `onChange` | `function` | — | Shortcut for registering a `change` listener |
| `required` | `boolean` | `false` | Form-field contract flag. Adds the required-asterisk class on the label; validation is always valid (a slider always holds a value) |
| `errorMessage` | `string` | `null` | Stored for the form-field contract |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Returns the current value — `number` (simple) or `[number, number]` (range) |
| `setValue(value)` | Set the value programmatically (number, or `[low, high]` for range). Values are clamped to `min`/`max` |
| `on(event, callback)` | Register an event listener (`'change'`) |
| `validate()` | Always returns `true` — a slider always holds a value, so `required` is a no-op. Emits a `validate` event. Provided for API uniformity ([Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `setError(msg)` | Set an external error message (e.g. server-side) below the slider |
| `clearError()` | Clear the external error message |

```js
const slider = new MTS.Slider('#my-slider', { min: 0, max: 100 });
slider.setValue(50);
```

---

## Events

Registering via the `onChange` option, `on('change', ...)`, or the DOM event are equivalent.

| Name | DOM event | Payload |
|--------|-----------|---------|
| `change` | `mts:slider:change` | `{ value }` — `number` (simple) or `[number, number]` (range) |
| `validate` | `mts:slider:validate` | `{ valid: true, errors: [] }` — emitted by `validate()` |

The `change` event fires continuously while a thumb is dragged.

```js
document.getElementById('my-slider')
  .addEventListener('mts:slider:change', function (e) { console.log(e.detail.value); });
```

---

## CSS Classes

Structure: `.mts-slider-wrap` (container), `.mts-slider__header`, `.mts-slider__value`, `.mts-slider__track`, `.mts-slider__rail`, `.mts-slider__fill`, `.mts-slider__thumb` (with `.mts-slider__thumb--active` while dragging).

Validation (form-field contract) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-label--required` (required asterisk on the label) — shared, single source in `base/matios-ui-base.css`.

---

## Interaction

- Each thumb is dragged with mouse or touch.
- In range mode, thumb 1 cannot exceed thumb 2 and thumb 2 cannot go below thumb 1.

---

## i18n

The slider displays only numeric values (`min` / `max` / current value), so it renders no translatable chrome — the visible output is driven entirely by your `value`, `label` and `labelFormat`. The `MTS.Slider` namespace registers a single `messages.required` string per language (es / en / pt) for the form-field contract.

Language is global and set once at startup with `MTS.setLanguage('en' | 'es' | 'pt')`. There is no per-instance `locale` option.

The demo texts live in `matios-ui-slider-i18n.js` under the same namespace (the `demo` block); those keys are demo-only and are not read by the component.
