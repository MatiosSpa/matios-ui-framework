# MTS.Checkbox

Checkbox component — individual with indeterminate state, and groups with vertical or horizontal layout.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-checkbox.css">
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
| `onChange` | `function` | — | Fires on state change — `{ checked, value }` |

### MTS.CheckboxGroup

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | `array` | `[]` | `[{ value, label, disabled? }]` |
| `value` | `array` | `[]` | Initially selected values |
| `disabled` | `boolean` | `false` | Disables all checkboxes |
| `horizontal` | `boolean` | `false` | Horizontal layout |
| `onChange` | `function` | — | Fires when the selection changes — `{ value }` |

---

## API

| Method | Description |
|--------|-------------|
| `isChecked()` | Returns the current state |
| `setChecked(bool)` | Set the state programmatically |
| `toggle()` | Invert the current state |
| `setIndeterminate(bool)` | Set the indeterminate state |
| `MTS.CheckboxGroup#getValue()` | Returns the selected values array |

```js
const chk = new MTS.Checkbox('#my-checkbox', { label: 'Accept terms' });
chk.setChecked(true);
chk.toggle();
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:checkbox:change` | `{ checked, value }` (group: `{ value }`) |

```js
document.getElementById('my-checkbox').querySelector('input')
  .addEventListener('mts:checkbox:change', function (e) { console.log(e.detail.checked); });
```

---

## Accessibility

- Renders a real `<input type="checkbox">` with an associated `<label>` — focusable and toggled with `Space`.
- The `indeterminate` state is visual only; reflect its meaning in nearby text when it represents partial selection.

---

## Changelog

### Initial
- Checkbox with checked/indeterminate/disabled states and `MTS.CheckboxGroup` (vertical/horizontal, per-option
  disable, array value), with `setChecked` / `toggle` / `setIndeterminate` / `getValue`.
