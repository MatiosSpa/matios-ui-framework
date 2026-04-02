# MTS.Lightbox

Visor de medios con navegación, zoom, miniaturas y soporte de imágenes, video HTML5, YouTube y Vimeo.

## Uso programático
```js
const lb = new MTS.Lightbox([
  { src:'foto1.jpg', caption:'Vista al mar' },
  { src:'foto2.jpg', caption:'Atardecer' },
  { src:'https://youtube.com/watch?v=xxx', type:'youtube', caption:'Demo' },
])
lb.open(0)
```

## Auto-bind con selector CSS
```html
<a href="foto.jpg" data-lightbox data-caption="Mi foto">
  <img src="thumb.jpg">
</a>
```
```js
new MTS.Lightbox('[data-lightbox]')
// Click en cualquier elemento abre el lightbox automáticamente
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `loop` | `boolean` | `true` | Loop infinito |
| `zoom` | `boolean` | `true` | Click para zoom 2× en imágenes |
| `download` | `boolean` | `false` | Botón de descarga |
| `counter` | `boolean` | `true` | "1 / 5" |
| `thumbnails` | `boolean` | `false` | Tira de miniaturas en el footer |
| `animation` | `string` | `'fade'` | `'fade'`\|`'slide'` |
| `onOpen` | `function` | `null` | `({ item, index }) => {}` |
| `onClose` | `function` | `null` | |
| `onChange` | `function` | `null` | `({ item, index }) => {}` |

## Tipos de media soportados
```js
{ src:'foto.jpg',    type:'image'   }  // default
{ src:'video.mp4',   type:'video'   }  // HTML5 video
{ src:'youtube.com/watch?v=xxx', type:'youtube' }
{ src:'vimeo.com/123456',        type:'vimeo'   }
```

## API
```js
const lb = new MTS.Lightbox([...])
lb.open(0)    // abrir en índice
lb.close()
lb.next()
lb.prev()
lb.goTo(2)
lb.addItems([{ src:'nueva.jpg' }])
lb.destroy()
```

## Teclado
- `←` / `→` — navegar
- `Escape` — cerrar
