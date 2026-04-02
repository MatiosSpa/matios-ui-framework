# matios-ui-label

Label de formulario con soporte para requerido, opcional, hint, error y tamaños.

---

## Instalación

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-label.css">
<script src="matios-ui-label.js"></script>
```

---

## Uso básico — HTML puro

```html
<!-- Label simple -->
<label class="mts-label" for="nombre">Nombre</label>
<input class="mts-input" id="nombre">

<!-- Requerido -->
<label class="mts-label mts-label--required" for="email">Email</label>

<!-- Opcional -->
<label class="mts-label mts-label--optional" for="tel">
  <span class="mts-label__text">Teléfono</span>
  <span class="mts-label__optional">opcional</span>
</label>

<!-- Oculto accesible -->
<label class="mts-label mts-label--hidden" for="buscar">Buscar</label>
```

---

## Uso via JS

```js
const lbl = new MTS.Label('#mi-label', {
  text:     'Nombre completo',
  required: true,
  hint:     'Tal como aparece en tu documento de identidad.',
  forId:    'input-nombre',
})
```

---

## Opciones

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `text` | `string` | texto del elemento | Texto del label |
| `required` | `boolean` | `false` | Muestra asterisco rojo |
| `optional` | `boolean` | `false` | Muestra badge "opcional" |
| `hint` | `string` | `null` | Texto de ayuda bajo el campo |
| `error` | `string` | `null` | Texto de error bajo el campo |
| `size` | `string` | `''` | `'sm'` · `''` · `'lg'` |
| `hidden` | `boolean` | `false` | Visualmente oculto pero accesible |
| `forId` | `string` | `null` | Atributo `for` del label |
| `className` | `string` | `''` | Clases CSS adicionales |

---

## API

```js
lbl.setText('Nuevo texto')       // cambiar texto
lbl.setHint('Texto de ayuda')    // mostrar hint
lbl.setError('Campo requerido')  // mostrar error
lbl.clearError()                 // quitar error
lbl.setRequired(true)            // activar/desactivar required
lbl.destroy()                    // destruir instancia
```

---

## Clases CSS

| Clase | Descripción |
|-------|-------------|
| `.mts-label` | Base |
| `.mts-label--required` | Muestra asterisco `*` en rojo |
| `.mts-label--optional` | Muestra badge "opcional" |
| `.mts-label--hidden` | Oculto visualmente, accesible por screen readers |
| `.mts-label--sm` | Tamaño pequeño |
| `.mts-label--lg` | Tamaño grande — semibold |
| `.mts-label__text` | Span interno del texto |
| `.mts-label__optional` | Badge "opcional" |
| `.mts-form-hint` | Texto de ayuda |
| `.mts-form-error` | Texto de error |

---

## En formularios

El label se usa siempre dentro de un `.mts-form-group`:

```html
<div class="mts-form-group">
  <label class="mts-label mts-label--required" for="email">Email</label>
  <input class="mts-input" id="email" type="email">
  <span class="mts-form-hint">Nunca compartiremos tu email.</span>
</div>
```

Con `mts-form--horizontal`, el label se alinea a la izquierda automáticamente gracias al CSS del formlayout.
