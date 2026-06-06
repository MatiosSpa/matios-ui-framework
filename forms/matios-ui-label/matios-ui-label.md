# MTS.Label

Form label component with required/optional badges, hint text, error state and size variants. Also usable as pure HTML with CSS classes.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-label.css">
<script src="matios-ui-label.js"></script>
```

---

## Usage

### CSS only (no JS)

```html
<!-- Basic -->
<label class="mts-label" for="name">Full name</label>

<!-- Required -->
<label class="mts-label mts-label--required" for="email">Email</label>

<!-- Optional -->
<label class="mts-label" for="phone">
  <span class="mts-label__text">Phone</span>
  <span class="mts-label__optional">optional</span>
</label>

<!-- In a form group with hint -->
<div class="mts-form-group">
  <label class="mts-label mts-label--required" for="email">Email</label>
  <input class="mts-input" id="email" type="email">
  <span class="mts-form-hint">We'll never share your email.</span>
</div>

<!-- Visually hidden (screen-reader accessible) -->
<label class="mts-label mts-label--hidden" for="search">Search</label>
```

### JavaScript

```js
const lbl = new MTS.Label('#my-label', {
  text:     'Full name',
  required: true,
  hint:     'As it appears on your ID document',
  forId:    'input-name',
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | `string` | element text | Label text |
| `required` | `boolean` | `false` | Show the red asterisk |
| `optional` | `boolean` | `false` | Show the optional badge |
| `hint` | `string` | `null` | Helper text |
| `error` | `string` | `null` | Error text |
| `size` | `string` | `''` | `'sm'` · `''` · `'lg'` |
| `hidden` | `boolean` | `false` | Visually hidden |
| `forId` | `string` | `null` | `for` attribute |
| `className` | `string` | `''` | Extra CSS classes |

---

## API

| Method | Description |
|--------|-------------|
| `setText(text)` | Change the label text |
| `setHint(text)` | Set / clear the hint |
| `setError(msg)` / `clearError()` | Set / clear the error |
| `setRequired(bool)` | Toggle the required asterisk |
| `destroy()` | Destroy the instance |

```js
const lbl = new MTS.Label('#my-label', { text: 'Email' });
lbl.setRequired(true);
lbl.setError('This field is required');
```

---

## CSS Classes

| Class | Description |
|-------|-------------|
| `.mts-label` | Base label |
| `.mts-label--required` | Shows the red asterisk `*` |
| `.mts-label--optional` | Shows the optional badge |
| `.mts-label--hidden` | Visually hidden, screen-reader accessible |
| `.mts-label--sm` / `--lg` | Small / large (semibold) size |
| `.mts-label__text` | Inner text span |
| `.mts-label__optional` | Optional badge span |
| `.mts-form-hint` | Helper text below the field |
| `.mts-form-error` | Error text below the field |

---

## Accessibility

- Always set `forId` (or the `for` attribute) so the label is programmatically tied to its field.
- `--hidden` keeps the label available to screen readers while hiding it visually — prefer it over removing the label.

---

## Changelog

### Initial
- Form label with required/optional badges, hint and error text, size variants, visually-hidden mode, CSS-only
  usage, and `setText` / `setHint` / `setError` / `setRequired` API.
