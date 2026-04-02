# Forms — Documentación de componentes

Colección de componentes de formulario. Haz click en cada componente para ver su documentación.

---

+++ MTS.Button — Botones con variantes, tamaños, grupos y estados
Botón con variantes, tamaños, estados y grupos. Envuelve un `<button>` nativo con una API JS limpia.

---

## Instalación
```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-button.css">
<script src="matios-ui-button.js"></script>
```

---

## ─── MTS.Button ───────────────────────────────────────────

### Uso básico
```js
const btn = new MTS.Button('#mi-btn', {
  label:   'Guardar',
  variant: 'primary',
  onClick: (event, instance) => console.log('¡click!'),
})
```

### Variantes
```js
new MTS.Button('#btn', { variant: 'primary'   })   // azul primario (default)
new MTS.Button('#btn', { variant: 'secondary' })   // superficie, con borde
new MTS.Button('#btn', { variant: 'ghost'     })   // solo borde, sin fondo
new MTS.Button('#btn', { variant: 'danger'    })   // rojo — acciones destructivas
new MTS.Button('#btn', { variant: 'warning'   })   // naranja — advertencia
new MTS.Button('#btn', { variant: 'link'      })   // sin borde, apariencia de link
```

### Tamaños
```js
new MTS.Button('#btn', { size: 'xs' })
new MTS.Button('#btn', { size: 'sm' })
new MTS.Button('#btn', { })              // md — default
new MTS.Button('#btn', { size: 'lg' })
new MTS.Button('#btn', { size: 'xl' })
```

### Con íconos
```js
new MTS.Button('#btn', {
  label:     'Descargar',
  iconLeft:  '<svg>...</svg>',
  iconRight: '<svg>...</svg>',
})

// Solo ícono (padding cuadrado)
new MTS.Button('#btn', {
  iconLeft: '<svg>...</svg>',
  iconOnly: true,
})
```

### CSS custom
```js
// Vía className
new MTS.Button('#btn', {
  className: 'mi-clase-extra otra-clase',
})

// Vía style inline
new MTS.Button('#btn', {
  style: { background: '#ff5500', borderColor: '#ff5500', color: '#fff' },
})
```

### Opciones completas
| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `label` | `string` | texto del botón | Texto visible |
| `variant` | `string` | `'primary'` | `'primary'` · `'secondary'` · `'ghost'` · `'danger'` · `'warning'` · `'link'` |
| `size` | `string` | `''` | `'xs'` · `'sm'` · `''` · `'lg'` · `'xl'` |
| `block` | `boolean` | `false` | Ancho 100% |
| `round` | `boolean` | `false` | Border-radius pill |
| `iconOnly` | `boolean` | `false` | Padding cuadrado — sin texto |
| `iconLeft` | `string` | `null` | HTML del ícono izquierdo |
| `iconRight` | `string` | `null` | HTML del ícono derecho |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `loading` | `boolean` | `false` | Muestra spinner |
| `className` | `string` | `''` | Clases CSS adicionales |
| `style` | `object` | `null` | Estilos inline custom |
| `onClick` | `function` | — | `(event, instance) => {}` |

---

## ─── API ──────────────────────────────────────────────────

```js
const btn = new MTS.Button('#btn', { ... })

btn.enable()                   // habilitar
btn.disable()                  // deshabilitar
btn.setLoading(true)           // activar spinner
btn.setLoading(false)          // desactivar spinner
btn.setLabel('Guardado ✓')     // cambiar texto
btn.setVariant('danger')       // cambiar variante

btn.on('click', (e, instance) => {})   // agregar listener
btn.off('click', fn)                   // remover listener
btn.destroy()                          // destruir instancia
```

---

## ─── Eventos DOM ──────────────────────────────────────────

```js
document.getElementById('mi-btn')
  .addEventListener('mts:button:click', (e) => {
    console.log(e.detail.button)   // instancia MTS.Button
  })
```

---

