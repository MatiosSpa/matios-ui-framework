# MTS.Stepper

[EN] Unified step-by-step flow component. Two modes: **wizard** (with content panels) and **progress** (pure visual indicator).
[ES] Componente unificado para flujos paso a paso. Dos modos: **wizard** (con paneles de contenido) y **progress** (indicador visual puro).

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-stepper.css">
<script src="matios-ui-stepper.js"></script>
```

---

## Modes / Modos

### `wizard` — with content panels (default) / con paneles de contenido

[EN] Each step has a panel showing HTML content, forms, tables or other MTS components.
[ES] Cada paso tiene un panel con contenido HTML, formularios, tablas u otros componentes MTS.

```js
const stepper = new MTS.Stepper('#el', {
  mode: 'wizard',
  steps: [
    {
      id:          'data',
      label:       'Personal data',
      description: 'Name and contact',
      content:     '<div id="form-data"></div>',
    },
    {
      id:      'security',
      label:   'Security',
      content: '<div id="form-pass"></div>',
    },
    {
      id:      'confirm',
      label:   'Confirmation',
      // Lazy function — runs only when user reaches this step
      // Función lazy — se ejecuta solo cuando el usuario llega a este paso
      content: () => buildSummary(),
    },
  ],
  // Panel is already in DOM when onChange fires / El panel ya está en el DOM al dispararse onChange
  onChange: (e) => {
    if (e.detail.index === 0) {
      new MTS.Input('#form-data #name', { label: 'Name' });
    }
  },
});
```

### `progress` — pure visual indicator / indicador visual puro

[EN] No panels — only the step indicator. Ideal for checkouts, pipelines, onboarding.
[ES] Sin paneles — solo el indicador de pasos. Ideal para checkouts, pipelines, onboarding.

```js
new MTS.Stepper('#el', {
  mode:    'progress',
  variant: 'default', // 'default' | 'compact' | 'dots'
  steps: [
    { id: 'cart',    label: 'Cart',      description: 'Review your products' },
    { id: 'ship',    label: 'Shipping',  description: 'Delivery address'     },
    { id: 'payment', label: 'Payment',   description: 'Payment method'       },
    { id: 'confirm', label: 'Confirmed'                                       },
  ],
});
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `mode` | `string` | `'wizard'` | `'wizard'` · `'progress'` |
| `variant` | `string` | `'default'` | [EN] `'default'` · `'compact'` · `'dots'` — progress mode only / [ES] solo en modo progress |
| `steps` | `array` | `[]` | [EN] Steps array — see schema below / [ES] Arreglo de pasos |
| `active` | `number` | `0` | [EN] Initially active step index / [ES] Índice del paso activo inicial |
| `direction` | `string` | `'horizontal'` | `'horizontal'` · `'vertical'` |
| `clickable` | `boolean` | `false` | [EN] Allow clicking completed steps to navigate / [ES] Permitir navegar clickeando pasos completados |
| `onChange` | `function` | — | [EN] Fires when active step changes / [ES] Se dispara al cambiar el paso activo |
| `onComplete` | `function` | — | [EN] Fires when the last step is reached / [ES] Se dispara al llegar al último paso |
| `onStepClick` | `function` | — | [EN] Fires when user clicks a step / [ES] Se dispara al hacer click en un paso |
| `onStatusChange` | `function` | — | [EN] Fires when a step status changes / [ES] Se dispara al cambiar el estado de un paso |

### Step schema / Esquema de paso

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier (required) / [ES] Identificador único (requerido) |
| `label` | `string` | [EN] Step text (required) / [ES] Texto del paso (requerido) |
| `description` | `string` | [EN] Subtitle — hidden in `compact` and `dots` / [ES] Subtítulo |
| `icon` | `string` | [EN] Custom SVG HTML for the indicator / [ES] HTML SVG del indicador |
| `status` | `string` | `'pending'` · `'error'` — `'complete'` and `'active'` are managed automatically |
| `disabled` | `boolean` | [EN] Prevents navigation to this step / [ES] Impide navegar a este paso |
| `content` | `string\|Element\|Function` | [EN] Panel content — `wizard` mode only / [ES] Contenido del panel — solo modo `wizard` |

---

## Events / Eventos

```js
new MTS.Stepper('#el', {
  steps: [...],
  // Fires when active step changes / Se dispara al cambiar el paso activo
  onChange: (e) => {
    console.log(e.detail.index);     // → new index (0-based)
    console.log(e.detail.prev);      // → previous index
    console.log(e.detail.step);      // → new step object
    console.log(e.detail.direction); // → 'next' | 'prev' | 'jump'
  },
  // Fires when last step is reached / Se dispara al llegar al último paso
  onComplete: (e) => {
    console.log(e.detail.steps); // → all steps
  },
  // Fires on clickable step click / Se dispara al hacer click (modo clickable)
  onStepClick: (e) => {
    console.log(e.detail.index, e.detail.step);
  },
  // Fires when step status changes / Se dispara al cambiar estado de un paso
  onStatusChange: (e) => {
    console.log(e.detail.index, e.detail.status);
  },
});
```

---

## API

```js
const stepper = new MTS.Stepper('#el', { steps: [...] });

// Navigate / Navegar
stepper.next()
stepper.prev()
stepper.goTo(2)            // jump to index / saltar al índice
stepper.goTo(2, 'jump')    // with explicit direction / con dirección explícita

// Step status / Estado del paso
stepper.setStepStatus(1, 'error')    // mark as error / marcar como error
stepper.setStepStatus(1, 'pending')  // reset to pending / resetear a pendiente

// Getters / Getters
stepper.getActive()    // → { index, step }
stepper.getSteps()     // → steps array copy
stepper.isFirst()      // → boolean
stepper.isLast()       // → boolean

// Replace all steps / Reemplazar todos los pasos
stepper.setSteps([...])

stepper.destroy()
```

---

## DOM Events / Eventos DOM

```js
el.addEventListener('mts:stepper:change',       (e) => {});
el.addEventListener('mts:stepper:complete',     (e) => {});
el.addEventListener('mts:stepper:stepclick',    (e) => {});
el.addEventListener('mts:stepper:statuschange', (e) => {});
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 2.1.0 | [EN] Bilingual docs, standardized structure / [ES] Docs bilingüe, estructura estandarizada |
| 2.0.0 | [EN] Unified wizard + progress modes / [ES] Modos wizard y progress unificados |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
