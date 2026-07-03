# MTS.Dropdown

Dropdown menu with groups, icons, keyboard shortcut hints, dividers, danger items, nested submenus and hover mode.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-dropdown.css">
<script src="matios-ui-dropdown.js"></script>
```

Optional: if `matios-ui-sanitize.js` is loaded, item `icon` HTML is passed through `MTS.Sanitize.html()` before insertion.

---

## Usage

The first argument is the trigger element (a CSS selector string or an `Element`). The menu is appended to `document.body` and positioned relative to the trigger.

```js
// Basic
const dd = new MTS.Dropdown('#btn-actions', {
  items: [
    { id: 'edit', label: 'Edit' },
    { id: 'copy', label: 'Duplicate' },
    { divider: true },
    { id: 'delete', label: 'Delete', disabled: true }
  ],
  onSelect: function (e) { console.log(e.detail.id, e.detail.item); }
});

// With icons and shortcuts
new MTS.Dropdown('#btn-file', {
  items: [
    { id: 'new', label: 'New file', icon: ICON_PLUS, shortcut: '⌘N' },
    { id: 'open', label: 'Open...', icon: ICON_FOLDER, shortcut: '⌘O' },
    { divider: true },
    { id: 'save', label: 'Save', icon: ICON_SAVE, shortcut: '⌘S' }
  ],
  onSelect: function (e) { console.log(e.detail.id); }
});

// With groups
new MTS.Dropdown('#btn-account', {
  items: [
    { group: 'Account' },
    { id: 'profile', label: 'My profile' },
    { id: 'settings', label: 'Settings' },
    { divider: true },
    { group: 'Session' },
    { id: 'logout', label: 'Sign out' }
  ]
});

// Nested submenu + hover trigger
new MTS.Dropdown('#btn-edit', {
  items: [
    { id: 'cut', label: 'Cut', shortcut: '⌘X' },
    { id: 'copy', label: 'Copy', shortcut: '⌘C' },
    { divider: true },
    { id: 'export', label: 'Export as', items: [
      { id: 'pdf', label: 'PDF' },
      { id: 'csv', label: 'CSV' },
      { id: 'xlsx', label: 'Excel (.xlsx)' }
    ]}
  ],
  onSelect: function (e) { console.log(e.detail.id); }
});

new MTS.Dropdown('#btn-hover', {
  trigger: 'hover',
  items: [
    { id: 'a', label: 'Option A' },
    { id: 'b', label: 'Option B' }
  ]
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Menu items (see schema below) |
| `position` | `string` | `'bottom-start'` | `'bottom-start'` \| `'bottom-end'` \| `'top-start'` \| `'top-end'` |
| `trigger` | `string` | `'click'` | `'click'` \| `'hover'` |
| `offset` | `number` | `4` | Gap in px between the trigger and the menu |
| `onSelect` | `function` | — | Fires when an item is selected — receives `{ type, detail: { id, item } }` |
| `onOpen` | `function` | — | Fires when the menu opens — receives `{ type, detail: {} }` |
| `onClose` | `function` | — | Fires when the menu closes — receives `{ type, detail: {} }` |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Identifier reported in `select` payloads |
| `label` | `string` | Display text |
| `icon` | `string` | Icon HTML rendered before the label (optional) |
| `shortcut` | `string` | Keyboard shortcut hint shown at the right (optional) |
| `disabled` | `boolean` | Renders the item as disabled and ignores clicks |
| `danger` | `boolean` | Applies the danger style to the item |
| `divider` | `boolean` | Renders a separator line (item is skipped otherwise) |
| `group` | `string` | Renders a non-clickable group header with this text |
| `items` | `array` | Submenu items (same schema; one level, rendered on hover) |
| `onClick` | `function` | Per-item callback, invoked with the item on select |

Note: `group` and `divider` entries are rendered as headers/separators; any other properties on those entries are ignored. Submenu items support `id`, `label`, `icon`, `disabled` and `onClick`.

---

## API

| Method | Description |
|--------|-------------|
| `open()` | Opens the menu (returns `this`) |
| `close()` | Closes the menu (returns `this`) |
| `toggle()` | Opens if closed, closes if open (returns `this`) |
| `setItems(array)` | Replaces the items and re-renders (returns `this`) |
| `on(event, cb)` | Subscribes to `'select'` \| `'open'` \| `'close'` (returns `this`) |
| `destroy()` | Removes the menu element and detaches the outside-click listener |

```js
const dd = new MTS.Dropdown('#my-btn', { items: [/* … */] });
dd.setItems([{ id: 'new-item', label: 'New item' }]);
dd.on('select', function (e) { console.log(e.detail.id); });
```

---

## Events

Every event is delivered two ways: to the callback registered via the option or `on()`, and as a DOM `CustomEvent` dispatched on the trigger element (bubbles).

| Callback | DOM event | Callback argument | DOM event `detail` |
|----------|-----------|-------------------|--------------------|
| `onSelect` / `on('select')` | `mts:dropdown:select` | `{ type: 'select', detail: { id, item } }` | `{ dropdown, id, item }` |
| `onOpen` / `on('open')` | `mts:dropdown:open` | `{ type: 'open', detail: {} }` | `{ dropdown }` |
| `onClose` / `on('close')` | `mts:dropdown:close` | `{ type: 'close', detail: {} }` | `{ dropdown }` |

```js
// Callback form
new MTS.Dropdown('#btn', {
  items: [/* … */],
  onSelect: function (e) { console.log(e.detail.id, e.detail.item); }
});

// DOM event form
document.addEventListener('mts:dropdown:select', function (e) {
  console.log(e.detail.id, e.detail.item, e.detail.dropdown);
});
```

---

## Accessibility

- The trigger gets `aria-haspopup="true"` and its `aria-expanded` is toggled with the menu.
- The menu uses `role="menu"`; items use `role="menuitem"`; dividers use `role="separator"`.
- On the trigger, `Enter` and `Space` toggle the menu and `Esc` closes it. Clicking outside the trigger or menu closes it.

---

## Internationalization

The component itself renders no built-in UI copy: every visible string (`label`, `group`, `shortcut`) is dev-supplied through `items`, so there is nothing for the component to translate. The `matios-ui-dropdown-i18n.js` file registers the `MTS.Dropdown` namespace only for the demo page texts.

Language is a single global setting for the whole framework:

```js
MTS.setLanguage('en'); // 'es' | 'en' | 'pt' — set once at startup
```

There is no per-instance `locale` option.
