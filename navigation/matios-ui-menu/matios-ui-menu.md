# MTS.Menu

Shared navigation model used by `MTS.Topbar` (horizontal mode) and `MTS.SideNav` (tree mode). You define the item tree once and hand the instance to a host component, which renders it; the same instance can be mounted in several hosts at the same time and stays in sync.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-menu.css">
<script src="matios-ui-menu.js"></script>
```

---

## Usage

```js
const menu = new MTS.Menu({
  active:  'dashboard',
  trigger: 'click', // horizontal mode only: 'click' | 'hover'
  items: [
    { key: 'dashboard', label: 'Dashboard', icon: '<svg>...</svg>', href: '/dashboard' },
    { key: 'reports',   label: 'Reports',   badge: 3, children: [
      { key: 'reports-sales', label: 'Sales',     href: '/reports/sales' },
      { key: 'reports-stock', label: 'Inventory', href: '/reports/stock' },
    ]},
    { divider: true },
    { key: 'settings', label: 'Settings', href: '/settings', disabled: true },
  ],
  onClick: function (item) { router.push(item.href); }, // receives the full item, incl. any extra props
});

// Hand the same instance to a host component
new MTS.Topbar('#topbar', { menu: menu });
new MTS.SideNav('#sidebar', { menu: menu });
```

> The active item can be auto-detected from `href` against the current URL when `active` is omitted; nested actives
> auto-open their ancestors.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Navigation item tree (see schema below) |
| `active` | `string` | auto | Key of the initially active item (auto-detected from `href` if omitted) |
| `trigger` | `string` | `'click'` | Horizontal mode only — `'click'` · `'hover'` |
| `overflow` | `string` | `'none'` | Horizontal mode only — `'auto'` enables Priority+ Navigation: items that don't fit collapse into a "More" dropdown, recalculated on container resize (`ResizeObserver`). The host container must be width-bounded (`flex:1; min-width:0`). |
| `overflowLabel` | `string` | i18n `more` | Label for the overflow trigger (defaults to the localized "More" / "Más" / "Mais") |
| `overflowIcon` | `string` | — | Optional `mts-icon` class for the overflow trigger |
| `onClick` | `function` | — | `function(item)` — receives the full item, including any extra props |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Unique identifier |
| `label` | `string` | Display text |
| `icon` | `string` | Icon HTML (optional) |
| `badge` | `string \| number` | Badge value (optional) |
| `href` | `string` | Link URL (optional) |
| `children` | `array` | Nested items (submenu) |
| `disabled` | `boolean` | Disables the item |
| `divider` | `boolean` | Renders a separator |
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
| `disable(key)` / `enable(key)` | Toggle an item's disabled state (chainable) |
| `destroy()` | Unmount from every host and clean up |

```js
const menu = new MTS.Menu({ items: [/* … */] });
menu.setActive('reports-sales');
menu.setBadge('reports', 5);
menu.getItems();   // → [{ key, label, children? }, …] (copy)
```

---

## Events

Navigation is reported through the `onClick(item)` callback. Host components (`MTS.Topbar` / `MTS.SideNav`) expose
their own DOM events for active-item changes.

---

## Accessibility

- Items with `href` render as links; submenus open by keyboard and `Esc` closes them in horizontal mode.
- A `disabled` item is skipped by keyboard navigation; the active item is exposed as the current state.

---

## Changelog

### 2026-06-29
- Submenu chevron migrated to `MTS.Icon` (`chevron-down`, rotated via CSS); dropped inline SVG. Requires `matios-ui-icons.js`.

### 2026-06-23
- `getItems()` — read back the top-level items as a shallow copy (collection-API symmetry across the framework).

### Initial
- Shared navigation model for `MTS.Topbar` and `MTS.SideNav`: item tree with keys/icons/badges/href/children,
  multi-host mounting kept in sync, auto-active detection, and `setItems` / `setActive` / `setBadge` / `disable` / `enable`.
