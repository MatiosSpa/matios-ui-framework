# MTS.TagInput

Tag input with autocomplete, debounce and object support. Each tag stores `{ uid, name }` — `uid` is the unique identifier (email, id, uuid, etc.), `name` is the text displayed in the chip. Legacy string tags are normalized to `{ uid: str, name: str }`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-taginput.css">
<script src="matios-ui-taginput.js"></script>
```

Optional (for localized chrome — placeholder, remove-tag label, validation message):

```html
<script src="../../base/matios-ui-i18n.js"></script>
<script src="matios-ui-taginput-i18n.js"></script>
```

---

## Usage

```js
// Async search
const ti = new MTS.TagInput('#el', {
  label:       'Guests',
  placeholder: 'Search a person...',
  allowCustom: false,
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

A tag is added when the user presses `Enter` or `,` (only if `allowCustom` is `true`), or by clicking a suggestion. `Backspace` on an empty input removes the last tag.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tags` | `{ uid, name }[]` | `[]` | Initial tags. Accepts strings or `{ value, label }` objects (normalized) |
| `suggestions` | `{ uid, name }[]` | `[]` | Static suggestions. Ignored while `onSearch` is set |
| `label` | `string` | `''` | Field label |
| `placeholder` | `string` | localized (`Add...`) | Input placeholder |
| `maxTags` | `number \| null` | `null` | Max tags allowed |
| `allowCustom` | `boolean` | `true` | Allow free-text tags via `Enter` / `,` |
| `allowDuplicates` | `boolean` | `false` | Allow duplicate uids |
| `renderMode` | `'auto' \| 'standalone' \| 'field-only'` | `'auto'` | Layout mode. `auto` hides the label when the host is inside a `.mts-form-group` |
| `debounce` | `number` | `300` | Debounce (ms) applied before `onSearch` |
| `onSearch` | `async (q) → { uid, name }[]` | `null` | Async search handler. When set, replaces the static suggestions |
| `required` | `boolean` | `false` | Field is required (empty = no tags) |
| `errorMessage` | `string` | localized | Custom message shown when `validate()` fails |
| `onChange` | `function` | — | Shorthand for `on('change', fn)` |
| `onAdd` | `function` | — | Shorthand for `on('add', fn)` |
| `onRemove` | `function` | — | Shorthand for `on('remove', fn)` |

### Declarative attributes (progressive enhancement)

Set on the host element, read at construction (explicit options win):

| Attribute | Maps to |
|-----------|---------|
| `data-label` | `label` |
| `data-placeholder` | `placeholder` |
| `data-max-tags` | `maxTags` |
| `data-allow-duplicates` | `allowDuplicates: true` |
| `data-allow-custom` | `allowCustom: true` |
| `data-disabled` | `disabled: true` |

```html
<div id="tags" data-label="Guests" data-placeholder="Search or type..." data-max-tags="4"></div>
```

---

## API

| Method | Description |
|--------|-------------|
| `getTags()` | Returns a copy `[{ uid, name }, …]` |
| `setTags(array)` | Replace all tags (accepts objects or strings), re-renders |
| `addTag(tag)` | Add one tag (`{ uid, name }` or string). Respects `maxTags` / duplicates |
| `removeTag(tag)` | Remove a tag by uid (string) or `{ uid }` |
| `setSuggestions(array)` | Replace the suggestions and re-render the dropdown |
| `on(event, fn)` / `off(event, fn)` | Subscribe / unsubscribe (`change`, `add`, `remove`, `validate`) |
| `validate()` | Validates `required` (empty = no tags); shows inline error, emits `validate` → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the inline error state |
| `destroy()` | Clears the host element |

Accepts `required` + `errorMessage` (localized default) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md).

```js
ti.addTag({ uid: 'x@y.com', name: 'X' });
ti.removeTag('x@y.com');
ti.on('add', function (e) { console.log(e.detail.tag); });
```

---

## Events

Each event fires listeners registered via `on(...)` / the `onX` options **and** dispatches a bubbling `CustomEvent` on the host element.

| API | DOM event | `detail` payload |
|-----|-----------|------------------|
| `onChange` / `on('change', fn)` | `mts:taginput:change` | `{ tags: { uid, name }[] }` |
| `onAdd` / `on('add', fn)` | `mts:taginput:add` | `{ tag: { uid, name } }` |
| `onRemove` / `on('remove', fn)` | `mts:taginput:remove` | `{ tag: { uid, name } }` |
| `on('validate', fn)` | `mts:taginput:validate` | `{ valid: boolean, errors: string[] }` |

Listeners receive `{ type, detail }`; DOM events carry `detail` directly.

```js
el.addEventListener('mts:taginput:change', function (e) {
  console.log(e.detail.tags);
});
```

---

## i18n

Chrome text (input placeholder, remove-tag `aria-label`, required-field message) is localized through the global i18n API under the namespace `MTS.TagInput`. Load `base/matios-ui-i18n.js` + `matios-ui-taginput-i18n.js`, then set the language once at startup:

```js
MTS.setLanguage('en'); // 'es' | 'en' | 'pt' — global, all components
```

Localized keys (`MTS.getString()['MTS.TagInput'].messages`):

| Key | en | Notes |
|-----|-----|-------|
| `placeholder` | `Add...` | Default input placeholder |
| `removeTag` | `Remove {tag}` | Per-tag remove `aria-label`; `{tag}` → the tag name |
| `required` | `This field is required` | Default `validate()` error |

Explicit `placeholder` / `errorMessage` options always override the localized values. There is no per-instance locale option.

---

## CSS Classes

| Class | Element |
|-------|---------|
| `.mts-taginput` | Wrapper |
| `.mts-taginput__tags` | Tag chip container |
| `.mts-taginput__tag` | A tag chip |
| `.mts-taginput__tag-remove` | Per-tag remove control |
| `.mts-taginput__input` | Text input |
| `.mts-taginput__dropdown` (`--open`) | Suggestions dropdown |
| `.mts-taginput__suggestion` | A suggestion row |
| `.mts-taginput__suggestion-name` / `--hint` | Suggestion name / uid hint |

Validation (form-field contract) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-label--required` (red asterisk on the label) — shared, single source in `base/matios-ui-base.css`.

---

## Accessibility

- Existing tags are removable by keyboard (`Backspace` from the empty input) or via the per-tag remove control (with a localized `aria-label`).
- `Escape` closes the suggestions dropdown; clicking a suggestion confirms it.
