# MTS.Input

[EN] Input component — text, email, password, number and textarea with validation, icons, clearable and character counter.
[ES] Componente input — texto, email, password, número y textarea con validación, íconos, clearable y contador de caracteres.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-input.css">
<script src="matios-ui-input.js"></script>
```

---

## Options / Opciones

[EN] All options are passed as the second argument to the constructor.
[ES] Todas las opciones se pasan como segundo argumento al constructor.

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `type` | `string` | `'text'` | `'text'` · `'email'` · `'password'` · `'number'` · `'textarea'` |
| `label` | `string` | `''` | [EN] Field label / [ES] Etiqueta del campo |
| `placeholder` | `string` | `''` | [EN] Placeholder text / [ES] Texto placeholder |
| `hint` | `string` | `''` | [EN] Helper text below field / [ES] Texto de ayuda debajo del campo |
| `value` | `string` | `''` | [EN] Initial value / [ES] Valor inicial |
| `required` | `boolean` | `false` | [EN] Marks field as required / [ES] Marca el campo como requerido |
| `disabled` | `boolean` | `false` | [EN] Disables all interaction / [ES] Deshabilita toda interacción |
| `readonly` | `boolean` | `false` | [EN] Read-only, not editable / [ES] Solo lectura, no editable |
| `clearable` | `boolean` | `false` | [EN] Shows × button to clear / [ES] Muestra botón × para limpiar |
| `showPassword` | `boolean` | `false` | [EN] Toggle to show password / [ES] Toggle para mostrar contraseña |
| `iconLeft` | `string` | `null` | [EN] Left icon SVG string / [ES] SVG string del ícono izquierdo |
| `iconRight` | `string` | `null` | [EN] Right icon SVG string / [ES] SVG string del ícono derecho |
| `maxLength` | `number` | `null` | [EN] Maximum characters / [ES] Máximo de caracteres |
| `showCount` | `boolean` | `false` | [EN] Shows character counter / [ES] Muestra contador de caracteres |
| `rows` | `number` | `4` | [EN] Textarea rows / [ES] Filas del textarea |
| `validateOnBlur` | `boolean` | `true` | [EN] Validate when field loses focus / [ES] Valida al perder foco |
| `validateOnInput` | `boolean` | `false` | [EN] Validate on every keystroke / [ES] Valida en cada tecla |
| `rules` | `object` | `{}` | [EN] Validation rules (see below) / [ES] Reglas de validación (ver abajo) |
| `onChange` | `function` | — | [EN] Fires on value change / [ES] Se dispara al cambiar el valor |
| `onFocus` | `function` | — | [EN] Fires on focus / [ES] Se dispara al enfocar |
| `onBlur` | `function` | — | [EN] Fires on blur / [ES] Se dispara al perder foco |
| `onValidate` | `function` | — | [EN] Fires after validation / [ES] Se dispara después de validar |

---

## Validation Rules / Reglas de validación

| Rule | Type | Description / Descripción |
|------|------|---------------------------|
| `required` | `boolean` | [EN] Field cannot be empty / [ES] Campo no puede estar vacío |
| `minLength` | `number` | [EN] Minimum character count / [ES] Mínimo de caracteres |
| `maxLength` | `number` | [EN] Maximum character count / [ES] Máximo de caracteres |
| `min` | `number` | [EN] Minimum value (number type) / [ES] Valor mínimo (tipo number) |
| `max` | `number` | [EN] Maximum value (number type) / [ES] Valor máximo (tipo number) |
| `email` | `boolean` | [EN] Validates email format / [ES] Valida formato email |
| `pattern` | `RegExp` | [EN] Custom regex pattern / [ES] Patrón regex personalizado |
| `patternMessage` | `string` | [EN] Message if pattern fails / [ES] Mensaje si falla el patrón |
| `custom` | `function` | [EN] `(value) => 'error msg' \| null` / [ES] `(valor) => 'mensaje error' \| null` |

---

## Events / Eventos

[EN] Use `onXxx` callbacks in the constructor. This is the recommended approach — no need for `addEventListener`.
[ES] Usa los callbacks `onXxx` en el constructor. Este es el enfoque recomendado — no necesitas `addEventListener`.

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

[EN] A disabled input cannot be interacted with. The visual style adapts to each theme using `--mts-text-disabled`.
[ES] Un input disabled no puede ser interactuado. El estilo visual se adapta a cada tema usando `--mts-text-disabled`.

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

[EN] A readonly input shows its value but cannot be edited. Visually different from disabled.
[ES] Un input readonly muestra su valor pero no puede editarse. Visualmente diferente al disabled.

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

[EN] Declare the field in HTML using `data-*` attributes, then instantiate with JavaScript.
[ES] Declara el campo en HTML usando atributos `data-*`, luego instancia con JavaScript.

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

[EN] Available `data-*` attributes:
[ES] Atributos `data-*` disponibles:

| Attribute / Atributo | JS Option | Description / Descripción |
|----------------------|-----------|---------------------------|
| `data-type` | `type` | `text` · `email` · `password` · `number` · `textarea` |
| `data-label` | `label` | [EN] Field label / [ES] Etiqueta |
| `data-placeholder` | `placeholder` | |
| `data-hint` | `hint` | [EN] Helper text / [ES] Texto de ayuda |
| `data-value` | `value` | [EN] Initial value / [ES] Valor inicial |
| `data-name` | `name` | [EN] Field name / [ES] Nombre del campo |
| `data-required` | `required` | [EN] Presence activates / [ES] Presencia activa |
| `data-disabled` | `disabled` | [EN] Presence activates / [ES] Presencia activa |
| `data-readonly` | `readonly` | [EN] Presence activates / [ES] Presencia activa |
| `data-clearable` | `clearable` | [EN] Presence activates / [ES] Presencia activa |
| `data-show-password` | `showPassword` | [EN] Presence activates / [ES] Presencia activa |
| `data-show-count` | `showCount` | [EN] Presence activates / [ES] Presencia activa |
| `data-max-length` | `maxLength` | [EN] Maximum characters / [ES] Máximo de caracteres |
| `data-rows` | `rows` | [EN] Textarea rows / [ES] Filas del textarea |

---

## JavaScript Usage / Uso JavaScript

[EN] Create the component entirely from JavaScript.
[ES] Crea el componente completamente desde JavaScript.

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

[EN] Methods available on the instance after creation.
[ES] Métodos disponibles en la instancia después de crearla.

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

[EN] If you need to listen from outside the component instance, use the native DOM events.
[ES] Si necesitas escuchar desde fuera de la instancia, usa los eventos DOM nativos.

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

## Changelog

| Version | Description |
|---------|-------------|
| 2.0.0 | [EN] Bilingual docs, improved disabled CSS using `--mts-text-disabled`, added `onValidate` / [ES] Docs bilingüe, CSS disabled mejorado usando `--mts-text-disabled`, agregado `onValidate` |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
