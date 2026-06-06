# MTS.Dropdown

Dropdown menu with groups, icons, keyboard shortcuts, dividers, submenus (up to 4 levels) and hover mode.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-dropdown.css">
<script src="matios-ui-dropdown.js"></script>
```

---

## Usage

The first argument is the trigger element (button, link, etc.). The dropdown appends itself to `document.body`.

```js
// Basic
const dd = new MTS.Dropdown('#btn-actions', {
  items: [
    { id: 'edit',   label: 'Edit' },
    { id: 'copy',   label: 'Copy' },
    { divider: true },
    { id: 'delete', label: 'Delete', disabled: true },
  ],
  onSelect: function (e) { console.log(e.detail.id); },
});

// With icons, shortcuts and a submenu
new MTS.Dropdown('#btn-file', {
  items: [
    { id: 'new',  label: 'New file', icon: ICON_NEW,  shortcut: '⌘N' },
    { id: 'open', label: 'Open...',  icon: ICON_OPEN, shortcut: '⌘O' },
    { divider: true },
    { id: 'export', label: 'Export as', items: [
      { id: 'pdf', label: 'PDF' }, { id: 'csv', label: 'CSV' }, { id: 'xlsx', label: 'Excel' },
    ]},
  ],
});

// With groups
new MTS.Dropdown('#btn-user', {
  items: [
    { group: 'Account' },
    { id: 'profile', label: 'My profile' },
    { id: 'settings', label: 'Settings' },
    { divider: true },
    { group: 'Session' },
    { id: 'logout', label: 'Sign out' },
  ],
});

// Hover trigger
new MTS.Dropdown('#btn-hover', { trigger: 'hover', items: [/* … */] });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Menu items (see schema below) |
| `position` | `string` | `'bottom-start'` | `'bottom-start'` · `'bottom-end'` · `'top-start'` · `'top-end'` |
| `trigger` | `string` | `'click'` | `'click'` · `'hover'` |
| `offset` | `number` | `4` | Gap in px between trigger and menu |
| `onSelect` | `function` | — | Fires when an item is selected — `{ id, item }` |
| `onOpen` | `function` | — | Fires when the menu opens |
| `onClose` | `function` | — | Fires when the menu closes |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Display text |
| `icon` | `string` | Icon HTML (optional) |
| `shortcut` | `string` | Keyboard shortcut hint (optional) |
| `disabled` | `boolean` | Disables the item |
| `divider` | `boolean` | Renders a separator line |
| `group` | `string` | Group label above the item |
| `items` | `array` | Submenu items (recursive) |

---

## API

| Method | Description |
|--------|-------------|
| `open()` / `close()` / `toggle()` | Control the menu |
| `setItems(array)` | Replace items at runtime |
| `on(event, cb)` | Listen to `'select'` / `'open'` / `'close'` |
| `destroy()` | Destroy the instance |

```js
const dd = new MTS.Dropdown('#my-btn', { items: [/* … */] });
dd.setItems([{ id: 'new-item', label: 'New item' }]);
dd.on('select', function (e) { console.log(e.detail.id); });
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onSelect` | `mts:dropdown:select` | `{ id, item }` |
| `onOpen` | `mts:dropdown:open` | — |
| `onClose` | `mts:dropdown:close` | — |

```js
document.addEventListener('mts:dropdown:select', function (e) { console.log(e.detail.id, e.detail.item); });
```

---

## Accessibility

- The menu opens on `Enter`/`Space`/arrow, items are arrow-navigable, `Esc` closes and returns focus to the trigger.
- A `disabled` item is skipped; submenus open on focus/hover and via the right arrow key.

---

## Changelog

### Initial
- Dropdown with groups, icons, shortcut hints, dividers, recursive submenus (up to 4 levels), click/hover triggers,
  positioning, `onSelect` / `onOpen` / `onClose`, and `open` / `close` / `toggle` / `setItems`.
