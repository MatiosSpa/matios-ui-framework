# Form Field Validation Contract

The standard, uniform validation contract every MTS **form field** component implements.

It is the **per-component** validation path — used when you are **not** driving the form with
[`MTS.Validate`](matios-ui-validation/matios-ui-validation.md) (the declarative, form-level validator that reads
native fields by `name`). Both paths coexist: the per-component contract is **opt-in** (`required` defaults to
`false`), so a field does nothing extra unless you ask it to. This is the right layer for dynamic / heterogeneous
forms built from MTS widgets (e.g. a metadata editor whose fields are generated at runtime).

---

## The contract (identical across every field)

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `required` | `boolean` | `false` | Opt-in. When `false` the field never reports a validation error. |
| `errorMessage` | `string \| null` | `null` | Per-instance override of the message. When `null`, the localized default (`_t()`) is used. **Messages are never hardcoded.** |

HTML enhancement: `data-required` and `data-error-message` map to the options above.

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `validate()` | `boolean` | Validates `required` (emptiness is component-specific, see below); on failure calls `setError(...)`, on success `clearError()`. Emits the `'validate'` event with `{ valid, errors }`. |
| `setError(msg)` | `this` | Marks the control invalid and shows `msg` in the error slot. |
| `clearError()` | `this` | Clears the error state and message. |
| `getValue()` | — | Already present on every field. |

### Behavior (invariants)

- **Message resolution:** `errorMessage ?? _t('required') ?? ` — never a hardcoded string.
- **`validate()` order:** check `required` first (empty → required message); then the component's own format rule
  if it has one (e.g. checksum / phone length).
- **Auto-clear:** changing the value clears a standing error.
- **Error slot:** rendered into an element carrying the shared `.mts-form-error` class (no new per-component error
  classes are invented for this).
- **Label:** where the field renders its own label, the required asterisk is shown via the `--required` modifier.
- **Event:** `'validate'` callback + DOM event `mts:<component>:validate` with detail `{ valid, errors }`.

### i18n namespace (per component)

```js
messages: {
  required: 'This field is required',   // es: 'Este campo es obligatorio'  · pt: 'Este campo é obrigatório'
  invalid:  'Invalid value'             // only fields with a format rule (NationalId, PhoneInput, Input)
}
```

---

## Per-component emptiness rule

What "empty" means for `required` in each field (what makes `validate()` fail):

| Component | `getValue()` shape | `required` fails when | Extra rule |
|-----------|--------------------|-----------------------|------------|
| `Input` | `string` | `!value.trim()` | `rules`: minLength / maxLength / min / max / pattern / email |
| `NationalId` | `{ valid, dv }` | empty | format / check digit |
| `PhoneInput` | `{ raw, full, valid, … }` | `raw` empty | digit length per country |
| `NumberInput` | `number \| null` | `value == null` (`null` is "not entered") | — |
| `OTP` | `string` | length `< n` (incomplete) | — |
| `Select` | `value \| value[] \| null` | single: `null`/`''` · multiple: `length === 0` | — |
| `DatePicker` | `Date \| null` | `getValue() === null` | — |
| `Autocomplete` | `value \| null` | empty / `null` | — |
| `ColorPicker` | `string \| null` | `!getValue()` | — |
| `Picker` | `value \| null` | `null` | — |
| `RichEditor` | `string` (html) | empty / whitespace only | — |
| `Checkbox` | `value[]` | `length === 0` (none checked) | — |
| `Radio` | `value \| null` | `null` (none selected) | — |
| `Toggle` | `boolean` | `!checked` (must be on) | — |
| `Rating` | `number` | `value === 0` | — |
| `TagInput` | `string[]` | `length === 0` | — |
| `TransferList` | `value[]` | `length === 0` | — |
| `Slider` | `number \| number[]` | **N/A** — always has a value; `validate()` is always `true` (API kept for uniformity) | — |

---

## Consumer pattern

```js
// Heterogeneous, dynamically-built form (no MTS.Validate):
const controls = fields.map(function (f) {
  return buildControl(f, { required: f.isRequired });   // each MTS field, required opt-in
});

function submit() {
  let firstInvalid = null;
  controls.forEach(function (ctrl) {
    if (!ctrl.validate()) firstInvalid = firstInvalid || ctrl;  // inline error per field
  });
  if (firstInvalid) { firstInvalid.focus?.(); return; }         // focus the first invalid — no generic toast
  // … all valid, proceed
}
```

---

## Reference implementations

`MTS.NationalId` and `MTS.PhoneInput` are the gold reference for the `errorMessage` + `_t()` message resolution;
`MTS.Input` is the reference for the multi-rule `validate()` shape.
