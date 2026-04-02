# MTS.VirtualList

Lista virtualizada para miles de ítems. Solo renderiza los elementos visibles + un buffer, logrando rendimiento constante sin importar el tamaño del dataset.

## Uso
```js
const vl = new MTS.VirtualList('#el', {
  height:     400,
  itemHeight: 52,
  items:      Array.from({ length: 100000 }, (_, i) => ({ id:i, name:'Item '+i })),
  renderItem: (item, index) => {
    const div = document.createElement('div')
    div.className = 'my-row'
    div.textContent = index + '. ' + item.name
    return div
  },
  onEndReached: ({ total }) => cargarMas(total),
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `items` | `Array` | `[]` | Array de datos |
| `renderItem` | `function` | — | `(item, index) => Element\|string` |
| `itemHeight` | `number` | `48` | Alto fijo de cada ítem en px |
| `height` | `number` | `400` | Alto del contenedor en px |
| `buffer` | `number` | `5` | Ítems extra fuera del viewport |
| `onScroll` | `function` | `null` | `({ scrollTop, firstVisible, lastVisible }) => {}` |
| `onEndReached` | `function` | `null` | Al llegar al final — para infinite scroll |
| `endThreshold` | `number` | `100` | px antes del final para disparar onEndReached |

## API
```js
const vl = new MTS.VirtualList('#el', { items:[...], renderItem:... })
vl.setItems([...])           // reemplazar dataset completo
vl.appendItems([...])        // agregar al final (infinite scroll)
vl.scrollTo(500)             // scroll al ítem 500
vl.scrollToTop()
vl.getVisibleRange()         // → { first, last }
vl.destroy()
```
