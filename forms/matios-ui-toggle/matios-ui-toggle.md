# MTS.Toggle

On/off switch component with three sizes, optional label and disabled state.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-toggle.css">
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-toggle-i18n.js"></script>
<script src="matios-ui-toggle.js"></script>
```

`matios-ui-i18n.js` and `matios-ui-toggle-i18n.js` are optional — needed only if you use the `required` validation message with `MTS.setLanguage`.

---

## Usage

The container only needs to exist in the DOM (`<div id="my-toggle"></div>`):

```js
const toggle = new MTS.Toggle('#my-toggle', {
  label:    'Active notifications',
  checked:  true,
  size:     'md',
  onChange: function (e) { console.log('checked:', e.detail.checked); }
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
| `size` | `string` | `'md'` | `'sm'` (32×18) \| `'md'` (42×24) \| `'lg'` (52×30) |
| `onChange` | `function` | — | Shortcut for `on('change', cb)`; receives `{ type, detail }` where `detail` is `{ checked }` |
| `required` | `boolean` | `false` | Marks the switch as required (must be on to pass `validate()`) |
| `errorMessage` | `string` | `null` | Overrides the localized default error message shown by `validate()` |

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

## i18n

The switch itself has no built-in on/off text — labels are always dev-supplied via the `label` option. The only localized string is the default validation message shown by `validate()` when `required` is set.

It is read from the `MTS.Toggle` namespace under `messages.required` (keys `es` / `en` / `pt`, default Spanish neutral). Set the language once at startup:

```js
MTS.setLanguage('en'); // 'es' | 'en' | 'pt'
```

Passing `errorMessage` overrides the localized default for that instance. There is no per-instance `locale` option.

---

## Accessibility

- Renders a real `<input type="checkbox">` styled as a switch — focusable and toggled with `Space`.
- Provide a `label` (or `aria-label`) so the switch has an accessible name describing what it controls.
