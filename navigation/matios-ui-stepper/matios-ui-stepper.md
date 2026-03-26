# matios-ui-stepper

Flujo paso a paso con estados, horizontal y vertical.

## Uso
```js
const stepper = new MTS.Stepper('#stepper', {
  direction: 'horizontal',   // 'horizontal'|'vertical'
  clickable: false,
  active:    0,
  steps: [
    { id: 's1', label: 'Datos básicos',    description: 'Nombre y apellido' },
    { id: 's2', label: 'Documentos',       description: 'Adjuntar archivos' },
    { id: 's3', label: 'Revisión',         description: 'Confirmar datos' },
    { id: 's4', label: 'Confirmación' },
  ],
  onChange:   (e) => console.log('Paso:', e.detail.index),
  onComplete: ()  => console.log('Flujo completado'),
})

stepper.next()               // → siguiente paso
stepper.prev()               // → paso anterior
stepper.setStep(2)           // → ir al paso 2
stepper.setStatus(1, 'error') // → marcar paso 1 como error
stepper.isFirst()            // → boolean
stepper.isLast()             // → boolean
```

## Estados
| Status | Visual |
|--------|--------|
| `pending` | Gris, número |
| `active` | Azul, número |
| `complete` | Verde, check |
| `error` | Rojo, ! |

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `change`   | `mts:stepper:change` |
| `complete` | `mts:stepper:complete` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial |
