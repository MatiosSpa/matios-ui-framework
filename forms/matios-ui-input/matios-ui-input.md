# MTS.Input

🇬🇧 Input component — text, email, password, number and textarea with validation, icons, clearable and character counter.
🇪🇸 Componente input — texto, email, password, número y textarea con validación, íconos, clearable y contador de caracteres.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-input.css">
<script src="matios-ui-input.js"></script>
```

---

## Options / Opciones

🇬🇧 All options are passed as the second argument to the constructor.
🇪🇸 Todas las opciones se pasan como segundo argumento al constructor.

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `type` | `string` | `'text'` | `'text'` · `'email'` · `'password'` · `'number'` · `'textarea'` |
| `label` | `string` | `''` | 🇬🇧 Field label / 🇪🇸 Etiqueta del campo |
| `placeholder` | `string` | `''` | 🇬🇧 Placeholder text / 🇪🇸 Texto placeholder |
| `hint` | `string` | `''` | 🇬🇧 Helper text below field / 🇪🇸 Texto de ayuda debajo del campo |
| `value` | `string` | `''` | 🇬🇧 Initial value / 🇪🇸 Valor inicial |
| `required` | `boolean` | `false` | 🇬🇧 Marks field as required / 🇪🇸 Marca el campo como requerido |
| `disabled` | `boolean` | `false` | 🇬🇧 Disables all interaction / 🇪🇸 Deshabilita toda interacción |
| `readonly` | `boolean` | `false` | 🇬🇧 Read-only, not editable / 🇪🇸 Solo lectura, no editable |
| `clearable` | `boolean` | `false` | 🇬🇧 Shows × button to clear / 🇪🇸 Muestra botón × para limpiar |
| `showPassword` | `boolean` | `false` | 🇬🇧 Toggle to show password / 🇪🇸 Toggle para mostrar contraseña |
| `iconLeft` | `string` | `null` | 🇬🇧 Left icon SVG string / 🇪🇸 SVG string del ícono izquierdo |
| `iconRight` | `string` | `null` | 🇬🇧 Right icon SVG string / 🇪🇸 SVG string del ícono derecho |
| `maxLength` | `number` | `null` | 🇬🇧 Maximum characters / 🇪🇸 Máximo de caracteres |
| `showCount` | `boolean` | `false` | 🇬🇧 Shows character counter / 🇪🇸 Muestra contador de caracteres |
| `rows` | `number` | `4` | 🇬🇧 Textarea rows / 🇪🇸 Filas del textarea |
| `selectOnFocus` | `boolean` | `false` | 🇬🇧 Selects all text when the field receives focus. Does not apply to `type="password"` / 🇪🇸 Selecciona todo el texto al recibir foco. No aplica a `type="password"` |
| `nextOnEnter` | `boolean` | `false` | 🇬🇧 Pressing Enter moves focus to the next input in the DOM. Does not apply to `type="textarea"` / 🇪🇸 Enter mueve el foco al siguiente input en el DOM. No aplica a `type="textarea"` |
| `validateOnBlur` | `boolean` | `true` | 🇬🇧 Validate when field loses focus / 🇪🇸 Valida al perder foco |
| `validateOnInput` | `boolean` | `false` | 🇬🇧 Validate on every keystroke / 🇪🇸 Valida en cada tecla |
| `rules` | `object` | `{}` | 🇬🇧 Validation rules (see below) / 🇪🇸 Reglas de validación (ver abajo) |
| `onChange` | `function` | — | 🇬🇧 Fires on value change / 🇪🇸 Se dispara al cambiar el valor |
| `onFocus` | `function` | — | 🇬🇧 Fires on focus / 🇪🇸 Se dispara al enfocar |
| `onBlur` | `function` | — | 🇬🇧 Fires on blur / 🇪🇸 Se dispara al perder foco |
| `onValidate` | `function` | — | 🇬🇧 Fires after validation / 🇪🇸 Se dispara después de validar |

---

## Validation Rules / Reglas de validación

| Rule | Type | Description / Descripción |
|------|------|---------------------------|
| `required` | `boolean` | 🇬🇧 Field cannot be empty / 🇪🇸 Campo no puede estar vacío |
| `minLength` | `number` | 🇬🇧 Minimum character count / 🇪🇸 Mínimo de caracteres |
| `maxLength` | `number` | 🇬🇧 Maximum character count / 🇪🇸 Máximo de caracteres |
| `min` | `number` | 🇬🇧 Minimum value (number type) / 🇪🇸 Valor mínimo (tipo number) |
| `max` | `number` | 🇬🇧 Maximum value (number type) / 🇪🇸 Valor máximo (tipo number) |
| `email` | `boolean` | 🇬🇧 Validates email format / 🇪🇸 Valida formato email |
| `pattern` | `RegExp` | 🇬🇧 Custom regex pattern / 🇪🇸 Patrón regex personalizado |
| `patternMessage` | `string` | 🇬🇧 Message if pattern fails / 🇪🇸 Mensaje si falla el patrón |
| `custom` | `function` | 🇬🇧 `(value) => 'error msg' \| null` / 🇪🇸 `(valor) => 'mensaje error' \| null` |

---

## Events / Eventos

🇬🇧 Use `onXxx` callbacks in the constructor. This is the recommended approach — no need for `addEventListener`.
🇪🇸 Usa los callbacks `onXxx` en el constructor. Este es el enfoque recomendado — no necesitas `addEventListener`.

```js
new MTS.Input('#my-input', {
  // Fires on every value change / Se dispara en cada cambio de valor
  onChange: (e) => console.log(e.detail.value),

  // Fires when the field gains focus / Se dispara cuando el campo obtiene foco
  onFocus: (e) => console.log('focused'),

  // Fires when the field loses focus / Se dispara cuando el campo pierde foco
  onBlur: (e) => console.log(e.detail.value),

  // Fires after every validation run / Se dispara después de cada validación
  onValidate: (e) => {
    console.log(e.detail.valid);   // → true | false
    console.log(e.detail.errors);  // → ['Error message', ...]
  },
});
```

---

## Disabled State / Estado Disabled

🇬🇧 A disabled input cannot be interacted with. The visual style adapts to each theme using `--mts-text-disabled`.
🇪🇸 Un input disabled no puede ser interactuado. El estilo visual se adapta a cada tema usando `--mts-text-disabled`.

```html
<!-- HTML declarativo / HTML declarative -->
<div id="inp-disabled"
  data-label="Read only field"
  data-value="Cannot be edited"
  data-disabled>
