# matios-ui-drawer

Panel lateral deslizante desde cualquier borde.

## Uso
```js
const drawer = new MTS.Drawer({
  title:    'Filtros',
  position: 'right',    // 'left'|'right'|'top'|'bottom'
  size:     'md',       // 'sm'|'md'|'lg'|'full'
  backdrop: true,
  closable: true,
  static:   false,
  content: `<div class="mts-form-group">...</div>`,
  footer:  `<button class="mts-btn mts-btn--primary">Aplicar</button>`,
  onOpen:  () => console.log('Abierto'),
  onClose: () => console.log('Cerrado'),
})

drawer.show()
drawer.hide()
drawer.toggle()
drawer.setTitle('Nuevo título')
drawer.setContent('<p>Nuevo contenido</p>')
drawer.destroy()
```

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `open`  | `mts:drawer:open` |
| `close` | `mts:drawer:close` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — left, right, top, bottom, sm/md/lg/full |
