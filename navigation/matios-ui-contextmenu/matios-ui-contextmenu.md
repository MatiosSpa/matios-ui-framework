# MTS.ContextMenu

Right-click (and long-press on mobile) context menu with icons, shortcuts, groups, dividers and danger items.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-contextmenu.css">
<script src="matios-ui-sanitize.js"></script>
<script src="matios-ui-contextmenu.js"></script>
```

`matios-ui-sanitize.js` is optional: when present, item `icon` HTML is sanitized before it is
injected. Without it the icon HTML is inserted as-is.

---

## Usage

The first argument is the target element (an element or a CSS selector string), or the literal
string `'document'` for a global (whole-page) context menu. The menu opens on right-click, and on a
500 ms long-press on touch devices (unless `longPress` is disabled).

```js
new MTS.ContextMenu('#ctx-zone-basic', {
  items: [
    { id: 'copy', label: 'Copy' },
    { id: 'cut', label: 'Cut' },
    { id: 'paste', label: 'Paste' },
    { divider: true },
    { id: 'delete', label: 'Delete', danger: true }
  ],
  onSelect: function (e) { console.log('select', e.detail.id); }
});
```

Global context menu with groups, icons and shortcuts:

```js
new MTS.ContextMenu('document', {
  items: [
    { group: 'View' },
    { id: 'refresh', label: 'Refresh', shortcut: 'F5' },
    { divider: true },
    { group: 'Edit' },
    { id: 'select', label: 'Select all', shortcut: '⌘A' }
  ],
  onOpen: function (e) { console.log('opened at', e.detail.x, e.detail.y); },
  onSelect: function (e) { console.log(e.detail.id); }
});
```

If the target selector matches no element, the instance does nothing (no menu is bound).

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Menu items (see schema below) |
| `longPress` | `boolean` | `true` | Enable the 500 ms long-press trigger on touch devices |
| `onOpen` | `function` | — | Fires when the menu opens — receives `{ detail: { x, y, event } }` |
| `onClose` | `function` | — | Fires when the menu closes — receives `{ detail: {} }` |
| `onSelect` | `function` | — | Fires when an item is selected — receives `{ detail: { id, item } }` |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Identifier passed back on `select` |
| `label` | `string` | Display text |
| `icon` | `string` | Icon HTML (sanitized when `MTS.Sanitize` is loaded) |
| `shortcut` | `string` | Keyboard shortcut hint shown at the right |
| `danger` | `boolean` | Applies the red danger style |
| `disabled` | `boolean` | Greys out the item; it does not respond to clicks and emits no `select` |
| `divider` | `boolean` | Renders a separator line (other item properties ignored) |
| `group` | `string` | Renders a non-clickable group label (other item properties ignored) |
| `onClick` | `function` | Per-item click handler, called with the item as argument |

Item labels, groups and shortcuts are developer-supplied text; the component does not localize them.

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `setItems(items)` | `this` | Replace the item list (applies to the next open) |
| `show(x, y)` | `this` | Open the menu at the given viewport coordinates |
| `hide()` | `this` | Close the menu if open |
| `on(event, cb)` | `this` | Register a listener for `'open'` / `'close'` / `'select'` |
| `off(event, cb)` | `this` | Remove a previously registered listener |
| `destroy()` | — | Close the menu and unbind the right-click listener |

```js
const ctx = new MTS.ContextMenu('#ctx-zone-basic', { items: [/* … */] });
ctx.show(100, 200);
ctx.on('select', function (e) { console.log(e.detail.id); });
```

---

## Events

Handlers registered through the constructor options or `on(...)` receive an object shaped
`{ type, detail }`; read the payload from `e.detail`. The same payloads are dispatched as bubbling
DOM `CustomEvent`s on the target element (or `document` for a global menu).

| Option | `on(...)` event | DOM event | `detail` payload |
|--------|-----------------|-----------|------------------|
| `onOpen` | `'open'` | `mts:contextmenu:open` | `{ x, y, event }` |
| `onClose` | `'close'` | `mts:contextmenu:close` | `{}` |
| `onSelect` | `'select'` | `mts:contextmenu:select` | `{ id, item }` |

```js
document.getElementById('ctx-zone-basic')
  .addEventListener('mts:contextmenu:select', function (e) { console.log(e.detail.id, e.detail.item); });
```

---

## i18n

The component renders no chrome text of its own — every visible string (`label`, `group`,
`shortcut`) is supplied by the developer through `items`, so there is nothing for the component to
localize. Set the global language once at startup with `MTS.setLanguage('es' | 'en' | 'pt')`;
supply already-translated `items` yourself.

The `MTS.ContextMenu` locale namespace exists only to hold the strings used by this component's demo
page. There is no per-instance `locale` option.

---

## Accessibility

- Items are activated with the pointer (click / tap). While the menu is open, `Esc` closes it, and a
  click anywhere outside closes it as well.
- `danger` items are styled distinctly so destructive actions read differently from the rest.
- Right-click and long-press are pointer-only gestures, so provide an equivalent keyboard path to the
  same actions elsewhere in your UI.
