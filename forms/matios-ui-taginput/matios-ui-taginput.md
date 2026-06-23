# MTS.TagInput

Tag input with autocomplete, debounce and object support. Each tag stores `{ uid, name }` — `uid` is the unique identifier (email, id, uuid, etc.), `name` is what is displayed.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-taginput.css">
<script src="matios-ui-taginput.js"></script>
```

---

## Usage

```js
// Async search
const ti = new MTS.TagInput('#el', {
  label:       'Guests',
  placeholder: 'Search a person...',
  allowCustom: false, // only allow selecting from suggestions
  onSearch: async function (q) {
    const res = await fetch('/api/attendees?q=' + encodeURIComponent(q));
    return res.json(); // → [{ uid, name }, …]
  },
  onChange: function (e) { console.log(e.detail.tags); },
});

ti.getTags(); // → [{ uid: 'ana@mail.com', name: 'Ana López' }]

// Static suggestions
new MTS.TagInput('#el2', {
  suggestions: [
    { uid: 'ana@mail.com',    name: 'Ana López' },
    { uid: 'carlos@mail.com', name: 'Carlos Ruiz' },
  ],
});

// Pre-loaded tags
new MTS.TagInput('#el3', { tags: [{ uid: 'ana@mail.com', name: 'Ana López' }] });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tags` | `{ uid, name }[]` | `[]` | Initial tags |
| `suggestions` | `{ uid, name }[]` | `[]` | Static suggestions |
| `label` | `string` | `''` | Field label |
| `placeholder` | `string` | localized | Input placeholder |
| `maxTags` | `number \| null` | `null` | Max tags allowed |
| `allowCustom` | `boolean` | `true` | Allow free-text tags |
| `allowDuplicates` | `boolean` | `false` | Allow duplicate uids |
| `debounce` | `number` | `300` | Debounce (ms) for `onSearch` |
| `onSearch` | `async (q) → { uid, name }[]` | `null` | Async search handler |
| `onChange` | `function` | — | Fires on tag add/remove |
| `onAdd` | `function` | — | Fires when a tag is added |
| `onRemove` | `function` | — | Fires when a tag is removed |

---

## API

| Method | Description |
|--------|-------------|
| `getTags()` | Returns `[{ uid, name }, …]` |
| `setTags(array)` | Replace all tags |
| `addTag({ uid, name })` | Add one tag |
| `removeTag(uid)` | Remove a tag by uid |
| `validate()` | Validates `required` (empty = no tags), inline error + `'validate'` event → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the error state |

Accepts `required` + `errorMessage` (localized default) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md).
| `setSuggestions(array)` | Replace the suggestions |
| `destroy()` | Destroy the instance |

```js
ti.addTag({ uid: 'x@y.com', name: 'X' });
ti.removeTag('x@y.com');
ti.on('add', function (e) { console.log(e.detail.tag); });
```

---

## Events

| Method | DOM event-style | Payload |
|--------|-----------------|---------|
| `onChange` / `on('change', fn)` | — | `{ tags }` |
| `onAdd` / `on('add', fn)` | — | `{ tag }` |
| `onRemove` / `on('remove', fn)` | — | `{ tag }` |

---

## Accessibility

- Existing tags are removable by keyboard (`Backspace` from the empty input, or the per-tag remove control).
- The suggestions dropdown is navigable with arrows and confirmed with `Enter`.

---

## Changelog

### 2026-06-23
- Validation contract: `required` (empty = no tags) + `errorMessage` + `validate()` + `setError`/`clearError` (localized). See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

### Initial
- Tag input with `{ uid, name }` objects, async `onSearch` (debounced) or static suggestions, `allowCustom`,
  `allowDuplicates`, `maxTags`, and `getTags` / `setTags` / `addTag` / `removeTag` / `setSuggestions`.
