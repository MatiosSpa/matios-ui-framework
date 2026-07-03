# MTS.Radio

Radio button group component — single selection with vertical or horizontal layout.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-radio.css">
<script src="matios-ui-radio.js"></script>
```

---

## Usage

```js
// Vertical (default)
new MTS.Radio('#radio-priority', {
  name:  'priority',
  value: 'medium',
  options: [
    { value: 'high',   label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low',    label: 'Low' },
  ],
  onChange: function (e) { console.log(e.detail.value); },
});

// Horizontal, with a disabled option
new MTS.Radio('#radio-plan', {
  horizontal: true,
  name:       'plan',
  value:      'free',
  options: [
    { value: 'free',       label: 'Free' },
    { value: 'pro',        label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise (coming soon)', disabled: true },
  ],
});
```

The container only needs to exist in the DOM (`<div id="radio-priority"></div>`).

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | `array` | `[]` | `[{ value, label, disabled? }]` |
| `value` | `string` | `null` | Initially selected value |
| `name` | `string` | auto | Radio group name (unique per group) |
| `disabled` | `boolean` | `false` | Disables all radio buttons |
| `horizontal` | `boolean` | `false` | Horizontal layout |
| `onChange` | `function` | — | Fires when the selection changes — `{ value }` |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Returns the selected value (`string \| null`) |
| `setValue(value)` | Set the selected value programmatically |
| `validate()` | Validates `required` (empty = none selected), inline error + `'validate'` event → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the error state |
| `on(event, callback)` | Register a listener (`'change'`, `'validate'`) — returns the instance |

Accepts `required` + `errorMessage` (localized default) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md).

```js
const radio = new MTS.Radio('#my-radio', { options: [/* … */], value: 'a' });
radio.setValue('b');
```

---

## Events

| Listener | DOM event | Payload |
|----------|-----------|---------|
| `on('change', …)` / `onChange` | `mts:radio:change` | `{ value }` |
| `on('validate', …)` | `mts:radio:validate` | `{ valid, errors }` |

```js
document.getElementById('my-radio')
  .addEventListener('mts:radio:change', function (e) { console.log(e.detail.value); });
```

`on()` listeners receive `{ type, detail }`; the DOM `CustomEvent` carries the payload in `e.detail`.

---

## CSS Classes

Validation (form-field contract) - see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) - shared, single source in `base/matios-ui-base.css`.

---

## Accessibility

- Renders real `<input type="radio">` controls sharing a `name` — arrow keys move selection within the group.
- A `disabled` option is skipped by keyboard navigation; reflect that state visually.

---

## i18n

The only chrome string is the `required` validation message. It is read from the global language
via `MTS.getString()['MTS.Radio'].messages.required` (namespace `MTS.Radio`, keys `es` / `en` / `pt`),
with a hardcoded `'This field is required'` fallback if i18n is not loaded. Set the language once at
startup with `MTS.setLanguage('es' | 'en' | 'pt')`. Per-instance `errorMessage` overrides the localized
default. There is no per-instance `locale` option. Option `label`s are developer-supplied — not localized
by the component.
