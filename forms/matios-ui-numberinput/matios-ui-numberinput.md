# MTS.NumberInput

Input numérico con botones +/−, soporte de min/max/step, formatos de moneda, porcentaje y prefix/suffix.

## Instalación

```html
<link rel="stylesheet" href="matios-ui-numberinput.css">
<script src="matios-ui-numberinput.js"></script>
```

## Uso básico

```js
new MTS.NumberInput('#el', {
  label:    'Cantidad',
  value:    1,
  min:      0,
  max:      100,
  step:     1,
  onChange: (value, formatted) => console.log(value, formatted),
})
```

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `value` | `number` | `0` | Valor inicial |
| `min` | `number` | `null` | Valor mínimo |
| `max` | `number` | `null` | Valor máximo |
| `step` | `number` | `1` | Paso de incremento/decremento |
| `decimals` | `number` | `0` | Decimales a mostrar |
| `label` | `string` | `''` | Etiqueta del input |
| `placeholder` | `string` | `''` | Placeholder |
| `hint` | `string` | `''` | Texto de ayuda debajo |
| `prefix` | `string` | `''` | Prefijo visible (ej: `$`) |
| `suffix` | `string` | `''` | Sufijo visible (ej: `kg`, `°C`) |
| `format` | `string` | `'plain'` | `'plain'` \| `'currency'` \| `'percent'` |
| `locale` | `string` | `'es-CL'` | Locale para Intl.NumberFormat |
| `currency` | `string` | `'CLP'` | Código de moneda (ISO 4217) |
| `size` | `string` | `'md'` | `'sm'` \| `'md'` \| `'lg'` |
| `disabled` | `boolean` | `false` | Desactiva el input |
| `readonly` | `boolean` | `false` | Solo lectura |
| `onChange` | `function` | `null` | `(value, formatted) => {}` |
| `onFocus` | `function` | `null` | Al enfocar |
| `onBlur` | `function` | `null` | Al perder foco |

## API

```js
const ni = new MTS.NumberInput('#el', { value: 50, min: 0, max: 100 })

ni.getValue()           // → 50 (número)
ni.setValue(75)         // actualiza y dispara onChange
ni.setValue(75, true)   // silent — no dispara onChange
ni.setMin(10)
ni.setMax(90)
ni.setError('Valor fuera de rango')
ni.clearError()
ni.disable()
ni.enable()
ni.focus()
```

## Formatos

```js
// Moneda
new MTS.NumberInput('#el', {
  format: 'currency', currency: 'CLP', locale: 'es-CL',
  value: 15000, step: 500,
})

// Porcentaje
new MTS.NumberInput('#el', {
  format: 'percent', min: 0, max: 100, step: 5,
  value: 25,
})

// Prefix/Suffix manual
new MTS.NumberInput('#el', {
  prefix: '$', suffix: 'USD',
  value: 99, decimals: 2,
})
```

## Eventos

```js
new MTS.NumberInput('#el', {
  onChange: (value, formatted) => {
    // value     → número: 15000
    // formatted → string: "$15.000"
  },
  onFocus: (e) => {},
  onBlur:  (e) => {},
})
```

---

## HTML declarativo

```html
<div id="miNum"
  data-label="Precio"
  data-min="0"
  data-max="99999"
  data-step="100"
  data-prefix="$"
  data-decimals="2">
</div>

<script>
new MTS.NumberInput('#miNum', {
  onChange: (v) => console.log('Precio:', v),
})
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-label` | `label` | |
| `data-value` | `value` | Valor inicial |
| `data-min` | `min` | |
| `data-max` | `max` | |
| `data-step` | `step` | |
| `data-decimals` | `decimals` | |
| `data-prefix` | `prefix` | Ej: `$`, `€` |
| `data-suffix` | `suffix` | Ej: `kg`, `%` |
| `data-disabled` | `disabled` | (presencia activa) |
| `data-readonly` | `readonly` | (presencia activa) |
| `data-size` | `size` | `sm`·`''`·`lg` |

