# MTS.Breadcrumb

Navigation breadcrumb with custom separator, icon support, collapsible overflow and dynamic item management.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-breadcrumb.css">
<script src="matios-ui-breadcrumb.js"></script>
```

---

## Usage

```js
// Basic
new MTS.Breadcrumb('#breadcrumb-basic', {
  items: [
    { label: 'Home',     href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Detail' }, // last item — no link
  ],
  onClick: function (e) { if (e.detail.item.href) router.push(e.detail.item.href); },
});

// Custom separator
new MTS.Breadcrumb('#breadcrumb-sep', { separator: '›', items: [/* … */] });

// With icons
new MTS.Breadcrumb('#breadcrumb-icons', {
  items: [{ label: 'Home', icon: '<svg>...</svg>', href: '/' }, { label: 'Profile' }],
});

// Collapsible overflow (shows first + … + last items)
new MTS.Breadcrumb('#breadcrumb-collapse', {
  maxItems: 4,
  items: [{ label: 'Home' }, { label: 'L1' }, { label: 'L2' }, { label: 'L3' }, { label: 'L4' }, { label: 'Current' }],
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Breadcrumb items (see schema below) |
| `separator` | `string` | `'/'` | Separator HTML between items |
| `maxItems` | `number` | `null` | Collapse when items exceed this count |
| `onClick` | `function` | — | Fires when an item is clicked — `{ item, index }` |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display text |
| `href` | `string` | Link URL (optional) |
| `onClick` | `function` | Per-item click handler (optional) |
| `icon` | `string` | Icon HTML (optional) |

---

## API

| Method | Description |
|--------|-------------|
| `setItems(array)` | Replace all items |
| `push(item)` | Add an item at the end |
| `pop()` | Remove the last item |
| `on(event, cb)` | Listen to `'click'` |
| `destroy()` | Destroy the instance |

```js
const bc = new MTS.Breadcrumb('#my-breadcrumb', { items: [/* … */] });
bc.push({ label: 'Sub-page', href: '/sub' });
bc.on('click', function (e) { console.log(e.detail.item); });
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onClick` | `mts:breadcrumb:click` | `{ item, index }` |

```js
document.getElementById('my-breadcrumb')
  .addEventListener('mts:breadcrumb:click', function (e) { console.log(e.detail.item, e.detail.index); });
```

---

## Accessibility

- Renders as a `nav` landmark; the last item represents the current page and is not a link.
- Items with `href` are real links; keyboard users tab through them and the collapsed overflow expands on activation.

---

## Changelog

### Initial
- Breadcrumb with custom separator, per-item icon/href/handler, collapsible overflow (`maxItems`), click event,
  and dynamic `setItems` / `push` / `pop`.
