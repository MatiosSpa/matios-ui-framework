# MTS.Breadcrumb

[EN] Navigation breadcrumb with custom separator, icon support, collapsible overflow and dynamic item management.
[ES] Breadcrumb de navegación con separador personalizado, soporte de íconos, colapso de desbordamiento y gestión dinámica de ítems.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-breadcrumb.css">
<script src="matios-ui-breadcrumb.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `items` | `array` | `[]` | [EN] Breadcrumb items (see below) / [ES] Ítems del breadcrumb |
| `separator` | `string` | `'/'` | [EN] Separator HTML between items / [ES] HTML del separador entre ítems |
| `maxItems` | `number` | `null` | [EN] Collapse if items exceed this count / [ES] Colapsar si los ítems superan este número |
| `onClick` | `function` | — | [EN] Fires when an item is clicked / [ES] Se dispara al hacer click en un ítem |

### Item schema / Esquema de ítem

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `label` | `string` | [EN] Display text / [ES] Texto visible |
| `href` | `string` | [EN] Link URL (optional) / [ES] URL del enlace (opcional) |
| `onClick` | `function` | [EN] Click handler (optional) / [ES] Handler de click (opcional) |
| `icon` | `string` | [EN] Icon HTML (optional) / [ES] HTML del ícono (opcional) |

---

## Events / Eventos

```js
new MTS.Breadcrumb('#my-breadcrumb', {
  items: [...],
  // Fires when any item is clicked / Se dispara al hacer click en cualquier ítem
  onClick: (e) => {
    console.log(e.detail.item);  // → { label, href, ... }
    console.log(e.detail.index); // → 1
  },
});
```

---

## HTML Usage / Uso HTML

```html
<div id="my-breadcrumb"></div>

<script>
  new MTS.Breadcrumb('#my-breadcrumb', {
    items: [
      { label: 'Home',     href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Laptop',   href: '/products/laptop' },
      { label: 'Model X'  }, // last item — no link / último ítem — sin enlace
    ],
    onClick: (e) =&gt; console.log(e.detail.item.label),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
new MTS.Breadcrumb('#breadcrumb-basic', {
  items: [
    { label: 'Home',     href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Detail' },
  ],
  // Fires on item click / Se dispara al hacer click en un ítem
  onClick: (e) => {
    e.detail.item.href && router.push(e.detail.item.href);
  },
});

// Custom separator / Separador personalizado
new MTS.Breadcrumb('#breadcrumb-sep', {
  separator: '›',
  items: [...],
});

// With icons / Con íconos
new MTS.Breadcrumb('#breadcrumb-icons', {
  items: [
    { label: 'Home',     icon: '<svg>...</svg>', href: '/' },
    { label: 'Settings', icon: '<svg>...</svg>', href: '/settings' },
    { label: 'Profile' },
  ],
});

// Collapsible overflow / Colapso de desbordamiento
new MTS.Breadcrumb('#breadcrumb-collapse', {
  maxItems: 4,   // shows first + ... + last 3 / muestra primero + ... + últimos 3
  items: [
    { label: 'Home' },
    { label: 'Level 1' },
    { label: 'Level 2' },
    { label: 'Level 3' },
    { label: 'Level 4' },
    { label: 'Current' },
  ],
});
```

---

## API

```js
const bc = new MTS.Breadcrumb('#my-breadcrumb', { ... });

// Replace all items / Reemplazar todos los ítems
bc.setItems([
  { label: 'Home', href: '/' },
  { label: 'New page' },
])

// Add an item at the end / Agregar un ítem al final
bc.push({ label: 'Sub-page', href: '/sub' })

// Remove the last item / Eliminar el último ítem
bc.pop()

// Register event listener / Registrar listener
bc.on('click', (e) => console.log(e.detail.item))

// Destroy / Destruir
bc.destroy()
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-breadcrumb')
  .addEventListener('mts:breadcrumb:click', (e) => {
    console.log(e.detail.item);  // → { label, href, ... }
    console.log(e.detail.index); // → number
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 1.0.0 | [EN] Initial release — separators, icons, collapse, dynamic items / [ES] Versión inicial |
