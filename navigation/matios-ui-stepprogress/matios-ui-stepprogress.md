# MTS.StepProgress

> **Deprecated / Deprecado**
>
> 🇬🇧 `MTS.StepProgress` is now a compatibility alias for `MTS.Stepper` in `mode: 'progress'`.
> 🇪🇸 `MTS.StepProgress` ahora es un alias de compatibilidad para `MTS.Stepper` en `mode: 'progress'`.

## Recommended / Recomendado

```js
new MTS.Stepper('#checkout-progress', {
  mode: 'progress',
  variant: 'default',
  active: 1,
  steps: [
    { id: 'cart', label: 'Cart', description: 'Review products' },
    { id: 'ship', label: 'Shipping', description: 'Delivery address' },
    { id: 'payment', label: 'Payment', description: 'Payment method' },
    { id: 'confirm', label: 'Confirmed' },
  ],
});
```

## Compatibility alias / Alias de compatibilidad

```js
new MTS.StepProgress('#checkout-progress', {
  variant: 'default',
  active: 1,
  steps: [
    { id: 'cart', label: 'Cart', description: 'Review products' },
    { id: 'ship', label: 'Shipping', description: 'Delivery address' },
    { id: 'payment', label: 'Payment', description: 'Payment method' },
    { id: 'confirm', label: 'Confirmed' },
  ],
});
```

## Migration / Migración

### Before / Antes

```js
new MTS.StepProgress('#el', {
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
new MTS.Stepper('#el', {
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

## Notes / Notas

- 🇬🇧 New examples live in `MTS.Stepper`.
- 🇪🇸 Los ejemplos nuevos viven en `MTS.Stepper`.
- 🇬🇧 Old code keeps working through this alias.
- 🇪🇸 El código antiguo sigue funcionando mediante este alias.
