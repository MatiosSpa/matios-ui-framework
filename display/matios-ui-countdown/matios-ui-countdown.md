# MTS.Countdown

Contador regresivo animado con variantes blocks, compact y minimal.

## Uso
```js
new MTS.Countdown('#el', {
  target:     new Date('2026-12-31T23:59:59'),
  variant:    'blocks',
  onComplete: () => console.log('¡Tiempo!'),
  onTick:     ({ days, hours, mins, secs }) => {},
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `target` | `Date\|string\|number` | — | Fecha/hora objetivo (requerido) |
| `variant` | `string` | `'blocks'` | `'blocks'`\|`'compact'`\|`'minimal'` |
| `showDays/Hours/Mins/Secs` | `boolean` | `true` | Mostrar cada unidad |
| `labels` | `object` | español | `{ days, hours, mins, secs }` |
| `separator` | `string` | `':'` | Solo en compact/minimal |
| `onTick` | `function` | `null` | Cada segundo |
| `onComplete` | `function` | `null` | Al llegar a 0 |

## API
```js
const cd = new MTS.Countdown('#el', { target: '2026-12-31' })
cd.pause()
cd.resume()
cd.setTarget(new Date('2027-01-01'))
cd.destroy()
```
