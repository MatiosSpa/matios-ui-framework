# MTS.Input

Input component — text, email, password, number and textarea with validation, icons, clearable and character counter.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-input.css">
<script src="matios-ui-input.js"></script>
```

---

## Usage

### JavaScript

```js
const inp = new MTS.Input('#my-input', {
  type:        'email',
  label:       'Email address',
  placeholder: 'user@example.com',
  hint:        "We'll use this for notifications",
  required:    true,
  rules:       { email: true },
  onChange:    function (e) { console.log(e.detail.value); },
  onValidate:  function (e) { if (!e.detail.valid) console.log(e.detail.errors[0]); },
});
```

### HTML with `data-*`

```html
<div id="inp-email"
  data-type="email"
  data-label="Email address"
  data-placeholder="user@example.com"
  data-hint="We'll use this for notifications"
  data-required
  data-clearable></div>

<script> new MTS.Input('#inp-email', { onChange: function (e) { console.log(e.detail.value); } }); </script>
```

Available `data-*`: `data-type`, `data-label`, `data-placeholder`, `data-hint`, `data-value`, `data-name`,
`data-required`, `data-disabled`, `data-readonly`, `data-clearable`, `data-show-password`, `data-show-count`,
`data-max-length`, `data-rows`, `data-select-on-focus`, `data-next-on-enter` (boolean attributes activate by presence).

---

## Options

All options are passed as the second argument to the constructor.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `string` | `'text'` | `'text'` · `'email'` · `'password'` · `'number'` · `'textarea'` |
| `label` | `string` | `''` | Field label |
| `placeholder` | `string` | `''` | Placeholder text |
| `hint` | `string` | `''` | Helper text below the field |
| `value` | `string` | `''` | Initial value |
| `required` | `boolean` | `false` | Marks the field as required |
| `disabled` | `boolean` | `false` | Disables all interaction |
| `readonly` | `boolean` | `false` | Read-only, not editable |
| `clearable` | `boolean` | `false` | Shows a × button to clear |
| `showPassword` | `boolean` | `false` | Toggle to reveal the password |
| `iconLeft` | `string` | `null` | Left icon SVG string |
| `iconRight` | `string` | `null` | Right icon SVG string |
| `maxLength` | `number` | `null` | Maximum characters |
| `showCount` | `boolean` | `false` | Shows the character counter |
| `rows` | `number` | `4` | Textarea rows |
| `selectOnFocus` | `boolean` | `false` | Selects all text on focus (not for `type="password"`) |
| `nextOnEnter` | `boolean` | `false` | Enter moves focus to the next input (not for `type="textarea"`) |
| `validateOnBlur` | `boolean` | `true` | Validate when the field loses focus |
| `validateOnInput` | `boolean` | `false` | Validate on every keystroke |
| `rules` | `object` | `{}` | Validation rules (see below) |
| `onChange` | `function` | — | Fires on value change |
| `onFocus` | `function` | — | Fires on focus |
| `onBlur` | `function` | — | Fires on blur |
| `onValidate` | `function` | — | Fires after validation |

### Validation rules

| Rule | Type | Description |
|------|------|-------------|
| `required` | `boolean` | Field cannot be empty |
| `minLength` / `maxLength` | `number` | Min / max character count |
| `min` / `max` | `number` | Min / max value (number type) |
| `email` | `boolean` | Validates email format |
| `pattern` | `RegExp` | Custom regex pattern |
| `patternMessage` | `string` | Message shown if the pattern fails |
| `custom` | `function` | `(value) → 'error msg' \| null` |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Get the current value |
| `setValue(value)` | Set the value programmatically |
| `clear()` | Clear the value and error |
| `focus()` | Focus the field |
| `disable()` / `enable()` | Disable / enable interaction |
| `validate()` | Run validation manually → `boolean` |
| `isValid()` | Current validation state → `boolean` |
| `setError(msg)` | Set an external error (e.g. from the server) |
| `clearError()` | Clear the error |
| `destroy()` | Destroy the component |

```js
const inp = new MTS.Input('#my-input', { type: 'email', rules: { email: true } });
inp.setValue('user@example.com');
if (!inp.validate()) inp.setError('Email already exists');
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:input:change` | `{ value }` |
| `onFocus` | `mts:input:focus` | — |
| `onBlur` | `mts:input:blur` | `{ value }` |
| `onValidate` | `mts:input:validate` | `{ valid, errors }` |

```js
document.getElementById('my-input').querySelector('input')
  .addEventListener('mts:input:change', function (e) { console.log(e.detail.value); });
```

---

## CSS Variables

Uses the framework base tokens for surface, border, text and state colors — notably `--mts-text-disabled` for the
disabled style, plus `--mts-danger-*` for the error state. Theme via `data-mts-mode` / `data-mts-accent`.

---

## Accessibility

- The `label` is associated with the field; always provide one (or an `aria-label`) so the input has a name.
- Errors are announced near the field; `hint` text gives non-error guidance.
- `disabled` blocks interaction entirely, `readonly` keeps the value reachable but non-editable — pick per intent.

---

## Changelog

### Initial
- Input with text/email/password/number/textarea types, validation rules + manual `validate()`/`setError()`,
  clearable, password toggle, character counter, icons, `selectOnFocus` / `nextOnEnter`, `data-*` API and DOM events.
