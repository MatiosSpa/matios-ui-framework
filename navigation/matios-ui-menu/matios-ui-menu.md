# MTS.Menu

Shared navigation model used by `MTS.Topbar` (horizontal mode) and `MTS.SideNav` (tree mode). You define the item tree once and hand the instance to a host component, which renders it; the same instance can be mounted in several hosts at the same time and stays in sync.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-icons.css">
<link rel="stylesheet" href="matios-ui-menu.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-menu.js"></script>
```

`matios-ui-icons.js` is required — the submenu chevron is drawn with `MTS.Icon`.

---

## Usage

`MTS.Menu` takes a single `options` object; it does not mount itself. You hand the instance to a host (`MTS.Topbar` and/or `MTS.SideNav`), which renders it.

```js
const menu = new MTS.Menu({
  active:  'dashboard',
  trigger: 'click', // horizontal mode only: 'click' | 'hover'
  items: [
    { key: 'dashboard', label: 'Dashboard', icon: 'mts-icon-home' },
    { key: 'reports',   label: 'Reports',   icon: 'mts-icon-bar-chart-2', badge: 3, children: [
      { key: 'reports-sales', label: 'Sales' },
      { key: 'reports-stock', label: 'Inventory' },
    ]},
    { divider: true },
    { key: 'config', label: 'Config', icon: 'mts-icon-settings' },
  ],
  onClick: function (item) { console.log(item.key); }, // receives the full item, incl. any extra props
});

// Hand the same instance to a host component
new MTS.Topbar('#topbar',  { menu: menu });
new MTS.SideNav('#sidebar', { menu: menu });
```

> The active item can be auto-detected from `href` against the current URL when `active` is omitted; nested actives
> auto-open their ancestors.

---

## Options

Everything is passed in a single `options` object: `new MTS.Menu(options)`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Navigation item tree (see schema below) |
| `active` | `string` | auto | Key of the initially active item (auto-detected from `href` if omitted) |
| `trigger` | `string` | `'click'` | Horizontal mode only — `'click'` \| `'hover'` |
| `overflow` | `string` | `'none'` | Horizontal mode only — `'auto'` enables Priority+ Navigation: items that don't fit collapse into a "More" dropdown, recalculated on container resize (`ResizeObserver`) |
| `overflowLabel` | `string` | i18n `more` | Label for the overflow trigger (defaults to the localized "More" / "Más" / "Mais") |
| `overflowIcon` | `string` | — | Optional `mts-icon` class for the overflow trigger |
| `onClick` | `function` | — | `function(item)` — receives the full item, including any extra props |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Unique identifier |
| `label` | `string` | Display text |
| `icon` | `string` | `mts-icon` class, e.g. `'mts-icon-home'` (optional) |
| `badge` | `string \| number` | Badge value (optional) |
| `href` | `string` | Link URL — only used for auto-active detection against the current path (optional) |
| `children` | `array` | Nested items (submenu) |
| `disabled` | `boolean` | Disables the item |
| `divider` | `boolean` | Renders a separator (no other props needed) |
| `group` | `string` | Tree mode — renders a group-label header. An **empty/whitespace** value (`''`, `' '`) renders **no header** (declarative "group without a visible title") |

Any extra property added to an item is passed through intact to `onClick`.

---

## API

| Method | Description |
|--------|-------------|
| `setItems(items)` | Replace the whole tree and re-render all hosts (chainable) |
| `setActive(key)` | Mark an item active (auto-opens ancestors), re-render (chainable) |
| `getActive()` | Returns the active key |
| `getItems()` | Top-level items as a shallow copy (each may carry `children`) |
| `setBadge(key, value)` | Update an item badge (chainable) |
| `disable(key)` | Disable an item (chainable) |
| `enable(key)` | Enable an item (chainable) |
| `destroy()` | Unmount from every host and clean up |

```js
const menu = new MTS.Menu({ items: [/* … */] });
menu.setActive('reports-sales');
menu.setBadge('reports', 5);
menu.getItems();   // → [{ key, label, children? }, …] (copy)
```

---

## Events

Navigation is reported through the `onClick(item)` callback — it fires when a leaf item is clicked and receives the full item object (including any extra props). There are no separate DOM events on the menu itself; host components (`MTS.Topbar` / `MTS.SideNav`) expose their own.

---

## Accessibility

- Horizontal submenu triggers set `aria-haspopup` and toggle `aria-expanded` as their dropdown opens and closes.
- A `disabled` item renders as a disabled `<button>` and is skipped by interaction.

---

## i18n

Namespace: `MTS.Menu`. Item labels are always dev-supplied (via each item's `label`), so the component itself localizes almost nothing. The only built-in string is the overflow trigger's default label, read from `MTS.getString()['MTS.Menu'].more` (falling back to `"More"`); `overflowLabel` overrides it per instance.

Set the language once, globally, at startup:

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'  — default 'es'
```

The bundle ships all three locales. There is no per-instance `locale` option.
