# MTS.PhoneInput

Input de teléfono con selector de país integrado, bandera emoji, formato automático y búsqueda de países. 20 países incluidos. 0 dependencias.

## Uso
```js
new MTS.PhoneInput('#el', {
  country: 'CL',
  label:   'Teléfono',
  onChange: ({ raw, formatted, full, country }) => {
    console.log(full) // '+56 9 1234 5678'
  },
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `country` | `string` | `'CL'` | Código ISO inicial |
| `value` | `string` | `''` | Dígitos iniciales |
| `label` | `string` | `''` | Etiqueta |
| `hint` | `string` | `''` | Texto de ayuda |
| `disabled` | `boolean` | `false` | |
| `size` | `string` | `'md'` | `'sm'`\|`'md'`\|`'lg'` |
| `onChange` | `function` | `null` | `({ raw, formatted, full, country }) => {}` |
| `onCountryChange` | `function` | `null` | `({ country }) => {}` |

## API
```js
const ph = new MTS.PhoneInput('#el', { country:'CL' })
ph.getValue()        // → { raw, formatted, full, country }
ph.setValue('912345678')
ph.setCountry('MX')
ph.setError('Número inválido')
ph.clearError()
ph.disable() / ph.enable()
```

---

## HTML declarativo

```html
<div id="miPhone"
  data-label="Teléfono"
  data-country="CL"
  data-placeholder="9 1234 5678">
</div>

<script>
new MTS.PhoneInput('#miPhone', {
  onChange: ({ full }) => console.log(full),
})
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-label` | `label` | |
| `data-placeholder` | `placeholder` | |
| `data-hint` | `hint` | |
| `data-value` | `value` | Valor inicial |
| `data-country` | `country` | Código de país (`CL`, `AR`...) |
| `data-disabled` | `disabled` | (presencia activa) |
| `data-size` | `size` | `sm`·`''`·`lg` |

