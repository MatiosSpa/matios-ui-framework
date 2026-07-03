# MTS.SortableList

Drag-and-drop sortable list with numbered items, move buttons, icons, avatars, badges and a read-only mode.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-sortablelist.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-sortablelist.js"></script>
```

The drag handle is drawn with `MTS.Icon.get('drag-handle')`, so `matios-ui-icons.js` is required whenever `showHandle` is on (the default).

Optional — load `matios-ui-i18n.js` and `matios-ui-sortablelist-i18n.js` before the component to localize the internal handle/move-button titles (see [i18n](#i18n)).

---

## Usage

```js
const list = new MTS.SortableList('#my-list', {
  numbered:    true,
  moveButtons: true,
  items: [
    { id: '1', title: 'Design review', description: 'Ana García',  badge: { label: 'Pending',     variant: 'warning' } },
    { id: '2', title: 'Backend API',   description: 'Pedro López', badge: { label: 'In progress', variant: 'primary' } },
    { id: '3', title: 'QA testing',    description: 'Laura Sánchez', disabled: true }
  ],
  onReorder: function (e) {
    console.log(e.detail.items);
  },
  onItemClick: function (e) {
    console.log(e.detail.item.id);
  }
});

// With icons and metadata
new MTS.SortableList('#my-list', {
  variant: 'compact',
  items: [
    { id: '1', title: 'Critical bug',    icon: MTS.Icon.get('warning', 16),      meta: 'P1 · 2h' },
    { id: '2', title: 'Feature request', icon: MTS.Icon.get('star', 16),         meta: 'P2 · 4h' },
    { id: '3', title: 'Documentation',   icon: MTS.Icon.get('check-circle', 16), meta: 'P3 · 1h' }
  ]
});

// Read-only (locked)
new MTS.SortableList('#my-list', {
  locked: true,
  items: [/* … */]
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Item list (see schema below) |
| `variant` | `string` | `'default'` | `'default'` \| `'flush'` \| `'compact'` |
| `numbered` | `boolean` | `false` | Show order numbers |
| `showHandle` | `boolean` | `true` | Show the drag handle (requires `matios-ui-icons.js`) |
| `locked` | `boolean` | `false` | Read-only — no drag |
| `moveButtons` | `boolean` | `false` | Show ↑ ↓ move buttons |
| `onReorder` | `function` | — | Fires on reorder — `({ items, fromIndex, toIndex, item })` |
| `onItemClick` | `function` | — | Fires on item click — `({ item, index })` |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier (used by `removeItem` and drag `dataTransfer`) |
| `title` | `string` | Item title |
| `description` | `string` | Subtitle text (hidden when `variant: 'compact'`) |
| `meta` | `string` | Right-side metadata |
| `icon` | `string` | Icon HTML (sanitized via `MTS.Sanitize` when available) |
| `avatar` | `string` | Full name — initials are derived (first letter of up to two words) |
| `avatarColor` | `string` | Background color for the avatar badge |
| `badge` | `object` \| `string` | `{ label, variant }`, or a plain string used as the label with the `default` variant |
| `disabled` | `boolean` | Disable drag and move buttons for this item |

`icon` takes precedence over `avatar` when both are set.

---

## API

| Method | Description |
|--------|-------------|
| `getItems()` | Returns a shallow copy of the current ordered items |
| `setItems(array)` | Replace all items and rebuild |
| `addItem(item[, index])` | Add an item; appends when `index` is omitted, otherwise inserts at `index` |
| `removeItem(id)` | Remove the item whose `id` matches |
| `updateItem(id, props)` | Merge `props` into the item with that `id` and rebuild |
| `lock()` | Switch to read-only mode |
| `unlock()` | Leave read-only mode |
| `on(event, cb)` | Register a listener (`'reorder'` \| `'itemClick'`) |
| `off(event, cb)` | Remove a listener |
| `destroy()` | Empty the container |

All mutating methods return `this` for chaining.

```js
const list = new MTS.SortableList('#my-list', { items: [/* … */] });
list.addItem({ id: 'top', title: 'At top' }, 0);
list.updateItem('1', { title: 'Updated title' });
list.on('reorder', function (e) {
  console.log(e.detail.items);
});
```

---

## Events

Emitted both through callbacks / `on(...)` listeners and as bubbling DOM `CustomEvent`s on the container. Callback and DOM listeners receive the same `detail` payload (via `e.detail`).

| Event | Payload | When |
|-------|---------|------|
| `reorder` | `{ items, fromIndex, toIndex, item }` | An item is moved (drag-drop or ↑ ↓ buttons) |
| `itemClick` | `{ item, index }` | An item row is clicked |

- `items` — the full reordered list (shallow copy).
- `fromIndex` / `toIndex` — the item's old and new positions.
- `item` — the moved item (present in `reorder` only).

DOM event names keep the original casing:

```js
el.addEventListener('mts:sortable:reorder', function (e) {
  console.log(e.detail.items, e.detail.fromIndex, e.detail.toIndex);
});
el.addEventListener('mts:sortable:itemClick', function (e) {
  console.log(e.detail.item, e.detail.index);
});
```

---

## i18n

The component's own chrome (drag-handle title and the ↑ ↓ button titles) reads from
`MTS.getString()['MTS.SortableList'].chrome` when `matios-ui-i18n.js` and
`matios-ui-sortablelist-i18n.js` are loaded. Set the active language once at startup with
`MTS.setLanguage('es' | 'en' | 'pt')`; without the i18n files, English fallbacks are used.

| Key | English | Used for |
|-----|---------|----------|
| `handleTitle` | `Drag to reorder` | `title` on the drag handle |
| `moveUp` | `Move up` | `title` on the ↑ button |
| `moveDown` | `Move down` | `title` on the ↓ button |

Item content (`title`, `description`, `meta`, `badge`, …) is supplied by the developer and is never
translated by the component. There is no per-instance `locale` option — language is global.

---

## Accessibility

- Move buttons (`moveButtons`) provide a keyboard-operable alternative to drag-and-drop — keep them enabled when
  pointer dragging is the only other affordance.
- A `disabled` item or `locked` list is not draggable; reflect that state visually and in any status text.
