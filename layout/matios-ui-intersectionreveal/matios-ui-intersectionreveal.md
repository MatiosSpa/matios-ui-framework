# MTS.IntersectionReveal

Animates elements as they enter the viewport using `IntersectionObserver`. Zero dependencies — replaces AOS and ScrollReveal.

---

## Installation

```html
<script src="layout/matios-ui-intersectionreveal/matios-ui-intersectionreveal.js"></script>
```

The component applies all reveal styles inline via JavaScript, so a single script is enough. The following files are **optional**:

- `matios-ui-intersectionreveal.css` — only a `[data-mts-reveal] { opacity: 0 }` helper (to hide elements before JS runs) plus the demo scaffold classes. Not required by the component.
- `base/matios-ui-i18n.js` + `matios-ui-intersectionreveal-i18n.js` — register demo-only strings; not read by the component (see [i18n](#i18n)).

---

## Usage

```html
<div class="reveal">Appears on scroll</div>
<div class="reveal">Another element</div>
```

```js
new MTS.IntersectionReveal('.reveal', {
  animation: 'fade-up',
  duration: 600,
  stagger: 80,
});
```

The first argument accepts a CSS selector string, a single element, a `NodeList`, or an array of elements.

```js
// A single element
var card = document.querySelector('.card');
new MTS.IntersectionReveal(card, { animation: 'zoom' });

// Different animations per group
new MTS.IntersectionReveal('.cards', { animation: 'zoom', stagger: 100 });
new MTS.IntersectionReveal('.title', { animation: 'fade-down', duration: 800 });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `animation` | `string` | `'fade-up'` | `'fade'` \| `'fade-up'` \| `'fade-down'` \| `'fade-left'` \| `'fade-right'` \| `'zoom'` \| `'flip'` |
| `duration` | `number` | `600` | Animation duration in ms |
| `delay` | `number` | `0` | Base delay in ms before starting |
| `stagger` | `number` | `0` | Extra delay per element, applied as `index * stagger` |
| `easing` | `string` | `'cubic-bezier(.4,0,.2,1)'` | CSS transition timing function |
| `threshold` | `number` | `0.15` | Fraction of the element that must be visible to trigger (0–1) |
| `once` | `boolean` | `true` | If `true`, unobserve the element after its first reveal |
| `onReveal` | `function` | `null` | `(element, index)` callback fired as each element is revealed |

Any unrecognized `animation` value falls back to a plain opacity fade (no transform).

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `revealAll()` | `this` | Clear inline hidden styles on all elements (opacity, transform, transition), then disconnect the observer. Reveals everything immediately, without animation. |
| `destroy()` | `undefined` | Disconnect the `IntersectionObserver`. Elements keep their current state. |

```js
var reveal = new MTS.IntersectionReveal('.reveal', { animation: 'fade-up' });
reveal.revealAll();
```

---

## Events

Two reveal hooks fire for each element as it enters the viewport:

| Hook | Type | Payload | When |
|------|------|---------|------|
| `onReveal` | option callback | `(element, index)` | Fired as the element is revealed |
| `mts:reveal` | DOM `CustomEvent` (bubbles) | `event.detail.index` | Dispatched on the element as it is revealed |

```js
document.addEventListener('mts:reveal', function (event) {
  console.log('revealed index', event.detail.index);
});
```

---

## i18n

The component emits **no runtime chrome text** — it only toggles inline styles and dispatches `mts:reveal`. There is nothing to localize at runtime.

`matios-ui-intersectionreveal-i18n.js` registers strings under the `MTS.IntersectionReveal` namespace, but every entry lives under a `demo` key and is used **only by `demo.html`**. It is not read by the component. There is no per-instance `locale` option.

---

## Notes

- On construction, all target elements are hidden inline (opacity `0` plus the animation's starting transform) and then revealed as they intersect.
- Elements are revealed in the order they enter the viewport.
- With `stagger > 0`, the delay is applied per element as `delay + index * stagger`.
- To animate on load without scrolling, use `threshold: 0`.

---

## Accessibility

- Respect `prefers-reduced-motion`: when set, reveal content without motion (for example by calling `revealAll()`).
- Reveal animations are presentational — content must remain available even if the animation never runs.
