# MTS.ImageGallery

Grid de imágenes con variantes grid/masonry/list, filtros por tags, selección múltiple y lightbox integrado.

## Uso
```js
new MTS.ImageGallery('#el', {
  cols:      3,
  lightbox:  true,
  selectable: true,
  filters:   ['Naturaleza', 'Ciudad', 'Arquitectura'],
  images: [
    { id:'1', src:'photo1.jpg', caption:'Montaña', tags:['Naturaleza'] },
    { id:'2', src:'photo2.jpg', caption:'Skyline',  tags:['Ciudad'] },
  ],
  onSelect: ({ selected }) => console.log(selected.length, 'seleccionadas'),
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `images` | `Array` | `[]` | Array de imágenes |
| `variant` | `string` | `'grid'` | `'grid'`\|`'masonry'`\|`'list'` |
| `cols` | `number` | `3` | Columnas en grid |
| `gap` | `string` | `'8px'` | Espacio entre imágenes |
| `selectable` | `boolean` | `false` | Selección múltiple |
| `lightbox` | `boolean` | `true` | Abre lightbox al click |
| `showCaption` | `boolean` | `true` | Caption en hover |
| `filters` | `Array` | `[]` | Tags para filtrar |
| `onSelect` | `function` | `null` | `({ selected, image }) => {}` |
| `onOpen` | `function` | `null` | `({ image, index }) => {}` |

## Estructura de imagen
```js
{ id, src, thumb?, alt?, caption?, tags?[] }
```

## API
```js
const gallery = new MTS.ImageGallery('#el', { images:[...] })
gallery.setImages([...])
gallery.getSelected()          // → [{ id, src, ... }]
gallery.clearSelection()
gallery.setFilter('Ciudad')
gallery.clearFilter()
gallery.openLightbox(2)        // abrir lightbox en índice 2
gallery.destroy()
```
