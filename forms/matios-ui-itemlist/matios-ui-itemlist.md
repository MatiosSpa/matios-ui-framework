# MTS.ItemList

Rich list (`<ul>` on steroids). Supports avatar · initials · icon · primary/secondary text · inline controls (select, badge, button) · selection · removal · automatic scroll past an item threshold. Can be initialized from pure JS, from existing HTML, or mixed.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-itemlist.css">
<script src="matios-ui-itemlist.js"></script>
```

---

## Usage

```js
new MTS.ItemList('#host', {
  datasource: [
    { value: 1, text: 'Ana Pérez', email: 'ana@company.com' },
    { value: 2, text: 'Luis Soto', email: 'luis@company.com' },
  ],
  row: {
    leading:   { type: 'initials', bind: 'text' },
    primary:   'text',
    secondary: 'email',
  },
});
```

### HTML + enhancement

The component accepts an existing `<ul>`. It reads config from the `<ul>`'s `data-*` and the datasource from each
`<li>`'s `data-*` (priority: JS option > element `data-*`):

```html
<ul id="mylist" data-scroll="true" data-max-items="5" data-empty="No items.">
  <li data-value="1" data-text="Ana Pérez" data-email="ana@company.com"></li>
  <li data-value="2" data-text="Luis Soto" data-email="luis@company.com"></li>
</ul>
```

```js
new MTS.ItemList('#mylist', { row: { primary: 'text', secondary: 'email' } });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `datasource` | `array` | `[]` | Array of objects. Each item needs at least `value` and `text` |
| `row` | `object` | `{}` | Slot declaration (see Row) |
| `scroll` | `boolean` | `false` | Enables `overflow-y: auto` on the `<ul>` |
| `maxItems` | `number` | `null` | Scroll only when there are more than N items (requires `scroll: true`) |
| `selectable` | `boolean` | `false` | Clickable items, highlights the active one, toggles on re-click |
| `canRemove` | `boolean` | `false` | Adds an automatic `×` button to each item's trailing slot |
| `allowDuplicates` | `boolean` | `false` | If `false`, `addItem()` ignores items with an existing `value` |
| `disabledBind` | `string` | `null` | Item field marking it disabled (`true` → no interaction) |
| `empty` | `string` | localized | Message when the datasource is empty |
| `onAdd` | `function` | — | Item added — `{ item, index, el }` |
| `onChange` | `function` | — | Inline control changed — `{ item, control, value, el }` |
| `onRemove` | `function` | — | Item removed — `{ item, value, index, el }` |
| `onAction` | `function` | — | Custom-`action` button — `{ item, action, el }` |
| `onSelect` | `function` | — | Item selected/deselected — `{ item, el }` (`item` is `null` on deselect) |

### Row — slots

```js
row: {
  leading:   { type: 'initials|avatar|icon', bind?, value? },
  primary:   'fieldName',
  secondary: 'fieldName',
  trailing:  { type: 'icon', bind?, value? },
  controls:  [ /* … */ ],
}
```

- **leading / trailing** — `'initials'` (circle with initials), `'avatar'` (`<img>` with automatic initials fallback),
  `'icon'` (SVG from the internal registry). `bind` reads an item field; `value` is a static value.
- **controls** — array of `{ type: 'select', bind, options }`, `{ type: 'badge', bind, variant, variantBind }`, or
  `{ type: 'button', icon, action, label, tooltip }` (`action: 'remove'` calls `removeItem`; otherwise fires `onAction`).

Every datasource field is mirrored as a `data-*` attribute on the `<li>`, so any value can be read straight from the DOM.

---

## API

| Method | Description |
|--------|-------------|
| `addItem(item)` | Append (respects `allowDuplicates`) |
| `removeItem(value)` | Remove by value |
| `updateItem(value, patch)` | Partial-merge an item and re-render |
| `findItem(value)` | Returns the item object or `null` |
| `getDatasource()` / `setDatasource(arr)` | Get a copy / replace the whole datasource |
| `getSelected()` / `clearSelection()` | Selection helpers (requires `selectable: true`) |
| `destroy()` | Clear the DOM |

---

## Events

| DOM event | Payload |
|-----------|---------|
| `mts:itemlist:add` | `{ item, index, el }` |
| `mts:itemlist:change` | `{ item, control, value, el }` |
| `mts:itemlist:remove` | `{ item, value, index, el }` |
| `mts:itemlist:action` | `{ item, action, el }` |
| `mts:itemlist:select` | `{ item, el }` (`item` is `null` on deselect) |

---

## Accessibility

- Selectable items are keyboard-operable; inline controls (select/button) are real focusable controls.
- Provide meaningful primary/secondary text; the leading icon/avatar is decorative.

---

## Changelog

### 2026-05-28
- Component created. Slots: leading (initials/avatar/icon) · primary · secondary · trailing · controls
  (select/badge/button). `selectable`, `canRemove`, `scroll` + `maxItems`, dynamic `data-*`, HTML enhancement,
  full API, `_mtsInstance` for FormGuard.
