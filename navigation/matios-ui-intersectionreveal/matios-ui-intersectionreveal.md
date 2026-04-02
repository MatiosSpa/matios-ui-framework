# MTS.IntersectionReveal

Anima elementos cuando entran al viewport usando IntersectionObserver. 0 deps, reemplaza AOS/ScrollReveal.

## Uso
```js
// Animar todos los elementos con data-reveal
new MTS.IntersectionReveal('[data-reveal]', {
  animation: 'fade-up',
  duration:   600,
  stagger:    80,  // delay entre cada elemento
})

// Con diferentes animaciones por grupo
new MTS.IntersectionReveal('.cards', { animation:'zoom',      stagger:100 })
new MTS.IntersectionReveal('.title', { animation:'fade-down', duration:800 })
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `animation` | `string` | `'fade-up'` | `'fade'`\|`'fade-up'`\|`'fade-down'`\|`'fade-left'`\|`'fade-right'`\|`'zoom'`\|`'flip'` |
| `duration` | `number` | `600` | ms de la animación |
| `delay` | `number` | `0` | Delay base en ms |
| `stagger` | `number` | `0` | ms de delay entre cada elemento |
| `easing` | `string` | `cubic-bezier(.4,0,.2,1)` | CSS easing |
| `threshold` | `number` | `0.15` | Fracción visible para activar |
| `once` | `boolean` | `true` | Solo animar la primera vez |
| `onReveal` | `function` | `null` | `(element, index) => {}` |

## API
```js
const ir = new MTS.IntersectionReveal('.cards', { animation:'fade-up' })
ir.revealAll() // revelar todo sin animación
ir.destroy()   // desconectar el observer
```
