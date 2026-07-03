# MTS.Accordion

Expandable sections component with single or multiple open panels, flush mode and icons.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-accordion.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-sanitize.js"></script>
<script src="matios-ui-accordion.js"></script>
```

`matios-ui-icons.js` is required — the header arrow is rendered with `MTS.Icon.get('chevron-down')`.
`matios-ui-sanitize.js` is optional — when present, string `content` and `icon` HTML are sanitized through `MTS.Sanitize.html`.

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
new MTS.Accordion('#accordion-multi', {
  multiple: true,
  items: [/* … */],
});

// Flush — no card border
new MTS.Accordion('#accordion-flush', {
  flush: true,
  items: [/* … */],
});

// With icons
new MTS.Accordion('#accordion-icons', {
  items: [
    { id: 'a', icon: '<svg>...</svg>', title: 'Settings', content: '...' },
  ],
});

// Scrollable body — cap the panel body height in px (enables internal scroll)
new MTS.Accordion('#accordion-scroll', {
  bodyMaxHeight: 200,
  items: [/* … */],
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
| `multiple` | `boolean` | `false` | Allow multiple panels open simultaneously. When `false`, opening a panel collapses the others |
| `flush` | `boolean` | `false` | No card border — flat style |
| `bodyMaxHeight` | `number` | `null` | Max panel body height in px — enables internal vertical scroll for that body |
| `onOpen` | `function` | — | Fires when a panel opens — `{ id, item }` |
| `onClose` | `function` | — | Fires when a panel closes — `{ id, item }` |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Panel header text |
| `content` | `string` \| `Element` \| `function` | Panel content — HTML string, a DOM `Element`, or a function returning an `Element` |
| `icon` | `string` | Icon HTML rendered before the title (optional) |
| `open` | `boolean` | Initially open (optional) |
| `disabled` | `boolean` | Disables the panel — header not clickable (optional) |

---

## API

| Method | Description |
|--------|-------------|
| `open(id)` / `close(id)` / `toggle(id)` | Open / close / toggle a panel by id |
| `openAll()` / `closeAll()` | Open / close all panels |
| `isOpen(id)` | Whether a panel is open |
| `setItemDisabled(id, bool)` | Disable / enable an item at runtime (closes it if it was open) |
| `isDisabled(id)` | Current disabled state |
| `addItem(item[, { open }])` | Append an item at runtime (same shape as `options.items`); mounts only the new node. Duplicate `id` is a no-op. With `{ open: true }` it opens on insert (collapsing others if `multiple` is false) |
| `removeItem(id)` | Remove an item — out of the DOM, the registry and the open set |
| `updateItem(id, patch)` | Update a rendered item in-place (`{ title?, icon?, disabled? }`) without rebuilding its content — keeps focus/state of inner controls |
| `hasItem(id)` | Whether an item with that id exists |
| `getItems()` | Shallow copy of the current items array |
| `on(event, cb)` | Listen to `'open'` / `'close'` |
| `destroy()` | Empty the container element |

All mutating methods return the instance (chainable).

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

Each event fires both the registered callback (`onOpen` / `onClose`, or via `on(...)`) and a bubbling DOM `CustomEvent` on the container element.

| Callback | DOM event | Payload |
|----------|-----------|---------|
| `onOpen` | `mts:accordion:open` | `{ id, item }` |
| `onClose` | `mts:accordion:close` | `{ id, item }` |

`id` is the item id; `item` is the matching entry from `items`.

```js
document.getElementById('my-accordion')
  .addEventListener('mts:accordion:open', function (e) { console.log(e.detail.id); });
```

---

## Accessibility

- Headers render as `<button>` elements: focusable, toggled with `Enter` / `Space`; a `disabled` item is skipped.
- Each header carries `aria-expanded` (boolean, tracks the open state) and `aria-controls` pointing at its body, which has `role="region"` — so assistive tech announces the expanded / collapsed state.

---

## i18n

`MTS.Accordion` has no translatable chrome: the header arrow is an SVG icon and `aria-expanded` is a boolean, not text. Panel `title` and `content` are supplied by you, in whatever language you pass. There is nothing to localize on the component itself, so no per-instance `locale` option exists.

The `MTS.Accordion` i18n namespace registered in `matios-ui-accordion-i18n.js` holds only the strings used by the demo page (es / en / pt); it is not read by the component.
