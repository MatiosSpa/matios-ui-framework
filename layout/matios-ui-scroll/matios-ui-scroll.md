# MTS.Scroll

Scrollable container with a themed scrollbar (thin, adapted to the active theme), edge fades that hint at more content, and position events.

---

## Installation

```html
<link rel="stylesheet" href="layout/matios-ui-scroll/matios-ui-scroll.css">
<script src="layout/matios-ui-scroll/matios-ui-scroll.js"></script>
```

---

## Usage

```html
<div id="my-scroll" style="height: 300px"><!-- long content here --></div>
```

```js
new MTS.Scroll('#my-scroll', {
  direction: 'vertical',
  onReachEnd: function () { console.log('reached the end — load more data'); }
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `direction` | `string` | `'vertical'` | `'vertical'` · `'horizontal'` · `'both'` |
| `shadows` | `boolean` | `true` | Show edge fades on the container |
| `fadeBg` | `string` | `null` | Fade color — use when the container is not over `--mts-bg-body` (e.g. `'var(--mts-bg-surface)'`) |
| `fadeSize` | `string` | `null` | Fade size in CSS (e.g. `'60px'`) |
| `threshold` | `number` | `24` | Distance in px from the edge to fire `onReachStart` / `onReachEnd` |
| `onScroll` | `function` | `null` | `({ scrollTop, scrollLeft, percent })` |
| `onReachStart` | `function` | `null` | Fires when reaching the start |
| `onReachEnd` | `function` | `null` | Fires when reaching the end |

---

## API

| Method | Description |
|--------|-------------|
| `scrollTo(px[, smooth])` | Move to a position in px (`smooth` defaults to `true`) |
| `scrollToStart([smooth])` / `scrollToEnd([smooth])` | Move to start / end (`smooth` defaults to `true`) |
| `getScroll()` | Current position in px (`scrollLeft` when `direction: 'horizontal'`, otherwise `scrollTop`) |
| `getPercent()` | Scroll percentage (0–100) |
| `update()` | Recalculate fades (after content grows dynamically) |
| `destroy()` | Remove the component and restore the original DOM |

All methods except `getScroll()` / `getPercent()` return the instance, so calls chain.

```js
const sc = new MTS.Scroll('#my-scroll', { direction: 'vertical' });
sc.scrollToEnd();       // smooth by default
sc.scrollTo(200, false); // jump without animation
sc.update();
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onScroll` | `{ scrollTop, scrollLeft, percent }` | On scroll |
| `onReachStart` / `onReachEnd` | — | Reached the start / end |

---

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--mts-scroll-thumb-color` | `var(--mts-border-color)` | Scrollbar thumb color |
| `--mts-scroll-thumb-hover` | `var(--mts-color-primary)` | Thumb color on hover |
| `--mts-scroll-bar-size` | `4px` | Scrollbar width/height |
| `--mts-scroll-fade-size` | `40px` | Fade height/width |
| `--mts-scroll-fade-bg` | `var(--mts-bg-body)` | Base color of the fade gradient |

---

## Notes

- The container needs a fixed height (`height`, `max-height`, or `flex: 1` in a flex parent) for scrolling to work.
- For containers over `mts-bg-surface` / `-2`, pass `fadeBg: 'var(--mts-bg-surface)'` so the fade blends correctly.
- `onReachEnd` is ideal as an infinite-scroll trigger — pairs well with `MTS.Infinite`.
- Call `update()` if the content grows dynamically after initialization.
