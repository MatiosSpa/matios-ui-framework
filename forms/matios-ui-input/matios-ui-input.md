# MTS.Input

Input component — text, email, password, number and textarea with validation, icons, clearable and character counter.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-input.css">
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-input-i18n.js"></script>
<script src="matios-ui-input.js"></script>
```

The password reveal icon uses `MTS.Icon` (`eye`), so include `matios-ui-icons.js` when using `type="password"` with the reveal toggle. The i18n files provide the localized validation messages and `aria-label`s; without them the component falls back to English defaults.

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
  onValidate:  function (e) { if (!e.detail.valid) console.log(e.detail.errors[0]); }
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

Options passed to the constructor take precedence over the `data-*` values.

If the container's parent already has the `mts-form-group` class, the component renders **field-only** (just the input plus a hint slot, no label wrapper). Force the behavior with `renderMode: 'field-only'` or `renderMode: 'standalone'`.

---

## Options

All options are passed as the second argument to the constructor.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `string` | `'text'` | `'text'` \| `'email'` \| `'password'` \| `'number'` \| `'textarea'` |
| `label` | `string` | `''` | Field label |
| `placeholder` | `string` | `''` | Placeholder text |
| `hint` | `string` | `''` | Helper text below the field |
| `value` | `string` | `''` | Initial value |
| `name` | `string` | `null` | `name` attribute set on the underlying input/textarea |
| `required` | `boolean` | `false` | Marks the field as required |
| `errorMessage` | `string` | `null` | Overrides the `required` message; when `null` the localized default is used (see [Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `disabled` | `boolean` | `false` | Disables all interaction |
| `readonly` | `boolean` | `false` | Read-only, not editable |
| `clearable` | `boolean` | `false` | Shows a × button to clear (right slot) |
| `showPassword` | `boolean` | `type === 'password'` | Toggle to reveal the password; defaults to `true` when `type` is `'password'` |
| `iconLeft` | `string` | `null` | Left icon SVG string |
| `iconRight` | `string` | `null` | Right icon SVG string (ignored when `clearable` or `showPassword` is set) |
| `maxLength` | `number` | `null` | Maximum characters (sets the native `maxlength`) |
| `showCount` | `boolean` | `false` | Shows the character counter |
| `rows` | `number` | `4` | Textarea rows (only for `type="textarea"`) |
| `resize` | `string` | `'vertical'` | Textarea resize handle: `'none'` \| `'vertical'` \| `'horizontal'` \| `'both'` (only for `type="textarea"`) |
| `autocomplete` | `string` | `null` | Sets the native `autocomplete` attribute (use `'browser-off'` per platform standard) |
| `selectOnFocus` | `boolean` | `false` | Selects all text on focus (ignored for `type="password"`) |
| `nextOnEnter` | `boolean` | `false` | Enter moves focus to the next input in the DOM (ignored for `type="textarea"`) |
| `renderMode` | `string` | `'auto'` | `'auto'` \| `'field-only'` \| `'standalone'` — controls whether the label wrapper is rendered |
| `validateOnBlur` | `boolean` | `true` | Validate when the field loses focus |
| `validateOnInput` | `boolean` | `false` | Validate on every keystroke |
| `rules` | `object` | `{}` | Validation rules (see below) |
| `onChange` | `function` | — | Fires on value change |
| `onFocus` | `function` | — | Fires on focus |
| `onBlur` | `function` | — | Fires on blur |
| `onValidate` | `function` | — | Fires after validation |

### Validation rules

Passed via the `rules` option. All are optional; only the rules you set are enforced.

| Rule | Type | Description |
|------|------|-------------|
| `required` | `boolean` | Field cannot be empty (equivalent to the `required` option) |
| `minLength` | `number` | Minimum character count |
| `maxLength` | `number` | Maximum character count |
| `min` | `number` | Minimum numeric value (compares `Number(value)`) |
| `max` | `number` | Maximum numeric value (compares `Number(value)`) |
| `email` | `boolean` | Validates email format |
| `pattern` | `RegExp` | Custom regex the value must match |
| `patternMessage` | `string` | Message shown when `pattern` fails (overrides the localized `pattern` default) |
| `custom` | `function` | `(value) → 'error msg' \| null` — return a string to fail, falsy to pass |

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `getValue()` | `string` | Get the current value |
| `setValue(value)` | `this` | Set the value programmatically (updates the counter) |
| `clear()` | `this` | Clear the value and any error |
| `focus()` | `this` | Focus the field |
| `disable()` | `this` | Disable interaction |
| `enable()` | `this` | Enable interaction |
| `validate()` | `boolean` | Run validation manually; emits `'validate'` |
| `isValid()` | `boolean` | Current validation state |
| `setError(msg)` | `this` | Set an external error (e.g. from the server) |
| `clearError()` | `this` | Clear the error state and message |
| `on(event, callback)` | `this` | Subscribe to an event (`change` \| `focus` \| `blur` \| `validate`) |
| `off(event, callback)` | `this` | Unsubscribe a previously registered callback |
| `destroy()` | — | Empty the container |

```js
const inp = new MTS.Input('#my-input', { type: 'email', rules: { email: true } });
inp.setValue('user@example.com');
if (!inp.validate()) inp.setError('Email already exists');
```

---

## Events

Every event fires both the constructor callback and a DOM `CustomEvent` (bubbling) on the underlying input element. The DOM event `detail` also carries an `input` reference to the instance.

| Callback | DOM event | Payload |
|----------|-----------|---------|
| `onChange` | `mts:input:change` | `{ value }` |
| `onFocus` | `mts:input:focus` | `{ value }` |
| `onBlur` | `mts:input:blur` | `{ value }` |
| `onValidate` | `mts:input:validate` | `{ valid, errors }` |

```js
document.getElementById('my-input').querySelector('input')
  .addEventListener('mts:input:change', function (e) { console.log(e.detail.value); });
