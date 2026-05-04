# MTS.Progress

🇬🇧 Progress bar and circle indicator with variants, striped/animated fills, indeterminate mode and smooth value transitions.
🇪🇸 Barra de progreso e indicador circular con variantes, relleno rayado/animado, modo indeterminado y transiciones suaves.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-progress.css">
<script src="matios-ui-progress.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `type` | `string` | `'bar'` | `'bar'` · `'circle'` · `'indeterminate'` |
| `value` | `number` | `0` | 🇬🇧 Initial value / 🇪🇸 Valor inicial |
| `min` | `number` | `0` | 🇬🇧 Minimum value / 🇪🇸 Valor mínimo |
| `max` | `number` | `100` | 🇬🇧 Maximum value / 🇪🇸 Valor máximo |
| `variant` | `string` | `'default'` | `'default'` · `'primary'` · `'success'` · `'warning'` · `'danger'` · `'info'` |
| `size` | `string` | `'md'` | `'xs'` · `'sm'` · `'md'` · `'lg'` |
| `showLabel` | `boolean` | `false` | 🇬🇧 Show label text / 🇪🇸 Mostrar texto de label |
| `showValue` | `boolean` | `false` | 🇬🇧 Show percentage value / 🇪🇸 Mostrar valor en porcentaje |
| `striped` | `boolean` | `false` | 🇬🇧 Striped fill pattern / 🇪🇸 Patrón de relleno rayado |
| `animated` | `boolean` | `false` | 🇬🇧 Animate stripes / 🇪🇸 Animar las rayas |
| `rounded` | `boolean` | `true` | 🇬🇧 Rounded corners / 🇪🇸 Esquinas redondeadas |
| `label` | `string` | `''` | 🇬🇧 Label text / 🇪🇸 Texto del label |
| `labelFormat` | `function` | `null` | 🇬🇧 `(value, pct) => string` Custom label / 🇪🇸 Label personalizado |
| `radius` | `number` | `40` | 🇬🇧 Circle radius in px / 🇪🇸 Radio del círculo en px (solo `type:'circle'`) |
| `strokeWidth` | `number` | `6` | 🇬🇧 Circle stroke width in px / 🇪🇸 Ancho del trazo en px (solo `type:'circle'`) |
| `onChange` | `function` | — | 🇬🇧 `({ value, pct }) => {}` Fires on value change / 🇪🇸 Se dispara al cambiar el valor |
| `onComplete` | `function` | — | 🇬🇧 Fires when value reaches max / 🇪🇸 Se dispara al llegar al máximo |

---

## Events / Eventos

```js
const prog = new MTS.Progress('#my-progress', {
  type:  'bar',
  value: 0,
  // Fires when value changes / Se dispara al cambiar el valor
  onChange: (e) => {
    console.log(e.detail.value); // → 45
    console.log(e.detail.pct);   // → 0.45
  },
  // Fires when value reaches max / Se dispara al llegar al máximo
  onComplete: (e) => {
    console.log('Done!', e.detail.value);
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic bar / Barra básica
const bar = new MTS.Progress('#my-progress', {
  type:      'bar',
  value:     65,
  variant:   'primary',
  showValue: true,
  onChange:  (e) => console.log(e.detail.pct),
});

// Striped and animated / Rayado y animado
new MTS.Progress('#progress-striped', {
  type:     'bar',
  value:    80,
  variant:  'success',
  striped:  true,
  animated: true,
});

// Circle / Círculo
new MTS.Progress('#progress-circle', {
  type:        'circle',
  value:       75,
  radius:      48,
  strokeWidth: 8,
  showValue:   true,
  variant:     'primary',
});

// Indeterminate loading / Carga indeterminada
new MTS.Progress('#progress-loading', {
  type:    'indeterminate',
  variant: 'primary',
});

// Custom label / Label personalizado
new MTS.Progress('#progress-label', {
  type:        'bar',
  value:       3,
  max:         10,
  showLabel:   true,
  labelFormat: (value, pct) => `${value} of 10 steps`,
});
```

---

## API

```js
const prog = new MTS.Progress('#my-progress', { value: 0 });

// Set value (animates by default) / Establecer valor (anima por defecto)
prog.setValue(75)
prog.setValue(75, false)  // no animation / sin animación

// Increment / decrement / Incrementar / decrementar
prog.increment(10)
prog.decrement(5)

// Reset to min / Resetear al mínimo
prog.reset()

// Change variant at runtime / Cambiar variante en runtime
prog.setVariant('success')

// Toggle indeterminate / Alternar modo indeterminado
prog.setIndeterminate(true)
prog.setIndeterminate(false)

// Register listeners / Registrar listeners
prog.on('change',   (e) => console.log(e.detail.value))
prog.on('complete', (e) => console.log('done'))
prog.off('change',  handler)
```

---

## CSS Only / Solo CSS

```html
<!-- Bar without JS / Barra sin JS -->
<div class="mts-progress">
  <div class="mts-progress__fill mts-progress__fill--primary" style="width:65%"></div>
</div>

<!-- Circle without JS / Círculo sin JS -->
<div class="mts-progress-circle" style="--mts-progress-pct:75">...</div>
```

---

## DOM Events / Eventos DOM

```js
el.addEventListener('mts:progress:change',   (e) => console.log(e.detail.value));
el.addEventListener('mts:progress:complete',  (e) => console.log('done'));
```

---
