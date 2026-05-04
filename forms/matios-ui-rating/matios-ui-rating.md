# MTS.Rating

🇬🇧 Star rating component with hover preview, half-star support and readonly mode.
🇪🇸 Componente de valoración por estrellas con preview al hover, medio punto y modo readonly.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-rating.css">
<script src="matios-ui-rating.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `value` | `number` | `0` | 🇬🇧 Initial rating value (0 to max) / 🇪🇸 Valor inicial (0 a max) |
| `max` | `number` | `5` | 🇬🇧 Total number of stars / 🇪🇸 Total de estrellas |
| `halfStars` | `boolean` | `false` | 🇬🇧 Allow half-star ratings / 🇪🇸 Permitir valoraciones de medio punto |
| `readonly` | `boolean` | `false` | 🇬🇧 Display only, no interaction / 🇪🇸 Solo display, sin interacción |
| `size` | `string` | `'md'` | 🇬🇧 Size variant: `'sm'` · `'md'` · `'lg'` / 🇪🇸 Variante de tamaño |
| `onChange` | `function` | — | 🇬🇧 Fires when rating changes / 🇪🇸 Se dispara al cambiar la valoración |

---

## Events / Eventos

🇬🇧 Use `onChange` in the constructor. This is the recommended approach.
🇪🇸 Usa `onChange` en el constructor. Este es el enfoque recomendado.

```js
new MTS.Rating('#my-rating', {
  // Fires when user selects a rating / Se dispara al seleccionar una valoración
  onChange: (e) => {
    console.log(e.detail.value); // → 3.5
  },
});
```

---

## HTML Usage / Uso HTML

```html
<!-- Basic / Básico -->
<div id="rating-product"></div>

<script>
  new MTS.Rating('#rating-product', {
    value:   3,
    max:     5,
    onChange: (e) => console.log(e.detail.value),
  });
</script>

<!-- Half stars / Medio punto -->
<div id="rating-half"></div>

<script>
  new MTS.Rating('#rating-half', {
    value:     3.5,
    halfStars: true,
    onChange:  (e) => console.log(e.detail.value),
  });
</script>

<!-- Readonly / Solo lectura -->
<div id="rating-readonly"
  data-value="4.5"
  data-half-stars
  data-readonly>
</div>
<script>
  new MTS.Rating('#rating-readonly');
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
const rating = new MTS.Rating('#my-rating', {
  // Initial value / Valor inicial
  value: 3,

  // Total stars / Total de estrellas
  max: 5,

  // Allow half-star ratings / Permitir medio punto
  halfStars: true,

  // Display only / Solo display
  readonly: false,

  // Size: 'sm' | 'md' | 'lg' / Tamaño
  size: 'md',

  // Fires when rating changes / Se dispara al cambiar la valoración
  onChange: (e) => {
    console.log(e.detail.value); // → 3.5
  },
});
```

---

## API

```js
const rating = new MTS.Rating('#my-rating', { ... });

// Get current value / Obtener valor actual
rating.getValue()     // → number (e.g. 3.5)

// Set value programmatically / Establecer valor programáticamente
rating.setValue(4)
rating.setValue(4.5)  // requires halfStars: true

// Destroy / Destruir
rating.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.getElementById('my-rating')
  .addEventListener('mts:rating:change', (e) => {
    console.log(e.detail.value); // → number
  });
```

| Event / Evento | DOM Namespace | 🇬🇧 Description / 🇪🇸 Descripción |
|----------------|---------------|--------------------------------------|
| `onChange` | `mts:rating:change` | 🇬🇧 User selects a rating / 🇪🇸 Usuario selecciona valoración |
| — | `mts:rating:hover` | 🇬🇧 User hovers over a star / 🇪🇸 Usuario hace hover sobre una estrella |

---
