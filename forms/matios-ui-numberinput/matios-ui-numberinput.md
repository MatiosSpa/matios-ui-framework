# MTS.NumberInput

Numeric input with +/− buttons, min/max/step, currency, percentage and prefix/suffix formats.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-numberinput.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-numberinput-i18n.js"></script>
<script src="matios-ui-numberinput.js"></script>
```

`matios-ui-icons.js` is required — the +/− steppers render `MTS.Icon.get('minus')` / `MTS.Icon.get('plus')`.
`matios-ui-i18n.js` + `matios-ui-numberinput-i18n.js` provide the localized `required` message.

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

### Declarative HTML (`data-*` enhancement)

Any element carrying `data-*` attributes is upgraded in place; options passed to the constructor win over `data-*`.

```html
<div id="ni-units"
     data-label="Units"
     data-value="12"
     data-min="0"
     data-max="50"
     data-step="1"></div>
```

```js
new MTS.NumberInput('#ni-units');
```

Recognized attributes: `data-label`, `data-placeholder`, `data-hint`, `data-value`, `data-min`, `data-max`, `data-step`, `data-decimals`, `data-prefix`, `data-suffix`, `data-disabled`, `data-readonly`, `data-required`, `data-error-message`, `data-size`.

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
| `renderMode` | `string` | `'auto'` | `'auto'` · `'field-only'` · `'standalone'`. `'auto'` hides the built-in `label` when the host element sits inside a `.mts-form-group`; `'field-only'` always hides it; `'standalone'` always renders it. |
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
| `setMin(n)` / `setMax(n)` | Set the boundaries and refresh the +/− button states |
| `validate()` | Validates `required` (empty = `null`), inline error + `'validate'` event → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the error state |
| `disable()` / `enable()` | Disable / enable interaction |
| `focus()` | Focus the field |
| `on(event, cb)` / `off(event, cb)` | Add / remove a listener for `'change'`, `'focus'`, `'blur'` or `'validate'` (all methods return `this`) |

```js
const ni = new MTS.NumberInput('#my-input', { min: 0, max: 100 });
ni.setValue(75);
ni.setError('Value out of range');
```

---

## Events

Every event is emitted twice: to listeners registered via the option/`on()`, and as a bubbling
`CustomEvent` on the host element whose `detail` is the payload below.

| Option | `on()` name | DOM event | Payload (`detail`) | Callback signature |
|--------|-------------|-----------|--------------------|--------------------|
| `onChange` | `'change'` | `mts:numberinput:change` | `{ value, formatted }` | `(value, formatted)` |
| `onFocus` | `'focus'` | `mts:numberinput:focus` | `{ event }` | `({ type, detail })` |
| `onBlur` | `'blur'` | `mts:numberinput:blur` | `{ event }` | `({ type, detail })` |
| — | `'validate'` | `mts:numberinput:validate` | `{ valid, errors }` | `({ type, detail })` |

`change` is the only event whose callback is invoked with positional arguments; every other event passes
`{ type, detail }`. `change` fires on stepper click, on arrow-key step, and on blur when the value changed.

```js
document.getElementById('my-input')
  .addEventListener('mts:numberinput:change', function (e) { console.log(e.detail.value, e.detail.formatted); });
```

---

## CSS Classes

| Class | Applied to |
|-------|------------|
| `.mts-numberinput` | Host element |
| `.mts-numberinput__label` | Field label (`+ .mts-label--required` when `required`) |
| `.mts-numberinput__wrap` | Control wrapper (`+ --sm` / `--md` / `--lg` per `size`) |
| `.mts-numberinput__wrap--disabled` | Wrapper when `disabled` |
| `.mts-numberinput__wrap--focus` | Wrapper while the input is focused |
| `.mts-numberinput__wrap--error` | Error state on the control (red border), toggled by `setError()` |
| `.mts-numberinput__wrap--active` | Brief flash on a stepper step |
| `.mts-numberinput__btn` | Stepper button (`+ --dec` / `--inc`) |
| `.mts-numberinput__prefix` / `.mts-numberinput__suffix` | Visible prefix / suffix |
| `.mts-numberinput__input` | The text input |
| `.mts-numberinput__hint` | Helper text |
| `.mts-numberinput__error` | Inline error message |

The `.mts-label--required` asterisk is shared from `base/matios-ui-base.css`. See the
[Form Field Contract](../FORM-FIELD-CONTRACT.md) for the validation behavior.

---

## Accessibility

- The +/− buttons supplement keyboard entry; arrow keys also step the value by `step`.
- Provide a `label` (or `aria-label`); the formatted string is for display, the raw `value` is the data.

---

## i18n

The component is registered under the namespace `MTS.NumberInput`. The only localized UI string is the default
`required` validation message, read from `MTS.getString()['MTS.NumberInput'].messages.required`. The +/− steppers
are icon-only (`MTS.Icon`) and carry no text.

Language is set once, globally — there is no per-instance `locale` option for i18n (the `locale` option only feeds
`Intl.NumberFormat` for number/currency formatting):

```js
MTS.setLanguage('es'); // 'es' · 'en' · 'pt'
```

Bundled messages:

| Key | es | en | pt |
|-----|----|----|----|
| `messages.required` | `Este campo es obligatorio` | `This field is required` | `Este campo é obrigatório` |

Override the message per instance with `errorMessage` (takes precedence over the localized default).