## ─── MTS.ButtonGroup ──────────────────────────────────────

Agrupa botones visualmente — sin gap, bordes compartidos, border-radius solo en los extremos.

```js
new MTS.ButtonGroup('#mi-grupo', [
  { label: 'Día',    variant: 'secondary', onClick: () => {} },
  { label: 'Semana', variant: 'secondary', onClick: () => {} },
  { label: 'Mes',    variant: 'primary',   onClick: () => {} },
])

// Con tamaño uniforme para todo el grupo
new MTS.ButtonGroup('#mi-grupo', [
  { label: 'Exportar', variant: 'ghost',  onClick: () => {} },
  { label: 'Eliminar', variant: 'danger', onClick: () => {} },
], { size: 'sm' })
```

```js
const grupo = new MTS.ButtonGroup('#grupo', [...])
grupo.getButton(0).disable()     // deshabilitar el primer botón
grupo.getButton(1).setLabel('Nuevo texto')
grupo.getButtons()               // → [MTS.Button, MTS.Button, ...]
```

---

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — variante `warning`, `MTS.ButtonGroup`, CSS custom, loading, onClick |
+++

+++ MTS.Input — Input de texto, email, password, número y textarea
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
+++

+++ MTS.Select — Select con búsqueda, multi-select, autocomplete y cascada
Select con búsqueda interna, multi-select, grupos y búsqueda externa async.

---

## Instalación
```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-select.css">
<script src="matios-ui-select.js"></script>
```

---

## Uso básico
```js
const sel = new MTS.Select('#mi-select', {
  label: 'País',
  options: [
    { value: 'cl', label: 'Chile' },
    { value: 'pe', label: 'Perú' },
    { value: 'co', label: 'Colombia' },
  ],
  onChange: (e) => console.log(e.detail.value),
})
```

---

## Con grupos
```js
new MTS.Select('#select', {
  options: [
    { value: 'stgo', label: 'Santiago',     group: 'Chile' },
    { value: 'vina', label: 'Viña del Mar', group: 'Chile' },
    { value: 'lima', label: 'Lima',          group: 'Perú' },
  ],
})
```

---

## Multi-select
```js
new MTS.Select('#select', {
  multiple:  true,
  maxSelect: 3,
  options:   [...],
  value:     ['cl', 'pe'],
})
```

---

## Con búsqueda interna
Filtra las opciones ya cargadas — no requiere llamada externa.
```js
new MTS.Select('#select', {
  searchable: true,
  options: [...],
})
```

---

## Con búsqueda externa (onSearch)
El componente **no hace fetch**. Emite el query y el dev decide de dónde vienen los datos.

```js
new MTS.Select('#select', {
  searchable: true,
  placeholder: 'Buscar usuario...',
  debounce: 300,    // ms de espera antes de llamar onSearch
  minChars: 2,      // mínimo de caracteres para disparar

  onSearch: async (query) => {
    // El dev controla completamente la fuente de datos
    const res = await fetch(`/api/usuarios?q=${query}`)
    const data = await res.json()
    // Debe retornar un array de { value, label }
    return data.map(u => ({ value: u.id, label: u.nombre }))
  },

  onChange: (e) => console.log('Seleccionado:', e.detail.value),
})
```

El componente muestra un spinner mientras `onSearch` está en curso.

Si `minChars: 0`, dispara `onSearch` al abrir el dropdown (carga inicial).

---

## Configuración completa
```js
new MTS.Select('#select', {
  // — Datos —
  options:     [],          // opciones iniciales
  value:       null,        // valor inicial (o [] para multiple)

  // — Apariencia —
  label:       'Label',
  placeholder: 'Selecciona...',
  hint:        'Texto de ayuda',

  // — Comportamiento —
  multiple:    false,       // multi-select
  maxSelect:   null,        // límite de selección en multi
  searchable:  false,       // habilitar campo de búsqueda
  clearable:   false,       // botón × para limpiar
  disabled:    false,

  // — Búsqueda externa (opcional) —
  onSearch:    async (query) => [...],  // si se define, búsqueda es externa
  debounce:    300,         // ms antes de llamar onSearch
  minChars:    1,           // mínimo de chars para disparar onSearch (0 = al abrir)

  // — Callbacks —
  onChange: (e) => console.log(e.detail.value),
})
```

