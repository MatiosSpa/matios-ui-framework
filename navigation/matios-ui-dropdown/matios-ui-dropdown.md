# MTS.Dropdown

[EN] Dropdown menu with groups, icons, keyboard shortcuts, dividers, submenus (up to 4 levels) and hover mode.
[ES] Menú desplegable con grupos, íconos, atajos de teclado, divisores, submenús (hasta 4 niveles) y modo hover.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-dropdown.css">
<script src="matios-ui-dropdown.js"></script>
```

---

## Options / Opciones

[EN] First argument is the trigger element (button, link, etc.). The dropdown appends itself to `document.body`.
[ES] El primer argumento es el elemento trigger (botón, enlace, etc.). El dropdown se agrega a `document.body`.

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `items` | `array` | `[]` | [EN] Menu items — see schema below / [ES] Ítems del menú |
| `position` | `string` | `'bottom-start'` | `'bottom-start'` · `'bottom-end'` · `'top-start'` · `'top-end'` |
| `trigger` | `string` | `'click'` | `'click'` · `'hover'` |
| `offset` | `number` | `4` | [EN] Gap in px between trigger and menu / [ES] Separación en px |
| `onSelect` | `function` | — | [EN] Fires when an item is selected / [ES] Se dispara al seleccionar un ítem |
| `onOpen` | `function` | — | [EN] Fires when menu opens / [ES] Se dispara al abrir |
| `onClose` | `function` | — | [EN] Fires when menu closes / [ES] Se dispara al cerrar |

### Item schema / Esquema de ítem

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `label` | `string` | [EN] Display text / [ES] Texto visible |
| `icon` | `string` | [EN] Icon HTML (optional) / [ES] HTML del ícono |
| `shortcut` | `string` | [EN] Keyboard shortcut hint (optional) / [ES] Atajo de teclado (opcional) |
| `disabled` | `boolean` | [EN] Disables the item / [ES] Deshabilita el ítem |
| `divider` | `boolean` | [EN] Renders a separator line / [ES] Renderiza una línea separadora |
| `group` | `string` | [EN] Group label above item / [ES] Label de grupo sobre el ítem |
| `items` | `array` | [EN] Submenu items (recursive) / [ES] Ítems del submenú (recursivo) |

---

## Events / Eventos

```js
new MTS.Dropdown('#my-btn', {
  items: [...],
  // Fires when an item is selected / Se dispara al seleccionar un ítem
  onSelect: (e) => {
    console.log(e.detail.id);   // → 'edit'
    console.log(e.detail.item); // → { id, label, ... }
  },
  // Fires when menu opens / Se dispara al abrir
  onOpen:  () => console.log('opened'),
  // Fires when menu closes / Se dispara al cerrar
  onClose: () => console.log('closed'),
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
const dd = new MTS.Dropdown('#btn-actions', {
  items: [
    { id: 'edit',   label: 'Edit' },
    { id: 'copy',   label: 'Copy' },
    { divider: true },
    { id: 'delete', label: 'Delete', disabled: true },
  ],
  onSelect: (e) => console.log(e.detail.id),
});

// With icons and shortcuts / Con íconos y atajos
new MTS.Dropdown('#btn-file', {
  items: [
    { id: 'new',    label: 'New file',    icon: ICON_NEW,  shortcut: '⌘N' },
    { id: 'open',   label: 'Open...',     icon: ICON_OPEN, shortcut: '⌘O' },
    { id: 'save',   label: 'Save',        icon: ICON_SAVE, shortcut: '⌘S' },
    { divider: true },
    { id: 'export', label: 'Export as', items: [
      { id: 'pdf',  label: 'PDF' },
      { id: 'csv',  label: 'CSV' },
      { id: 'xlsx', label: 'Excel' },
    ]},
  ],
});

// With groups / Con grupos
new MTS.Dropdown('#btn-user', {
  items: [
    { group: 'Account' },
    { id: 'profile',  label: 'My profile' },
    { id: 'settings', label: 'Settings' },
    { divider: true },
    { group: 'Session' },
    { id: 'logout',   label: 'Sign out' },
  ],
});

// Hover trigger / Trigger hover
new MTS.Dropdown('#btn-hover', {
  trigger: 'hover',
  items:   [...],
});
```

---

## API

```js
const dd = new MTS.Dropdown('#my-btn', { ... });

// Open / close / toggle / Abrir / cerrar / alternar
dd.open()
dd.close()
dd.toggle()

// Replace items at runtime / Reemplazar ítems en runtime
dd.setItems([
  { id: 'new-item', label: 'New item' },
])

// Register event listener / Registrar listener
dd.on('select', (e) => console.log(e.detail.id))

// Destroy / Destruir
dd.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.addEventListener('mts:dropdown:select', (e) => {
  console.log(e.detail.id, e.detail.item);
});
document.addEventListener('mts:dropdown:open',   () => {});
document.addEventListener('mts:dropdown:close',  () => {});
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 1.0.0 | [EN] Initial release — groups, icons, shortcuts, submenus, hover / [ES] Versión inicial |