</div>
<script>
  new MTS.Input('#inp-disabled');
</script>
```

```js
// Via JavaScript / Vía JavaScript
const inp = new MTS.Input('#my-input', {
  label:    'Disabled field',
  value:    'Cannot be edited',
  disabled: true,
});

// Toggle at runtime / Alternar en runtime
inp.disable()
inp.enable()
```

---

## Readonly State / Estado Readonly

🇬🇧 A readonly input shows its value but cannot be edited. Visually different from disabled.
🇪🇸 Un input readonly muestra su valor pero no puede editarse. Visualmente diferente al disabled.

```html
<div id="inp-readonly"
  data-label="Fixed value"
  data-value="Cannot be changed"
  data-readonly>
</div>
<script>
  new MTS.Input('#inp-readonly');
</script>
```

---

## HTML Usage / Uso HTML

🇬🇧 Declare the field in HTML using `data-*` attributes, then instantiate with JavaScript.
🇪🇸 Declara el campo en HTML usando atributos `data-*`, luego instancia con JavaScript.

```html
<div id="inp-email"
  data-type="email"
  data-label="Email address"
  data-placeholder="user@example.com"
  data-hint="We'll use this for notifications"
  data-required
  data-clearable>
</div>

<script>
  new MTS.Input('#inp-email', {
    onChange:   (e) => console.log(e.detail.value),
    onValidate: (e) => console.log(e.detail.valid),
  });
