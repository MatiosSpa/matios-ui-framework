# MTS.Skeleton

Animated loading placeholder with multiple layout variants: text, circle, rect, card, list and table.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-skeleton.css">
<script src="matios-ui-skeleton.js"></script>
```

---

## Usage

```js
// Text lines
new MTS.Skeleton('#loading-text', { variant: 'text', lines: 4, animation: 'pulse' });

// Avatar circle
new MTS.Skeleton('#loading-avatar', { variant: 'circle', width: '48px', height: '48px' });

// Rectangle (image placeholder)
new MTS.Skeleton('#loading-image', { variant: 'rect', width: '100%', height: '200px' });

// Card / list / table layouts
new MTS.Skeleton('#loading-card', { variant: 'card' });
new MTS.Skeleton('#loading-list', { variant: 'list', items: 5 });
new MTS.Skeleton('#loading-table', { variant: 'table', rows: 5, cols: 4 });

// Show skeleton while loading, then swap in real content
const sk = new MTS.Skeleton('#user-card', { variant: 'card' });
fetchUser().then(function (data) { sk.destroy(); renderUser('#user-card', data); });
```

### CSS only (no JS)

```html
<div class="mts-skeleton__bone mts-skeleton__bone--pulse" style="width:100%;height:16px;border-radius:4px"></div>
```

(Bone dimensions are arbitrary runtime values, set inline by design.)

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `string` | `'text'` | `'text'` · `'circle'` · `'rect'` · `'card'` · `'table'` · `'list'` |
| `lines` | `number` | `3` | Text lines (variant `'text'`) |
| `rows` | `number` | `4` | Table rows (variant `'table'`) |
| `cols` | `number` | `4` | Table columns (variant `'table'`) |
| `items` | `number` | `3` | List items (variant `'list'`) |
| `width` | `string` | `'100%'` | Container width |
| `height` | `string` | `null` | Container height |
| `animation` | `string` | `'pulse'` | `'pulse'` · `'wave'` · `'none'` |

---

## API

| Method | Description |
|--------|-------------|
| `show()` / `hide()` | Show / hide the skeleton |
| `destroy()` | Destroy the skeleton and clear the container |

```js
const sk = new MTS.Skeleton('#loading', { variant: 'card' });
sk.destroy();
```

---

## Accessibility

- Skeletons are decorative; mark the loading region with `aria-busy="true"` and announce when content is ready,
  rather than relying on the placeholder alone.

---

## Changelog

### Initial
- Loading skeleton with text/circle/rect/card/list/table variants, configurable lines/rows/cols/items, pulse/wave/
  none animations, CSS-only bones, and `show` / `hide` / `destroy`.
