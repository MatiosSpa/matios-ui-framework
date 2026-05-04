# MTS.Tabs

🇬🇧 Tab component with underline, pill and card variants, horizontal and vertical layout, lazy rendering, icons and badges.
🇪🇸 Componente de pestañas con variantes underline, pill y card, layout horizontal y vertical, renderizado lazy, íconos y badges.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tabs.css">
<script src="matios-ui-tabs.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `tabs` | `array` | `[]` | 🇬🇧 Tab items (see below) / 🇪🇸 Ítems de pestañas |
| `active` | `string` | first tab | 🇬🇧 Initially active tab ID / 🇪🇸 ID de la pestaña activa inicial |
| `variant` | `string` | `'underline'` | `'underline'` · `'pill'` · `'card'` · `'bordered'` |
| `direction` | `string` | `'horizontal'` | `'horizontal'` · `'vertical'` |
| `lazy` | `boolean` | `false` | 🇬🇧 Render panel content only when first activated / 🇪🇸 Renderizar panel solo al activarse por primera vez |
| `border` | `boolean` | `true` | 🇬🇧 Show separator border between nav and panels / 🇪🇸 Mostrar borde separador nav/paneles |
| `borderWidth` | `string` | `'2px'` | 🇬🇧 Separator border width / 🇪🇸 Grosor del borde separador |
| `height` | `string` | `'360px'` | 🇬🇧 Panel height: `'auto'` · `'stretch'` · `'200px'` / 🇪🇸 Alto del panel |
| `stretch` | `boolean` | `false` | 🇬🇧 Alias for `height:'stretch'` / 🇪🇸 Alias de `height:'stretch'` |
| `navWidth` | `string` | `null` | 🇬🇧 Nav width in vertical mode (e.g. `'200px'`) / 🇪🇸 Ancho del nav en vertical |
| `panelBorder` | `boolean` | `true` | 🇬🇧 Left border on panel in vertical mode / 🇪🇸 Borde izquierdo en panel vertical |
| `onChange` | `function` | — | 🇬🇧 Fires when active tab changes / 🇪🇸 Se dispara al cambiar la pestaña activa |

### Tab item schema / Esquema de ítem

| Property | Type | 🇬🇧 Description / 🇪🇸 Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | 🇬🇧 Unique identifier / 🇪🇸 Identificador único |
| `label` | `string` | 🇬🇧 Tab label / 🇪🇸 Texto de la pestaña |
| `content` | `string` | 🇬🇧 Panel HTML content / 🇪🇸 Contenido HTML del panel |
| `icon` | `string` | 🇬🇧 Icon HTML (optional) / 🇪🇸 HTML del ícono (opcional) |
| `badge` | `string\|number` | 🇬🇧 Badge text (optional) / 🇪🇸 Texto del badge (opcional) |
| `disabled` | `boolean` | 🇬🇧 Disables the tab / 🇪🇸 Deshabilita la pestaña |

---

## Events / Eventos

```js
new MTS.Tabs('#my-tabs', {
  tabs: [...],
  // Fires when active tab changes / Se dispara al cambiar la pestaña activa
  onChange: (e) => {
    console.log(e.detail.id);  // → 'tab-2'
    console.log(e.detail.tab); // → { id, label, content, ... }
  },
});
```

---

## HTML Usage / Uso HTML

```html
<div id="my-tabs"></div>

<script>
  new MTS.Tabs('#my-tabs', {
    variant: 'underline',
    tabs: [
      { id: 'overview', label: 'Overview',  content: '<p>Overview content</p>' },
      { id: 'details',  label: 'Details',   content: '<p>Details content</p>' },
      { id: 'history',  label: 'History',   content: '<p>History content</p>', disabled: true },
    ],
    onChange: (e) =&gt; console.log(e.detail.id),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Underline (default) / Underline (por defecto)
new MTS.Tabs('#tabs-basic', {
  variant: 'underline',
  tabs: [
    { id: 'a', label: 'Tab A', content: '<p>Content A</p>' },
    { id: 'b', label: 'Tab B', content: '<p>Content B</p>' },
    { id: 'c', label: 'Tab C', content: '<p>Content C</p>' },
  ],
  onChange: (e) => console.log(e.detail.id),
});

// Pill variant / Variante pill
new MTS.Tabs('#tabs-pill', {
  variant: 'pill',
  active:  'b',
  tabs: [...],
});

// Vertical layout / Layout vertical
new MTS.Tabs('#tabs-vertical', {
  variant:   'card',
  direction: 'vertical',
  navWidth:  '180px',
  height:    '300px',
  tabs: [...],
});

// With icons and badges / Con íconos y badges
new MTS.Tabs('#tabs-icons', {
  tabs: [
    { id: 'inbox', label: 'Inbox', badge: 5,     icon: '<svg>...</svg>', content: '...' },
    { id: 'sent',  label: 'Sent',  badge: null,  icon: '<svg>...</svg>', content: '...' },
  ],
});
```

---

## API

```js
const tabs = new MTS.Tabs('#my-tabs', { ... });

// Set active tab programmatically / Activar pestaña programáticamente
tabs.setActive('tab-id')

// Add a tab / Agregar una pestaña
tabs.addTab({ id: 'new', label: 'New Tab', content: '<p>...</p>' })

// Remove a tab / Eliminar una pestaña
tabs.removeTab('tab-id')

// Register event listener / Registrar listener
tabs.on('change', (e) => console.log(e.detail.id))

// Destroy / Destruir
tabs.destroy()
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-tabs')
  .addEventListener('mts:tabs:change', (e) => {
    console.log(e.detail.id);  // → active tab id
  });
```

---
