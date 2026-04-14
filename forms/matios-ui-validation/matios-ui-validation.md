# MTS.Validate

[EN] Form validation without dependencies. Auto-integrates with `MTS.Input` — detects instances and uses their own error/success API.
[ES] Validación de formularios sin dependencias. Se integra automáticamente con `MTS.Input` — detecta las instancias y usa su propia API de error/éxito.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-input.css">
<script src="matios-ui-input.js"></script>
<script src="matios-ui-validation.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `rules` | `object` | `{}` | [EN] Validation rules per field name / [ES] Reglas de validación por nombre de campo |
| `messages` | `object` | `{}` | [EN] Custom error messages per field/rule / [ES] Mensajes de error personalizados |
| `validateOnBlur` | `boolean` | `true` | [EN] Validate when field loses focus / [ES] Validar al perder foco |
| `validateOnInput` | `boolean` | `false` | [EN] Validate on every keystroke / [ES] Validar en cada tecla |
| `onValid` | `function` | — | [EN] Fires on submit when form is valid / [ES] Se dispara al enviar cuando el formulario es válido |
| `onInvalid` | `function` | — | [EN] Fires on submit when form has errors / [ES] Se dispara al enviar cuando hay errores |

---

## Events / Eventos

[EN] Use `onValid` and `onInvalid` in the constructor.
[ES] Usa `onValid` y `onInvalid` en el constructor.

```js
new MTS.Validate('#my-form', {
  rules: { ... },
  // Fires on submit when all fields are valid / Se dispara al enviar cuando todo es válido
  onValid: (data) => {
    console.log(data); // → { fieldName: value, ... }
    submitToServer(data);
  },
  // Fires on submit when there are validation errors / Se dispara al enviar cuando hay errores
  onInvalid: (errors) => {
    console.log(errors); // → { fieldName: 'Error message', ... }
  },
});
```

---

## Validation Rules / Reglas de validación

| Rule | Type | [EN] Description / [ES] Descripción |
|------|------|--------------------------------------|
| `required` | `boolean` | [EN] Field cannot be empty / [ES] Campo no puede estar vacío |
| `minLength` | `number` | [EN] Minimum characters / [ES] Mínimo de caracteres |
| `maxLength` | `number` | [EN] Maximum characters / [ES] Máximo de caracteres |
| `min` | `number` | [EN] Minimum numeric value / [ES] Valor numérico mínimo |
| `max` | `number` | [EN] Maximum numeric value / [ES] Valor numérico máximo |
| `email` | `boolean` | [EN] Valid email format / [ES] Formato email válido |
| `url` | `boolean` | [EN] Valid URL format / [ES] Formato URL válido |
| `number` | `boolean` | [EN] Numeric only / [ES] Solo números |
| `integer` | `boolean` | [EN] Integer only / [ES] Solo enteros |
| `pattern` | `RegExp` | [EN] Custom regex / [ES] Regex personalizado |
| `equalTo` | `string` | [EN] Must equal field (e.g. `'#pass'`) / [ES] Debe ser igual al campo |
| `rut` | `boolean` | [EN] Chilean RUT validation / [ES] Validación RUT chileno |
| `phone` | `boolean` | [EN] Phone format / [ES] Formato teléfono |
| `date` | `boolean` | [EN] Valid date / [ES] Fecha válida |
| `minDate` | `string` | [EN] Min date (e.g. `'2024-01-01'`) / [ES] Fecha mínima |
| `maxDate` | `string` | [EN] Max date / [ES] Fecha máxima |
| `accept` | `string` | [EN] File types (`'image/*'`, `'.pdf'`) / [ES] Tipos de archivo |
| `maxSize` | `number` | [EN] Max file size in MB / [ES] Tamaño máximo en MB |
| `custom` | `function` | [EN] `(value, el) => true \| 'error'` / [ES] Validación personalizada |

---

## HTML Usage / Uso HTML

```html
<form id="my-form">
  <div id="field-name"></div>
  <div id="field-email"></div>
  <button type="submit" class="mts-btn mts-btn--primary">Submit</button>
</form>

<script>
  // name: must match the key in rules / name: debe coincidir con la clave en rules
  new MTS.Input('#field-name',  { name: 'name',  label: 'Name',  rules: { required: true, minLength: 3 } });
  new MTS.Input('#field-email', { name: 'email', label: 'Email', type: 'email', rules: { required: true, email: true } });

  new MTS.Validate('#my-form', {
    rules: {
      name:  { required: true, minLength: 3 },
      email: { required: true, email: true },
    },
    onValid:   (data)   => console.log('Valid:', data),
    onInvalid: (errors) => console.log('Errors:', errors),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// MTS.Validate detects MTS.Input instances automatically
// MTS.Validate detecta instancias MTS.Input automáticamente
// IMPORTANT: name: must match the key in rules
// IMPORTANTE: name: debe coincidir con la clave en rules
new MTS.Input('#field-name',  {
  name:  'name',
  label: 'Full name',
  rules: { required: true, minLength: 3 },
});
new MTS.Input('#field-email', {
  name:  'email',
  label: 'Email',
  type:  'email',
  rules: { required: true, email: true },
});
new MTS.Input('#field-pass',  {
  name:  'password',
  label: 'Password',
  type:  'password',
  rules: { required: true, minLength: 8, pattern: /(?=.*\d)(?=.*[a-z])/ },
});

const v = new MTS.Validate('#my-form', {
  rules: {
    name:  { required: true, minLength: 3 },
    email: { required: true, email: true },
    pass:  { required: true, minLength: 8, pattern: /(?=.*\d)(?=.*[a-z])/ },
  },

  // Custom error messages / Mensajes de error personalizados
  messages: {
    name:  { required: 'Name cannot be empty', minLength: 'At least 3 characters' },
    email: { email: 'Enter a valid email address' },
  },

  // Validate on blur / Validar al perder foco
  validateOnBlur: true,

  // Fires on valid submit / Se dispara al enviar válido
  onValid: (data) => submitToServer(data),

  // Fires on invalid submit / Se dispara al enviar inválido
  onInvalid: (errors) => console.log(errors),
});
```

---

## API

```js
const v = new MTS.Validate('#my-form', { ... });

// Validate entire form / Validar todo el formulario
v.validate()                         // → boolean

// Check current validity / Verificar validez actual
v.isValid()                          // → boolean

// Get current errors / Obtener errores actuales
v.getErrors()                        // → { fieldName: 'message', ... }

// Get form data / Obtener datos del formulario
v.getData()                          // → { fieldName: value, ... }

// Clear all visual errors / Limpiar todos los errores visuales
v.clearErrors()

// Set a server-side error / Establecer error del lado del servidor
v.setError('email', 'Email already exists')

// Add a rule at runtime / Agregar una regla en runtime
v.addRule('name', 'minLength', 5)
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual docs, standardized structure / [ES] Docs bilingüe, estructura estandarizada |
| 1.0.0 | [EN] Initial release — MTS.Input integration, Chilean RUT, custom validation / [ES] Versión inicial |
