# MTS.Label

🇬🇧 Form label component with required/optional badges, hint text, error state and size variants. Also usable as pure HTML with CSS classes.
🇪🇸 Componente label de formulario con badges requerido/opcional, texto de ayuda, estado de error y variantes de tamaño. También usable como HTML puro con clases CSS.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-label.css">
<script src="matios-ui-label.js"></script>
```

---

## CSS Classes / Clases CSS

🇬🇧 Use directly in HTML without JavaScript.
🇪🇸 Usa directamente en HTML sin JavaScript.

| Class / Clase | 🇬🇧 Description / 🇪🇸 Descripción |
|---------------|--------------------------------------|
| `.mts-label` | 🇬🇧 Base label / 🇪🇸 Label base |
| `.mts-label--required` | 🇬🇧 Shows red asterisk `*` / 🇪🇸 Muestra asterisco rojo `*` |
| `.mts-label--optional` | 🇬🇧 Shows optional badge / 🇪🇸 Muestra badge opcional |
| `.mts-label--hidden` | 🇬🇧 Visually hidden, screen-reader accessible / 🇪🇸 Oculto visualmente, accesible |
| `.mts-label--sm` | 🇬🇧 Small size / 🇪🇸 Tamaño pequeño |
| `.mts-label--lg` | 🇬🇧 Large size, semibold / 🇪🇸 Tamaño grande, semibold |
| `.mts-label__text` | 🇬🇧 Inner text span / 🇪🇸 Span interno del texto |
| `.mts-label__optional` | 🇬🇧 Optional badge span / 🇪🇸 Span badge opcional |
| `.mts-form-hint` | 🇬🇧 Helper text below field / 🇪🇸 Texto de ayuda debajo del campo |
| `.mts-form-error` | 🇬🇧 Error text below field / 🇪🇸 Texto de error debajo del campo |

---

## Options / Opciones (JavaScript)

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `text` | `string` | element text | 🇬🇧 Label text / 🇪🇸 Texto del label |
| `required` | `boolean` | `false` | 🇬🇧 Show red asterisk / 🇪🇸 Mostrar asterisco rojo |
| `optional` | `boolean` | `false` | 🇬🇧 Show optional badge / 🇪🇸 Mostrar badge opcional |
| `hint` | `string` | `null` | 🇬🇧 Helper text / 🇪🇸 Texto de ayuda |
| `error` | `string` | `null` | 🇬🇧 Error text / 🇪🇸 Texto de error |
| `size` | `string` | `''` | `'sm'` · `''` · `'lg'` |
| `hidden` | `boolean` | `false` | 🇬🇧 Visually hidden / 🇪🇸 Oculto visualmente |
| `forId` | `string` | `null` | 🇬🇧 `for` attribute / 🇪🇸 Atributo `for` |
| `className` | `string` | `''` | 🇬🇧 Extra CSS classes / 🇪🇸 Clases CSS adicionales |

---

## HTML Usage / Uso HTML

🇬🇧 Pure HTML — no JavaScript required.
🇪🇸 HTML puro — no requiere JavaScript.

```html
<!-- Basic / Básico -->
<label class="mts-label" for="name">Full name</label>
<input class="mts-input" id="name">

<!-- Required / Requerido -->
<label class="mts-label mts-label--required" for="email">Email</label>

<!-- Optional / Opcional -->
<label class="mts-label" for="phone">
  <span class="mts-label__text">Phone</span>
  <span class="mts-label__optional">optional</span>
</label>

<!-- With hint / Con texto de ayuda -->
<div class="mts-form-group">
  <label class="mts-label mts-label--required" for="email">Email</label>
  <input class="mts-input" id="email" type="email">
  <span class="mts-form-hint">We'll never share your email.</span>
</div>

<!-- Visually hidden / Oculto visualmente -->
<label class="mts-label mts-label--hidden" for="search">Search</label>
<input class="mts-input" id="search" placeholder="Search...">
```

---

## JavaScript Usage / Uso JavaScript

```js
const lbl = new MTS.Label('#my-label', {
  // Label text / Texto del label
  text: 'Full name',

  // Show required asterisk / Mostrar asterisco requerido
  required: true,

  // Helper text / Texto de ayuda
  hint: 'As it appears on your ID document',

  // for attribute / Atributo for
  forId: 'input-name',

  // Size: 'sm' | '' | 'lg' / Tamaño
  size: '',
});
```

---

## API

```js
const lbl = new MTS.Label('#my-label', { ... });

// Change text / Cambiar texto
lbl.setText('New label text')

// Show/clear hint / Mostrar/limpiar hint
lbl.setHint('Helper text')

// Show/clear error / Mostrar/limpiar error
lbl.setError('This field is required')
lbl.clearError()

// Toggle required / Alternar requerido
lbl.setRequired(true)
lbl.setRequired(false)

// Destroy / Destruir
lbl.destroy()
```

---

## In Form Groups / En grupos de formulario

🇬🇧 Label is typically used inside `.mts-form-group`:
🇪🇸 El label se usa típicamente dentro de `.mts-form-group`:

```html
<div class="mts-form-group">
  <label class="mts-label mts-label--required" for="email">Email</label>
  <input class="mts-input" id="email" type="email">
  <span class="mts-form-hint">We'll use this for notifications.</span>
</div>
```

---
