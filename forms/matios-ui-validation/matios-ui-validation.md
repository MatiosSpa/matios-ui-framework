# MTS.Validate

🇬🇧 Form validation without dependencies. Auto-integrates with `MTS.Input` — detects instances and uses their own error/success API.
🇪🇸 Validación de formularios sin dependencias. Se integra automáticamente con `MTS.Input` — detecta las instancias y usa su propia API de error/éxito.

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

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `rules` | `object` | `{}` | 🇬🇧 Validation rules per field name / 🇪🇸 Reglas de validación por nombre de campo |
| `messages` | `object` | `{}` | 🇬🇧 Custom error messages per field/rule / 🇪🇸 Mensajes de error personalizados |
| `validateOnBlur` | `boolean` | `true` | 🇬🇧 Validate when field loses focus / 🇪🇸 Validar al perder foco |
| `validateOnInput` | `boolean` | `false` | 🇬🇧 Validate on every keystroke / 🇪🇸 Validar en cada tecla |
| `onValid` | `function` | — | 🇬🇧 Fires on submit when form is valid / 🇪🇸 Se dispara al enviar cuando el formulario es válido |
| `onInvalid` | `function` | — | 🇬🇧 Fires on submit when form has errors / 🇪🇸 Se dispara al enviar cuando hay errores |

---

## Events / Eventos

🇬🇧 Use `onValid` and `onInvalid` in the constructor.
🇪🇸 Usa `onValid` y `onInvalid` en el constructor.

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

| Rule | Type | 🇬🇧 Description / 🇪🇸 Descripción |
|------|------|--------------------------------------|
| `required` | `boolean` | 🇬🇧 Field cannot be empty / 🇪🇸 Campo no puede estar vacío |
| `minLength` | `number` | 🇬🇧 Minimum characters / 🇪🇸 Mínimo de caracteres |
| `maxLength` | `number` | 🇬🇧 Maximum characters / 🇪🇸 Máximo de caracteres |
| `min` | `number` | 🇬🇧 Minimum numeric value / 🇪🇸 Valor numérico mínimo |
| `max` | `number` | 🇬🇧 Maximum numeric value / 🇪🇸 Valor numérico máximo |
| `email` | `boolean` | 🇬🇧 Valid email format / 🇪🇸 Formato email válido |
| `url` | `boolean` | 🇬🇧 Valid URL format / 🇪🇸 Formato URL válido |
| `number` | `boolean` | 🇬🇧 Numeric only / 🇪🇸 Solo números |
| `integer` | `boolean` | 🇬🇧 Integer only / 🇪🇸 Solo enteros |
| `pattern` | `RegExp` | 🇬🇧 Custom regex / 🇪🇸 Regex personalizado |
| `equalTo` | `string` | 🇬🇧 Must equal field (e.g. `'#pass'`) / 🇪🇸 Debe ser igual al campo |
| `rut` | `boolean` | 🇬🇧 Chilean RUT validation / 🇪🇸 Validación RUT chileno |
| `phone` | `boolean` | 🇬🇧 Phone format / 🇪🇸 Formato teléfono |
| `date` | `boolean` | 🇬🇧 Valid date / 🇪🇸 Fecha válida |
| `minDate` | `string` | 🇬🇧 Min date (e.g. `'2024-01-01'`) / 🇪🇸 Fecha mínima |
| `maxDate` | `string` | 🇬🇧 Max date / 🇪🇸 Fecha máxima |
| `accept` | `string` | 🇬🇧 File types (`'image/*'`, `'.pdf'`) / 🇪🇸 Tipos de archivo |
| `maxSize` | `number` | 🇬🇧 Max file size in MB / 🇪🇸 Tamaño máximo en MB |
| `custom` | `function` | 🇬🇧 `(value, el) => true \| 'error'` / 🇪🇸 Validación personalizada |

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
