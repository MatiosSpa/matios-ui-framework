# MTS.Slider

[EN] Range slider component — single value or dual-thumb range, with label, custom formatter and step.
[ES] Componente slider de rango — valor simple o rango de dos thumbs, con label, formateador personalizado y step.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-slider.css">
<script src="matios-ui-slider.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `min` | `number` | `0` | [EN] Minimum value / [ES] Valor mínimo |
| `max` | `number` | `100` | [EN] Maximum value / [ES] Valor máximo |
| `step` | `number` | `1` | [EN] Step increment / [ES] Incremento de paso |
| `value` | `number\|array` | `min` | [EN] Initial value. Array `[min, max]` for range / [ES] Valor inicial. Array `[min, max]` para rango |
| `range` | `boolean` | `false` | [EN] Enable dual-thumb range mode / [ES] Activar modo rango de dos thumbs |
| `label` | `string` | `''` | [EN] Label text above slider / [ES] Texto label sobre el slider |
| `showValue` | `boolean` | `true` | [EN] Show current value next to label / [ES] Mostrar valor actual junto al label |
| `labelFormat` | `function` | `null` | [EN] Custom value formatter / [ES] Formateador personalizado de valor |
| `onChange` | `function` | — | [EN] Fires when value changes / [ES] Se dispara al cambiar el valor |

---

## Events / Eventos

[EN] Use `onChange` in the constructor. This is the recommended approach.
[ES] Usa `onChange` en el constructor. Este es el enfoque recomendado.

```js
// Simple slider / Slider simple
new MTS.Slider('#my-slider', {
  // Fires on every drag / Se dispara en cada arrastre
  onChange: (e) => {
    console.log(e.detail.value); // → number
  },
});

// Range slider / Slider de rango
new MTS.Slider('#my-slider', {
  range: true,
  onChange: (e) => {
    console.log(e.detail.value); // → [min, max]
  },
});
```

---

## HTML Usage / Uso HTML

```html
<!-- Simple slider / Slider simple -->
<div id="slider-volume"></div>

<script>
  new MTS.Slider('#slider-volume', {
    label:       'Volume',
    min:         0,
    max:         100,
    value:       65,
    showValue:   true,
    labelFormat: (v) => v + '%',
    onChange:    (e) => console.log(e.detail.value),
  });
</script>

<!-- Range slider / Slider de rango -->
<div id="slider-price"></div>

<script>
  new MTS.Slider('#slider-price', {
    label:       'Price range',
    range:       true,
    min:         0,
    max:         1000,
    step:        10,
    value:       [200, 700],
    showValue:   true,
    labelFormat: ([a, b]) => '$' + a + ' – $' + b,
    onChange:    (e) => console.log(e.detail.value), // → [200, 700]
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Simple / Simple
const slider = new MTS.Slider('#my-slider', {
  // Label above slider / Label sobre el slider
  label: 'Volume',

  // Range boundaries / Límites del rango
  min: 0,
  max: 100,

  // Step increment / Incremento de paso
  step: 5,

  // Initial value / Valor inicial
  value: 65,

  // Show value next to label / Mostrar valor junto al label
  showValue: true,

  // Custom formatter / Formateador personalizado
  labelFormat: (v) => v + '%',

  // Fires on drag / Se dispara al arrastrar
  onChange: (e) => console.log(e.detail.value),
});

// Range / Rango
const range = new MTS.Slider('#my-range', {
  range:       true,
  label:       'Price',
  min:         0,
  max:         1000,
  step:        10,
  value:       [200, 700],  // [minimum, maximum] / [mínimo, máximo]
  showValue:   true,
  labelFormat: ([a, b]) => '$' + a + ' – $' + b,
  onChange:    (e) => console.log(e.detail.value), // → [200, 700]
});
```

---

## API

```js
const slider = new MTS.Slider('#my-slider', { ... });

// Returns current value / Retorna el valor actual
slider.getValue()              // → number (simple) | [number, number] (range)

// Sets value programmatically / Establece el valor programáticamente
slider.setValue(50)            // simple
slider.setValue([300, 600])    // range / rango
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-slider')
  .addEventListener('mts:slider:change', (e) => {
    console.log(e.detail.value); // → number | [number, number]
  });
```

| Event / Evento | DOM Namespace |
|----------------|---------------|
| `onChange` | `mts:slider:change` |

---

## Changelog

| Version | Description |
|---------|-------------|
| 3.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 3.0.0 | [EN] Rewritten with custom div thumbs and drag API — fixed dual-thumb behavior / [ES] Reescrito con thumbs div custom y API drag — corregido comportamiento rango doble |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
