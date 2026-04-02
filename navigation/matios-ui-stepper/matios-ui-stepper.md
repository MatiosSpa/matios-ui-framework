# MTS.Stepper

Componente unificado para flujos paso a paso. Dos modos: **wizard** (con paneles de contenido) y **progress** (indicador visual puro).

## Instalación

```html
<link rel="stylesheet" href="matios-ui-stepper.css">
<script src="matios-ui-stepper.js"></script>
```

---

## Modos

### Modo `wizard` — con contenido (default)

Cada paso tiene un panel que muestra contenido HTML, formularios, tablas u otros componentes MTS.

```js
const stepper = new MTS.Stepper('#el', {
  mode: 'wizard',   // default
  steps: [
    {
      id:          'datos',
      label:       'Datos personales',
      description: 'Nombre y contacto',
      content:     '<div id="form-datos"></div>',
    },
    {
      id:      'seguridad',
      label:   'Seguridad',
      content: '<div id="form-pass"></div>',
    },
    {
      id:      'confirm',
      label:   'Confirmación',
      // Función lazy — se ejecuta solo cuando el usuario llega a este paso
      content: () => construirResumen(),
    },
  ],
  onChange: (e) => {
    // El panel ya está visible — el DOM está listo para montar componentes
    if (e.detail.index === 0) {
      new MTS.Input('#form-datos #nombre', { label: 'Nombre' })
    }
  },
})
```

### Modo `progress` — indicador visual puro

Sin paneles. Solo el indicador del estado del proceso. Ideal para checkouts, pipelines, onboarding.

```js
new MTS.Stepper('#el', {
  mode:    'progress',
  variant: 'default',   // 'default' | 'compact' | 'dots'
  steps: [
    { id: 'cart',    label: 'Carrito',    description: 'Revisa tus productos' },
    { id: 'ship',    label: 'Envío',      description: 'Dirección de entrega'  },
    { id: 'payment', label: 'Pago',       description: 'Método de pago'        },
    { id: 'confirm', label: 'Confirmado'                                        },
  ],
})
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `mode` | `string` | `'wizard'` | `'wizard'` \| `'progress'` |
| `variant` | `string` | `'default'` | `'default'` \| `'compact'` \| `'dots'` — solo en `mode:'progress'` |
| `steps` | `Array` | `[]` | Array de pasos — ver estructura abajo |
| `active` | `number` | `0` | Índice del paso activo inicial |
| `direction` | `string` | `'horizontal'` | `'horizontal'` \| `'vertical'` |
| `clickable` | `boolean` | `false` | Permite navegar clickeando pasos completados |
| `onChange` | `function` | `null` | Callback al cambiar de paso |
| `onComplete` | `function` | `null` | Callback al llegar al último paso |
| `onStepClick` | `function` | `null` | Callback al hacer click manual en un paso |
| `onStatusChange` | `function` | `null` | Callback al cambiar estado de un paso |

## Estructura de un paso

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `string` | Identificador único (requerido) |
| `label` | `string` | Texto del paso (requerido) |
| `description` | `string` | Subtítulo — no se muestra en `compact` ni `dots` |
| `icon` | `string` | HTML SVG custom para el indicador |
| `status` | `string` | `'pending'` \| `'error'` — `'complete'` y `'active'` se gestionan solos |
| `disabled` | `boolean` | No permite navegar a este paso |
| `content` | `string\|Element\|Function` | Contenido del panel — solo en `mode:'wizard'` |

### Tipos de `content`

```js
// HTML string — más común
content: '<div id="mi-form"></div>'

// Element del DOM ya existente
content: document.getElementById('mi-tabla')

// Función lazy — se ejecuta solo cuando el usuario llega al paso
// Ideal para contenido pesado o que depende de pasos anteriores
content: () => {
  const data = recolectarDatosAnteriores()
  return '<div>' + data.map(item => '<p>' + item + '</p>').join('') + '</div>'
}
```

---

## API

```js
const stepper = new MTS.Stepper('#el', { steps: [...] })

stepper.next()              // avanzar un paso
stepper.prev()              // retroceder un paso
stepper.goTo(2)             // ir al paso índice 2
stepper.goTo(2, 'jump')     // con dirección explícita

stepper.setStepStatus(1, 'error')    // marcar paso como error
stepper.setStepStatus(1, 'pending')  // volver a pendiente

stepper.getActive()   // → { index: 1, step: { id, label, ... } }
stepper.getSteps()    // → copia del array de pasos
stepper.isFirst()     // → boolean
stepper.isLast()      // → boolean

stepper.setSteps([...]) // reemplazar todos los pasos

stepper.on('change', cb)
stepper.off('change', cb)
stepper.destroy()
```

---

## Eventos

### `onChange`
```js
stepper.on('change', (e) => {
  e.detail.index      // índice nuevo (0-based)
  e.detail.prev       // índice anterior
  e.detail.step       // objeto del paso nuevo
  e.detail.direction  // 'next' | 'prev' | 'jump'
})
```

### `onComplete`
```js
stepper.on('complete', (e) => {
  e.detail.steps  // array completo de pasos
})
```

### `onStepClick`
```js
stepper.on('stepclick', (e) => {
  e.detail.index  // índice del paso clickeado
  e.detail.step   // objeto del paso
})
```

### `onStatusChange`
```js
stepper.on('statuschange', (e) => {
  e.detail.index   // índice del paso
  e.detail.status  // nuevo status
  e.detail.step    // objeto del paso
})
```

### Eventos DOM
```js
document.addEventListener('mts:stepper:change',       (e) => {})
document.addEventListener('mts:stepper:complete',     (e) => {})
document.addEventListener('mts:stepper:stepclick',    (e) => {})
document.addEventListener('mts:stepper:statuschange', (e) => {})
```

---

## Ejemplos prácticos

### Registro de usuario (wizard)
```js
const reg = new MTS.Stepper('#registro', {
  mode: 'wizard',
  steps: [
    { id:'s1', label:'Datos',     content:'<div id="r-datos"></div>' },
    { id:'s2', label:'Seguridad', content:'<div id="r-pass"></div>'  },
    { id:'s3', label:'Listo',     content:'<div id="r-ok"></div>'    },
  ],
  onChange: (e) => {
    if (e.detail.index === 0) {
      new MTS.Input('#r-datos', { label:'Nombre' })
    }
  },
  onComplete: () => enviarFormulario(),
})
```

### Checkout (progress)
```js
new MTS.Stepper('#checkout', {
  mode: 'progress', variant: 'compact',
  active: 1,
  steps: [
    { id:'cart',    label:'Carrito'    },
    { id:'ship',    label:'Envío'      },
    { id:'payment', label:'Pago'       },
    { id:'confirm', label:'Confirmado' },
  ],
})
```

### Pipeline CI/CD (dots)
```js
new MTS.Stepper('#pipeline', {
  mode: 'progress', variant: 'dots',
  active: 2,
  steps: [
    { id:'t', label:'Trigger' },
    { id:'b', label:'Build'   },
    { id:'t', label:'Tests'   },
    { id:'d', label:'Deploy'  },
    { id:'l', label:'Live'    },
  ],
})
```
