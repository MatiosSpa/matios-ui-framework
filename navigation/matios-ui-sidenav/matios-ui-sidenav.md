# MTS.SideNav

Collapsible dashboard-style side navigation. It is a thin shell that renders a brand header, a collapse toggle button, an `MTS.Menu` instance (mounted in `tree` mode) and an optional footer. When collapsed it shows icons only and reveals each item's label in a floating tooltip on hover.

The navigation items, active state, badges and click handling all live in the `MTS.Menu` instance you pass in — `MTS.SideNav` itself only owns the brand, footer and collapsed state.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-icons.css">
<link rel="stylesheet" href="matios-ui-menu.css">
<link rel="stylesheet" href="matios-ui-sidenav.css">

<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-sanitize.js"></script>
<script src="matios-ui-menu.js"></script>
<script src="matios-ui-sidenav-i18n.js"></script>
<script src="matios-ui-sidenav.js"></script>
```

`MTS.Menu` and `MTS.Icon` are required. `MTS.Sanitize` is used to sanitize `brand.logo` and `footer` HTML when present.

---

## Usage

```js
var navMenu = new MTS.Menu({
  items: [
    { group: 'Main' },
    { key: 'dashboard', label: 'Dashboard', icon: 'mts-icon-home' },
    { key: 'analytics', label: 'Analytics', icon: 'mts-icon-bar-chart-2', badge: 'NEW' },
    { key: 'products', label: 'Products', icon: 'mts-icon-package', children: [
      { key: 'all-products', label: 'All products' },
      { key: 'add-product', label: 'Add product' }
    ]},
    { divider: true },
    { group: 'Settings' },
    { key: 'settings', label: 'Settings', icon: 'mts-icon-settings' }
  ],
  active: 'dashboard',
  onClick: function (item) { /* your logic here */ }
});

var nav = new MTS.SideNav('#sidebar', {
  brand: {
    logo: '<!-- logo html -->',
    title: 'MyApp',
    onClick: function () { navMenu.setActive(''); }
  },
  menu: navMenu,
  footer: '<span>Matios UI · v2.0</span>',
  collapsed: false,
  collapseBtn: '#btn-toggle',
  onCollapse: function (e) { console.log('collapsed:', e.detail.collapsed); }
});
```

The first argument is a CSS selector `string` or an `Element`. If it resolves to nothing, the constructor returns without building anything.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `brand` | `object` | `null` | Header block — see brand schema below. When omitted, the nav gets the `mts-sidenav--no-brand` modifier. |
| `menu` | `MTS.Menu` | `null` | An `MTS.Menu` instance. It is mounted inside the nav in `tree` mode. Any value that is not an `MTS.Menu` instance is ignored. |
| `footer` | `string` | `''` | Footer HTML (sanitized via `MTS.Sanitize` when available). |
| `collapsed` | `boolean` | `false` | Start collapsed (icons only). |
| `collapseBtn` | `string` | — | Selector of an external button; clicking it calls `toggleCollapse()`. |
| `onCollapse` | `function` | — | Registered as a listener for the `collapse` event — see Events. |

### Brand schema

| Property | Type | Description |
|----------|------|-------------|
| `logo` | `string` | Logo HTML (sanitized via `MTS.Sanitize` when available). |
| `title` | `string` | Brand title text (rendered as text, not HTML). |
| `onClick` | `function` | Click handler for the whole brand block; the block becomes clickable when set. |

> Navigation items, `active` id, `badge`, `children`, `group`, `divider` and click handling are properties of `MTS.Menu`, not of `MTS.SideNav`. See the `MTS.Menu` documentation for the item schema.

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `collapse()` | `this` | Collapse to icons-only. |
| `expand()` | `this` | Expand to full width. |
| `toggleCollapse()` | `this` | Toggle the collapsed state. |
| `on(event, cb)` | `this` | Register a listener (`'collapse'`). |
| `off(event, cb)` | `this` | Remove a previously registered listener. |
| `destroy()` | `void` | Unmount the menu, remove the tooltip and clear the container. |

```js
var nav = new MTS.SideNav('#sidebar', { menu: navMenu });
nav.collapse();
nav.expand();
nav.toggleCollapse();
```

---

## Events

There is a single event, emitted on collapse and on expand.

| Option | Method | DOM event | Payload |
|--------|--------|-----------|---------|
| `onCollapse` | `on('collapse', cb)` | `mts:sidenav:collapse` | `{ collapsed }` |

The callback receives `{ type: 'collapse', detail: { collapsed } }`. The DOM `CustomEvent` bubbles and carries `{ collapsed }` in `event.detail`.

```js
nav.on('collapse', function (e) {
  console.log('collapsed:', e.detail.collapsed);
});

document.getElementById('sidebar')
  .addEventListener('mts:sidenav:collapse', function (e) {
    console.log('collapsed:', e.detail.collapsed);
  });
```

---

## Accessibility

- The menu is rendered inside a `nav` landmark.
- The collapse toggle button carries a localized `title` and `aria-label` (`Collapse` / `Expand`), read from the active language.
- When collapsed, items show icons only; the hover tooltip surfaces each item's label.

---

## Internationalization

The toggle button's `title` / `aria-label` are read from the active language under the `MTS.SideNav` namespace (keys `collapse` and `expand`), with English fallbacks. Bundled languages: `es`, `en`, `pt`.

Set the language once at startup — there is no per-instance locale option.

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'
```

The nav item labels are not owned by SideNav — they come from the `MTS.Menu` instance you pass via the `menu` option, so localize them there.
