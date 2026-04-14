# MTS.RatingReview

[EN] Rating review widget with average score, star display, breakdown bars and optional interactive voting.
[ES] Widget de reseñas con promedio, estrellas, barras de desglose y votación interactiva opcional.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-ratingreview.css">
<script src="matios-ui-ratingreview.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `average` | `number` | `0` | [EN] Average rating (1-5) / [ES] Promedio de calificaciones |
| `total` | `number` | `0` | [EN] Total number of reviews / [ES] Total de reseñas |
| `breakdown` | `object` | `{5:0,4:0,3:0,2:0,1:0}` | [EN] Count per star / [ES] Cantidad por estrella |
| `interactive` | `boolean` | `false` | [EN] Show interactive voting stars / [ES] Mostrar estrellas de votación |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `onRate` | `function` | — | [EN] `({ stars }) => {}` Fires when user rates / [ES] Se dispara al calificar |

---

## Events / Eventos

```js
new MTS.RatingReview('#my-widget', {
  average:     4.3,
  total:       1284,
  interactive: true,
  // Fires when user clicks a star / Se dispara al hacer click en una estrella
  onRate: (e) => {
    console.log(e.detail.stars); // → 4
    submitRating(e.detail.stars);
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Read-only — shows score and breakdown / Solo lectura — muestra puntaje y desglose
new MTS.RatingReview('#my-widget', {
  average:   4.3,
  total:     1284,
  size:      'md',
  breakdown: { 5: 720, 4: 380, 3: 120, 2: 48, 1: 16 },
});

// Interactive — user can rate / Interactivo — usuario puede calificar
new MTS.RatingReview('#my-widget', {
  average:     4.3,
  total:       1284,
  breakdown:   { 5: 720, 4: 380, 3: 120, 2: 48, 1: 16 },
  interactive: true,
  // Fires when user rates / Se dispara al calificar
  onRate: (e) => {
    console.log('rated:', e.detail.stars); // → 4
    fetch('/api/rate', { method: 'POST', body: JSON.stringify({ stars: e.detail.stars }) });
  },
});

// Large size / Tamaño grande
new MTS.RatingReview('#my-widget', {
  average:   4.8,
  total:     523,
  breakdown: { 5: 480, 4: 30, 3: 8, 2: 3, 1: 2 },
  size:      'lg',
});
```

---

## API

```js
const widget = new MTS.RatingReview('#my-widget', { ... });

// Update data and re-render / Actualizar datos y re-renderizar
widget.update({
  average:   4.5,
  total:     1300,
  breakdown: { 5: 750, 4: 380, 3: 110, 2: 48, 1: 12 },
})

// Register / remove listeners / Registrar / eliminar listeners
widget.on('rate', (e) => console.log(e.detail.stars))
widget.off('rate', handler)
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-widget')
  .addEventListener('mts:ratingreview:rate', (e) => {
    console.log(e.detail.stars);
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] `onRate` normalized to `.on()`, bilingual docs / [ES] Normalizado a `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release — average, breakdown bars, interactive voting / [ES] Versión inicial |
