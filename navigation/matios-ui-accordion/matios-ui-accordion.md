# matios-ui-accordion

Secciones expandibles con animación, múltiple y flush.

## Uso
```js
const acc = new MTS.Accordion('#acc', {
  multiple: false,     // solo uno abierto a la vez
  flush:    false,     // sin bordes laterales
  items: [
    { id: 'a1', title: 'Información básica', content: '<p>...</p>', open: true },
    { id: 'a2', title: 'Configuración',      content: '<p>...</p>' },
    { id: 'a3', title: 'Avanzado',           content: '<p>...</p>', disabled: true },
  ],
  onOpen:  (e) => console.log('Abierto:', e.detail.id),
  onClose: (e) => console.log('Cerrado:', e.detail.id),
})

acc.open('a2')
acc.close('a1')
acc.toggle('a2')
acc.openAll()
acc.closeAll()
acc.isOpen('a1')  // → boolean
```

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `open`  | `mts:accordion:open` |
| `close` | `mts:accordion:close` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial |
