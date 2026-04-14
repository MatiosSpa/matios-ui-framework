# MTS.Label

[EN] Form label component with required/optional badges, hint text, error state and size variants. Also usable as pure HTML with CSS classes.
[ES] Componente label de formulario con badges requerido/opcional, texto de ayuda, estado de error y variantes de tamaño. También usable como HTML puro con clases CSS.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-label.css">
<script src="matios-ui-label.js"></script>
```

---

## CSS Classes / Clases CSS

[EN] Use directly in HTML without JavaScript.
[ES] Usa directamente en HTML sin JavaScript.

| Class / Clase | [EN] Description / [ES] Descripción |
|---------------|--------------------------------------|
| `.mts-label` | [EN] Base label / [ES] Label base |
| `.mts-label--required` | [EN] Shows red asterisk `*` / [ES] Muestra asterisco rojo `*` |
| `.mts-label--optional` | [EN] Shows optional badge / [ES] Muestra badge opcional |
| `.mts-label--hidden` | [EN] Visually hidden, screen-reader accessible / [ES] Oculto visualmente, accesible |
| `.mts-label--sm` | [EN] Small size / [ES] Tamaño pequeño |
| `.mts-label--lg` | [EN] Large size, semibold / [ES] Tamaño grande, semibold |
| `.mts-label__text` | [EN] Inner text span / [ES] Span interno del texto |
| `.mts-label__optional` | [EN] Optional badge span / [ES] Span badge opcional |
| `.mts-form-hint` | [EN] Helper text below field / [ES] Texto de ayuda debajo del campo |
| `.mts-form-error` | [EN] Error text below field / [ES] Texto de error debajo del campo |

---

## Options / Opciones (JavaScript)

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `text` | `string` | element text | [EN] Label text / [ES] Texto del label |
| `required` | `boolean` | `false` | [EN] Show red asterisk / [ES] Mostrar asterisco rojo |
| `optional` | `boolean` | `false` | [EN] Show optional badge / [ES] Mostrar badge opcional |
| `hint` | `string` | `null` | [EN] Helper text / [ES] Texto de ayuda |
| `error` | `string` | `null` | [EN] Error text / [ES] Texto de error |
| `size` | `string` | `''` | `'sm'` · `''` · `'lg'` |
| `hidden` | `boolean` | `false` | [EN] Visually hidden / [ES] Oculto visualmente |
| `forId` | `string` | `null` | [EN] `for` attribute / [ES] Atributo `for` |
| `className` | `string` | `''` | [EN] Extra CSS classes / [ES] Clases CSS adicionales |

---

## HTML Usage / Uso HTML

[EN] Pure HTML — no JavaScript required.
[ES] HTML puro — no requiere JavaScript.

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

[EN] Label is typically used inside `.mts-form-group`:
[ES] El label se usa típicamente dentro de `.mts-form-group`:

```html
<div class="mts-form-group">
  <label class="mts-label mts-label--required" for="email">Email</label>
  <input class="mts-input" id="email" type="email">
  <span class="mts-form-hint">We'll use this for notifications.</span>
</div>
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual docs, standardized structure / [ES] Docs bilingüe, estructura estandarizada |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
