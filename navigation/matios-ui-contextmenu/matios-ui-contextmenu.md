# MTS.ContextMenu

🇬🇧 Right-click (and long-press on mobile) context menu with icons, shortcuts, groups, dividers and danger items.
🇪🇸 Menú contextual de click derecho (y long-press en móvil) con íconos, shortcuts, grupos, divisores e ítems de peligro.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-contextmenu.css">
<script src="matios-ui-contextmenu.js"></script>
```

---

## Options / Opciones

🇬🇧 First argument is the target element or `'document'` for a global context menu.
🇪🇸 El primer argumento es el elemento objetivo o `'document'` para un menú contextual global.

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `items` | `array` | `[]` | 🇬🇧 Menu items (see schema below) / 🇪🇸 Ítems del menú |
| `longPress` | `boolean` | `true` | 🇬🇧 Enable long-press on mobile / 🇪🇸 Activar long-press en móvil |
| `onOpen` | `function` | — | 🇬🇧 Fires when menu opens: `({ x, y, event }) => {}` / 🇪🇸 Se dispara al abrir |
| `onClose` | `function` | — | 🇬🇧 Fires when menu closes / 🇪🇸 Se dispara al cerrar |
| `onSelect` | `function` | — | 🇬🇧 Fires when item selected: `({ id, item }) => {}` / 🇪🇸 Se dispara al seleccionar |

### Item schema / Esquema de ítem

| Property | Type | 🇬🇧 Description / 🇪🇸 Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | 🇬🇧 Unique identifier / 🇪🇸 Identificador único |
| `label` | `string` | 🇬🇧 Display text / 🇪🇸 Texto visible |
| `icon` | `string` | 🇬🇧 Icon HTML / 🇪🇸 HTML del ícono |
| `shortcut` | `string` | 🇬🇧 Keyboard shortcut hint / 🇪🇸 Atajo de teclado |
| `danger` | `boolean` | 🇬🇧 Red danger style / 🇪🇸 Estilo de peligro rojo |
| `disabled` | `boolean` | 🇬🇧 Disables the item / 🇪🇸 Deshabilita el ítem |
| `divider` | `boolean` | 🇬🇧 Renders a separator line / 🇪🇸 Renderiza una línea separadora |
| `group` | `string` | 🇬🇧 Group label / 🇪🇸 Etiqueta de grupo |
| `onClick` | `function` | 🇬🇧 Per-item click handler / 🇪🇸 Handler de click por ítem |

---

## Events / Eventos

```js
new MTS.ContextMenu('#my-zone', {
  items: [...],
  // Fires when menu opens / Se dispara al abrir el menú
  onOpen: (e) => {
    console.log(e.detail.x, e.detail.y); // → cursor position
  },

  // Fires when menu closes / Se dispara al cerrar el menú
  onClose: (e) => console.log('closed'),

  // Fires when an item is selected / Se dispara al seleccionar un ítem
  onSelect: (e) => {
    console.log(e.detail.id);   // → 'copy'
    console.log(e.detail.item); // → { id, label, ... }
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// On a specific element / En un elemento específico
new MTS.ContextMenu('#my-table', {
  items: [
    { id: 'copy',   label: 'Copy',   shortcut: '⌘C' },
    { id: 'cut',    label: 'Cut',    shortcut: '⌘X' },
    { id: 'paste',  label: 'Paste',  shortcut: '⌘V' },
    { divider: true },
    { id: 'delete', label: 'Delete', danger: true },
  ],
  onSelect: (e) => console.log(e.detail.id),
});

// Global context menu (whole page) / Menú contextual global (toda la página)
new MTS.ContextMenu('document', {
  items: [
    { group: 'View' },
    { id: 'refresh', label: 'Refresh', shortcut: 'F5' },
    { id: 'zoom',    label: 'Zoom in',  shortcut: '⌘+' },
    { divider: true },
    { group: 'Edit' },
    { id: 'select',  label: 'Select all', shortcut: '⌘A' },
  ],
  onSelect: (e) => console.log(e.detail.id),
});

// With icons and groups / Con íconos y grupos
new MTS.ContextMenu('#my-zone', {
  items: [
    { group: 'File' },
    { id: 'open',   label: 'Open',    icon: ICON_FOLDER },
    { id: 'save',   label: 'Save',    icon: ICON_SAVE,   shortcut: '⌘S' },
    { divider: true },
    { id: 'delete', label: 'Delete',  icon: ICON_TRASH,  danger: true },
  ],
  onOpen:   (e) => console.log('opened at', e.detail.x, e.detail.y),
  onClose:  () => console.log('closed'),
  onSelect: (e) => console.log(e.detail.id),
});
```

---

## API

```js
const ctx = new MTS.ContextMenu('#my-zone', { ... });

// Replace item list / Reemplazar lista de ítems
ctx.setItems([...])

// Show at specific position / Mostrar en posición específica
ctx.show(100, 200)

// Hide / Ocultar
ctx.hide()

// Register / remove listeners / Registrar / eliminar listeners
ctx.on('select', (e) => console.log(e.detail.id))
ctx.off('select', handler)

// Destroy / Destruir
ctx.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.getElementById('my-zone')
  .addEventListener('mts:contextmenu:select', (e) => {
    console.log(e.detail.id, e.detail.item);
  });
```

| Event / Evento | DOM Namespace |
|----------------|---------------|
| `onOpen` | `mts:contextmenu:open` |
| `onClose` | `mts:contextmenu:close` |
| `onSelect` | `mts:contextmenu:select` |

---
