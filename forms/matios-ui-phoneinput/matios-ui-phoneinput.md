# MTS.PhoneInput

Phone input with an integrated country selector, emoji flag, automatic formatting and country search. 38 countries included (full Americas + key international markets). Extensible via static methods. Zero dependencies.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-phoneinput.css">
<script src="matios-ui-phoneinput.js"></script>
```

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
    console.log(e.detail.full);      // → '+56 9 1234 5678'
    console.log(e.detail.country);   // → { code: 'CL', dial: '+56', name: 'Chile', … }
  },
  onCountryChange: function (e) { console.log(e.detail.country.code); }, // → 'MX'
});
```

### HTML with `data-*`

```html
<div id="phone-contact" data-label="Phone number" data-country="CL"></div>

<script>
  new MTS.PhoneInput('#phone-contact', { onChange: function (e) { console.log(e.detail.full); } });
</script>
```

Available `data-*`: `data-label`, `data-placeholder`, `data-hint`, `data-value`, `data-country`, `data-disabled`, `data-size`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `country` | `string` | `'CL'` | Initial ISO country code |
| `value` | `string` | `''` | Initial phone digits |
| `label` | `string` | `''` | Field label |
| `hint` | `string` | `''` | Helper text |
| `disabled` | `boolean` | `false` | Disables interaction |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `required` | `boolean` | `false` | Also via `data-required`. Gates validity: empty is valid **unless** required |
| `errorMessage` | `string` | i18n `invalid` | Error text when the number length doesn't match the country |
| `onChange` | `function` | — | Fires on value or country change |
| `onCountryChange` | `function` | — | Fires only when the country changes |

> **Validation.** Phone numbers have no checksum, so validity is by **length** — the digit count must match the country's format. Empty is valid unless `required`. The validation does **not** use the native HTML `required` attribute (no browser bubble); it is shown with the component's own error.

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Returns `{ raw, formatted, full, country, valid }` |
| `isValid()` | `boolean` — length matches the country (empty → valid unless `required`) |
| `validate()` | Validates required + phone length, renders the error inline, emits `'validate'`, returns `boolean` ([Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `setValue(digits)` | Set the phone digits programmatically |
| `setCountry(code)` | Change the country programmatically |
| `setError(msg)` / `clearError()` | Set / clear the error state |
| `disable()` / `enable()` | Disable / enable interaction |

```js
const phone = new MTS.PhoneInput('#my-phone', { country: 'CL' });
phone.setCountry('MX');
phone.setValue('912345678');
```

### Static methods — extending countries

Add countries without modifying the component. Existing codes are skipped (no duplicates):

```js
MTS.PhoneInput.addCountry({ code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia', fmt: '### ### ###' });
// → true (added) | false (already exists)

MTS.PhoneInput.addCountries([
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia',   fmt: '### ### ###' },
  { code: 'NZ', dial: '+64', flag: '🇳🇿', name: 'New Zealand', fmt: '## ### ####' },
]);
// → { added: N, skipped: M }
```

Each entry requires: `code` (ISO 3166-1 alpha-2), `dial` (e.g. `'+61'`), `flag` (emoji), `name` (display name),
`fmt` (format mask — `#` = digit, other chars = literal separator).

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:phoneinput:change` | `{ raw, formatted, full, country }` |
| `onCountryChange` | — | `{ country }` |

```js
document.getElementById('my-phone')
  .addEventListener('mts:phoneinput:change', function (e) { console.log(e.detail.full); });
```

---

## Included countries

38 by default, grouped by region — North America (CA, US, MX); Central America (GT, BZ, HN, SV, NI, CR, PA);
Caribbean (CU, DO, HT, JM, PR, TT, BB); South America (CO, VE, GY, SR, BR, EC, PE, BO, PY, AR, CL, UY);
Europe (ES, PT, GB, FR, DE, IT); Asia/Pacific (CN, JP).

---

## CSS Classes

Validation (form-field contract) - see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) - shared, single source in `base/matios-ui-base.css`.

---

## Accessibility

- The country selector is keyboard-operable and searchable; the phone field accepts digits with live formatting.
- Provide a `label`; the `full` E.164-style value is the one to persist.

---

## Changelog

### 2026-06-23
- Added the public `validate()` method (required + length → inline error + `'validate'` event), aligning `MTS.PhoneInput` with the [Form Field Contract](../FORM-FIELD-CONTRACT.md). Already had `required` + `errorMessage` + `setError`/`clearError`.

### Initial
- Phone input with integrated country selector (38 countries), emoji flags, automatic per-country formatting,
  country search, static `addCountry` / `addCountries` extension, and `getValue` / `setValue` / `setCountry`.
