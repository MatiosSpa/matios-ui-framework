# MTS.NationalId

Format and validate **legal / national identity documents** per country (RUN·RUT, CPF·CNPJ, CUIT, DNI·NIE, RUC, NIT, CI, Cédula, NIF…), as you type, with checksum validation.

Two layers:
- **`MTS.NationalId`** — pure core (no DOM): `registerCountry`, `format`, `validate`, `countries`.
- **`MTS.NationalId.Input`** — input component on top of the core (format-as-you-type + validation + error message).

## Installation

```html
<link rel="stylesheet" href="forms/matios-ui-nationalid/matios-ui-nationalid.css">
<script src="forms/matios-ui-nationalid/matios-ui-nationalid.js"></script>
<!-- optional, for localized default error messages -->
<script src="base/matios-ui-i18n.js"></script>
<script src="forms/matios-ui-nationalid/matios-ui-nationalid-i18n.js"></script>
```

## Usage

```html
<div id="rut"></div>

<script>
  var idInput = new MTS.NationalId.Input('#rut', {
    country: 'CL',                 // ISO-2 — like MTS.PhoneInput
    type: 'auto',                  // 'auto' | a specific type (run/rut/cpf/cnpj/…)
    label: 'RUT',
    errorMessage: 'Invalid RUT',   // optional — overrides the localized default
    required: true,
    onChange: function (v) {
      saveBtn.disabled = !v.valid; // { raw, formatted, valid, dv, type, country }
    }
  });
</script>
```

The core can also be used **without the input**, e.g. on submit or in a grid:

```js
MTS.NationalId.validate('CL', '12.345.678-5');
// → { valid:true, raw:'123456785', formatted:'12.345.678-5', dv:'5', type:'rut', country:'CL' }

MTS.NationalId.format('BR', '11144477735');   // → '111.444.777-35'
MTS.NationalId.countries();                    // → ['AR','BR','CL', …]
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `country` | `string` | `'CL'` | ISO-2 country code (must be registered) |
| `type` | `string` | `'auto'` | `'auto'` (resolved by length/prefix) or a specific type key |
| `label` | `string` | — | Field label |
| `placeholder` | `string` | country default | Override the placeholder |
| `value` | `string` | — | Initial value |
| `required` | `boolean` | `false` | Also via `data-required`. Gates validity: empty is valid **unless** required. Does **not** set the native HTML `required` (no browser bubble) |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `disabled` | `boolean` | `false` | Disables the field |
| `errorMessage` | `string` | i18n `invalid` | Error text; `{doc}` is replaced by the doc label (RUT, CPF…) |
| `maxLength` | `number` | derived | Override the derived attribute cap (formatted length + 2) |
| `autocomplete` | `string` | `'browser-off'` | Per platform standard |
| `onChange` | `function` | — | `function(v)` — receives the value object |

> **maxLength.** Derived as `formattedLength + 2` (a small buffer so the native `maxlength` never blocks the formatter). The real cap is by **digit count** in JS (`maxDigits` per type), and the source of truth for correctness is `validate()` — not the length.

## API

### Core — `MTS.NationalId`
| Method | Returns |
|--------|---------|
| `validate(country, value, [type])` | `{ valid, raw, formatted, dv, type, country }` |
| `format(country, value, [type])` | formatted `string` |
| `resolveType(country, value, [type])` | resolved type key |
| `countries()` | array of registered ISO-2 codes |
| `getCountry(code)` | the country definition |
| `registerCountry(code, def)` | register / override a country |

### Input — `MTS.NationalId.Input`
| Method | Description |
|--------|-------------|
| `getValue()` | `{ raw, formatted, valid, dv, type, country }` |
| `isValid()` | `boolean` |
| `validate()` | Validates required + format, renders the error inline, emits `'validate'`, returns `boolean` ([Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `setValue(v)` | Set value (re-formats + re-validates), chainable |
| `setCountry(code)` | Switch country, chainable |
| `setError(msg)` / `clearError()` | Manual error control |
| `on(event, cb)` | Subscribe to an event |
| `destroy()` | Unmount and clean up |

## Events

`mts:nationalid:change` (and the `onChange` callback) fire with the value object on every keystroke.

```javascript
document.getElementById('rut')
  .addEventListener('mts:nationalid:change', function (e) { console.log(e.detail); });
