# MTS.Tabs

[EN] Tab component with underline, pill and card variants, horizontal and vertical layout, lazy rendering, icons and badges.
[ES] Componente de pestañas con variantes underline, pill y card, layout horizontal y vertical, renderizado lazy, íconos y badges.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tabs.css">
<script src="matios-ui-tabs.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `tabs` | `array` | `[]` | [EN] Tab items (see below) / [ES] Ítems de pestañas |
| `active` | `string` | first tab | [EN] Initially active tab ID / [ES] ID de la pestaña activa inicial |
| `variant` | `string` | `'underline'` | `'underline'` · `'pill'` · `'card'` |
| `direction` | `string` | `'horizontal'` | `'horizontal'` · `'vertical'` |
| `lazy` | `boolean` | `true` | [EN] Render panel content only when first activated / [ES] Renderizar panel solo al activarse por primera vez |
| `border` | `boolean` | `true` | [EN] Show separator border between nav and panels / [ES] Mostrar borde separador nav/paneles |
| `borderWidth` | `string` | `'2px'` | [EN] Separator border width / [ES] Grosor del borde separador |
| `height` | `string` | `'auto'` | [EN] Panel height: `'auto'` · `'stretch'` · `'200px'` / [ES] Alto del panel |
| `stretch` | `boolean` | `false` | [EN] Alias for `height:'stretch'` / [ES] Alias de `height:'stretch'` |
| `navWidth` | `string` | `null` | [EN] Nav width in vertical mode (e.g. `'200px'`) / [ES] Ancho del nav en vertical |
| `panelBorder` | `boolean` | `true` | [EN] Left border on panel in vertical mode / [ES] Borde izquierdo en panel vertical |
| `onChange` | `function` | — | [EN] Fires when active tab changes / [ES] Se dispara al cambiar la pestaña activa |

### Tab item schema / Esquema de ítem

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `label` | `string` | [EN] Tab label / [ES] Texto de la pestaña |
| `content` | `string` | [EN] Panel HTML content / [ES] Contenido HTML del panel |
| `icon` | `string` | [EN] Icon HTML (optional) / [ES] HTML del ícono (opcional) |
| `badge` | `string\|number` | [EN] Badge text (optional) / [ES] Texto del badge (opcional) |
| `disabled` | `boolean` | [EN] Disables the tab / [ES] Deshabilita la pestaña |

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

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 1.0.0 | [EN] Initial release — underline/pill/card, vertical, lazy, icons, badges / [ES] Versión inicial |
