# MTS.Rating

Star rating input with hover preview, half-star support and read-only mode.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-rating.css">
<script src="matios-ui-rating.js"></script>

<!-- Optional: localized chrome (aria-labels, required message) -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-rating-i18n.js"></script>
```

Without the i18n files the component falls back to its built-in English defaults.

---

## Usage

```js
// Basic
new MTS.Rating('#rating-product', {
  value: 3,
  max: 5,
  onChange: function (e) { console.log(e.detail.value); }
});

// Half stars
new MTS.Rating('#rating-half', {
  value: 3.5,
  halfStars: true,
  onChange: function (e) { console.log(e.detail.value); }
});

// Read-only
new MTS.Rating('#rating-readonly', {
  value: 4.5,
  halfStars: true,
  readonly: true
});
```

The container only needs to exist in the DOM: `<div id="rating-product"></div>`.

The first argument is a CSS selector string or a DOM element; the component builds itself in place.

---

## Declarative HTML

The component reads `data-*` attributes off the container and merges them under any options passed in code
(explicit options win). Boolean attributes only need to be present.

```html
<div id="rating-declarative"
     data-value="4"
     data-max="10"
     data-half-stars
     data-readonly
     data-size="lg"></div>
```

```js
new MTS.Rating('#rating-declarative', {
  onChange: function (e) { console.log(e.detail.value); }
});
```

| Attribute | Maps to | Notes |
|-----------|---------|-------|
| `data-value` | `value` | Parsed with `parseFloat` |
| `data-max` | `max` | Parsed with `parseInt` |
| `data-half-stars` | `halfStars` | Presence = `true` |
| `data-readonly` | `readonly` | Presence = `true` |
| `data-size` | `size` | `'sm'` \| `'md'` \| `'lg'` |

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `number` | `0` | Initial rating value (clamped to `0`–`max`) |
| `max` | `number` | `5` | Total number of stars |
| `halfStars` | `boolean` | `false` | Allow half-star ratings |
| `readonly` | `boolean` | `false` | Display only, no interaction |
| `size` | `string` | `'md'` | `'sm'` \| `'md'` \| `'lg'` |
| `onChange` | `function` | — | Shorthand for `on('change', fn)`; fires when the value changes |
| `required` | `boolean` | `false` | Marks the field required for `validate()` (empty = `value === 0`) |
| `errorMessage` | `string` | `null` | Custom error message; falls back to the localized default |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Returns the current value (e.g. `3.5`) |
| `setValue(n)` | Sets the value programmatically, clamped to `0`–`max` (`.5` requires `halfStars: true`); re-renders and returns `this` |
| `on(event, fn)` | Registers an event listener (`'change'`, `'hover'`, `'validate'`); returns `this` |
| `validate()` | Validates `required` (empty = `value === 0`), shows the inline error, emits `'validate'`, returns `boolean` |
| `setError(msg)` | Sets the inline error state; returns `this` |
| `clearError()` | Clears the inline error state; returns `this` |
| `destroy()` | Empties the container |

Accepts `required` + `errorMessage` (localized default) — see the [Form Field Contract](../FORM-FIELD-CONTRACT.md).

```js
const rating = new MTS.Rating('#my-rating', { halfStars: true });
rating.setValue(4.5);
console.log(rating.getValue()); // 4.5
```

---

## Events

Listeners receive `{ type, detail }`; the matching DOM event carries the same `detail` and bubbles.

| on(...) | DOM event | Payload |
|---------|-----------|---------|
| `'change'` | `mts:rating:change` | `{ value }` |
| `'hover'` | `mts:rating:hover` | `{ value }` (hover preview) |
| `'validate'` | `mts:rating:validate` | `{ valid, errors }` |

```js
document.getElementById('my-rating')
  .addEventListener('mts:rating:change', function (e) { console.log(e.detail.value); });
```

---

## CSS Classes

The container gets `.mts-rating` plus `.mts-rating--<size>` and, when read-only, `.mts-rating--readonly`.
Each star is a `<button class="mts-rating__star">` with a fill modifier: `--full`, `--half` or `--empty`.

Validation (form-field contract) — see the [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) — shared, single source in `base/matios-ui-base.css`.

---

## Accessibility

- The container uses `role="radiogroup"`.
- Each star is a real `<button type="button">` with an `aria-label` of the form `"3 stars"` (localized, see i18n).
- In read-only mode the star buttons are `disabled`.

---

## i18n

Localized chrome is read at render time from the global string table under the namespace `MTS.Rating`.
Set the language once at startup with the global API; there is no per-instance `locale` option.

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'  (default 'es')
```

Keys under `MTS.Rating.messages`:

| Key | Used for | Default (en) |
|-----|----------|--------------|
| `required` | Default `validate()` error message | `This field is required` |
| `starLabel` | Per-star `aria-label`; `{n}` is replaced by the star index | `{n} stars` |

Per instance you can override the validation error text with the `errorMessage` option, which wins over the localized default.

Bundled languages: `es`, `en`, `pt`.
