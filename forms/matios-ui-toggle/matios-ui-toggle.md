# MTS.Toggle

On/off switch component with three sizes, optional label and disabled state.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-toggle.css">
<script src="matios-ui-toggle.js"></script>
```

---

## Usage

The container only needs to exist in the DOM (`<div id="my-toggle"></div>`):

```js
const toggle = new MTS.Toggle('#my-toggle', {
  label:    'Active notifications',
  checked:  true,
  size:     'md',
  onChange: function (e) { console.log('checked:', e.detail.checked); },
});

// Disabled
new MTS.Toggle('#my-toggle-disabled', { label: 'Not available', disabled: true, checked: false });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | `''` | Text displayed next to the switch |
| `checked` | `boolean` | `false` | Initial state |
| `disabled` | `boolean` | `false` | Disables all interaction |
| `size` | `string` | `'md'` | `'sm'` (32×18) · `'md'` (42×24) · `'lg'` (52×30) |
| `onChange` | `function` | — | Fires when the state changes — `{ checked }` |

---

## API

| Method | Description |
|--------|-------------|
| `isChecked()` | Returns the current state |
| `setChecked(bool)` | Set the state programmatically |
| `toggle()` | Invert the current state |
| `validate()` | Validates `required` (must be on), inline error + `'validate'` event → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the error state |

Accepts `required` + `errorMessage` (localized default) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md).

```js
const toggle = new MTS.Toggle('#my-toggle', { label: 'Notifications' });
toggle.setChecked(true);
toggle.toggle();
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:toggle:change` | `{ checked }` |

```js
document.getElementById('my-toggle').querySelector('input')
  .addEventListener('mts:toggle:change', function (e) { console.log(e.detail.checked); });
```

---

## CSS Classes

Validation (form-field contract) - see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) - shared, single source in `base/matios-ui-base.css`.

---

## Accessibility

- Renders a real `<input type="checkbox">` styled as a switch — focusable and toggled with `Space`.
- Provide a `label` (or `aria-label`) so the switch has an accessible name describing what it controls.

---

## Changelog

### 2026-06-23
- Validation contract: `required` (must be on) + `errorMessage` + `validate()` + `setError`/`clearError` (localized). See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

### Initial
- On/off switch with `sm` / `md` / `lg` sizes, optional label, disabled state, `onChange`, and
  `isChecked` / `setChecked` / `toggle`.
