# MTS.Validate

Form validation without dependencies. Auto-integrates with `MTS.Input` — detects instances and uses their own error/success API.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-input.css">
<script src="matios-ui-input.js"></script>
<script src="matios-ui-validation.js"></script>
```

---

## Usage

`MTS.Validate` detects `MTS.Input` instances automatically. **The input `name` must match the key in `rules`.**

```html
<form id="my-form">
  <div id="field-name"></div>
  <div id="field-email"></div>
  <button type="submit" class="mts-btn mts-btn--primary">Submit</button>
</form>
```

```js
new MTS.Input('#field-name',  { name: 'name',  label: 'Full name', rules: { required: true, minLength: 3 } });
new MTS.Input('#field-email', { name: 'email', label: 'Email', type: 'email', rules: { required: true, email: true } });
new MTS.Input('#field-pass',  { name: 'password', label: 'Password', type: 'password',
  rules: { required: true, minLength: 8, pattern: /(?=.*\d)(?=.*[a-z])/ } });

const v = new MTS.Validate('#my-form', {
  rules: {
    name:     { required: true, minLength: 3 },
    email:    { required: true, email: true },
    password: { required: true, minLength: 8 },
  },
  messages: {
    name:  { required: 'Name cannot be empty', minLength: 'At least 3 characters' },
    email: { email: 'Enter a valid email address' },
  },
  validateOnBlur: true,
  onValid:   function (data)   { submitToServer(data); },
  onInvalid: function (errors) { console.log(errors); },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rules` | `object` | `{}` | Validation rules per field name |
| `messages` | `object` | `{}` | Custom error messages per field/rule |
| `validateOnBlur` | `boolean` | `true` | Validate when a field loses focus |
| `validateOnInput` | `boolean` | `false` | Validate on every keystroke |
| `onValid` | `function` | — | Fires on submit when the form is valid — `(data)` |
| `onInvalid` | `function` | — | Fires on submit when the form has errors — `(errors)` |

### Validation rules

| Rule | Type | Description |
|------|------|-------------|
| `required` | `boolean` | Field cannot be empty |
| `minLength` / `maxLength` | `number` | Min / max characters |
| `min` / `max` | `number` | Min / max numeric value |
| `email` / `url` | `boolean` | Valid email / URL format |
| `number` / `integer` | `boolean` | Numeric only / integer only |
| `pattern` | `RegExp` | Custom regex |
| `equalTo` | `string` | Must equal another field (e.g. `'#pass'`) |
| `rut` | `boolean` | Chilean RUT validation |
| `phone` | `boolean` | Phone format |
| `date` | `boolean` | Valid date |
| `minDate` / `maxDate` | `string` | Min / max date (e.g. `'2024-01-01'`) |
| `accept` | `string` | File types (`'image/*'`, `'.pdf'`) |
| `maxSize` | `number` | Max file size in MB |
| `custom` | `function` | `(value, el) → true \| 'error'` |

---

## API

| Method | Description |
|--------|-------------|
| `validate()` | Validate the whole form → `boolean` |
| `isValid()` | Current validity → `boolean` |
| `getErrors()` | `{ fieldName: 'message', … }` |
| `getData()` | `{ fieldName: value, … }` |
| `clearErrors()` | Clear all visual errors |
| `setError(field, msg)` | Set a server-side error |
| `addRule(field, rule, value)` | Add a rule at runtime |

```js
const v = new MTS.Validate('#my-form', { rules: { /* … */ } });
if (!v.validate()) v.setError('email', 'Email already exists');
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onValid(fn)` | `(data)` | Submit, all fields valid |
| `onInvalid(fn)` | `(errors)` | Submit, validation errors present |

---

## Accessibility

- Errors are rendered through each `MTS.Input`'s own error API, so they stay associated with the field for
  assistive tech. `setError` surfaces server-side errors the same way.
- Submitting an invalid form moves attention to the failing fields rather than silently blocking.

---

## Changelog

### Initial
- Dependency-free form validation auto-integrated with `MTS.Input`: 18 built-in rules (incl. `rut`, `equalTo`,
  `custom`), per-field/rule messages, blur/input timing, server-error injection, and a full programmatic API.
