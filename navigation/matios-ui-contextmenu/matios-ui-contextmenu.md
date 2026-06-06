# MTS.ContextMenu

Right-click (and long-press on mobile) context menu with icons, shortcuts, groups, dividers and danger items.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-contextmenu.css">
<script src="matios-ui-contextmenu.js"></script>
```

---

## Usage

The first argument is the target element, or `'document'` for a global (whole-page) context menu.

```js
// On a specific element
new MTS.ContextMenu('#my-table', {
  items: [
    { id: 'copy',  label: 'Copy',  shortcut: '⌘C' },
    { id: 'cut',   label: 'Cut',   shortcut: '⌘X' },
    { id: 'paste', label: 'Paste', shortcut: '⌘V' },
    { divider: true },
    { id: 'delete', label: 'Delete', danger: true },
  ],
  onSelect: function (e) { console.log(e.detail.id); },
});

// Global context menu with groups and icons
new MTS.ContextMenu('document', {
  items: [
    { group: 'View' },
    { id: 'refresh', label: 'Refresh', shortcut: 'F5' },
    { divider: true },
    { group: 'Edit' },
    { id: 'select', label: 'Select all', shortcut: '⌘A' },
  ],
  onOpen:   function (e) { console.log('opened at', e.detail.x, e.detail.y); },
  onSelect: function (e) { console.log(e.detail.id); },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Menu items (see schema below) |
| `longPress` | `boolean` | `true` | Enable long-press on mobile |
| `onOpen` | `function` | — | Fires when the menu opens — `{ x, y, event }` |
| `onClose` | `function` | — | Fires when the menu closes |
| `onSelect` | `function` | — | Fires when an item is selected — `{ id, item }` |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Display text |
| `icon` | `string` | Icon HTML |
| `shortcut` | `string` | Keyboard shortcut hint |
| `danger` | `boolean` | Red danger style |
| `disabled` | `boolean` | Disables the item |
| `divider` | `boolean` | Renders a separator line |
| `group` | `string` | Group label |
| `onClick` | `function` | Per-item click handler |

---

## API

| Method | Description |
|--------|-------------|
| `setItems(array)` | Replace the item list |
| `show(x, y)` | Show at a specific position |
| `hide()` | Hide the menu |
| `on(event, cb)` / `off(event, cb)` | Listen to `'select'` / `'open'` / `'close'` |
| `destroy()` | Destroy the instance |

```js
const ctx = new MTS.ContextMenu('#my-zone', { items: [/* … */] });
ctx.show(100, 200);
ctx.on('select', function (e) { console.log(e.detail.id); });
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onOpen` | `mts:contextmenu:open` | `{ x, y, event }` |
| `onClose` | `mts:contextmenu:close` | — |
| `onSelect` | `mts:contextmenu:select` | `{ id, item }` |

```js
document.getElementById('my-zone')
  .addEventListener('mts:contextmenu:select', function (e) { console.log(e.detail.id, e.detail.item); });
```

---

## Accessibility

- Once open, the menu is arrow-navigable, `Enter` activates and `Esc` closes; `danger` items are styled distinctly.
- Provide an equivalent keyboard path to the actions, since right-click/long-press is a pointer gesture.

---

## Changelog

### Initial
- Context menu on an element or `document`, right-click + mobile long-press, icons/shortcuts/groups/dividers and
  danger items, `show(x,y)` / `hide` / `setItems`, and `onOpen` / `onClose` / `onSelect`.