---

## API
```js
const sel = new MTS.Select('#select', config)

// Valor
sel.getValue()           // → value | value[]
sel.setValue('cl')
sel.setValue(['cl','pe']) // multi
sel.clear()

// Opciones
sel.setOptions([...])    // reemplaza opciones y re-renderiza

// Estado
sel.open()
sel.close()
sel.toggle()
sel.destroy()

// Eventos
sel.on('change', (e) => console.log(e.detail.value))
sel.on('open',   (e) => {})
sel.on('close',  (e) => {})
sel.off('change', handler)
```

---

## Eventos DOM
| Evento   | Namespace DOM          | Detail                  |
|----------|------------------------|-------------------------|
| `change` | `mts:select:change`    | `{ select, value }`     |
| `open`   | `mts:select:open`      | `{ select }`            |
| `close`  | `mts:select:close`     | `{ select }`            |

```js
document.getElementById('select')
  .addEventListener('mts:select:change', (e) => {
    console.log(e.detail.value)
  })
```

---

## Ejemplo completo — búsqueda con API real
```js
new MTS.Select('#buscar-producto', {
  searchable:  true,
  clearable:   true,
  placeholder: 'Buscar producto...',
  debounce:    400,
  minChars:    2,

  onSearch: async (query) => {
    try {
      const res = await fetch(`https://api.ejemplo.com/productos?q=${encodeURIComponent(query)}`)
      const { items } = await res.json()
      return items.map(p => ({
        value: p.id,
        label: p.nombre,
        group: p.categoria,   // opcional
      }))
    } catch {
      return []
    }
  },

  onChange: (e) => {
    console.log('Producto seleccionado, id:', e.detail.value)
  },
})
```

---

## Changelog
| Versión | Descripción |
|---------|-------------|
| 2.0.0 | `onSearch` externo — el componente ya no hace fetch. Loading spinner. Arquitectura limpia. |
| 1.0.0 | Release inicial |
+++

+++ MTS.Validate — Validación de formularios — 15+ reglas, integración con MTS.Input
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
+++

+++ MTS.Picker — Selectores de fecha, hora, rango, mes, semana y color
Selectores de fecha, hora, rango, mes, semana y color. Cada tipo es una clase independiente que extiende una base común.

---

## Instalación
```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-picker-shared.css">

