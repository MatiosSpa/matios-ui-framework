# MTS.SideNav

[EN] Collapsible sidebar navigation with nested submenus, badges, groups, dividers, accordion mode and external collapse button.
[ES] Navegación lateral colapsable con submenús anidados, badges, grupos, divisores, modo acordeón y botón externo de colapso.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-sidenav.css">
<script src="matios-ui-sidenav.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `items` | `array` | `[]` | [EN] Navigation items tree / [ES] Árbol de ítems de navegación |
| `active` | `string` | `''` | [EN] Initially active item ID / [ES] ID del ítem activo inicial |
| `collapsed` | `boolean` | `false` | [EN] Start collapsed (icons only) / [ES] Iniciar colapsado (solo íconos) |
| `collapseBtn` | `string` | — | [EN] External collapse button selector / [ES] Selector del botón externo de colapso |
| `logo` | `string` | `''` | [EN] Logo HTML for the nav header / [ES] HTML del logo en el header |
| `footer` | `string` | `''` | [EN] Footer HTML / [ES] HTML del pie de la nav |
| `accordion` | `boolean` | `true` | [EN] Only one submenu open at a time / [ES] Solo un submenú abierto a la vez |
| `onChange` | `function` | — | [EN] Fires when active item changes / [ES] Se dispara al cambiar el ítem activo |
| `onCollapse` | `function` | — | [EN] Fires when nav collapses or expands / [ES] Se dispara al colapsar o expandir |

### Item schema / Esquema de ítem

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `label` | `string` | [EN] Display text / [ES] Texto visible |
| `icon` | `string` | [EN] Icon HTML / [ES] HTML del ícono |
| `badge` | `string\|number` | [EN] Badge value / [ES] Valor del badge |
| `href` | `string` | [EN] Link URL / [ES] URL del enlace |
| `children` | `array` | [EN] Nested items (submenu) / [ES] Ítems anidados (submenú) |
| `group` | `string` | [EN] Group label above item / [ES] Etiqueta de grupo |
| `divider` | `boolean` | [EN] Renders a separator line / [ES] Renderiza una línea separadora |
| `disabled` | `boolean` | [EN] Disables the item / [ES] Deshabilita el ítem |

---

## Events / Eventos

```js
new MTS.SideNav('#my-nav', {
  items: [...],
  // Fires when active item changes / Se dispara al cambiar el ítem activo
  onChange: (e) => {
    console.log(e.detail.id);   // → 'dashboard'
    console.log(e.detail.item); // → { id, label, href, ... }
  },
  // Fires when nav collapses or expands / Se dispara al colapsar o expandir
  onCollapse: (e) => {
    console.log(e.detail.collapsed); // → true | false
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
const nav = new MTS.SideNav('#sidebar', {
  active:    'dashboard',
  collapsed: false,
  accordion: true,

  // Logo / Logo
  logo: '<img src="logo.svg" alt="Logo">',

  // External collapse button / Botón externo de colapso
  collapseBtn: '#btn-toggle',

  items: [
    // Group label / Etiqueta de grupo
    { group: 'Main' },
    {
      id:    'dashboard',
      label: 'Dashboard',
      icon:  '<svg>...</svg>',
      href:  '/dashboard',
    },
    {
      id:    'analytics',
      label: 'Analytics',
      icon:  '<svg>...</svg>',
      badge: 'NEW',
      href:  '/analytics',
    },
    // Submenu / Submenú
    {
      id:    'products',
      label: 'Products',
      icon:  '<svg>...</svg>',
      children: [
        { id: 'products-list',   label: 'All products', href: '/products' },
        { id: 'products-create', label: 'Add product',  href: '/products/new' },
      ],
    },
    // Divider / Separador
    { divider: true },
    { group: 'Settings' },
    { id: 'settings', label: 'Settings', icon: '<svg>...</svg>', href: '/settings' },
  ],

  onChange:   (e) => console.log('active:', e.detail.id),
  onCollapse: (e) => console.log('collapsed:', e.detail.collapsed),
});
```

---

## API

```js
const nav = new MTS.SideNav('#sidebar', { ... });

// Set active item / Establecer ítem activo
nav.setActive('analytics')

// Collapse / expand / toggle / Colapsar / expandir / alternar
nav.collapse()
nav.expand()
nav.toggleCollapse()

// Replace all items / Reemplazar todos los ítems
nav.setItems([...])

// Update a badge / Actualizar un badge
nav.setBadge('inbox', 12)
nav.setBadge('inbox', null)  // clear / limpiar

// Register / remove listeners / Registrar / eliminar listeners
nav.on('change',   (e) => console.log(e.detail.id))
nav.on('collapse', (e) => console.log(e.detail.collapsed))
nav.off('change',  handler)

// Destroy / Destruir
nav.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.getElementById('sidebar')
  .addEventListener('mts:sidenav:change', (e) => {
    console.log(e.detail.id, e.detail.item);
  });

document.getElementById('sidebar')
  .addEventListener('mts:sidenav:collapse', (e) => {
    console.log(e.detail.collapsed);
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Fully normalized to `.on()` pattern, bilingual docs / [ES] Completamente normalizado al patrón `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release — collapse, submenus, badges, groups / [ES] Versión inicial |
