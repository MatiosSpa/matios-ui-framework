# MTS.Checkbox

Checkbox component — individual with indeterminate state, and groups with vertical or horizontal layout.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-checkbox.css">
<!-- Optional: localized 'required' validation message -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-checkbox-i18n.js"></script>
<script src="matios-ui-checkbox.js"></script>
```

---

## Usage

```js
// Individual checkbox
const chk = new MTS.Checkbox('#chk-terms', {
  label:    'I accept the terms',
  checked:  false,
  onChange: function (e) { console.log(e.detail.checked, e.detail.value); },
});

// Group (vertical by default)
const group = new MTS.CheckboxGroup('#chk-formats', {
  options: [
    { value: 'pdf',  label: 'PDF' },
    { value: 'xlsx', label: 'Excel' },
    { value: 'csv',  label: 'CSV', disabled: true },
  ],
  value:    ['pdf'],
  onChange: function (e) { console.log(e.detail.value); }, // → ['pdf', …]
});

// Group horizontal
new MTS.CheckboxGroup('#chk-days', {
  horizontal: true,
  options: [
    { value: 'mon', label: 'Monday' },
    { value: 'tue', label: 'Tuesday' },
    { value: 'wed', label: 'Wednesday' },
  ],
  value: ['mon'],
});
```

The container only needs to exist in the DOM (e.g. `<div id="chk-terms"></div>`).

---

## Options

### MTS.Checkbox

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | `''` | Text next to the checkbox |
| `checked` | `boolean` | `false` | Initial checked state |
| `indeterminate` | `boolean` | `false` | Partial-selection state |
| `disabled` | `boolean` | `false` | Disables interaction |
| `value` | `string` | `''` | Value associated with this checkbox |
| `required` | `boolean` | `false` | `validate()` fails unless checked |
| `errorMessage` | `string` | `null` | Custom error text (overrides the localized default) |
| `onChange` | `function` | — | Fires on state change — `{ checked, value }` |

### MTS.CheckboxGroup

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | `array` | `[]` | `[{ value, label, disabled? }]` |
| `value` | `array` | `[]` | Initially selected values |
| `disabled` | `boolean` | `false` | Disables all checkboxes |
| `horizontal` | `boolean` | `false` | Horizontal layout |
| `required` | `boolean` | `false` | `validate()` fails unless ≥1 selected |
| `errorMessage` | `string` | `null` | Custom error text (overrides the localized default) |
| `onChange` | `function` | — | Fires when the selection changes — `{ value }` |

---

## API

| Method | Description |
|--------|-------------|
| `isChecked()` | Returns the current state |
| `setChecked(bool)` | Set the state programmatically |
| `toggle()` | Invert the current state |
| `setIndeterminate(bool)` | Set the indeterminate state |
| `MTS.CheckboxGroup#getValue()` | Returns the selected values array (group only) |
| `validate()` | Validates `required` — single: must be checked; group: ≥1 selected. Shows inline error + emits `'validate'` → `boolean`. See [Form Field Contract](../FORM-FIELD-CONTRACT.md) |
| `setError(msg)` / `clearError()` | Set / clear the error state |
| `on(event, cb)` | Register a listener (`'change'`, `'validate'`) |

Both `MTS.Checkbox` and `MTS.CheckboxGroup` accept `required` + `errorMessage` (localized default).

```js
const chk = new MTS.Checkbox('#my-checkbox', { label: 'Accept terms' });
chk.setChecked(true);
chk.toggle();
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:checkbox:change` | single: `{ checked, value }` \| group: `{ value }` (array) |
| `validate()` | `mts:checkbox:validate` | `{ valid, errors }` (via `on('validate', …)`) |

The `change` event bubbles. On a single `MTS.Checkbox` it is dispatched from the inner `<input>`; on `MTS.CheckboxGroup` it is dispatched from the container element.

```js
document.getElementById('my-checkbox').querySelector('input')
  .addEventListener('mts:checkbox:change', function (e) { console.log(e.detail.checked); });
```

---

## CSS Classes

Validation (form-field contract) - see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) - shared, single source in `base/matios-ui-base.css`.

---

## i18n

The only built-in chrome string is the default `required` validation message; the label and option labels are always dev-supplied. The message is read from the global language namespace `MTS.Checkbox` (keys `es` / `en` / `pt`, default Spanish) and falls back to `'This field is required'` if the i18n bundle is absent. Set the language once at startup:

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'
```

Passing `errorMessage` overrides the localized default for that instance. There is no per-instance `locale` option.

| Key | es | en | pt |
|-----|----|----|----|
| `required` | Este campo es obligatorio | This field is required | Este campo é obrigatório |

---

## Accessibility

- Renders a real `<input type="checkbox">` with an associated `<label>` — focusable and toggled with `Space`.
- The `indeterminate` state is visual only; reflect its meaning in nearby text when it represents partial selection.
