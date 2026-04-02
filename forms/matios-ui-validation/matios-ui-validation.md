# MTS.Validate

Validación de formularios sin dependencias. Se integra automáticamente con `MTS.Input` — detecta las instancias y usa su propia API de error/éxito.

---

## Instalación
```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="../matios-ui-input/matios-ui-input.css">
<script src="../matios-ui-input/matios-ui-input.js"></script>
<script src="matios-ui-validation.js"></script>
```

---

## Uso básico — formulario completo
```html
<form id="mi-form">
  <div id="campo-nombre"></div>
  <div id="campo-email"></div>
  <div id="campo-edad"></div>
  <button type="submit" class="mts-btn mts-btn--primary">Enviar</button>
</form>
```

```js
/* Crear inputs con MTS.Input */
new MTS.Input('#campo-nombre', {
  label: 'Nombre',
  placeholder: 'Tu nombre completo',
  rules: { required: true, minLength: 3 },
})

new MTS.Input('#campo-email', {
  label: 'Email',
  type: 'email',
  placeholder: 'correo@ejemplo.com',
  rules: { required: true, email: true },
})

new MTS.Input('#campo-edad', {
  label: 'Edad',
  type: 'number',
  rules: { required: true, min: 18, max: 99 },
})

/* MTS.Validate detecta los MTS.Input con reglas automáticamente */
const v = new MTS.Validate('#mi-form', {
  rules: {
    nombre: { required: true, minLength: 3 },
    email:  { required: true, email: true },
    edad:   { required: true, min: 18, max: 99 },
  },
  onValid:   (data) => console.log('Datos válidos:', data),
  onInvalid: (errors) => console.log('Errores:', errors),
})
```

> `MTS.Validate` detecta si el campo tiene una instancia `MTS.Input` asociada y usa su API (`setError()`, `clearError()`) para mostrar los mensajes. No hay que conectarlos manualmente.

---

## Reglas disponibles

| Regla | Tipo | Descripción |
|-------|------|-------------|
| `required` | `boolean` | Campo obligatorio |
| `minLength` | `number` | Mínimo de caracteres |
| `maxLength` | `number` | Máximo de caracteres |
| `min` | `number` | Valor mínimo (numérico) |
| `max` | `number` | Valor máximo (numérico) |
| `email` | `boolean` | Valida formato email |
| `url` | `boolean` | Valida formato URL |
| `number` | `boolean` | Solo números |
| `integer` | `boolean` | Solo enteros |
| `pattern` | `RegExp` | Expresión regular |
| `equalTo` | `string` | Igual al campo indicado (ej: `'#pass'`) |
| `rut` | `boolean` | Validación RUT chileno |
| `phone` | `boolean` | Formato de teléfono |
| `date` | `boolean` | Fecha válida |
| `minDate` | `string` | Fecha mínima (ej: `'2024-01-01'`) |
| `maxDate` | `string` | Fecha máxima |
| `accept` | `string` | Tipos de archivo (`'image/*'`, `'.pdf,.docx'`) |
| `maxSize` | `number` | Tamaño máximo de archivo en MB |
| `custom` | `function` | Validación personalizada `(value, el) => true \| 'mensaje'` |

---

## Mensajes personalizados
```js
new MTS.Validate('#form', {
  rules: {
    nombre: { required: true, minLength: 3 },
  },
  messages: {
    nombre: {
      required:  'El nombre no puede estar vacío',
      minLength: 'Ingresa al menos 3 letras',
    },
  },
})
```

---

## Configuración completa
```js
new MTS.Validate('#form', {
  rules: {
    nombre:   { required: true, minLength: 3 },
    email:    { required: true, email: true },
    pass:     { required: true, minLength: 8, pattern: /(?=.*\d)(?=.*[a-z])/ },
    pass2:    { required: true, equalTo: '#pass' },
    rut:      { required: true, rut: true },
    edad:     { required: true, min: 18, max: 99 },
    archivo:  { required: true, accept: 'image/*', maxSize: 2 },
    custom:   { custom: (val) => val !== 'admin' ? true : 'Nombre no permitido' },
  },
  messages: { /* mensajes custom por campo */ },

  validateOnBlur:  true,   // validar al salir del campo
  validateOnInput: false,  // validar mientras escribe

  onValid:   (data)   => enviarFormulario(data),
  onInvalid: (errors) => console.log('Errores:', errors),
})
```

---

## API
```js
const v = new MTS.Validate('#form', config)

v.validate()                    // → boolean — valida todo el formulario
v.isValid()                     // → boolean — estado actual
v.getErrors()                   // → { campo: 'mensaje', ... }
v.getData()                     // → { campo: valor, ... }
v.clearErrors()                 // limpia todos los errores visualmente
v.setError('email', 'Ya existe este email')  // error desde servidor
v.addRule('nombre', 'minLength', 5)          // agregar regla en runtime
```

---

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — integración con MTS.Input, RUT chileno, validación custom |
