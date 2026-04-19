# MTS.Stepper

[EN] Unified step flow + progress component. Supports `wizard` and `progress` in a single API.
[ES] Componente unificado para flujo paso a paso + progreso visual. Soporta `wizard` y `progress` con una sola API.

> **Compatibility note / Nota de compatibilidad**
>
> [EN] `MTS.StepProgress` is now a compatibility alias. New usage should go through `MTS.Stepper`.
> [ES] `MTS.StepProgress` queda como alias de compatibilidad. El uso nuevo debe hacerse con `MTS.Stepper`.

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

[EN] Uses step indicators plus content panels.
[ES] Usa indicadores de pasos más paneles de contenido.

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

[EN] Pure progress indicator. Covers checkout, compact and dots scenarios.
[ES] Indicador visual puro. Cubre checkout, compact y dots.

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

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `mode` | `string` | `'wizard'` | `'wizard'` · `'progress'` |
| `variant` | `string` | `'default'` | [EN] `'default'` · `'compact'` · `'dots'` — progress mode only / [ES] solo en modo progress |
| `steps` | `array` | `[]` | [EN] Steps array / [ES] Arreglo de pasos |
| `active` | `number` | `0` | [EN] Initially active step index / [ES] Índice del paso activo inicial |
| `direction` | `string` | `'horizontal'` | `'horizontal'` · `'vertical'` |
| `clickable` | `boolean` | `false` | [EN] Allow clicking steps to navigate / [ES] Permitir navegar haciendo click |
| `onChange` | `function` | — | [EN] Fires when active step changes / [ES] Se dispara al cambiar el paso activo |
| `onComplete` | `function` | — | [EN] Fires when last step is reached / [ES] Se dispara al llegar al último paso |
| `onStepClick` | `function` | — | [EN] Fires when a step is clicked / [ES] Se dispara al hacer click en un paso |
| `onStatusChange` | `function` | — | [EN] Fires when step status changes / [ES] Se dispara al cambiar estado |

### Step schema / Esquema de paso

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `label` | `string` | [EN] Step label / [ES] Texto del paso |
| `description` | `string` | [EN] Subtitle — hidden in `compact` and `dots` / [ES] Subtítulo |
| `icon` | `string` | [EN] SVG HTML for the indicator / [ES] HTML SVG del indicador |
| `status` | `string` | `'pending'` · `'error'` |
| `disabled` | `boolean` | [EN] Prevent navigation / [ES] Impide navegar |
| `content` | `string|Element|Function` | [EN] Wizard-only panel content / [ES] Contenido del panel en wizard |

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

## Changelog

| Version | Description |
|---------|-------------|
| 2.2.0 | [EN] Consolidated StepProgress examples into Stepper / [ES] Se consolidaron ejemplos de StepProgress dentro de Stepper |
| 2.1.0 | [EN] Bilingual docs and standardized structure / [ES] Docs bilingüe y estructura estandarizada |
| 2.0.0 | [EN] Unified wizard + progress modes / [ES] Modos wizard y progress unificados |
