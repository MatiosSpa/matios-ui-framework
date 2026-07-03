# MTS.Stepper

Unified step flow + progress component. Supports `wizard` and `progress` modes through a single API.

> **Compatibility note** — `MTS.StepProgress` is now a compatibility alias. New code should use `MTS.Stepper`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-stepper.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-sanitize.js"></script>
<script src="matios-ui-stepper.js"></script>
```

`matios-ui-icons.js` is required — the completed and error indicators are drawn with `MTS.Icon` (`check` / `close`).
`matios-ui-sanitize.js` is optional but recommended: when present, `content` strings and `icon` HTML are passed through `MTS.Sanitize.html()`.

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
  onChange: function (e) {
    console.log(e.detail.step.id);
  },
});
```

### `progress` — pure progress indicator (checkout, compact, dots)

```js
new MTS.Stepper('#el', {
  mode:    'progress',
  variant: 'default',
  active:  1,
  steps: [
    { id: 'cart',    label: 'Cart',      description: 'Review products' },
    { id: 'ship',    label: 'Shipping',  description: 'Delivery address' },
    { id: 'payment', label: 'Payment',   description: 'Payment method' },
    { id: 'confirm', label: 'Confirmed' },
  ],
});
```

### Migrating from `MTS.StepProgress`

Add `mode: 'progress'` and switch the constructor — all other options are identical:

```js
// Before:  new MTS.StepProgress('#checkout', { variant: 'compact', active: 2, clickable: true, steps: [...] });
new MTS.Stepper('#checkout', {
  mode:      'progress',
  variant:   'compact',
  active:    2,
  clickable: true,
  steps: [
    /* … */
  ],
});
```

---

## Constructor

```js
new MTS.Stepper(el | selector, options);
```

- `el | selector` — a DOM element or a CSS selector string. If nothing matches, the constructor logs an error and returns without building.
- The component builds itself in place inside that element (`el.innerHTML` is replaced).

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | `string` | `'wizard'` | `'wizard'` (indicators + content panels) \| `'progress'` (indicator only) |
| `variant` | `string` | `'default'` | `'default'` \| `'compact'` \| `'dots'` — applied only when `mode` is `'progress'` |
| `steps` | `array` | `[]` | Steps array (see schema below) |
| `active` | `number` | `0` | Initially active step index |
| `direction` | `string` | `'horizontal'` | `'horizontal'` \| `'vertical'` |
| `clickable` | `boolean` | `false` | Allow clicking a step to navigate to it |
| `onChange` | `function` | — | Fires when the active step changes |
| `onComplete` | `function` | — | Fires when `next()` is called on the last step |
| `onStepClick` | `function` | — | Fires when a step is clicked (`clickable` mode) |
| `onStatusChange` | `function` | — | Fires when a step status changes |

### Step schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Identifier passed back in event payloads (not enforced unique) |
| `label` | `string` | Step label — hidden in the `dots` variant |
| `description` | `string` | Subtitle — hidden in the `compact` and `dots` variants |
| `icon` | `string` | HTML for the indicator (ignored in `dots`, and when the step is done/error) |
| `status` | `string` | Only `'error'` is special-cased; any other value renders as a normal (positional) step |
| `disabled` | `boolean` | Blocks navigation to this step (via click or `goTo`) |
| `content` | `string \| Element \| Function` | Wizard-only panel content; a function is called lazily on first show |

Indicator rendering per step: an error step shows the `close` icon, a completed step (index before `active`) shows the `check` icon, otherwise it shows the step `icon` if provided, else the 1-based step number.

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `next()` | `this` | Go to the next step; on the last step it emits `complete` instead |
| `prev()` | `this` | Go to the previous step (no-op on the first) |
| `goTo(index, direction)` | `this` | Jump to `index`; ignored if out of range or the target step is `disabled`. `direction` defaults to `'jump'` and is passed through to the `change` payload |
| `setStepStatus(index, status)` | `this` | Set a step's `status` and re-render; emits `statuschange` |
| `getSteps()` | `array` | Shallow copies of every step |
| `getActive()` | `object` | `{ index, step }` for the active step |
| `isFirst()` | `boolean` | `true` when the active step is the first |
| `isLast()` | `boolean` | `true` when the active step is the last |
| `setSteps(array)` | `this` | Replace all steps and rebuild (resets `active` to `0`) |
| `on(event, cb)` | `this` | Subscribe to an event (`'change'` \| `'complete'` \| `'stepclick'` \| `'statuschange'`) |
| `off(event, cb)` | `this` | Remove a previously added listener |
| `destroy()` | — | Empties the host element and drops panel references |

```js
const stepper = new MTS.Stepper('#el', { steps: [/* … */] });
stepper.next();
stepper.setStepStatus(1, 'error');
stepper.getActive();
```

---

## Events

Every event is delivered two ways: as the matching `on*` option / `on()` callback (called with `{ type, detail }`), and as a bubbling DOM `CustomEvent` on the host element whose `detail` holds the payload.

| Callback | DOM event | When | `detail` payload |
|----------|-----------|------|------------------|
| `onChange` | `mts:stepper:change` | Active step changes | `{ index, prev, step, direction }` |
| `onComplete` | `mts:stepper:complete` | `next()` on the last step | `{ steps }` |
| `onStepClick` | `mts:stepper:stepclick` | A step is clicked | `{ index, step }` |
| `onStatusChange` | `mts:stepper:statuschange` | A step status changes | `{ index, status, step }` |

```js
el.addEventListener('mts:stepper:change', function (e) {
  console.log(e.detail.index, e.detail.step);
});
```

---

## Accessibility

- In `clickable` mode a step becomes a click target unless it is `disabled` or already active; a `disabled` step blocks navigation to it.
- Step status (active / complete / error / pending) is conveyed visually via CSS classes; mirror it in any surrounding status text.
