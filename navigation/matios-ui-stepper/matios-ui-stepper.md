# MTS.Stepper

🇬🇧 Unified step flow + progress component. Supports `wizard` and `progress` in a single API.
🇪🇸 Componente unificado para flujo paso a paso + progreso visual. Soporta `wizard` y `progress` con una sola API.

> **Compatibility note / Nota de compatibilidad**
>
> 🇬🇧 `MTS.StepProgress` is now a compatibility alias. New usage should go through `MTS.Stepper`.
> 🇪🇸 `MTS.StepProgress` queda como alias de compatibilidad. El uso nuevo debe hacerse con `MTS.Stepper`.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-stepper.css">
<script src="matios-ui-stepper.js"></script>
```

---

## Modes / Modos

### `wizard`

🇬🇧 Uses step indicators plus content panels.
🇪🇸 Usa indicadores de pasos más paneles de contenido.

```js
new MTS.Stepper('#el', {
  mode: 'wizard',
  steps: [
    { id: 'account',  label: 'Account',  content: '<div>Step 1</div>' },
    { id: 'security', label: 'Security', content: '<div>Step 2</div>' },
    { id: 'confirm',  label: 'Confirm',  content: '<div>Step 3</div>' },
  ],
});
```

### `progress`

🇬🇧 Pure progress indicator. Covers checkout, compact and dots scenarios.
🇪🇸 Indicador visual puro. Cubre checkout, compact y dots.

```js
new MTS.Stepper('#el', {
  mode: 'progress',
  variant: 'default', // 'default' | 'compact' | 'dots'
  active: 1,
  steps: [
    { id: 'cart', label: 'Cart', description: 'Review products' },
    { id: 'ship', label: 'Shipping', description: 'Delivery address' },
    { id: 'payment', label: 'Payment', description: 'Payment method' },
    { id: 'confirm', label: 'Confirmed' },
  ],
});
```

---

## StepProgress migration / Migración desde StepProgress

### Before / Antes

```js
new MTS.StepProgress('#checkout-progress', {
  variant: 'compact',
  active: 2,
  clickable: true,
  steps: [
    { id: 's1', label: 'Datos' },
    { id: 's2', label: 'Seguridad' },
    { id: 's3', label: 'Confirmar' },
    { id: 's4', label: 'Listo' },
  ],
});
```

### Now / Ahora

```js
new MTS.Stepper('#checkout-progress', {
  mode: 'progress',
  variant: 'compact',
  active: 2,
  clickable: true,
  steps: [
    { id: 's1', label: 'Datos' },
    { id: 's2', label: 'Seguridad' },
    { id: 's3', label: 'Confirmar' },
    { id: 's4', label: 'Listo' },
  ],
});
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `mode` | `string` | `'wizard'` | `'wizard'` · `'progress'` |
| `variant` | `string` | `'default'` | 🇬🇧 `'default'` · `'compact'` · `'dots'` — progress mode only / 🇪🇸 solo en modo progress |
| `steps` | `array` | `[]` | 🇬🇧 Steps array / 🇪🇸 Arreglo de pasos |
| `active` | `number` | `0` | 🇬🇧 Initially active step index / 🇪🇸 Índice del paso activo inicial |
| `direction` | `string` | `'horizontal'` | `'horizontal'` · `'vertical'` |
| `clickable` | `boolean` | `false` | 🇬🇧 Allow clicking steps to navigate / 🇪🇸 Permitir navegar haciendo click |
| `onChange` | `function` | — | 🇬🇧 Fires when active step changes / 🇪🇸 Se dispara al cambiar el paso activo |
| `onComplete` | `function` | — | 🇬🇧 Fires when last step is reached / 🇪🇸 Se dispara al llegar al último paso |
| `onStepClick` | `function` | — | 🇬🇧 Fires when a step is clicked / 🇪🇸 Se dispara al hacer click en un paso |
| `onStatusChange` | `function` | — | 🇬🇧 Fires when step status changes / 🇪🇸 Se dispara al cambiar estado |

### Step schema / Esquema de paso

| Property | Type | 🇬🇧 Description / 🇪🇸 Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | 🇬🇧 Unique identifier / 🇪🇸 Identificador único |
| `label` | `string` | 🇬🇧 Step label / 🇪🇸 Texto del paso |
| `description` | `string` | 🇬🇧 Subtitle — hidden in `compact` and `dots` / 🇪🇸 Subtítulo |
| `icon` | `string` | 🇬🇧 SVG HTML for the indicator / 🇪🇸 HTML SVG del indicador |
| `status` | `string` | `'pending'` · `'error'` |
| `disabled` | `boolean` | 🇬🇧 Prevent navigation / 🇪🇸 Impide navegar |
| `content` | `string|Element|Function` | 🇬🇧 Wizard-only panel content / 🇪🇸 Contenido del panel en wizard |

---

## API

```js
const stepper = new MTS.Stepper('#el', { steps: [...] });

stepper.next();
stepper.prev();
stepper.goTo(2);

stepper.setStepStatus(1, 'error');
stepper.setStepStatus(1, 'pending');

stepper.getActive();
stepper.getSteps();
stepper.isFirst();
stepper.isLast();

stepper.setSteps([...]);
stepper.destroy();
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
