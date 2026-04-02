# MTS.StepProgress

Indicador de progreso de pasos tipo checkout o wizard. Diferente al Stepper de navigation — este es visual/feedback, sin contenido de panels.

## Uso

```js
new MTS.StepProgress('#el', {
  active: 1,
  steps: [
    { id: 's1', label: 'Carrito',    description: 'Revisa tus productos' },
    { id: 's2', label: 'Envío',      description: 'Datos de entrega'     },
    { id: 's3', label: 'Pago',       description: 'Método de pago'       },
    { id: 's4', label: 'Confirmado'                                       },
  ],
  onChange: (index, step) => console.log(index, step.label),
})
```

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `steps` | `Array` | `[]` | Pasos con `id`, `label`, `description?` |
| `active` | `number` | `0` | Índice activo (0-based) |
| `variant` | `string` | `'default'` | `'default'` \| `'compact'` \| `'dots'` |
| `clickable` | `boolean` | `false` | Permite navegar clickeando pasos completados |
| `onChange` | `function` | `null` | `(index, step) => {}` |

## API

```js
const sp = new MTS.StepProgress('#el', { steps: [...] })
sp.next()
sp.prev()
sp.goTo(2)
sp.setStepStatus(1, 'error')    // marcar paso como error
sp.setStepStatus(1, 'complete') // volver a completado
sp.getActive()  // → { index, step }
```
