# MTS.IntersectionReveal

[EN] Animates elements as they enter the viewport using IntersectionObserver. Supports fade, slide, zoom and flip animations with stagger.
[ES] Anima elementos al entrar al viewport usando IntersectionObserver. Soporta animaciones fade, slide, zoom y flip con efecto escalonado.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<script src="matios-ui-intersectionreveal.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `animation` | `string` | `'fade-up'` | `'fade'` · `'fade-up'` · `'fade-down'` · `'fade-left'` · `'fade-right'` · `'zoom'` · `'flip'` |
| `duration` | `number` | `600` | [EN] Animation duration in ms / [ES] Duración de la animación en ms |
| `delay` | `number` | `0` | [EN] Base delay in ms / [ES] Delay base en ms |
| `stagger` | `number` | `0` | [EN] Stagger delay between elements in ms / [ES] Delay escalonado entre elementos en ms |
| `easing` | `string` | `'cubic-bezier(.4,0,.2,1)'` | [EN] CSS easing function / [ES] Función CSS de easing |
| `threshold` | `number` | `0.15` | [EN] Visible fraction to trigger (0-1) / [ES] Fracción visible para activar (0-1) |
| `once` | `boolean` | `true` | [EN] Animate only the first time / [ES] Animar solo la primera vez |
| `onReveal` | `function` | — | [EN] `({ element, index }) => {}` Fires when element is revealed / [ES] Se dispara al revelar un elemento |

---

## Events / Eventos

```js
new MTS.IntersectionReveal('.card', {
  animation: 'fade-up',
  stagger:   80,
  // Fires when each element is revealed / Se dispara al revelar cada elemento
  onReveal: (e) => {
    console.log(e.detail.element); // → HTMLElement
    console.log(e.detail.index);   // → 0, 1, 2...
  },
});
```

---

## HTML Usage / Uso HTML

```html
<!-- Elements to animate / Elementos a animar -->
<div class="card">Card 1</div>
<div class="card">Card 2</div>
<div class="card">Card 3</div>

<script>
  new MTS.IntersectionReveal('.card', {
    animation: 'fade-up',
    duration:  600,
    stagger:   80,   // 80ms between each / 80ms entre cada uno
    onReveal: (e) =&gt; console.log('revealed:', e.detail.index),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic fade-up / Fade-up básico
new MTS.IntersectionReveal('.section', {
  animation: 'fade-up',
  duration:  500,
  threshold: 0.1,
});

// Staggered cards / Tarjetas escalonadas
new MTS.IntersectionReveal('.card', {
  animation: 'fade-up',
  duration:  600,
  stagger:   80,   // 80ms delay between each card / 80ms entre cada tarjeta
  onReveal: (e) => console.log('card revealed:', e.detail.index),
});

// Zoom with delay / Zoom con delay
new MTS.IntersectionReveal('.hero-image', {
  animation: 'zoom',
  duration:  800,
  delay:     200,  // wait 200ms before starting / esperar 200ms antes de iniciar
  easing:    'cubic-bezier(.34,1.56,.64,1)', // spring
});

// Repeat on every scroll / Repetir en cada scroll
new MTS.IntersectionReveal('.stat', {
  animation: 'fade-left',
  once:      false,  // re-animate every time / re-animar cada vez
});

// Multiple selectors / Múltiples selectores
new MTS.IntersectionReveal([
  ...document.querySelectorAll('.title'),
  ...document.querySelectorAll('.subtitle'),
], {
  animation: 'fade',
  stagger:   60,
});
```

---

## Animations / Animaciones

| Value | [EN] Effect / [ES] Efecto |
|-------|--------------------------|
| `'fade'` | [EN] Fade in only / [ES] Solo fade in |
| `'fade-up'` | [EN] Fade in + slide from bottom / [ES] Fade in + deslizar desde abajo |
| `'fade-down'` | [EN] Fade in + slide from top / [ES] Fade in + deslizar desde arriba |
| `'fade-left'` | [EN] Fade in + slide from right / [ES] Fade in + deslizar desde la derecha |
| `'fade-right'` | [EN] Fade in + slide from left / [ES] Fade in + deslizar desde la izquierda |
| `'zoom'` | [EN] Fade in + scale up / [ES] Fade in + escalar |
| `'flip'` | [EN] Fade in + flip from top / [ES] Fade in + voltear desde arriba |

---

## API

```js
const reveal = new MTS.IntersectionReveal('.card', { ... });

// Reveal all elements immediately (no animation) / Revelar todos inmediatamente sin animación
reveal.revealAll()

// Register / remove listeners / Registrar / eliminar listeners
reveal.on('reveal', (e) => console.log(e.detail.index))
reveal.off('reveal', handler)

// Stop observing / Dejar de observar
reveal.destroy()
```

---

## DOM Event / Evento DOM

```js
document.querySelector('.card')
  .addEventListener('mts:intersectionreveal:reveal', (e) => {
    console.log(e.detail.index);
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Normalized to `.on()` pattern, bilingual docs / [ES] Normalizado al patrón `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
