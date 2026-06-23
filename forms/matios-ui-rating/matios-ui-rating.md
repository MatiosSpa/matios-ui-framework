# MTS.Rating

Star rating input with hover preview, half-star support and read-only mode.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-rating.css">
<script src="matios-ui-rating.js"></script>
```

---

## Usage

```js
// Basic
new MTS.Rating('#rating-product', { value: 3, max: 5, onChange: function (e) { console.log(e.detail.value); } });

// Half stars
new MTS.Rating('#rating-half', { value: 3.5, halfStars: true, onChange: function (e) { console.log(e.detail.value); } });

// Read-only
new MTS.Rating('#rating-readonly', { value: 4.5, halfStars: true, readonly: true });
```

The container only needs to exist in the DOM (`<div id="rating-product"></div>`). Also supports `data-value`,
`data-half-stars`, `data-readonly`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `number` | `0` | Initial rating value (0 to `max`) |
| `max` | `number` | `5` | Total number of stars |
| `halfStars` | `boolean` | `false` | Allow half-star ratings |
| `readonly` | `boolean` | `false` | Display only, no interaction |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `onChange` | `function` | — | Fires when the rating changes |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Get the current value (e.g. `3.5`) |
| `setValue(n)` | Set the value programmatically (`.5` requires `halfStars: true`) |
| `validate()` | Validates `required` (empty = `value === 0`), inline error + `'validate'` event → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the error state |

Accepts `required` + `errorMessage` (localized default) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md).
| `destroy()` | Destroy the instance |

```js
const rating = new MTS.Rating('#my-rating', { halfStars: true });
rating.setValue(4.5);
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:rating:change` | `{ value }` |
| — | `mts:rating:hover` | `{ value }` (hover preview) |

```js
document.getElementById('my-rating')
  .addEventListener('mts:rating:change', function (e) { console.log(e.detail.value); });
```

---

## Accessibility

- In interactive mode the stars are keyboard-operable (arrow keys step the value, respecting `halfStars`).
- A `readonly` rating should still expose its value as text for assistive tech.

---

## Changelog

### 2026-06-23
- Validation contract: `required` (empty = `value === 0`) + `errorMessage` + `validate()` + `setError`/`clearError` (localized). See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

### Initial
- Star rating input with hover preview, half-star support, configurable `max`, sizes, read-only mode,
  `onChange`, and `getValue` / `setValue`.
