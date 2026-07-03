# MTS.Validate

Form validation without dependencies. Auto-integrates with `MTS.Input` — when a field is backed by an `MTS.Input` instance, errors and success states are rendered through that instance's own API; otherwise the component falls back to plain DOM elements and CSS classes.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-input.css">
<script src="matios-ui-input.js"></script>

<!-- Optional: global i18n (default messages in en/pt; without it, messages are Spanish) -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-validation-i18n.js"></script>

<script src="matios-ui-validation.js"></script>
```

`matios-ui-input.js` is only required when you bind fields through `MTS.Input`. The validator works against any plain `<input>`, `<select>` or `<textarea>` on its own.

---

## Usage

`MTS.Validate` locates each field by looking up `[name="<key>"]` first, then `#<key>`, where `<key>` is the key used in `rules`. When a field is an `MTS.Input`, its `name` must match the key in `rules`.

```html
<form id="my-form">
  <div id="field-name"></div>
  <div id="field-email"></div>
  <div><button type="submit" id="field-submit"></button></div>
</form>
```

```js
new MTS.Input('#field-name', {
  name: 'name',
  label: 'Full name',
  rules: { required: true, minLength: 3 }
});
new MTS.Input('#field-email', {
  name: 'email',
  label: 'Email',
  type: 'email',
  rules: { required: true, email: true }
});
new MTS.Button('#field-submit', { label: 'Submit form', variant: 'primary' });

const v = new MTS.Validate('#my-form', {
  rules: {
    name:  { required: true, minLength: 3 },
    email: { required: true, email: true }
  },
  messages: {
    name: { required: 'Name is required', minLength: 'At least 3 characters' }
  },
  validateOnBlur: true,
  onValid: function (data) {
    console.log('valid', data);
  },
  onInvalid: function (errors) {
    console.log('errors', errors);
  }
});
```

The constructor accepts a selector string or a form element as its first argument. On `submit`, the form's default action is prevented and `validate()` runs automatically.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rules` | `object` | `{}` | Validation rules per field key |
| `messages` | `object` | `{}` | Custom error messages per field/rule — `{ fieldKey: { ruleName: 'message' } }` |
| `validateOnBlur` | `boolean` | `true` | Validate a field when it loses focus (only after it has been focused once) |
| `validateOnInput` | `boolean` | `false` | Validate a field on every keystroke (only after it has been focused once) |
| `onValid` | `function` | `null` | Fires on submit when every field is valid — receives `(data)` |
| `onInvalid` | `function` | `null` | Fires on submit when there are errors — receives `(errors)` |

### Validation rules

Each rule is declared as `ruleName: param`. `null` / `undefined` / empty values pass every rule except `required` (rules short-circuit on empty input), so combine with `required` when a value is mandatory. Boolean rules only run when their param is truthy.

| Rule | Param type | Description |
|------|------------|-------------|
| `required` | `boolean` | Field cannot be empty (checkbox must be checked; file input must have a file) |
| `minLength` | `number` | Minimum number of characters |
| `maxLength` | `number` | Maximum number of characters |
| `min` | `number` | Minimum numeric value |
| `max` | `number` | Maximum numeric value |
| `email` | `boolean` | Valid email format |
| `url` | `boolean` | Valid URL (parseable by the `URL` constructor) |
| `number` | `boolean` | Any numeric value |
| `integer` | `boolean` | Whole number only |
| `pattern` | `RegExp` \| `string` | Value must match the regular expression |
| `equalTo` | `string` | Value must equal another field's value, given as a selector (e.g. `'#pass'`) |
| `rut` | `boolean` | Chilean RUT (modulo-11 check digit) |
| `phone` | `boolean` | Phone-number format |
| `date` | `boolean` | Parseable date |
| `minDate` | `string` | Value must be on or after this date (e.g. `'2024-01-01'`) |
| `maxDate` | `string` | Value must be on or before this date |
| `accept` | `string` | Allowed file types, comma-separated (`'image/*'`, `'.pdf'`, `'application/pdf'`) |
| `maxSize` | `number` | Maximum file size in MB |
| `custom` | `function` | `(value, el)` returning `true` when valid, or an error string when invalid |

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `validate()` | `boolean` | Validate every field, render errors/success, fire `onValid`/`onInvalid`, and scroll/focus the first invalid field |
| `isValid()` | `boolean` | `true` when there are no errors from the last validation pass |
| `getErrors()` | `object` | Copy of the current errors as `{ fieldKey: 'message' }` |
| `getData()` | `object` | Collected values of every named `input` / `select` / `textarea` in the form (checkboxes as `boolean`, files as `FileList`) |
| `clearErrors()` | — | Remove all error/success markers and reset the errors map |
| `setError(field, message)` | — | Set an error on a field manually (e.g. a server-side error) |
| `addRule(field, rule, message)` | — | Add a rule (set to `true`) to a field at runtime, with an optional custom message |

```js
const v = new MTS.Validate('#my-form', { rules: { email: { required: true, email: true } } });
if (!v.validate()) {
  v.setError('email', 'Email already exists');
}
```

### Rule helpers

`MTS.Validate.rules` is a static set of factory functions that return a `{ rule, messages }` fragment, handy when composing rule objects with an inline message:

| Helper | Returns |
|--------|---------|
| `MTS.Validate.rules.required(msg)` | `{ required: true, messages: { required: msg } }` |
| `MTS.Validate.rules.email(msg)` | `{ email: true, messages: { email: msg } }` |
| `MTS.Validate.rules.minLength(n, msg)` | `{ minLength: n, messages: { minLength: msg } }` |
| `MTS.Validate.rules.maxLength(n, msg)` | `{ maxLength: n, messages: { maxLength: msg } }` |
| `MTS.Validate.rules.min(n, msg)` | `{ min: n, messages: { min: msg } }` |
| `MTS.Validate.rules.max(n, msg)` | `{ max: n, messages: { max: msg } }` |

---

## Callbacks

Both callbacks are passed as constructor options and fire on submit (and on the explicit `validate()` call).

| Option | Payload | When |
|--------|---------|------|
| `onValid` | `(data)` | Every field is valid — `data` is the result of `getData()` |
| `onInvalid` | `(errors)` | One or more fields failed — `errors` is `{ fieldKey: 'message' }` |

---

## Internationalization

Default per-rule messages are **built into the component** (`MTS.Validate._messages`, with `es` / `en` / `pt`) and are picked by the active global language. Set it once at startup:

```js
MTS.setLanguage('en'); // 'es' (default) | 'en' | 'pt'
```

The component resolves each default from its **internal** table via `MTS.getLanguage()` (fallback: `es`). These defaults are **not** registered in the global i18n table and do **not** require `matios-ui-validation-i18n.js` — that file only carries the demo-page strings. There is **no** per-instance `locale` option.

**To change a message, pass it per field/rule** — that is your content, not a language change. An explicit string in the field's `messages` map (or the string returned by a `custom` function) always wins over the internal default. See the [Rules](#rules) examples.

Messages with a numeric parameter (`minLength`, `maxLength`, `min`, `max`, `minDate`, `maxDate`, `accept`, `maxSize`) use the `{n}` placeholder, which is replaced with the rule's param at render time.

---

## Accessibility

- When a field is an `MTS.Input`, errors are rendered through that instance's own error API, keeping them associated with the field for assistive technology. `setError` surfaces server-side errors the same way.
- For plain fields, the invalid element gets the `mts-input-error` class and a `.mts-validation-error` message node is appended to the closest `.mts-form-group` (or the field's parent).
- Submitting an invalid form scrolls the first failing field into view and moves focus to it, rather than silently blocking.
