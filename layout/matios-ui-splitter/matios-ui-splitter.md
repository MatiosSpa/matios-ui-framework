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
<div id="split">
  <div>Left panel</div>
  <div>Right panel</div>
</div>
```

```js
new MTS.Splitter('#split', {
  direction:   'horizontal',
  initialSize: 30,
  minSize:     15,
  maxSize:     85,
  onChange: function (sizes) { console.log(sizes.firstSize + '% / ' + sizes.secondSize + '%'); },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `direction` | `string` | `'horizontal'` | Divider orientation: `'horizontal'` · `'vertical'` |
| `initialSize` | `number` | `50` | Initial size of the first panel (%) |
| `minSize` | `number` | `10` | Minimum % allowed per panel |
| `maxSize` | `number` | `90` | Maximum % allowed for the first panel |
| `collapsible` | `boolean` | `false` | Double-click the divider to collapse the panel |
| `gutterSize` | `string` | `'6px'` | Divider width/height in CSS |
| `onChange` | `function` | `null` | `({ sizes, firstSize, secondSize })` — fires while dragging |
| `onDragStart` | `function` | `null` | Fires when dragging starts |
| `onDragEnd` | `function` | `null` | `({ sizes })` — fires on release |

---

## API

| Method | Description |
|--------|-------------|
| `setSize(pct)` | Set the first panel size (%) |
| `getSizes()` | Returns `{ firstSize, secondSize }` (%) |
| `collapseFirst()` / `collapseSecond()` | Collapse a panel |
| `restore()` | Restore panels to the pre-collapse size |
| `destroy()` | Destroy the instance |

```js
const sp = new MTS.Splitter('#split', { initialSize: 30 });
sp.setSize(40);
sp.getSizes(); // → { firstSize, secondSize }
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onChange` | `{ sizes, firstSize, secondSize }` | While dragging |
| `onDragStart` | — | Drag starts |
| `onDragEnd` | `{ sizes }` | On release |

---

## Accessibility

- The divider is keyboard-operable (arrow keys resize); expose `role="separator"` with `aria-valuenow` for the
  first panel's size where the split conveys meaningful proportions.

---

## Notes

- The container needs a defined `height` when `direction: 'vertical'`.
- With `collapsible: true`, double-click toggles between collapse and restore.
- Panels resize via `flex-basis`; the container becomes `display: flex`.

---

## Changelog

### 2026-05-13
- Documentation homologated to the standard template.
