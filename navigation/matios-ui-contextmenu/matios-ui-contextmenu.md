# MTS.ContextMenu

Menú contextual activado con click derecho o long press (móvil). Misma estructura de items que MTS.Dropdown.

## Uso
```js
// En un elemento específico
new MTS.ContextMenu('#mi-tabla', {
  items: [
    { label:'Ver detalle',  icon: MTS.Icon.get('eye'),    onClick: (item) => {} },
    { label:'Editar',       icon: MTS.Icon.get('edit-2'), onClick: (item) => {} },
    { divider: true },
    { label:'Eliminar',     icon: MTS.Icon.get('trash'),  danger: true, onClick: (item) => {} },
  ],
  onSelect: (e) => console.log('seleccionado:', e.item.label),
})

// Global — en todo el documento
new MTS.ContextMenu('document', { items: [...] })
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `items` | `Array` | `[]` | Items del menú |
| `longPress` | `boolean` | `true` | Activar con long press en móvil |
| `onOpen` | `function` | `null` | `({ x, y, event }) => {}` |
| `onClose` | `function` | `null` | |
| `onSelect` | `function` | `null` | `({ item }) => {}` |

## Estructura de item
Igual que MTS.Dropdown: `{ label, icon?, shortcut?, divider?, group?, danger?, disabled?, onClick }`.
