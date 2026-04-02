# MTS.Skeleton

Placeholder animado que simula contenido cargando. Disponible en variantes text, circle, rect, card, list y table.

## Uso

```js
new MTS.Skeleton('#el', { variant: 'list', items: 4, animation: 'wave' })
```

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `variant` | `string` | `'text'` | `'text'` \| `'circle'` \| `'rect'` \| `'card'` \| `'list'` \| `'table'` |
| `lines` | `number` | `3` | Líneas para variante `text` |
| `rows` | `number` | `4` | Filas para variante `table` |
| `cols` | `number` | `4` | Columnas para variante `table` |
| `items` | `number` | `3` | Items para variante `list` |
| `width` | `string` | `'100%'` | Ancho CSS |
| `height` | `string` | `null` | Alto CSS |
| `animation` | `string` | `'pulse'` | `'pulse'` \| `'wave'` \| `'none'` |

## API

```js
const sk = new MTS.Skeleton('#el', { variant: 'card' })
sk.show()
sk.hide()
sk.destroy()
```
