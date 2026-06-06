# MTS.SideNav

Collapsible sidebar navigation with nested submenus, badges, groups, dividers, accordion mode and an external collapse button.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-sidenav.css">
<script src="matios-ui-sidenav.js"></script>
```

---

## Usage

```js
const nav = new MTS.SideNav('#sidebar', {
  active:      'dashboard',
  collapsed:   false,
  accordion:   true,
  logo:        '<img src="logo.svg" alt="Logo">',
  collapseBtn: '#btn-toggle', // external collapse button
  items: [
    { group: 'Main' },
    { id: 'dashboard', label: 'Dashboard', icon: '<svg>...</svg>', href: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: '<svg>...</svg>', badge: 'NEW', href: '/analytics' },
    { id: 'products', label: 'Products', icon: '<svg>...</svg>', children: [
      { id: 'products-list',   label: 'All products', href: '/products' },
      { id: 'products-create', label: 'Add product',  href: '/products/new' },
    ]},
    { divider: true },
    { group: 'Settings' },
    { id: 'settings', label: 'Settings', icon: '<svg>...</svg>', href: '/settings' },
  ],
  onChange:   function (e) { console.log('active:', e.detail.id); },
  onCollapse: function (e) { console.log('collapsed:', e.detail.collapsed); },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Navigation items tree (see schema below) |
| `active` | `string` | `''` | Initially active item id |
| `collapsed` | `boolean` | `false` | Start collapsed (icons only) |
| `collapseBtn` | `string` | — | External collapse-button selector |
| `logo` | `string` | `''` | Logo HTML for the nav header |
| `footer` | `string` | `''` | Footer HTML |
| `accordion` | `boolean` | `true` | Only one submenu open at a time |
| `onChange` | `function` | — | Fires when the active item changes — `{ id, item }` |
| `onCollapse` | `function` | — | Fires when the nav collapses or expands — `{ collapsed }` |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Display text |
| `icon` | `string` | Icon HTML |
| `badge` | `string \| number` | Badge value |
| `href` | `string` | Link URL |
| `children` | `array` | Nested items (submenu) |
| `group` | `string` | Group label above the item |
| `divider` | `boolean` | Renders a separator line |
| `disabled` | `boolean` | Disables the item |

---

## API

| Method | Description |
|--------|-------------|
| `setActive(id)` | Set the active item |
| `collapse()` / `expand()` / `toggleCollapse()` | Control the collapsed state |
| `setItems(array)` | Replace all items |
| `setBadge(id, value)` | Update (or clear with `null`) a badge |
| `on(event, cb)` / `off(event, cb)` | Listen to `'change'` / `'collapse'` |
| `destroy()` | Destroy the instance |

```js
const nav = new MTS.SideNav('#sidebar', { items: [/* … */] });
nav.setActive('analytics');
nav.setBadge('inbox', 12);
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:sidenav:change` | `{ id, item }` |
| `onCollapse` | `mts:sidenav:collapse` | `{ collapsed }` |

```js
document.getElementById('sidebar')
  .addEventListener('mts:sidenav:change', function (e) { console.log(e.detail.id, e.detail.item); });
```

---

## Accessibility

- Renders as a `nav` landmark; items with `href` are real links, submenus expand/collapse by keyboard.
- When collapsed, items show icons only — keep an accessible name (title/`aria-label`) on each.

---

## Changelog

### Initial
- Collapsible sidebar with nested submenus, badges, groups, dividers, accordion mode, logo/footer slots, external
  collapse button, and `setActive` / `collapse` / `expand` / `setItems` / `setBadge` API.