```

---

## i18n

Validation messages and the clear / show-password `aria-label`s are **localized**, never hardcoded. They are read at
render/validate time from the global language via `MTS.getString()['MTS.Input'].messages`, so a single
`MTS.setLanguage('es' | 'en' | 'pt')` at startup drives the whole app. There is **no** per-instance `locale` option.

| Key | en | Used for |
|-----|-----|----------|
| `required` | `This field is required` | `required` failed |
| `minLength` | `Minimum {n} characters` | `rules.minLength` failed |
| `maxLength` | `Maximum {n} characters` | `rules.maxLength` failed |
| `min` | `Minimum value: {n}` | `rules.min` failed |
| `max` | `Maximum value: {n}` | `rules.max` failed |
| `pattern` | `Invalid format` | `rules.pattern` failed |
| `email` | `Invalid email` | `rules.email` failed |
| `clear` | `Clear` | Clear button `aria-label` |
| `showPassword` | `Show password` | Reveal button `aria-label` |

`{n}` is substituted with the rule value. Per-instance overrides still win: `errorMessage` replaces the `required`
message and `rules.patternMessage` replaces the `pattern` message. Localized strings ship for `es` / `en` / `pt`.

---

## CSS Variables

Uses the framework base tokens for surface, border, text and state colors — notably `--mts-text-disabled` for the
disabled style, plus `--mts-danger-*` for the error state. Theme via `data-mts-mode` / `data-mts-accent`.

**Validation classes:** `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) — shared, single source in `base/matios-ui-base.css`. Error state: `.mts-input-wrap--error`. See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

---

## Accessibility

- The `label` is associated with the field; always provide one (or an `aria-label`) so the input has a name.
- Errors are announced near the field; `hint` text gives non-error guidance.
- `disabled` blocks interaction entirely, `readonly` keeps the value reachable but non-editable — pick per intent.
- The clear and show-password buttons carry localized `aria-label`s.