<!-- Cargar solo los que necesitas -->
<script src="matios-ui-picker-base.js"></script>
<script src="matios-ui-picker-date.js"></script>
<script src="matios-ui-picker-time.js"></script>
<script src="matios-ui-picker-datetime.js"></script>
<script src="matios-ui-picker-daterange.js"></script>
<script src="matios-ui-picker-month.js"></script>
<script src="matios-ui-picker-week.js"></script>
<script src="matios-ui-picker-color.js"></script>
```

---

## MTS.Picker.Date — Solo fecha
```js
const dp = new MTS.Picker.Date('#mi-input', {
  format:   'DD/MM/YYYY',
  locale:   'es-CL',
  minDate:  new Date('2024-01-01'),
  maxDate:  new Date('2025-12-31'),
  disabledDays: [0, 6],   // 0=Dom, 6=Sáb
  clearable: true,
  onChange: (e) => console.log(e.detail.value, e.detail.formatted),
})
dp.setValue(new Date())
dp.getValue()    // → Date
dp.clear()
```

---

## MTS.Picker.Time — Solo hora
```js
new MTS.Picker.Time('#mi-input', {
  timeStep:  15,    // pasos en minutos
  startHour: 8,
  endHour:   20,
  onChange: (e) => console.log(e.detail.formatted),
})
```

---

## MTS.Picker.DateTime — Fecha + hora
```js
new MTS.Picker.DateTime('#mi-input', {
  format:   'DD/MM/YYYY',
  timeStep:  5,
  onChange: (e) => console.log(e.detail.value),
})
```

---

## MTS.Picker.DateRange — Rango de fechas
```js
const rp = new MTS.Picker.DateRange('#mi-input', {
  onChange: (e) => {
    console.log(e.detail.value.start)   // Date inicio
    console.log(e.detail.value.end)     // Date fin
    console.log(e.detail.formatted)     // "01/03/2025 → 15/03/2025"
  },
})
rp.setValue([new Date('2025-03-01'), new Date('2025-03-15')])
rp.getValue()   // → { start: Date, end: Date }
```

---

## MTS.Picker.Month — Mes y año
```js
new MTS.Picker.Month('#mi-input', {
  onChange: (e) => console.log(e.detail.formatted),  // "03/2025"
})
```

---

## MTS.Picker.Week — Semana
```js
new MTS.Picker.Week('#mi-input', {
  onChange: (e) => {
    console.log(e.detail.value.start)   // lunes de la semana
    console.log(e.detail.value.end)     // domingo de la semana
    console.log(e.detail.formatted)     // "Semana 12 - 2025"
  },
})
```

---

## MTS.Picker.Color — Color (hex, rgb, hsl)
```js
const cp = new MTS.Picker.Color('#mi-input', {
  value:       '#4f8eff',
  colorFormat: 'hex',      // 'hex' | 'rgb' | 'hsl'
  presets: ['#f87171', '#34d399', '#4f8eff', '#a78bfa'],
  onChange: (e) => {
    console.log(e.detail.value)    // "#4f8eff" | "rgb(...)" | "hsl(...)"
    console.log(e.detail.hex)      // siempre el hex
  },
})
cp.setValue('#ff5500')
cp.getValue()   // → string en el formato configurado
```

---

## API común (todos los pickers)
```js
picker.open()
picker.close()
picker.getValue()       // → valor según tipo
picker.setValue(...)    // → instancia (chainable)
picker.clear()
picker.destroy()

picker.on('change', (e) => { e.detail.value; e.detail.formatted })
picker.on('open',   () => {})
picker.on('close',  () => {})

// Alias — ambos funcionan igual
picker.on('change',  fn)
picker.on('onSelect', fn)  // alias
```

---

## Eventos DOM
```js
document.getElementById('mi-input')
  .addEventListener('mts:picker:change', (e) => {
    console.log(e.detail.value)
    console.log(e.detail.formatted)
  })
```

---

## Changelog
| Versión | Descripción |
|---------|-------------|
| 2.0.0 | Separado en clases individuales. Fix cierre al seleccionar. MTS.Picker.Month, Week, Color nuevos. |
| 1.0.0 | Release inicial (clase única con modos) |
+++

+++ MTS.Checkbox — Checkbox, radio buttons y toggle switch
Checkbox, CheckboxGroup, Radio, Toggle/Switch y Slider/Range en un solo archivo.

## Instalación
```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-checkbox.css">
<script src="matios-ui-checkbox.js"></script>
```

## Checkbox
```js
const chk = new MTS.Checkbox('#chk', {
  label:   'Acepto los términos',
  checked: false,
  onChange: (e) => console.log(e.detail.checked),
})
chk.isChecked()        // → boolean
chk.setChecked(true)
chk.toggle()
chk.setIndeterminate(true)
```

## CheckboxGroup
```js
const group = new MTS.CheckboxGroup('#group', {
  options: [
    { value: 'pdf',  label: 'PDF' },
    { value: 'docx', label: 'Word' },
    { value: 'xlsx', label: 'Excel', disabled: true },
  ],
  value:    ['pdf'],
  onChange: (e) => console.log(e.detail.value),
})
group.getValue() // → ['pdf', 'docx']
```

## Radio
```js
const radio = new MTS.Radio('#radio', {
  name:    'formato',
  options: [
    { value: 'table', label: 'Tabla' },
    { value: 'card',  label: 'Tarjetas' },
    { value: 'list',  label: 'Lista' },
  ],
  value:    'table',
  onChange: (e) => console.log(e.detail.value),
})
radio.getValue()     // → 'table'
radio.setValue('card')
```

## Toggle / Switch
```js
const toggle = new MTS.Toggle('#toggle', {
  label:    'Notificaciones activas',
  checked:  true,
  size:     'md',  // 'sm'|'md'|'lg'
  onChange: (e) => console.log(e.detail.checked),
})
toggle.isChecked()    // → boolean
toggle.setChecked(false)
toggle.toggle()
```

## Slider / Range
```js
// Simple
const slider = new MTS.Slider('#slider', {
  min:   0, max: 100, step: 5,
  value: 40,
  label: 'Volumen',
  showValue: true,
  labelFormat: (v) => `${v}%`,
  onChange: (e) => console.log(e.detail.value),
})

