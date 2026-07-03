# MTS.ItemList

Rich list (`<ul>` on steroids). Supports avatar · initials · icon · primary/secondary text · inline controls (select, badge, button) · selection · removal · automatic scroll past an item threshold. Can be initialized from pure JS, from existing HTML, or mixed.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-itemlist.css">
<script src="matios-ui-itemlist.js"></script>
<script src="matios-ui-itemlist-i18n.js"></script>
```

The `-i18n.js` file registers the component's built-in strings (empty-state message, remove aria-label) for `es` / `en` / `pt`. It requires `base/matios-ui-i18n.js` to be loaded first; without it the component falls back to its English defaults.

---

## Usage

```js
new MTS.ItemList('#host', {
  datasource: [
    { value: 1, text: 'Ana Perez', email: 'ana@company.com' },
    { value: 2, text: 'Luis Soto', email: 'luis@company.com' }
  ],
  row: {
    leading:   { type: 'initials', bind: 'text' },
    primary:   'text',
    secondary: 'email'
  }
});
```

Each datasource item needs a `value` (its identity, used by `addItem` / `removeItem` / selection). Every other field is arbitrary and is bound through `row` slots.

### HTML + enhancement

The component accepts an existing `<ul>`. It reads config from the `<ul>`'s `data-*` and the datasource from each `<li>`'s `data-*` (priority: JS option > element `data-*`):

```html
<ul id="mylist" data-scroll="true" data-max-items="5" data-empty="No items.">
  <li data-value="1" data-text="Ana Perez" data-email="ana@company.com"></li>
  <li data-value="2" data-text="Luis Soto" data-email="luis@company.com"></li>
</ul>
```

```js
new MTS.ItemList('#mylist', { row: { primary: 'text', secondary: 'email' } });
```

Per-`<li>` `data-*` values are auto-typed: numeric strings become numbers, `true` / `false` become booleans. Only `<li>` elements carrying a `data-value` are added to the datasource.

---

## Options

Every option below has an equivalent `data-*` attribute on the host `<ul>` (kebab-case, e.g. `maxItems` → `data-max-items`). The JS option always wins over the attribute.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `datasource` | `array` | `[]` (or read from `<li>` `data-*`) | Array of objects. Each item needs at least `value` |
| `row` | `object` | `{}` | Slot declaration (see Row) |
| `scroll` | `boolean` | `false` | Enables the scroll container on the `<ul>` |
| `maxItems` | `number` | `null` | Scroll only when there are more than N items (requires `scroll: true`); also caps the visible height to N rows |
| `selectable` | `boolean` | `false` | Clickable items, highlights the active one, toggles off on re-click |
| `canRemove` | `boolean` | `false` | Adds an automatic `×` remove button to each item |
| `allowDuplicates` | `boolean` | `false` | If `false`, `addItem()` ignores an item whose `value` already exists |
| `disabledBind` | `string` | `null` | Item field that marks the row disabled when truthy (no click / no remove) |
| `empty` | `string` | localized | Message shown when the datasource is empty. Omit to use the built-in localized string |
| `onAdd` | `function` | — | Item added — `{ item, index, el }` |
| `onChange` | `function` | — | Inline control changed — `{ item, control, value, el }` |
| `onRemove` | `function` | — | Item removed — `{ item, value, index, el }` |
| `onAction` | `function` | — | Custom-`action` button clicked — `{ item, action, el }` |
| `onSelect` | `function` | — | Item selected/deselected — `{ item, el }` (`item` is `null` on deselect) |

Callbacks receive an event-shaped argument: the payload lives on `ev.detail` (e.g. `onSelect: function (ev) { ev.detail.item }`).

### Row — slots

```js
row: {
  leading:   { type: 'initials|avatar|icon', bind, value },
  primary:   'fieldName',
  secondary: 'fieldName',
  trailing:  { type: 'icon', bind, value },
  controls:  [ /* ... */ ]
}
```

- **leading** — `'initials'` (circle with initials), `'avatar'` (`<img>` with automatic initials fallback on load error), or `'icon'`.
- **trailing** — `'icon'` only.
- **primary / secondary** — the name of the item field whose value is rendered as the row's main / sub text.
- For `leading` / `trailing`, `bind` reads the value from an item field; `value` is a static value. For `'avatar'`, `bind`/`value` is the image URL; for `'initials'`, the text to derive initials from; for `'icon'`, an icon name from `MTS.Icon` (see `MTS.Icon.list()`).
- **controls** — an array of control descriptors:
  - `{ type: 'select', bind, options: [ { value, label } ] }` — writes the chosen value back onto the item and fires `change`.
  - `{ type: 'badge', bind, variant, variantBind }` — only renders when the bound field has a value; `variantBind` reads the variant from an item field, otherwise the static `variant` is used.
  - `{ type: 'button', icon, label, action, tooltip }` — `action: 'remove'` removes the row; any other `action` fires `onAction` / the `action` event.

Every datasource field is mirrored as a `data-*` attribute on the `<li>`, so any value can be read straight from the DOM.

---

## API

`new MTS.ItemList(el | selector, options)` — `el` may be a DOM element or a CSS selector string. If the element is not found, the constructor is a no-op. The instance is also stored on the element as `_mtsInstance`.

| Method | Description |
|--------|-------------|
| `addItem(item)` | Append an item (respects `allowDuplicates`), re-render, fire `add`. Returns `this` |
| `removeItem(value)` | Remove the item with this `value`, re-render, fire `remove`. Returns `this` |
| `updateItem(value, patch)` | Shallow-merge `patch` into the matching item and re-render. Returns `this` |
| `findItem(value)` | Return the item object with this `value`, or `null` |
| `getDatasource()` | Return a shallow copy of the current datasource array |
| `setDatasource(arr)` | Replace the whole datasource, clear selection, re-render. Returns `this` |
| `getSelected()` | Return `{ item, el }` for the selected row, or `null` (requires `selectable: true`) |
| `clearSelection()` | Deselect the current row. Returns `this` |
| `destroy()` | Empty the rendered DOM |

---

## Events

Events bubble on the host element and mirror the option callbacks. The payload is on `event.detail`.

| DOM event | Payload |
|-----------|---------|
| `mts:itemlist:add` | `{ item, index, el }` |
| `mts:itemlist:change` | `{ item, control, value, el }` |
| `mts:itemlist:remove` | `{ item, value, index, el }` |
| `mts:itemlist:action` | `{ item, action, el }` |
| `mts:itemlist:select` | `{ item, el }` (`item` is `null` on deselect) |

---

## Internationalization

The component ships two built-in strings under the `MTS.ItemList` namespace: the empty-state message and the remove-button `aria-label`. They are localized for `es` / `en` / `pt` via `matios-ui-itemlist-i18n.js`.

Set the language once at startup:

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'
```

`MTS.getLanguage()` returns the current language. To override the empty-state text for a single instance, pass the `empty` option (or the `data-empty` attribute); a dev-supplied `empty` always wins over the localized default.

All user-facing text you provide (`row` fields, control `label` / `tooltip` / `options`, badges) is your own content — the component does not translate it.

---

## Accessibility

- Selectable rows respond to clicks; inline controls (`select` / `button`) are real focusable form controls.
- The remove button exposes a localized `aria-label`.
- Provide meaningful primary/secondary text; the leading icon/avatar is decorative.
