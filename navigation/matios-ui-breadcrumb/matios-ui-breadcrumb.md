# MTS.Breadcrumb

Navigation breadcrumb with custom separator, icon support, collapsible overflow and dynamic item management.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-breadcrumb.css">

<!-- Optional: i18n base + component locale (for translated chrome labels) -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-breadcrumb-i18n.js"></script>

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

| Option / listener | DOM event | Payload |
|-------------------|-----------|---------|
| `onClick` / `on('click', cb)` | `mts:breadcrumb:click` | `{ item, index }` |

```js
document.getElementById('my-breadcrumb')
  .addEventListener('mts:breadcrumb:click', function (e) { console.log(e.detail.item, e.detail.index); });
```

---

## Accessibility

- Renders as a `nav` landmark with an `aria-label` (`Breadcrumb`, localized via i18n).
- The last item represents the current page (`aria-current="page"`) and is not a link.
- Items with `href` are real links; keyboard users tab through them.
- Separators carry `aria-hidden="true"`.
- The collapsed overflow is a `button` with an `aria-label` (`Show full path`, localized); activating it expands the full path.

---

## i18n

Chrome labels (the `nav` `aria-label` and the overflow-expand `aria-label`) come from the global language API.
Item labels are always supplied by the developer through `items`.

Load `matios-ui-i18n.js` and `matios-ui-breadcrumb-i18n.js`, then set the language once at startup:

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'
```

Namespace `MTS.Breadcrumb` — chrome keys:

| Key | en | es | pt |
|-----|----|----|----|
| `navLabel` | `Breadcrumb` | `Ruta de navegación` | `Trilha de navegação` |
| `expandLabel` | `Show full path` | `Mostrar ruta completa` | `Mostrar caminho completo` |

Without the i18n scripts the component falls back to the English literals. There is no per-instance
`locale` option; the language is global (`MTS.setLanguage` / `MTS.getLanguage` / `MTS.getString`).
