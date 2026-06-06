# MTS.IntersectionReveal

Animates elements as they enter the viewport using `IntersectionObserver`. Zero dependencies — replaces AOS and ScrollReveal.

---

## Installation

```html
<link rel="stylesheet" href="layout/matios-ui-intersectionreveal/matios-ui-intersectionreveal.css">
<script src="layout/matios-ui-intersectionreveal/matios-ui-intersectionreveal.js"></script>
```

---

## Usage

```html
<div data-reveal>Appears on scroll</div>
<div data-reveal>Another element</div>
```

```js
new MTS.IntersectionReveal('[data-reveal]', { animation: 'fade-up', duration: 600, stagger: 80 });

// Different animations per group
new MTS.IntersectionReveal('.cards', { animation: 'zoom', stagger: 100 });
new MTS.IntersectionReveal('.title', { animation: 'fade-down', duration: 800 });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `animation` | `string` | `'fade-up'` | `'fade'` · `'fade-up'` · `'fade-down'` · `'fade-left'` · `'fade-right'` · `'zoom'` · `'flip'` |
| `duration` | `number` | `600` | Animation duration in ms |
| `delay` | `number` | `0` | Base delay in ms before starting |
| `stagger` | `number` | `0` | Extra delay between elements in ms |
| `easing` | `string` | `cubic-bezier(.4,0,.2,1)` | CSS animation curve |
| `threshold` | `number` | `0.15` | Fraction of the element visible to trigger (0–1) |
| `once` | `boolean` | `true` | If `true`, animate only the first time the element enters the viewport |
| `onReveal` | `function` | `null` | `(element, index)` — fires as each element is revealed |

---

## API

| Method | Description |
|--------|-------------|
| `revealAll()` | Reveal all elements immediately, without animation |
| `destroy()` | Disconnect the `IntersectionObserver` |

```js
const reveal = new MTS.IntersectionReveal('[data-reveal]', { animation: 'fade-up' });
reveal.revealAll();
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onReveal` | `(element, index)` | Each element is revealed |

---

## Notes

- Elements are revealed in the order they enter the viewport.
- With `stagger > 0` and several elements visible on load, the delay is applied sequentially by index.
- To animate on load (no scroll), use `threshold: 0` and `once: true`.

---

## Accessibility

- Respect `prefers-reduced-motion`: when set, reveal content without motion (or call `revealAll()`).
- Reveal animations are presentational — content must remain available even if the animation never runs.

---

## Changelog

### 2026-05-13
- Documentation homologated to the standard template.