// Rango doble
const range = new MTS.Slider('#range', {
  range:  true,
  min:    0, max: 1000, step: 10,
  value:  200, value2: 800,
  label:  'Precio',
  labelFormat: ([a, b]) => `$${a} – $${b}`,
  onChange: (e) => console.log(e.detail.value), // → [200, 800]
})
slider.getValue()     // → number | [number, number]
slider.setValue(60)   // simple
slider.setValue([300, 700]) // rango
```

## Eventos DOM
| Componente | Evento | Namespace |
|-----------|--------|-----------|
| Checkbox | `change` | `mts:checkbox:change` |
| Radio | `change` | `mts:radio:change` |
| Toggle | `change` | `mts:toggle:change` |
| Slider | `change` | `mts:slider:change` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — Checkbox, CheckboxGroup, Radio, Toggle, Slider |
+++

+++ MTS.Rating — Calificación por estrellas
Estrellas de valoración con hover, medio punto y readonly.

## Uso
```js
const rating = new MTS.Rating('#rating', {
  value:     3.5,
  max:       5,
  halfStars: true,
  size:      'md',  // 'sm'|'md'|'lg'
  readonly:  false,
  onChange:  (e) => console.log(e.detail.value),
})
rating.getValue()   // → 3.5
rating.setValue(4)
```

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `change` | `mts:rating:change` |
| `hover`  | `mts:rating:hover` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial |
+++

+++ MTS.TagInput — Input de etiquetas con autocompletado
Input de etiquetas con sugerencias, debounce y búsqueda asíncrona.

## Instalación
```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-taginput.css">
<script src="matios-ui-taginput.js"></script>
```

## Uso rápido
```js
const taginput = new MTS.TagInput('#tags', {
  label:       'Etiquetas',
  placeholder: 'Agregar etiqueta...',
  tags:        ['urgente', 'revisión'],
  suggestions: ['urgente', 'pendiente', 'aprobado', 'rechazado', 'revisión'],
  onChange:    (e) => console.log(e.detail.tags),
})
```

## Con búsqueda asíncrona
```js
new MTS.TagInput('#tags', {
  allowCustom: false,
  debounce:    300,
  onSearch: async (query) => {
    const results = await api.searchTags(query)
    taginput.setSuggestions(results)
  },
})
```

## API
```js
taginput.getTags()              // → string[]
taginput.setTags(['a', 'b'])
taginput.addTag('nuevo')
taginput.removeTag('urgente')
taginput.setSuggestions([...]) // actualizar sugerencias
```

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `add`    | `mts:taginput:add` |
| `remove` | `mts:taginput:remove` |
| `change` | `mts:taginput:change` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial |
+++

+++ MTS.FileUpload — Upload con drag & drop, preview y validación
_Documentación pendiente._
+++

