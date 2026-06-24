# MTS.NumberInput

Numeric input with +/− buttons, min/max/step, currency, percentage and prefix/suffix formats.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-numberinput.css">
<script src="matios-ui-numberinput.js"></script>
```

---

## Usage

```js
// Basic
const ni = new MTS.NumberInput('#my-input', {
  label:    'Quantity',
  value:    1,
  min:      0,
  max:      100,
  step:     1,
  onChange: function (value, formatted) { console.log(value, formatted); },
});

// Currency format
new MTS.NumberInput('#inp-price', {
  label:    'Price',
  format:   'currency',
  currency: 'CLP',
  locale:   'es-CL',
  value:    15000,
  step:     500,
  onChange: function (value, formatted) { console.log(formatted); }, // → '$15.000'
});

// Percentage format
new MTS.NumberInput('#inp-pct', { label: 'Discount', format: 'percent', min: 0, max: 100, step: 5, value: 25 });

// Manual prefix / suffix
new MTS.NumberInput('#inp-weight', { label: 'Weight', suffix: 'kg', decimals: 2, step: 0.1, value: 1.5 });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `number` | `0` | Initial value |
| `min` | `number` | `null` | Minimum value |
| `max` | `number` | `null` | Maximum value |
| `step` | `number` | `1` | Increment/decrement step |
| `decimals` | `number` | `0` | Decimal places to display |
| `label` | `string` | `''` | Field label |
| `placeholder` | `string` | `''` | Placeholder text |
| `hint` | `string` | `''` | Helper text |
| `prefix` | `string` | `''` | Visible prefix (e.g. `$`) |
| `suffix` | `string` | `''` | Visible suffix (e.g. `kg`) |
| `format` | `string` | `'plain'` | `'plain'` · `'currency'` · `'percent'` |
| `locale` | `string` | `'es-CL'` | Locale for `Intl.NumberFormat` |
| `currency` | `string` | `'CLP'` | ISO 4217 currency code |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `disabled` | `boolean` | `false` | Disables interaction |
| `readonly` | `boolean` | `false` | Read only |
| `required` | `boolean` | `false` | Opt-in `validate()`; "empty" = `value` is `null` (see [Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `errorMessage` | `string` | `null` | Overrides the `required` message (localized default when `null`) |
| `onChange` | `function` | — | `(value, formatted)` — fires on change |
| `onFocus` | `function` | — | Fires on focus |
| `onBlur` | `function` | — | Fires on blur |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Get the value — `number` or `null` when empty |
| `setValue(value[, silent])` | Set the value (`silent=true` skips `onChange`); `null` / `''` clears it to empty |
| `setMin(n)` / `setMax(n)` | Set the boundaries |
| `validate()` | Validates `required` (empty = `null`), inline error + `'validate'` event → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the error state |
| `disable()` / `enable()` | Disable / enable interaction |
| `focus()` | Focus the field |

```js
const ni = new MTS.NumberInput('#my-input', { min: 0, max: 100 });
ni.setValue(75);
ni.setError('Value out of range');
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:numberinput:change` | `{ value, formatted }` (callback receives `(value, formatted)`) |
| `onFocus` / `onBlur` | — | — |

```js
document.getElementById('my-input')
  .addEventListener('mts:numberinput:change', function (e) { console.log(e.detail.value, e.detail.formatted); });
```

---

## CSS Classes

Validation (form-field contract) - see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) - shared, single source in `base/matios-ui-base.css`.
- `.mts-numberinput__wrap--error` - error state on the control (red border), toggled by `setError()`.

---

## Accessibility

- The +/− buttons supplement keyboard entry; arrow keys also step the value by `step`.
- Provide a `label` (or `aria-label`); the formatted string is for display, the raw `value` is the data.

---

## Changelog

### 2026-06-23
- Validation contract: `required` + `errorMessage` + `validate()` (inline error, localized message). `value` now
  supports `null` ("empty") so `required` is meaningful — `getValue()` returns `null` for an empty field and an empty
  input no longer coerces to `0`. See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

### Initial
- Numeric input with +/− steppers, min/max/step, decimals, plain/currency/percent formats via `Intl.NumberFormat`,
  prefix/suffix, sizes, error state, and `getValue` / `setValue` / `setMin` / `setMax`.
