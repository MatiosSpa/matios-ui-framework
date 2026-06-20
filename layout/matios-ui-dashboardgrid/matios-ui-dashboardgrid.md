# MTS.DashboardGrid

Interactive bento grid with drag-drop, a tray of available widgets, resize, and keyboard support.  
No external dependencies. Composed with `MTS.Grid` (class `mts-grid`).

---

## Installation

```html
<!-- Requires the grid base CSS -->
<link rel="stylesheet" href="layout/matios-ui-grid/matios-ui-grid.css">
<link rel="stylesheet" href="layout/matios-ui-dashboardgrid/matios-ui-dashboardgrid.css">
<script src="layout/matios-ui-dashboardgrid/matios-ui-dashboardgrid.js"></script>
```

---

## Basic usage

```js
var dg = new MTS.DashboardGrid('#my-dashboard', {
  columns:       8,
  rowHeight:     90,
  gap:           12,
  editable:      false,
  collisionMode: 'displace',
  items:          data.items,
  availableItems: data.availableItems,
  onWidgetsChange: function(layout) {
    // layout: [{ id, col, row, w, h }, ...]
    // Persist on the server
  }
});
```

### Pattern with an async dataSource

```js
function mockFetch() {
  return new Promise(function(resolve) {
    fetch('/api/dashboard/layout')
      .then(function(r) { return r.json(); })
      .then(function(data) { resolve(data); });
  });
}

mockFetch().then(function(data) {
  var dg = new MTS.DashboardGrid('#dashboard', {
    items:          data.items,
    availableItems: data.availableItems,
    onWidgetsChange: function(layout) {
      fetch('/api/dashboard/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(layout)
      });
    }
  });
});
```

---

## Constructor options

| Option | Type | Default | Description |
|---|---|---|---|
| `columns` | `number` | `12` | Number of grid columns |
| `rowHeight` | `number` | `80` | Height of each row in px |
| `gap` | `number` | `12` | Gap between cells in px |
| `editable` | `boolean` | `false` | Enables drag-drop, resize, and tray |
| `collisionMode` | `'displace' \| 'block'` | `'displace'` | Collision mode when moving |
| `emptyAreaMinHeight` | `number` | `0` | Min-height in px applied to the inner grid. Required when the grid can start empty (no items) so that dragging from the tray can register a drop. Without it, `_isOverGrid()` returns `false` because `rect.height = 0`. Suggested: `520`. |
| `accent` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| null` | `null` | Color of the decorative top stripe on each item. Visual identity of the dashboard provided by the grid (not by the widget content). |
| `items` | `Item[]` | `[]` | Active widgets in the grid |
| `availableItems` | `Item[]` | `[]` | Available widgets in the tray |
| `onWidgetsChange` | `function(layout)` | `null` | Callback when the layout changes |
| `onItemMounted` | `function(el, item)` | `null` | Callback invoked for each item AFTER injecting its `html` into the `__content`. The consumer uses this hook to activate declarative bindings (`data-mts-bind`), instantiate sub-components (`MTS.Chart`, `MTS.DataTable`), wire up listeners, etc. **Only the frontend runs this callback** — the backend never reaches this point because its HTML goes through `MTS.Sanitize` before being injected (the `<script>` tags and `on*` attributes are removed). |

---

## Item structure

```js
{
  id:     'sales',           // string — unique identifier
  col:    1,                 // starting column number (1-based)
  row:    1,                 // starting row number (1-based)
  w:      3,                 // width in columns
  h:      2,                 // height in rows
  title:  'Monthly sales',   // string — if present, it is rendered at the top as a title-bar
                             // (with padding + border-bottom). If null/empty, there is no title-bar.
                             // Also used for aria-label and in the tray.
  html:   '<div>...</div>',  // INNER content of the widget. Do NOT include the title here (the grid
                             // provides it via item.title). Do NOT wrap with Card/KpiCard — the grid
                             // already provides the box (bg + border + radius + content padding).
                             // Only the semantic "interior": text, numbers, charts, lists, etc.
                             // Sanitized with MTS.Sanitize if available.
  locked: false,             // if true: cannot be moved or removed
  minW:   1,                 // minimum width when resizing
  minH:   1,                 // minimum height when resizing
  maxW:   null,              // maximum width (no limit if null)
  maxH:   null               // maximum height (no limit if null)
}
```

### Resulting DOM structure

```html
<div class="mts-dashboardgrid__item">
  <div class="mts-dashboardgrid__title-bar">      <!-- only if item.title -->
    <div class="mts-dashboardgrid__title">{title}</div>
  </div>
  <div class="mts-dashboardgrid__content">
    {html}   <!-- injected via innerHTML (sanitized) -->
  </div>
