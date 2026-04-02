# MTS.RatingReview

Sistema de reseñas con score promedio, breakdown por estrellas y opción de votación interactiva.

## Uso
```js
new MTS.RatingReview('#el', {
  average:   4.3,
  total:     1248,
  breakdown: { 5:820, 4:280, 3:98, 2:32, 1:18 },
  interactive: true,
  onRate: (stars) => enviarResena(stars),
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `average` | `number` | `0` | Promedio 1-5 |
| `total` | `number` | `0` | Total de reseñas |
| `breakdown` | `object` | `{}` | `{ 5:n, 4:n, 3:n, 2:n, 1:n }` |
| `interactive` | `boolean` | `false` | Permite votar |
| `size` | `string` | `'md'` | `'sm'`\|`'md'`\|`'lg'` |
| `onRate` | `function` | `null` | `(stars) => {}` |

## API
```js
const rr = new MTS.RatingReview('#el', { average:4.3 })
rr.update({ average:4.5, total:1300, breakdown:{...} })
```
