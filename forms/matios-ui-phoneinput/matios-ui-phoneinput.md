# MTS.PhoneInput

Phone input with an integrated country selector, emoji flag, automatic per-country formatting and country search. 34 countries included by default (full Americas + key international markets). Extensible via static methods. Chile-focused: the default country is Chile (`+56 9 XXXX XXXX`). Zero dependencies.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-phoneinput.css">
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-phoneinput-i18n.js"></script>
<script src="matios-ui-phoneinput.js"></script>
```

`matios-ui-i18n.js` + `matios-ui-phoneinput-i18n.js` are optional but recommended: without them the component falls back to its built-in English strings.

---

## Usage

```js
const phone = new MTS.PhoneInput('#my-phone', {
  country: 'CL',
  label:   'Phone number',
  size:    'md',
  onChange: function (e) {
    console.log(e.detail.raw);       // → '912345678'
    console.log(e.detail.formatted); // → '9 1234 5678'
    console.log(e.detail.full);      // → '+56912345678'
    console.log(e.detail.country);   // → { code: 'CL', dial: '+56', name: 'Chile', … }
  },
  onCountryChange: function (e) {
    console.log(e.detail.country.code); // → 'MX'
  }
});
```

> The instance mounts **in place** on the element you pass (element or CSS selector). There is no `.mount()`.

### HTML with `data-*`

```html
<div id="phone-contact" data-label="Phone number" data-country="CL"></div>

<script>
  new MTS.PhoneInput('#phone-contact', { onChange: function (e) { console.log(e.detail.full); } });
</script>
```

Available `data-*`: `data-label`, `data-placeholder`, `data-hint`, `data-value`, `data-country`, `data-disabled`, `data-size`, `data-required`. Explicit `options` override the matching `data-*` values.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `country` | `string` | `'CL'` | Initial ISO country code |
| `value` | `string` | `''` | Initial phone digits (non-digits are stripped) |
| `label` | `string` | `''` | Field label |
| `placeholder` | `string` | country format | Input placeholder. Defaults to the country's format with `#` replaced by `0` |
| `hint` | `string` | `''` | Helper text below the field |
| `disabled` | `boolean` | `false` | Disables the input and the country selector |
| `size` | `string` | `'md'` | `'sm'` \| `'md'` \| `'lg'` |
| `required` | `boolean` | `false` | Gates validity: empty is valid **unless** required |
| `errorMessage` | `string` | i18n `invalid` | Error text shown when the number length doesn't match the country |
| `renderMode` | `string` | `'auto'` | `'auto'` \| `'field-only'` \| `'standalone'`. In `'auto'`, the label is hidden when the element sits inside a `.mts-form-group`; `'field-only'` forces no label, `'standalone'` always renders the label |
| `onChange` | `function` | — | Fires on value change **and** on country change. Shortcut for `on('change', fn)` |
| `onCountryChange` | `function` | — | Fires only when the country changes. Shortcut for `on('country', fn)` |

> **Validation.** Phone numbers have no checksum, so validity is by **length** — the digit count must match the country's format (`fmt`). Empty is valid unless `required`. Validation does **not** use the native HTML `required` attribute (no browser bubble); the error is shown with the component's own inline element.

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Returns `{ raw, formatted, full, country, valid }` |
| `isValid()` | `boolean` — digit count matches the country (empty → valid unless `required`) |
| `validate()` | Validates required + length, renders the error inline, emits `'validate'`, returns `boolean` ([Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `setValue(digits)` | Set the phone digits programmatically (non-digits stripped). Returns `this` |
| `setCountry(code)` | Change the country programmatically (rebuilds the field). Returns `this` |
| `setError(msg)` | Set the error state and render it inline. Returns `this` |
| `clearError()` | Clear the error state. Returns `this` |
| `disable()` / `enable()` | Disable / enable interaction. Returns `this` |
| `on(event, cb)` / `off(event, cb)` | Subscribe / unsubscribe a listener. Events: `'change'`, `'country'`, `'validate'`. Returns `this` |

```js
const phone = new MTS.PhoneInput('#my-phone', { country: 'CL' });
phone.setCountry('MX');
phone.setValue('5512345678');
```

### Static methods — extending countries

Add countries without modifying the component. Existing codes are skipped (no duplicates):

```js
MTS.PhoneInput.addCountry({ code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia', fmt: '### ### ###' });
// → true (added) | false (already exists)

MTS.PhoneInput.addCountries([
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia',   fmt: '### ### ###' },
  { code: 'NZ', dial: '+64', flag: '🇳🇿', name: 'New Zealand', fmt: '## ### ####' }
]);
// → { added: N, skipped: M }
```

Each entry requires: `code` (ISO 3166-1 alpha-2), `dial` (e.g. `'+61'`), `flag` (emoji), `name` (display name), `fmt` (format mask — `#` = digit, any other char = literal separator).

---

## Events

| Callback | `on()` event | DOM event | Payload (`e.detail`) |
|----------|--------------|-----------|----------------------|
| `onChange` | `'change'` | `mts:phoneinput:change` | `{ raw, formatted, full, country, valid }` |
| `onCountryChange` | `'country'` | `mts:phoneinput:country` | `{ country }` |
| — | `'validate'` | `mts:phoneinput:validate` | `{ valid, errors }` |

The DOM events bubble. The `'change'` event fires on typing **and** on country change; `'country'` fires only on country change; `'validate'` fires only from `validate()`.

```js
document.getElementById('my-phone')
  .addEventListener('mts:phoneinput:change', function (e) { console.log(e.detail.full); });
```

---

## Included countries

34 by default, grouped by region:

- **North America** — CA, US, MX
- **Central America** — GT, BZ, HN, SV, NI, CR, PA
- **Caribbean** — CU, DO, HT, JM, PR, TT, BB
- **South America** — CO, VE, GY, SR, BR, EC, PE, BO, PY, AR, CL, UY
- **Europe** — ES, PT, GB, FR, DE, IT
- **Asia / Pacific** — CN, JP

---

## i18n

The component is registered under the namespace `MTS.PhoneInput`. Localized UI strings are read from `MTS.getString()['MTS.PhoneInput']`:

- `invalid` — default validation message when the number length is wrong.
- `required` — validation message when a required field is empty.
- `searchPlaceholder` — placeholder of the country-search box in the dropdown.

Language is set once, globally — there is no per-instance `locale` option:

```js
MTS.setLanguage('es'); // 'es' · 'en' · 'pt'
```

Bundled strings:

| Key | es | en | pt |
|-----|----|----|----|
| `invalid` | `Teléfono inválido` | `Invalid phone number` | `Telefone inválido` |
| `required` | `Requerido` | `Required` | `Obrigatório` |
| `searchPlaceholder` | `Buscar país...` | `Search country...` | `Buscar país...` |

Override the validation message per instance with `errorMessage` (takes precedence over the localized `invalid`).

---

## CSS Classes

Validation (form-field contract) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) — shared, single source in `base/matios-ui-base.css`.

---

## Accessibility

- The country selector is keyboard-operable and searchable; the phone field accepts digits with live formatting and a stable caret.
- Provide a `label`; the `full` E.164-style value (`country.dial` + digits) is the one to persist.
