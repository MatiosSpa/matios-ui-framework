# matios-ui-input

Input, email, password, number y textarea con validación, íconos y contador de caracteres.

## Instalación
```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-input.css">
<script src="matios-ui-input.js"></script>
```

## Uso rápido
```js
const input = new MTS.Input('#mi-campo', {
  label:       'Nombre',
  placeholder: 'Ingresa tu nombre',
  required:    true,
  hint:        'Mínimo 3 caracteres',
  rules:       { minLength: 3 },
})
```

## Tipos
```js
new MTS.Input('#campo', { type: 'text' })
new MTS.Input('#campo', { type: 'email' })
new MTS.Input('#campo', { type: 'password', showPassword: true })
new MTS.Input('#campo', { type: 'number', rules: { min: 0, max: 100 } })
new MTS.Input('#campo', { type: 'textarea', rows: 6 })
```

## Configuración completa
```js
new MTS.Input('#campo', {
  type:            'text',
  label:           'Email',
  placeholder:     'correo@ejemplo.com',
  hint:            'Usaremos este email para notificaciones',
  value:           '',
  required:        true,
  disabled:        false,
  readonly:        false,
  iconLeft:        '<svg>...</svg>',
  iconRight:       '<svg>...</svg>',
  clearable:       true,
  showPassword:    false,
  maxLength:       100,
  showCount:       true,
  rows:            4,           // solo textarea
  validateOnBlur:  true,
  validateOnInput: false,
  rules: {
    required:      true,
    minLength:     3,
    maxLength:     50,
    min:           0,           // solo number
    max:           100,         // solo number
    email:         true,        // valida formato email
    pattern:       /^[a-z]+$/,
    patternMessage:'Solo letras minúsculas',
    custom:        (val) => val === 'admin' ? 'Nombre no permitido' : null,
  },
  onChange:  (e) => console.log(e.detail.value),
  onFocus:   (e) => {},
  onBlur:    (e) => {},
})
```

## API
```js
const input = new MTS.Input('#campo', config)

input.getValue()          // → string
input.setValue('hola')
input.clear()
input.focus()
input.disable()
input.enable()
input.validate()          // → boolean
input.isValid()           // → boolean
input.setError('Mensaje de error')
input.clearError()
input.destroy()

input.on('change',   (e) => {})
input.on('validate', (e) => console.log(e.detail.valid, e.detail.errors))
```

## Eventos DOM
```js
document.getElementById('campo')
  .addEventListener('mts:input:change', (e) => console.log(e.detail.value))
```

| Evento | Namespace DOM |
|--------|--------------|
| `change` | `mts:input:change` |
| `focus` | `mts:input:focus` |
| `blur` | `mts:input:blur` |
| `validate` | `mts:input:validate` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial |

---

## HTML declarativo

```html
<div id="miInput"
  data-label="Correo"
  data-type="email"
  data-placeholder="usuario@mail.com"
  data-hint="Tu correo principal"
  data-required
  data-clearable>
</div>

<script>
const inp = new MTS.Input('#miInput', {
  onChange: (v) => console.log(v),
})
inp.getValue()
inp.setValue('test@mail.com')
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-type` | `type` | `text`·`email`·`password`·`number`·`textarea` |
| `data-label` | `label` | Etiqueta |
| `data-placeholder` | `placeholder` | |
| `data-hint` | `hint` | Texto de ayuda |
| `data-value` | `value` | Valor inicial |
| `data-name` | `name` | Nombre del campo |
| `data-required` | `required` | (presencia activa) |
| `data-disabled` | `disabled` | (presencia activa) |
| `data-readonly` | `readonly` | (presencia activa) |
| `data-clearable` | `clearable` | (presencia activa) |
| `data-show-password` | `showPassword` | (presencia activa) |
| `data-show-count` | `showCount` | (presencia activa) |
| `data-max-length` | `maxLength` | Máximo caracteres |
| `data-rows` | `rows` | Filas para textarea |

