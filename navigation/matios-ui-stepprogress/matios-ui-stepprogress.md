# MTS.StepProgress

> **Deprecated** — `MTS.StepProgress` is now a compatibility alias for `MTS.Stepper` in `mode: 'progress'`. New code
> should use [`MTS.Stepper`](../matios-ui-stepper/matios-ui-stepper.md); existing code keeps working through this alias.

---

## Recommended (use `MTS.Stepper`)

```js
new MTS.Stepper('#checkout-progress', {
  mode:    'progress',
  variant: 'default',
  active:  1,
  steps: [
    { id: 'cart',    label: 'Cart',     description: 'Review products' },
    { id: 'ship',    label: 'Shipping', description: 'Delivery address' },
    { id: 'payment', label: 'Payment',  description: 'Payment method' },
    { id: 'confirm', label: 'Confirmed' },
  ],
});
```

## Compatibility alias

```js
new MTS.StepProgress('#checkout-progress', {
  variant: 'default',
  active:  1,
  steps: [
    { id: 'cart',    label: 'Cart',     description: 'Review products' },
    { id: 'ship',    label: 'Shipping', description: 'Delivery address' },
    { id: 'payment', label: 'Payment',  description: 'Payment method' },
    { id: 'confirm', label: 'Confirmed' },
  ],
});
```

## Migration

The alias accepts the same options; switch the constructor and add `mode: 'progress'`:

```js
// Before:  new MTS.StepProgress('#el', { variant: 'compact', active: 2, clickable: true, steps: [...] });
new MTS.Stepper('#el', { mode: 'progress', variant: 'compact', active: 2, clickable: true, steps: [/* … */] });
```

See `MTS.Stepper` for the full Options, API, Events, Accessibility and Changelog. This component shares its
implementation.

---

## Changelog

### 2026-06-29
- Indicator icons migrated to `MTS.Icon` (done → `check`, error → `close`); dropped inline SVG. Requires `matios-ui-icons.js`.

### Initial
- Standalone step-progress indicator. Now superseded by `MTS.Stepper` (`mode: 'progress'`) and kept as a
  backward-compatible alias.
