# MTS.SortableList

Drag-and-drop sortable list with numbered items, move buttons, icons, avatars, badges and a read-only mode.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-sortablelist.css">
<script src="matios-ui-sortablelist.js"></script>
```

---

## Usage

```js
// Basic sortable
const list = new MTS.SortableList('#my-list', {
  variant:     'default',
  numbered:    true,
  showHandle:  true,
  moveButtons: true,
  items: [
    { id: '1', title: 'Design review',  description: 'Ana García',    badge: { label: 'Pending',     variant: 'warning' } },
    { id: '2', title: 'Backend API',    description: 'Pedro López',   badge: { label: 'In progress', variant: 'primary' } },
    { id: '3', title: 'QA testing',     description: 'Laura Sánchez', disabled: true },
    { id: '4', title: 'Deploy to prod', description: 'Carlos Ruiz',   badge: { label: 'Blocked',     variant: 'danger' } },
  ],
  onReorder:   function (e) { saveOrder(e.detail.items); },
  onItemClick: function (e) { openDetail(e.detail.item); },
});

// With icons and metadata
new MTS.SortableList('#my-list', {
  variant: 'compact',
  items: [
    { id: '1', title: 'Critical bug',    icon: '🔴', meta: 'P1 · 2h' },
    { id: '2', title: 'Feature request', icon: '🟡', meta: 'P2 · 4h' },
    { id: '3', title: 'Documentation',   icon: '🟢', meta: 'P3 · 1h' },
  ],
});

// Read-only (locked)
new MTS.SortableList('#my-list', { locked: true, items: [/* … */] });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Item list (see schema below) |
| `variant` | `string` | `'default'` | `'default'` · `'flush'` · `'compact'` |
| `numbered` | `boolean` | `false` | Show order numbers |
| `showHandle` | `boolean` | `true` | Show the drag handle |
| `locked` | `boolean` | `false` | Read-only — no drag |
| `moveButtons` | `boolean` | `false` | Show ↑ ↓ move buttons |
| `onReorder` | `function` | — | Fires on reorder — `({ items, fromIndex, toIndex })` |
| `onItemClick` | `function` | — | Fires on item click — `({ item, index })` |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Item title |
| `description` | `string` | Subtitle text |
| `meta` | `string` | Right-side metadata |
| `icon` | `string` | SVG icon HTML |
| `avatar` | `string` | Avatar initials |
| `badge` | `object` | `{ label, variant }` |
| `disabled` | `boolean` | Disable drag for this item |

---

## API

| Method | Description |
|--------|-------------|
| `getItems()` | Get the current order |
| `setItems(array)` | Replace all items |
| `addItem(item[, index])` | Add an item (optionally at an index) |
| `removeItem(id)` | Remove an item by id |
| `updateItem(id, patch)` | Update an item |
| `lock()` / `unlock()` | Toggle read-only mode |
| `on(event, cb)` / `off(event, cb)` | Register / remove listeners (`'reorder'`, `'itemClick'`) |

```js
const list = new MTS.SortableList('#my-list', { items: [/* … */] });
list.addItem({ id: 'top', title: 'At top' }, 0);
list.updateItem('1', { title: 'Updated title' });
list.on('reorder', function (e) { console.log(e.detail.items); });
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onReorder(fn)` / `on('reorder', fn)` | `{ items, fromIndex, toIndex }` | Items are reordered |
| `onItemClick(fn)` / `on('itemClick', fn)` | `{ item, index }` | An item is clicked |

Also dispatched as DOM events:

```js
el.addEventListener('mts:sortable:reorder',   function (e) { console.log(e.detail); });
el.addEventListener('mts:sortable:itemclick', function (e) { console.log(e.detail); });
```

---

## Accessibility

- Move buttons (`moveButtons`) provide a keyboard-operable alternative to drag-and-drop — keep them enabled when
  pointer dragging is the only other affordance.
- A `disabled` item or `locked` list is not draggable; reflect that state visually and in any status text.

---

## Changelog

### Initial
- Sortable list with drag-and-drop, numbered items, drag handle, ↑↓ move buttons, icons/avatars/badges, locked
  read-only mode, and full item CRUD (`addItem` / `removeItem` / `updateItem` / `setItems`).
