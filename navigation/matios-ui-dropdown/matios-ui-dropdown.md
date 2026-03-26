# matios-ui-dropdown

Menú desplegable con grupos, submenús y activación por click o hover.

## Uso
```js
const dd = new MTS.Dropdown('#mi-btn', {
  position: 'bottom-start',  // 'bottom-start'|'bottom-end'|'top-start'|'top-end'
  trigger:  'click',         // 'click'|'hover'
  items: [
    { label: 'Ver',       icon: '<svg>...</svg>', onClick: () => {} },
    { label: 'Editar',    icon: '<svg>...</svg>', shortcut: '⌘E', onClick: () => {} },
    { divider: true },
    { group: 'Acciones peligrosas' },
    { label: 'Eliminar',  icon: '<svg>...</svg>', danger: true, onClick: () => {} },
    // Submenú
    { label: 'Exportar', items: [
      { label: 'CSV',  onClick: () => {} },
      { label: 'XLSX', onClick: () => {} },
    ]},
  ],
  onSelect: (e) => console.log('Seleccionado:', e.detail.item.label),
})

dd.open()
dd.close()
dd.toggle()
dd.setItems([...])
dd.destroy()
```

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `open`   | `mts:dropdown:open` |
| `close`  | `mts:dropdown:close` |
| `select` | `mts:dropdown:select` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — grupos, dividers, submenús, shortcuts, hover/click |
