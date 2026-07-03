# MTS.StepProgress

> **Deprecated** — `MTS.StepProgress` is a compatibility alias for [`MTS.Stepper`](../matios-ui-stepper/matios-ui-stepper.md)
> in `mode: 'progress'`. New code should use `MTS.Stepper`; existing code keeps working through this alias.
> When `MTS.Stepper` is loaded, the constructor delegates to it and logs a one-time deprecation warning to the console.

This is a linear progress-steps bar (checkout-style indicator). It is distinct from the `MTS.Stepper` wizard: it renders
only the step indicators, connector lines and a progress fill bar — never step content panels.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-stepper.css">
<link rel="stylesheet" href="matios-ui-stepprogress.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-stepper.js"></script>
<script src="matios-ui-stepprogress.js"></script>
```

`matios-ui-icons.js` is required — the done and error indicators are drawn with `MTS.Icon` (`check` / `close`).
`matios-ui-stepper.js` is what the alias delegates to; if it is not present the alias falls back to its own built-in
legacy renderer. Load `matios-ui-i18n.js` + `matios-ui-stepprogress-i18n.js` only if you need the demo strings — the
component itself renders no chrome text.

---

## Usage

```js
const progress = new MTS.StepProgress('#checkout-progress', {
  variant: 'default',
  active: 1,
  steps: [
    { id: 'cart',    label: 'Cart',      description: 'Review products' },
    { id: 'ship',    label: 'Shipping',  description: 'Delivery address' },
    { id: 'payment', label: 'Payment',   description: 'Payment method' },
    { id: 'confirm', label: 'Confirmed' }
  ],
  onChange: function (e) {
    console.log(e.detail.index);
  }
});
```

### Recommended (use `MTS.Stepper`)

Switch the constructor and add `mode: 'progress'`; all other options are identical:

```js
new MTS.Stepper('#checkout-progress', {
  mode: 'progress',
  variant: 'default',
  active: 1,
  steps: [
    { id: 'cart',    label: 'Cart',      description: 'Review products' },
    { id: 'ship',    label: 'Shipping',  description: 'Delivery address' },
    { id: 'payment', label: 'Payment',   description: 'Payment method' },
    { id: 'confirm', label: 'Confirmed' }
  ]
});
```

---

## Constructor

```js
new MTS.StepProgress(el | selector, options);
```

- `el | selector` — a DOM element or a CSS selector string. If nothing matches, the constructor returns without building.
- The component builds itself in place inside that element (`el.innerHTML` is replaced).

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `steps` | `array` | `[]` | Steps array (see schema below) |
| `active` | `number` | `0` | Initially active step index |
| `variant` | `string` | `'default'` | `'default'` \| `'compact'` \| `'dots'` |
| `clickable` | `boolean` | `false` | Allow clicking a done/active step to navigate to it |
| `onChange` | `function` | — | Fires when the active step changes |
| `onComplete` | `function` | — | Fires on completion (delegated to `MTS.Stepper`) |
| `onStepClick` | `function` | — | Fires when a step is clicked (delegated to `MTS.Stepper`) |
| `onStatusChange` | `function` | — | Fires when a step status changes (delegated to `MTS.Stepper`) |

> `onComplete`, `onStepClick` and `onStatusChange` are forwarded only when `MTS.Stepper` is present (the normal path).
> The built-in legacy fallback emits only `change`.

### Step schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Identifier passed back in event payloads |
| `label` | `string` | Step label — hidden in the `dots` variant |
| `description` | `string` | Subtitle — shown only in the `default` variant |

The indicator per step: an error step (see `setStepStatus`) shows the `close` icon, a done step (index before `active`)
shows the `check` icon, otherwise it shows the 1-based step number.

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `next()` | `this` | Advance to the next step (clamped to the last step) |
| `prev()` | `this` | Go back one step (clamped to the first step) |
| `goTo(index)` | `this` | Jump to `index`; out-of-range values are ignored |
| `setStepStatus(index, status)` | `this` | Set a step status; `'error'` renders the `close` indicator |
| `getActive()` | `object` | Current position `{ index, step }` |
| `getSteps()` | `array` | Shallow copy of the steps array (empty array via `MTS.Stepper` if unavailable) |
| `on(event, cb)` | `this` | Subscribe to an event |
| `off(event, cb)` | `this` | Unsubscribe a handler |
| `destroy()` | — | Clear the rendered markup |

There is no `setCurrent`, `setSteps`, `getConfig`, `getCode`, `showPercent` option, or percent/`"Step n of m"` text — the
progress amount is expressed only as the width of the fill bar.

---

## Events

Every event fires the corresponding `on...` option callback (if provided), any handler registered with `on()`, and a
bubbling DOM `CustomEvent` named `mts:stepprogress:<event>` on the host element.

| Event | Fires when | `detail` |
|-------|------------|----------|
| `change` | The active step changes | `{ index, step }` |
| `complete` | Completion (via `MTS.Stepper`) | forwarded from `MTS.Stepper` |
| `stepclick` | A step is clicked (via `MTS.Stepper`) | forwarded from `MTS.Stepper` |
| `statuschange` | A step status changes (via `MTS.Stepper`) | forwarded from `MTS.Stepper` |

```js
progress.on('change', function (e) {
  console.log(e.detail.index, e.detail.step.label);
});

document.querySelector('#checkout-progress').addEventListener('mts:stepprogress:change', function (e) {
  console.log(e.detail.index);
});
```

---

## i18n

The component renders **no chrome text of its own** — every visible label comes from the dev-supplied `steps`, and the
indicators are numbers or `MTS.Icon` glyphs. There is nothing to translate at runtime.

The `MTS.StepProgress` i18n namespace (`matios-ui-stepprogress-i18n.js`) holds **only the demo page strings** (`demo.*`
in `es` / `en` / `pt`), read through the global `MTS.getString()['MTS.StepProgress']`. Language is selected once at
startup with `MTS.setLanguage('es' | 'en' | 'pt')`. There is no per-instance `locale` option.