</div>
```

The grid provides the widget "frame". The consumer only provides the semantic content.

### `onWidgetsChange` payload

It returns only the position and dimension properties, without the content:

```js
[
  { id: 'sales', col: 1, row: 1, w: 3, h: 2 },
  { id: 'users', col: 4, row: 1, w: 2, h: 1 },
  // ...
]
```

---

## Instance API

| Method | Description |
|---|---|
| `setItems(items)` | Replaces the grid widgets and re-renders |
| `setAvailableItems(items)` | Replaces the tray widgets |
| `setEditable(bool)` | Enables or disables edit mode |
| `getItems()` | Returns a snapshot of the layout `[{id, col, row, w, h}]` |
| `addItem(item)` | Adds a widget in the first free position |
| `removeItem(id)` | Removes a widget from the grid by id |
| `destroy()` | Cleans up listeners and empties the DOM |

---

## Collision modes

### `displace` (default)

When a widget is dropped onto another, the affected ones shift down automatically. Downward gravity: the fixed item stays; the rest are ordered top to bottom and pushed row++ until they no longer collide. The displacement is previewed with a CSS animation during the drag.

### `block`

When dragging over an occupied space, the placeholder turns red and the drop is rejected. The other widgets do not move.

---

## Operation modes

```
┌──────────────────────────────────────────────────────┐
│  editable: false (default)                           │
│  • View only                                         │
│  • Tray hidden                                       │
│  • No drag / resize / remove controls                │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  editable: true                                      │
│  • Drag handle visible on hover                      │
│  • × (remove) button top-right — sends to the tray   │
│  • Resize handle bottom-right                        │
│  • Side tray with available widgets                  │
│  • Drag from the tray with ghost portal              │
│  • Keyboard navigation (see below)                   │
└──────────────────────────────────────────────────────┘
```

---

## Accessibility — keyboard

| Key | Action |
|---|---|
| `Tab` | Navigate between widgets |
| `Enter` / `Space` on the drag handle | Activate keyboard mode |
| `←` `→` `↑` `↓` | Move the widget cell by cell |
| `Enter` / `Space` (in active mode) | Confirm the new position |
| `Escape` | Cancel — return to the original position |

Items with `locked: true` do not get a drag handle and do not participate in keyboard mode.

---

## Composition with MTS.Grid

The inner container (`.mts-dashboardgrid__grid`) receives the `mts-grid` class from the base framework, which sets `display: grid` and `grid-template-columns`. DashboardGrid overrides `grid-template-rows: unset` and adds `grid-auto-rows` for dynamic rows.

The position of each widget is managed with CSS custom properties:

```
--mts-dg-col  → grid-column-start
--mts-dg-row  → grid-row-start
--mts-dg-w    → grid-column span
--mts-dg-h    → grid-row span
```

Consistent pattern with `MTS.Grid._applyStyle()`. The CSS vars are updated only on commit — never during the drag. The displacement in `displace` mode is previewed via `transform: translate(dx, dy)` (GPU, no grid reflow), with a spring curve `cubic-bezier(0.34, 1.2, 0.64, 1)` for the floating effect while displacing and while returning.

---

## Customizable CSS variables

| Variable | Default | Description |
|---|---|---|
| `--mts-dg-row-height` | `80px` | Base row height (settable via `rowHeight`) |

---

## DOM structure

```
div.mts-dashboardgrid [.mts-dashboardgrid--editable]
  div.mts-dashboardgrid__grid.mts-grid
    div.mts-dashboardgrid__item [--mts-dg-col] [--mts-dg-row] [--mts-dg-w] [--mts-dg-h]
      div.mts-dashboardgrid__drag-handle        ← only if editable and not locked
        span.mts-dashboardgrid__drag-icon
      button.mts-dashboardgrid__remove-btn      ← only if editable and not locked
      div.mts-dashboardgrid__resize-handle      ← only if editable and not locked
      div.mts-dashboardgrid__title-bar          ← only if item.title
        div.mts-dashboardgrid__title
      div.mts-dashboardgrid__content
        <!-- widget html (semantic interior) -->
    div.mts-dashboardgrid__placeholder          ← present during drag
  aside.mts-dashboardgrid__tray                 ← visible only if editable
    div.mts-dashboardgrid__tray-title
    div.mts-dashboardgrid__tray-item            ← one per available widget
```

---

## Changelog

### 2026-05-11
- **DOM structure refactor**: each item is now rendered as
  `__item > [__title-bar > __title] + __content`. The `__title-bar` is included
  automatically when `item.title` is present. It provides padding +
  border-bottom (divider). Important note: `item.html` must contain
  **only the semantic interior** of the widget, **without** wrapping it with Card/KpiCard
  or with its own headers — the grid handles the visual wrapper.
- **New**: `accent: 'primary' | 'success' | 'warning' | 'danger' | 'info' | null` option —
  paints a 3px colored top stripe on each item, as the visual identity
  of the dashboard. Provided by the grid (not by the widget content).
- **New**: `onItemMounted(el, item)` option — callback invoked after
  injecting the `html` into each `__content`. The consumer uses this hook to
  activate declarative bindings (`data-mts-bind`), instantiate sub-components
  (`MTS.Chart`, `MTS.DataTable`), wire up listeners, etc. Only the frontend
  runs this callback — the backend HTML goes through `MTS.Sanitize` first,
  so `<script>` tags and `on*` attributes are removed.
- **New**: `emptyAreaMinHeight` option — applies `min-height` to the inner grid
  when it starts empty. Fixes a bug where `_isOverGrid()` returned `false`
  because `rect.height = 0`, preventing any drop from the tray. Use
  case: the user's first login.
- `.mts-dashboardgrid__content` is now a flex-column with `flex: 1 1 auto`
  to take all the available height of the item. Fixes a bug where the content
  was compacted at the top when resizing the height.

### 2026-05-13
- **JS**: migration `var` → `const`/`let` across the whole file
- **JS**: entry animation when dropping a widget from the tray — fade + scale 180ms ease-out (`--entering`)
- **CSS**: duplicate `.mts-dashboardgrid__content` block unified into one
- **Doc**: fixed a factual error in the "Composition with MTS.Grid" section (grid-column/row → transform)
- **Doc**: removed an obsolete changelog note about versioning

### 2026-05-09 — Initial release
- Drag-move, drag-from-tray with ghost portal, resize
- Collision modes: `displace` (gravity ↓) and `block` (rejection with red placeholder)
- Animated preview of the displacement during drag
- Keyboard a11y: Tab → Enter/Space → arrows → Enter/Escape
- `onWidgetsChange` emits only `[{id, col, row, w, h}]`
- Items with `locked: true` do not participate in editing
- `setItems()`, `setAvailableItems()`, `setEditable()`, `getItems()`, `addItem()`, `removeItem()`, `destroy()`
```