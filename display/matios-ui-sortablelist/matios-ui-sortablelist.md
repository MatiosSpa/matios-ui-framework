# MTS.SortableList

Lista reordenable con drag & drop, botones ↑ ↓ y eventos. Ideal para workflows de aprobación, listas de prioridades o cualquier colección ordenable por el usuario.

---

## Instalación

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-sortablelist.css">
<script src="matios-ui-sortablelist.js"></script>
```

---

## Uso básico

```js
new MTS.SortableList('#mi-lista', {
  items: [
    { id:'1', title:'Juan Pérez',    description:'Gerente General',    avatar:'Juan Pérez' },
    { id:'2', title:'María Alarcón', description:'Jefe de Proyecto',   avatar:'María Alarcón' },
    { id:'3', title:'Carlos Ruiz',   description:'Desarrollador Senior',avatar:'Carlos Ruiz' },
  ],
  onReorder: (e) => {
    console.log('Nuevo orden:', e.detail.items.map(i => i.title))
    console.log('Movido de', e.detail.fromIndex, 'a', e.detail.toIndex)
  },
})
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `items` | `Array` | `[]` | Array de items de la lista |
| `variant` | `string` | `'default'` | `'default'` \| `'flush'` \| `'compact'` |
| `numbered` | `boolean` | `false` | Muestra número de orden (1, 2, 3…) |
| `showHandle` | `boolean` | `true` | Muestra el handle de arrastre ⠿ |
| `locked` | `boolean` | `false` | Lista en modo lectura sin drag |
| `moveButtons` | `boolean` | `false` | Muestra botones ↑ ↓ por item |
| `onReorder` | `function` | `null` | Callback al reordenar |
| `onItemClick` | `function` | `null` | Callback al hacer click en un item |

---

## Estructura de un item

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `string` | Identificador único (requerido) |
| `title` | `string` | Título principal (requerido) |
| `description` | `string` | Texto secundario (no aparece en variante `compact`) |
| `meta` | `string` | Texto a la derecha (fecha, número, estado) |
| `icon` | `string` | HTML de ícono SVG |
| `avatar` | `string` | Nombre completo → genera iniciales automáticas |
| `avatarColor` | `string` | Color de fondo del avatar (CSS color) |
| `badge` | `object\|string` | `{ label, variant }` o string directo |
| `disabled` | `boolean` | Item no arrastrable |

---

## API

```js
const list = new MTS.SortableList('#el', { items: [...] })

list.getItems()               // → copia del array actual
list.setItems(newItems)       // reemplaza todos los items
list.addItem(item, index?)    // agrega un item (al final si no se especifica índice)
list.removeItem('id')         // elimina por id
list.updateItem('id', props)  // actualiza propiedades de un item
list.lock()                   // desactiva drag
list.unlock()                 // reactiva drag
list.on('reorder', cb)        // listener de evento
list.off('reorder', cb)       // remover listener
list.destroy()                // limpia el DOM
```

---

## Eventos

### `onReorder` / `mts:sortable:reorder`

Se dispara al soltar un item después de arrastrarlo o al usar los botones ↑ ↓.

```js
list.on('reorder', (e) => {
  console.log(e.detail.items)      // Array completo reordenado
  console.log(e.detail.item)       // Item que se movió
  console.log(e.detail.fromIndex)  // Posición original (0-based)
  console.log(e.detail.toIndex)    // Nueva posición (0-based)
})

// También vía evento DOM
document.addEventListener('mts:sortable:reorder', (e) => {
  console.log(e.detail)
})
```

### `onItemClick` / `mts:sortable:itemClick`

```js
list.on('itemClick', (e) => {
  console.log(e.detail.item)   // Item clickeado
  console.log(e.detail.index)  // Posición actual
})
```

---

## Variantes

```js
// Default — cada item con borde card
new MTS.SortableList('#el', { variant: 'default', items: [...] })

// Flush — solo separadores horizontales
new MTS.SortableList('#el', { variant: 'flush', items: [...] })

// Compact — sin descripción, más denso
new MTS.SortableList('#el', { variant: 'compact', items: [...] })
```

---

## Casos de uso

### Workflow de aprobaciones

```js
new MTS.SortableList('#aprobadores', {
  numbered:    true,
  moveButtons: true,
  items: [
    { id:'1', title:'Juan Pérez',    description:'Gerente General',    avatar:'Juan Pérez',    badge:{ label:'Obligatorio', variant:'danger' }, disabled:true },
    { id:'2', title:'María Alarcón', description:'Jefe de Proyecto',   avatar:'María Alarcón', badge:{ label:'Aprobador',   variant:'primary' } },
    { id:'3', title:'Carlos Ruiz',   description:'Revisor Técnico',    avatar:'Carlos Ruiz',   badge:{ label:'Revisor',     variant:'default' } },
  ],
  onReorder: (e) => guardarOrdenAprobacion(e.detail.items),
})
```

### Lista de prioridades

```js
new MTS.SortableList('#prioridades', {
  numbered: true,
  variant:  'flush',
  items: [
    { id:'p1', title:'Seguridad del sistema',     icon: MTS.Icon.get('shield'),    meta:'Alta' },
    { id:'p2', title:'Rendimiento de la API',      icon: MTS.Icon.get('activity'),  meta:'Media' },
    { id:'p3', title:'Experiencia de usuario',     icon: MTS.Icon.get('heart'),     meta:'Alta' },
  ],
  onReorder: (e) => console.log('Nueva prioridad:', e.detail.items.map(i => i.title)),
})
```

### Orden de columnas de tabla

```js
new MTS.SortableList('#columnas', {
  variant:  'compact',
  showHandle: true,
  items: columns.map(col => ({
    id:    col.key,
    title: col.label,
    badge: col.visible ? { label:'Visible', variant:'success' } : { label:'Oculta', variant:'default' },
  })),
  onReorder: (e) => reordenarColumnas(e.detail.items),
})
```
