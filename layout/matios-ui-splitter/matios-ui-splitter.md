# MTS.Splitter

Two resizable panels separated by a draggable divider. The container must have exactly two direct children.

---

## Installation

```html
<link rel="stylesheet" href="layout/matios-ui-splitter/matios-ui-splitter.css">
<script src="layout/matios-ui-splitter/matios-ui-splitter.js"></script>
```

---

## Usage

```html
<div id="split-horizontal">
  <div>Left panel</div>
  <div>Right panel</div>
</div>
```

```js
const splitter = new MTS.Splitter('#split-horizontal', {
  direction: 'horizontal',
  initialSize: 40,
  minSize: 15,
  maxSize: 85,
  onChange: function (sizes) {
    console.log(sizes.firstSize, sizes.secondSize);
  },
});
```

The first argument is a CSS selector string or an `Element`. If the element is not found, or has fewer than two children, the instance does nothing (a message is logged to the console for the missing-children case).

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `direction` | `string` | `'horizontal'` | Divider orientation: `'horizontal'` \| `'vertical'` |
| `initialSize` | `number` | `50` | Initial size of the first panel (%) |
| `minSize` | `number` | `10` | Minimum % allowed (clamps the first panel's lower bound) |
| `maxSize` | `number` | `90` | Maximum % allowed for the first panel |
| `collapsible` | `boolean` | `false` | Enables double-click on the divider to toggle collapse/restore |
| `gutterSize` | `string` | `'6px'` | Divider width (horizontal) or height (vertical), as a CSS length |
| `onChange` | `function` | `null` | `function (sizes) {}` — fires continuously while dragging |
| `onDragStart` | `function` | `null` | `function () {}` — fires when a drag begins |
| `onDragEnd` | `function` | `null` | `function (sizes) {}` — fires when the drag is released |

`sizes` in every callback is the object returned by `getSizes()`: `{ firstSize, secondSize }`.

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `setSize(pct)` | `this` | Set the first panel size (%). The value is clamped to `[minSize, maxSize]` |
| `getSizes()` | `object` | Returns `{ firstSize, secondSize }` (%) |
| `collapseFirst()` | `this` | Collapse the first panel (first panel to 0%) |
| `collapseSecond()` | `this` | Collapse the second panel (first panel to 100%) |
| `restore()` | `this` | Restore panels to the size held before the last collapse |
| `destroy()` | `undefined` | Empty the container (clears the panels and divider) |

```js
const splitter = new MTS.Splitter('#split-horizontal', { initialSize: 30 });
splitter.setSize(40);
splitter.getSizes(); // → { firstSize: 40, secondSize: 60 }
splitter.collapseSecond();
splitter.restore();
```

---

## Callbacks

The component reports drag activity through the option callbacks below — there are no DOM events.

| Callback | Argument | When |
|----------|----------|------|
| `onChange` | `{ firstSize, secondSize }` | On every position update while dragging |
| `onDragStart` | — | When a drag begins (mouse or touch) |
| `onDragEnd` | `{ firstSize, secondSize }` | When the drag is released |

---

## Notes

- The container must have exactly two direct child elements; the divider is inserted between them at build time.
- Give the container a defined `height` when `direction: 'vertical'`; otherwise the vertical layout has no height to distribute.
- The container becomes `display: flex`; each panel's size is applied as a percentage `width` (horizontal) or `height` (vertical).
- With `collapsible: true`, double-clicking the divider toggles between collapsing the second panel and restoring the previous size.
- Dragging works with both mouse and touch.

---

## i18n

`MTS.Splitter` renders no user-facing chrome text at runtime, so no language setup is required for the component itself. The `MTS.Splitter` i18n namespace only carries strings for the demo page.

Language is controlled globally, once at startup, via the shared API:

```js
MTS.setLanguage('en'); // 'es' | 'en' | 'pt'
```

There is no per-instance `locale` option.