```

## Available countries

| Country | Types | Algorithm | Confidence |
|---|---|---|---|
| 🇨🇱 CL | RUN · RUT | mod 11 (DV 0-9 / K) | ✅ verified (real vector) |
| 🇧🇷 BR | CPF · CNPJ | 2 check digits | ✅ verified (real vectors) |
| 🇪🇸 ES | DNI/NIF · NIE | mod 23 (letter) | ✅ verified |
| 🇪🇨 EC | Cédula | mod 10 (2-1 coeff.) | ✅ verified |
| 🇦🇷 AR | CUIT / CUIL | mod 11 | 🟡 per official spec |
| 🇵🇪 PE | RUC | mod 11 | 🟡 per official spec |
| 🇨🇴 CO | NIT | mod 11 (prime weights) | 🟡 per official spec |
| 🇺🇾 UY | CI | mod 10 (2987634) | 🟡 per official spec |
| 🇵🇹 PT | NIF | mod 11 | 🟡 per official spec |
| 🇺🇸 US | SSN · EIN | format only | ⚪ no public checksum |

> ✅ verified against known real IDs · 🟡 implements the documented official algorithm (self-consistent; confirm with a real sample before relying in production) · ⚪ format/length only.

## Adding a country

Register a country at runtime — no need to edit the component:

```js
MTS.NationalId.registerCountry('XX', {
  name: 'Country',
  defaultType: 'id',
  detect: function (raw) { return null; },   // optional — pick a type by length/prefix ('auto')
  types: {
    id: {
      label: 'ID',
      placeholder: '00.000-0',
      maxDigits: 7,                            // real digit cap (drives truncation + maxLength)
      format:   function (clean) { return '…'; },          // clean string → formatted
      validate: function (clean) { return { valid: true, dv: '0' }; } // → { valid, dv? }
    }
  }
});
```

A country can have several `types` (e.g. person vs company). Use `detect(raw)` to auto-pick when `type:'auto'`; otherwise pass `type` explicitly.

## CSS Classes

| Class | Element |
|---|---|
| `.mts-nationalid` | Root |
| `.mts-nationalid__label` (`--required`) | Label |
| `.mts-nationalid__wrap` (`--sm/md/lg`, `--focus`, `--error`, `--disabled`) | Field wrapper |
| `.mts-nationalid__input` | The text input |
| `.mts-nationalid__error` | Error message |

All colors/spacing use `--mts-*` tokens; the enabled background is `--mts-bg-surface` (same as `MTS.Input`).

> Note: `MTS.NationalId.Input` ships its own `--required` / `--error` classes (above). The rest of the form-field family uses the shared `.mts-label--required` / `.mts-form-error` / `.mts-form-hint` from `base/matios-ui-base.css` — see [Form Field Contract](../FORM-FIELD-CONTRACT.md).

## Accessibility

- Label linked to the input via `for`/`id`.
- Error text linked via `aria-describedby` and announced with `aria-live="polite"`.
- `aria-invalid="true"` on the input while invalid.

## Changelog

- **2026-06-23** — Added the public `validate()` method (required + format → inline error + `'validate'` event), aligning `MTS.NationalId.Input` with the [Form Field Contract](../FORM-FIELD-CONTRACT.md). Already had `required` + `errorMessage` + `setError`/`clearError`.
- **2026-06-10** — Initial version. Core (registry + format + validate) with CL, BR, ES, EC, AR, PE, CO, UY, PT, US; `MTS.NationalId.Input` (format-as-you-type with digit-count caret restore, validation, configurable error message, derived `maxLength`); es/en/pt locale.
