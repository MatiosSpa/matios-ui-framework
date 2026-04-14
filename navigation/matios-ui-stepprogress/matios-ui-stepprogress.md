# MTS.StepProgress

[EN] Step progress indicator — checkout, onboarding and pipeline style. Three variants: default, compact and dots.
[ES] Indicador de progreso de pasos — estilo checkout, onboarding y pipeline. Tres variantes: default, compact y dots.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-stepprogress.css">
<script src="matios-ui-stepprogress.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `steps` | `array` | `[]` | [EN] Step items (see schema) / [ES] Ítems de pasos |
| `active` | `number` | `0` | [EN] Initially active step index / [ES] Índice del paso activo inicial |
| `variant` | `string` | `'default'` | `'default'` · `'compact'` · `'dots'` |
| `clickable` | `boolean` | `false` | [EN] Allow clicking steps to navigate / [ES] Permitir navegar haciendo click en los pasos |
| `onChange` | `function` | — | [EN] `({ index, step }) => {}` Fires when active step changes / [ES] Se dispara al cambiar el paso activo |

### Step schema / Esquema de paso

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `label` | `string` | [EN] Step label / [ES] Texto del paso |
| `description` | `string` | [EN] Subtitle — hidden in `compact` and `dots` / [ES] Subtítulo — oculto en `compact` y `dots` |

---

## Events / Eventos

```js
new MTS.StepProgress('#my-progress', {
  steps: [...],
  // Fires when active step changes / Se dispara al cambiar el paso activo
  onChange: (e) => {
    console.log(e.detail.index); // → 2
    console.log(e.detail.step);  // → { id, label, description }
  },
});
```

---

## HTML Usage / Uso HTML

```html
<div id="checkout-progress"></div>

<script>
  const sp = new MTS.StepProgress('#checkout-progress', {
    variant: 'default',
    active:  1,
    steps: [
      { id: 'cart',    label: 'Cart',      description: 'Review products' },
      { id: 'ship',    label: 'Shipping',  description: 'Delivery address' },
      { id: 'payment', label: 'Payment',   description: 'Payment method' },
      { id: 'confirm', label: 'Confirmed' },
    ],
    onChange: (e) =&gt; console.log('step:', e.detail.index),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Default — with description / Con descripción
new MTS.StepProgress('#progress-default', {
  variant: 'default',
  active:  1,
  steps: [
    { id: 'cart',    label: 'Cart',      description: 'Review your products' },
    { id: 'ship',    label: 'Shipping',  description: 'Delivery address' },
    { id: 'payment', label: 'Payment',   description: 'Payment method' },
    { id: 'confirm', label: 'Confirmed' },
  ],
  onChange: (e) => console.log(e.detail.index),
});

// Compact — label only / Solo label
new MTS.StepProgress('#progress-compact', {
  variant:   'compact',
  active:    2,
  clickable: true,  // click to navigate / click para navegar
  steps: [...],
  onChange: (e) => console.log(e.detail.index),
});

// Dots — minimalist pipeline / Pipeline minimalista
new MTS.StepProgress('#progress-dots', {
  variant: 'dots',
  active:  1,
  steps: [
    { id: 'trigger', label: 'Trigger' },
    { id: 'build',   label: 'Build'   },
    { id: 'test',    label: 'Tests'   },
    { id: 'deploy',  label: 'Deploy'  },
    { id: 'live',    label: 'Live'    },
  ],
});
```

---

## API

```js
const sp = new MTS.StepProgress('#my-progress', { ... });

// Navigate / Navegar
sp.next()
sp.prev()
sp.goTo(2)

// Set step status / Establecer estado de un paso
sp.setStepStatus(1, 'error')    // mark as error / marcar como error
sp.setStepStatus(1, 'pending')  // reset / resetear

// Get active step / Obtener paso activo
sp.getActive()  // → { index: 2, step: { id, label, ... } }

// Register / remove listeners / Registrar / eliminar listeners
sp.on('change', (e) => console.log(e.detail.index))
sp.off('change', handler)
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-progress')
  .addEventListener('mts:stepprogress:change', (e) => {
    console.log(e.detail.index, e.detail.step);
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Normalized to `.on()` pattern, bilingual docs / [ES] Normalizado al patrón `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release — default/compact/dots, clickable, error status / [ES] Versión inicial |
