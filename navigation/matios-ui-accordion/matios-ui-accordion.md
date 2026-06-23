# MTS.Accordion

Expandable sections component with single or multiple open panels, flush mode and icons.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-accordion.css">
<script src="matios-ui-accordion.js"></script>
```

---

## Usage

```js
// Single open (default)
new MTS.Accordion('#accordion-basic', {
  items: [
    { id: 'a', title: 'Section A', content: '<p>Content A</p>', open: true },
    { id: 'b', title: 'Section B', content: '<p>Content B</p>' },
    { id: 'c', title: 'Premium', content: '<p>Coming soon.</p>', disabled: true },
  ],
  onOpen:  function (e) { console.log('opened:', e.detail.id); },
  onClose: function (e) { console.log('closed:', e.detail.id); },
});

// Multiple open
new MTS.Accordion('#accordion-multi', { multiple: true, items: [/* … */] });

// Flush — no card border
new MTS.Accordion('#accordion-flush', { flush: true, items: [/* … */] });

// With icons
new MTS.Accordion('#accordion-icons', {
  items: [{ id: 'a', icon: '<svg>...</svg>', title: 'Settings', content: '...' }],
});

// Dynamic items — add / update / remove at runtime (no full rebuild)
const acc = new MTS.Accordion('#builder', { items: [] });
acc.addItem({ id: 'f1', title: 'Field 1', content: fieldEl }, { open: true });
acc.updateItem('f1', { title: 'Name' });   // rename in-place — keeps content/focus
acc.removeItem('f1');                       // out of DOM + state
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Accordion items (see schema below) |
| `multiple` | `boolean` | `false` | Allow multiple panels open simultaneously |
| `flush` | `boolean` | `false` | No card border — flat style |
| `onOpen` | `function` | — | Fires when a panel opens — `{ id }` |
| `onClose` | `function` | — | Fires when a panel closes — `{ id }` |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Panel header text |
| `content` | `string` | Panel HTML content |
| `icon` | `string` | Icon HTML (optional) |
| `open` | `boolean` | Initially open |
| `disabled` | `boolean` | Disables the panel |

---

## API

| Method | Description |
|--------|-------------|
| `open(id)` / `close(id)` / `toggle(id)` | Open / close / toggle a panel by id |
| `openAll()` / `closeAll()` | Open / close all panels |
| `isOpen(id)` | Whether a panel is open |
| `setItemDisabled(id, bool)` | Disable / enable an item at runtime (closes it if it was open) |
| `isDisabled(id)` | Current disabled state |
| `addItem(item[, { open }])` | Append an item at runtime (same shape as `options.items`); mounts only the new node. Duplicate `id` is a no-op. With `{ open: true }` it opens on insert (collapsing others if `multiple` is false). |
| `removeItem(id)` | Remove an item — out of the DOM, the registry and the open set |
| `updateItem(id, patch)` | Update a rendered item in-place (`{ title?, icon?, disabled? }`) without rebuilding its content — keeps focus/state of inner controls |
| `hasItem(id)` | Whether an item with that id exists |
| `getItems()` | Shallow copy of the current items array |
| `on(event, cb)` | Listen to `'open'` / `'close'` |
| `destroy()` | Destroy the instance |

```js
const acc = new MTS.Accordion('#my-accordion', { items: [/* … */] });
acc.open('panel-id');
acc.setItemDisabled('panel-id', true);

// Runtime items — surgical, no full rebuild
acc.addItem({ id: 'x', title: 'New', content: someEl }, { open: true });
acc.updateItem('x', { title: 'Renamed' });
acc.removeItem('x');
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onOpen` | `mts:accordion:open` | `{ id }` |
| `onClose` | `mts:accordion:close` | `{ id }` |

```js
document.getElementById('my-accordion')
  .addEventListener('mts:accordion:open', function (e) { console.log(e.detail.id); });
```

---

## Accessibility

- Headers render as buttons: focusable, toggled with `Enter`/`Space`; a `disabled` item is skipped.
- The panel content is associated with its header so assistive tech announces the expanded/collapsed state.

---

## Changelog

### 2026-06-23
- Dynamic items: `addItem(item[, { open }])`, `removeItem(id)` and `updateItem(id, patch)` — add, remove and update
  items at runtime with surgical DOM (only the affected node), so inner live controls keep their focus and state
  (no full rebuild). Plus `hasItem(id)` and `getItems()`. Brings `MTS.Accordion` in line with the other collection
  components (`MTS.ItemList`, `MTS.Tabs`). Non-breaking.

### 2026-05-21
- `setItemDisabled(id, bool)` — disable/enable an item at runtime without rebuilding the DOM; an open item closes
  automatically when disabled.
- `isDisabled(id)` — returns the current disabled state.
