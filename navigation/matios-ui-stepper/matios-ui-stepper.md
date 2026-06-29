# MTS.Stepper

Unified step flow + progress component. Supports `wizard` and `progress` modes through a single API.

> **Compatibility note** — `MTS.StepProgress` is now a compatibility alias. New code should use `MTS.Stepper`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-stepper.css">
<script src="matios-ui-stepper.js"></script>
```

---

## Usage

### `wizard` — step indicators plus content panels

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

### `progress` — pure progress indicator (checkout, compact, dots)

```js
new MTS.Stepper('#el', {
  mode:    'progress',
  variant: 'default', // 'default' | 'compact' | 'dots'
  active:  1,
  steps: [
    { id: 'cart',    label: 'Cart',    description: 'Review products' },
    { id: 'ship',    label: 'Shipping', description: 'Delivery address' },
    { id: 'payment', label: 'Payment', description: 'Payment method' },
    { id: 'confirm', label: 'Confirmed' },
  ],
});
```

### Migrating from `MTS.StepProgress`

Add `mode: 'progress'` and switch the constructor — all other options are identical:

```js
// Before:  new MTS.StepProgress('#checkout', { variant: 'compact', active: 2, clickable: true, steps: [...] });
new MTS.Stepper('#checkout', { mode: 'progress', variant: 'compact', active: 2, clickable: true, steps: [/* … */] });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | `string` | `'wizard'` | `'wizard'` · `'progress'` |
| `variant` | `string` | `'default'` | `'default'` · `'compact'` · `'dots'` (progress mode only) |
| `steps` | `array` | `[]` | Steps array (see schema below) |
| `active` | `number` | `0` | Initially active step index |
| `direction` | `string` | `'horizontal'` | `'horizontal'` · `'vertical'` |
| `clickable` | `boolean` | `false` | Allow clicking steps to navigate |
| `onChange` | `function` | — | Fires when the active step changes |
| `onComplete` | `function` | — | Fires when the last step is reached |
| `onStepClick` | `function` | — | Fires when a step is clicked |
| `onStatusChange` | `function` | — | Fires when a step status changes |

### Step schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Step label |
| `description` | `string` | Subtitle — hidden in `compact` and `dots` |
| `icon` | `string` | SVG HTML for the indicator |
| `status` | `string` | `'pending'` · `'error'` |
| `disabled` | `boolean` | Prevent navigation |
| `content` | `string \| Element \| Function` | Wizard-only panel content |

---

## API

| Method | Description |
|--------|-------------|
| `next()` / `prev()` / `goTo(i)` | Navigate steps |
| `setStepStatus(i, status)` | Set a step status (`'pending'` / `'error'`) |
| `getActive()` / `getSteps()` | Read the current state |
| `isFirst()` / `isLast()` | Boundary checks |
| `setSteps(array)` | Replace the steps |
| `destroy()` | Destroy the instance |

```js
const stepper = new MTS.Stepper('#el', { steps: [/* … */] });
stepper.next();
stepper.setStepStatus(1, 'error');
```

---

## Events

| Method | DOM event | When |
|--------|-----------|------|
| `onChange` | `mts:stepper:change` | Active step changes |
| `onComplete` | `mts:stepper:complete` | Last step reached |
| `onStepClick` | `mts:stepper:stepclick` | A step is clicked |
| `onStatusChange` | `mts:stepper:statuschange` | A step status changes |

```js
el.addEventListener('mts:stepper:change', function (e) { console.log(e.detail); });
```

---

## Accessibility

- In `clickable` mode steps are keyboard-operable; a `disabled` step blocks navigation to it.
- Step status (current / error / pending) is conveyed visually and should be mirrored in any status text.

---

## Changelog

### 2026-06-29
- Indicator icons migrated to `MTS.Icon` (done → `check`, error → `close`); dropped inline SVG. Requires `matios-ui-icons.js`.

### Initial
- Unified `wizard` + `progress` stepper (default/compact/dots variants), horizontal/vertical direction, per-step
  status/icon/disabled, navigation API (`next` / `prev` / `goTo`), and `MTS.StepProgress` compatibility alias.
