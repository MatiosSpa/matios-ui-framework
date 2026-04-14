# MTS.SortableList

[EN] Drag-and-drop sortable list with numbered items, move buttons, icons, avatars, badges and read-only mode.
[ES] Lista reordenable con drag & drop, ítems numerados, botones de movimiento, íconos, avatares, badges y modo lectura.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-sortablelist.css">
<script src="matios-ui-sortablelist.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `items` | `array` | `[]` | [EN] Item list (see schema) / [ES] Lista de ítems |
| `variant` | `string` | `'default'` | `'default'` · `'flush'` · `'compact'` |
| `numbered` | `boolean` | `false` | [EN] Show order numbers / [ES] Mostrar números de orden |
| `showHandle` | `boolean` | `true` | [EN] Show drag handle / [ES] Mostrar asa de arrastre |
| `locked` | `boolean` | `false` | [EN] Read-only — no drag / [ES] Modo lectura — sin drag |
| `moveButtons` | `boolean` | `false` | [EN] Show ↑ ↓ move buttons / [ES] Mostrar botones ↑ ↓ |
| `onReorder` | `function` | — | [EN] `({ items, fromIndex, toIndex }) => {}` Fires on reorder / [ES] Se dispara al reordenar |
| `onItemClick` | `function` | — | [EN] `({ item, index }) => {}` Fires on item click / [ES] Se dispara al hacer click |

### Item schema / Esquema de ítem

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `title` | `string` | [EN] Item title / [ES] Título del ítem |
| `description` | `string` | [EN] Subtitle text / [ES] Texto subtítulo |
| `meta` | `string` | [EN] Right-side metadata / [ES] Metadata lado derecho |
| `icon` | `string` | [EN] SVG icon HTML / [ES] HTML del ícono SVG |
| `avatar` | `string` | [EN] Avatar initials / [ES] Iniciales del avatar |
| `badge` | `object` | `{ label, variant }` |
| `disabled` | `boolean` | [EN] Disable drag for this item / [ES] Deshabilitar drag en este ítem |

---

## Events / Eventos

```js
new MTS.SortableList('#my-list', {
  items: [...],
  // Fires when items are reordered / Se dispara al reordenar
  onReorder: (e) => {
    console.log(e.detail.items);     // → new ordered array
    console.log(e.detail.fromIndex); // → 2
    console.log(e.detail.toIndex);   // → 0
  },
  // Fires when an item is clicked / Se dispara al hacer click en un ítem
  onItemClick: (e) => {
    console.log(e.detail.item.id);
    console.log(e.detail.index);
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic sortable / Básico reordenable
const list = new MTS.SortableList('#my-list', {
  variant:     'default',
  numbered:    true,
  showHandle:  true,
  moveButtons: true,
  items: [
    { id: '1', title: 'Design review',   description: 'Ana García',  badge: { label: 'Pending', variant: 'warning' } },
    { id: '2', title: 'Backend API',     description: 'Pedro López',  badge: { label: 'In progress', variant: 'primary' } },
    { id: '3', title: 'QA testing',      description: 'Laura Sánchez', disabled: true },
    { id: '4', title: 'Deploy to prod',  description: 'Carlos Ruiz',  badge: { label: 'Blocked', variant: 'danger' } },
  ],
  onReorder:   (e) => saveOrder(e.detail.items),
  onItemClick: (e) => openDetail(e.detail.item),
});

// With icons and metadata / Con íconos y metadata
new MTS.SortableList('#my-list', {
  variant: 'compact',
  items: [
    { id: '1', title: 'Critical bug',    icon: '🔴', meta: 'P1 · 2h' },
    { id: '2', title: 'Feature request', icon: '🟡', meta: 'P2 · 4h' },
    { id: '3', title: 'Documentation',   icon: '🟢', meta: 'P3 · 1h' },
  ],
  onReorder: (e) => console.log(e.detail.items),
});

// Read-only locked / Solo lectura
new MTS.SortableList('#my-list', {
  locked: true,
  items:  [...],
});
```

---

## API

```js
const list = new MTS.SortableList('#my-list', { items: [...] });

// Get current order / Obtener orden actual
list.getItems()

// Replace all items / Reemplazar todos los ítems
list.setItems([...])

// Add item / Agregar ítem
list.addItem({ id: 'new', title: 'New item' })
list.addItem({ id: 'top', title: 'At top' }, 0)  // at index / en índice

// Remove / update / Eliminar / actualizar
list.removeItem('new')
list.updateItem('1', { title: 'Updated title' })

// Lock / unlock / Bloquear / desbloquear
list.lock()
list.unlock()

// Register listeners / Registrar listeners
list.on('reorder',   (e) => console.log(e.detail.items))
list.on('itemClick', (e) => console.log(e.detail.item))
list.off('reorder',  handler)
```

---

## DOM Events / Eventos DOM

```js
el.addEventListener('mts:sortable:reorder',   (e) => console.log(e.detail));
el.addEventListener('mts:sortable:itemclick', (e) => console.log(e.detail));
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingüe, docs estandarizados |
| 1.0.0 | [EN] Initial release — drag & drop, numbered, move buttons, variants / [ES] Versión inicial |