</script>
```

🇬🇧 Available `data-*` attributes:
🇪🇸 Atributos `data-*` disponibles:

| Attribute / Atributo | JS Option | Description / Descripción |
|----------------------|-----------|---------------------------|
| `data-type` | `type` | `text` · `email` · `password` · `number` · `textarea` |
| `data-label` | `label` | 🇬🇧 Field label / 🇪🇸 Etiqueta |
| `data-placeholder` | `placeholder` | 🇬🇧 Placeholder text / 🇪🇸 Texto de marcador |
| `data-hint` | `hint` | 🇬🇧 Helper text / 🇪🇸 Texto de ayuda |
| `data-value` | `value` | 🇬🇧 Initial value / 🇪🇸 Valor inicial |
| `data-name` | `name` | 🇬🇧 Field name / 🇪🇸 Nombre del campo |
| `data-required` | `required` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |
| `data-disabled` | `disabled` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |
| `data-readonly` | `readonly` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |
| `data-clearable` | `clearable` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |
| `data-show-password` | `showPassword` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |
| `data-show-count` | `showCount` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |
| `data-max-length` | `maxLength` | 🇬🇧 Maximum characters / 🇪🇸 Máximo de caracteres |
| `data-rows` | `rows` | 🇬🇧 Textarea rows / 🇪🇸 Filas del textarea |
| `data-select-on-focus` | `selectOnFocus` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |
| `data-next-on-enter` | `nextOnEnter` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |

---

## JavaScript Usage / Uso JavaScript

🇬🇧 Create the component entirely from JavaScript.
🇪🇸 Crea el componente completamente desde JavaScript.

```js
const inp = new MTS.Input('#my-input', {
  // Field type / Tipo de campo
  type: 'email',

  // Field label / Etiqueta del campo
  label: 'Email address',

  // Placeholder text / Texto placeholder
  placeholder: 'user@example.com',

  // Helper text / Texto de ayuda
  hint: "We'll use this for notifications",

  // Mark as required / Marcar como requerido
  required: true,

  // Validation rules / Reglas de validación
  rules: { email: true },

  // Fires on value change / Se dispara al cambiar el valor
  onChange: (e) => console.log(e.detail.value),

  // Fires after validation / Se dispara después de validar
  onValidate: (e) => {
    if (!e.detail.valid) console.log(e.detail.errors[0]);
  },
});
```

---

## API

🇬🇧 Methods available on the instance after creation.
🇪🇸 Métodos disponibles en la instancia después de crearla.

```js
const inp = new MTS.Input('#my-input', { ... });

// Get current value / Obtener valor actual
inp.getValue()              // → string

// Set value programmatically / Establecer valor programáticamente
inp.setValue('hello')

// Clear value and error / Limpiar valor y error
inp.clear()

// Focus the field / Enfocar el campo
inp.focus()

// Disable / enable / Deshabilitar / habilitar
inp.disable()
inp.enable()

// Run validation manually / Ejecutar validación manualmente
inp.validate()              // → boolean

// Check validation state / Verificar estado de validación
inp.isValid()               // → boolean

// Set external error (e.g. from server) / Establecer error externo (ej: del servidor)
inp.setError('Email already exists')

// Clear error / Limpiar error
inp.clearError()

// Destroy the component / Destruir el componente
inp.destroy()
```

---

## DOM Event / Evento DOM

🇬🇧 If you need to listen from outside the component instance, use the native DOM events.
🇪🇸 Si necesitas escuchar desde fuera de la instancia, usa los eventos DOM nativos.

```js
document.getElementById('my-input')
  .querySelector('input')
  .addEventListener('mts:input:change', (e) => {
    console.log(e.detail.value);
  });
```

| Event / Evento | DOM Namespace |
|----------------|---------------|
| `onChange` | `mts:input:change` |
| `onFocus` | `mts:input:focus` |
| `onBlur` | `mts:input:blur` |
| `onValidate` | `mts:input:validate` |

---
