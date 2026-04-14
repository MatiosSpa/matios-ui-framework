# MTS.NumberInput

[EN] Numeric input with +/− buttons, min/max/step, currency, percentage and prefix/suffix formats.
[ES] Input numérico con botones +/−, min/max/step, formatos de moneda, porcentaje y prefix/suffix.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-numberinput.css">
<script src="matios-ui-numberinput.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `value` | `number` | `0` | [EN] Initial value / [ES] Valor inicial |
| `min` | `number` | `null` | [EN] Minimum value / [ES] Valor mínimo |
| `max` | `number` | `null` | [EN] Maximum value / [ES] Valor máximo |
| `step` | `number` | `1` | [EN] Increment/decrement step / [ES] Paso de incremento/decremento |
| `decimals` | `number` | `0` | [EN] Decimal places to display / [ES] Decimales a mostrar |
| `label` | `string` | `''` | [EN] Field label / [ES] Etiqueta del campo |
| `placeholder` | `string` | `''` | |
| `hint` | `string` | `''` | [EN] Helper text / [ES] Texto de ayuda |
| `prefix` | `string` | `''` | [EN] Visible prefix (e.g. `$`) / [ES] Prefijo visible |
| `suffix` | `string` | `''` | [EN] Visible suffix (e.g. `kg`) / [ES] Sufijo visible |
| `format` | `string` | `'plain'` | `'plain'` · `'currency'` · `'percent'` |
| `locale` | `string` | `'es-CL'` | [EN] Locale for Intl.NumberFormat / [ES] Locale para Intl.NumberFormat |
| `currency` | `string` | `'CLP'` | [EN] ISO 4217 currency code / [ES] Código de moneda ISO 4217 |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `disabled` | `boolean` | `false` | [EN] Disables interaction / [ES] Deshabilita la interacción |
| `readonly` | `boolean` | `false` | [EN] Read only / [ES] Solo lectura |
| `onChange` | `function` | — | [EN] `(value, formatted) => {}` / [ES] Se dispara al cambiar |
| `onFocus` | `function` | — | [EN] Fires on focus / [ES] Se dispara al enfocar |
| `onBlur` | `function` | — | [EN] Fires on blur / [ES] Se dispara al perder foco |

---

## Events / Eventos

[EN] Use `onChange`, `onFocus` and `onBlur` in the constructor. This is the recommended approach.
[ES] Usa `onChange`, `onFocus` y `onBlur` en el constructor. Este es el enfoque recomendado.

```js
new MTS.NumberInput('#my-input', {
  // Fires when value changes — receives raw number and formatted string
  // Se dispara al cambiar — recibe número y string formateado
  onChange: (value, formatted) => {
    console.log(value);     // → 15000  (number)
    console.log(formatted); // → '$15.000' (string)
  },

  // Fires on focus / Se dispara al enfocar
  onFocus: (e) => console.log('focused'),

  // Fires on blur / Se dispara al perder foco
  onBlur:  (e) => console.log('blurred'),
});
```

---

## HTML Usage / Uso HTML

```html
<!-- Basic / Básico -->
<div id="inp-qty"
  data-label="Quantity"
  data-min="0"
  data-max="100"
  data-step="1">
</div>

<script>
  new MTS.NumberInput('#inp-qty', {
    value:    1,
    onChange: (value, formatted) => console.log(value),
  });
</script>

<!-- Currency / Moneda -->
<div id="inp-price"
  data-label="Price"
  data-min="0"
  data-step="500"
  data-prefix="$">
</div>

<script>
  new MTS.NumberInput('#inp-price', {
    format:   'currency',
    currency: 'CLP',
    locale:   'es-CL',
    value:    15000,
    onChange: (value, formatted) => console.log(formatted),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
const ni = new MTS.NumberInput('#my-input', {
  label:    'Quantity',
  value:    1,
  min:      0,
  max:      100,
  step:     1,
  onChange: (value, formatted) => console.log(value, formatted),
});

// Currency format / Formato moneda
new MTS.NumberInput('#inp-price', {
  label:    'Price',
  format:   'currency',
  currency: 'CLP',
  locale:   'es-CL',
  value:    15000,
  step:     500,
  onChange: (value, formatted) => console.log(formatted), // → '$15.000'
});

// Percentage format / Formato porcentaje
new MTS.NumberInput('#inp-pct', {
  label:  'Discount',
  format: 'percent',
  min:    0,
  max:    100,
  step:   5,
  value:  25,
});

// Manual prefix / suffix
new MTS.NumberInput('#inp-weight', {
  label:    'Weight',
  prefix:   '',
  suffix:   'kg',
  decimals: 2,
  step:     0.1,
  value:    1.5,
});
```

---

## API

```js
const ni = new MTS.NumberInput('#my-input', { ... });

// Get value / Obtener valor
ni.getValue()              // → number

// Set value / Establecer valor
ni.setValue(75)            // fires onChange / dispara onChange
ni.setValue(75, true)      // silent — no onChange / silencioso

// Set boundaries / Establecer límites
ni.setMin(10)
ni.setMax(90)

// Error state / Estado de error
ni.setError('Value out of range')
ni.clearError()

// Enable / disable / Habilitar / deshabilitar
ni.disable()
ni.enable()

// Focus / Enfocar
ni.focus()
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-input')
  .addEventListener('mts:numberinput:change', (e) => {
    console.log(e.detail.value);     // → number
    console.log(e.detail.formatted); // → string
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual docs, standardized structure / [ES] Docs bilingüe, estructura estandarizada |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
