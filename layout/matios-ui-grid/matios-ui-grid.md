# MTS.Grid

CSS Grid utilities for structural page layout. Distributes content blocks across columns, rows and responsive spans without styling the inner component. An optional thin JavaScript helper (`MTS.Grid`) renders the exact same CSS classes — it does not create a separate layout system.

---

## Installation

```html
<link rel="stylesheet" href="base/matios-ui-base.css">
<link rel="stylesheet" href="base/matios-ui-grid.css">
```

The classes above are all you need for CSS-only usage. The optional JavaScript helper adds a small builder on top of the same classes:

```html
<script src="utilities/matios-ui-sanitize/matios-ui-sanitize.js"></script>
<script src="layout/matios-ui-grid/matios-ui-grid.js"></script>
```

The helper uses `MTS.Sanitize.html()` when it is present to sanitize `html` item content; if `MTS.Sanitize` is not loaded, the raw HTML string is used as-is.

---

## Usage

### CSS only

```html
<div class="mts-grid mts-grid--gap-md">
  <div class="mts-g-col-8">Main content</div>
  <div class="mts-g-col-4">Sidebar</div>
</div>
```

### Responsive

```html
<div class="mts-grid mts-grid--gap-md">
  <div class="mts-g-col-12 mts-g-col-md-6 mts-g-col-lg-4">A</div>
  <div class="mts-g-col-12 mts-g-col-md-6 mts-g-col-lg-4">B</div>
  <div class="mts-g-col-12 mts-g-col-md-12 mts-g-col-lg-4">C</div>
</div>
```

### Row spans (set `--mts-rows`)

```html
<div class="mts-grid mts-grid--gap-md" style="--mts-rows: 3;">
  <div class="mts-g-col-6 mts-g-row-2">Tall block</div>
  <div class="mts-g-col-6">Right top</div>
  <div class="mts-g-col-6">Right middle</div>
  <div class="mts-g-col-full">Full row</div>
</div>
```

### JavaScript helper

```js
const grid = new MTS.Grid('#grid-js-runtime', {
  className: 'mts-grid--gap-md',
  items: [
    {
      col: 8,
      html: '<div class="demo-grid-outline">Main — col 8</div>'
    },
    {
      col: 4,
      html: '<div class="demo-grid-outline">Sidebar — col 4</div>'
    },
    {
      full: true,
      html: '<div class="demo-grid-outline">Footer — full width</div>'
    }
  ]
});
```

---

## JavaScript API

### Constructor

```js
new MTS.Grid(selector, options)
```

- `selector` — a CSS selector string or an element. If it is a string, it is resolved with `document.querySelector`. If the element is not found, the constructor logs an error and returns without rendering.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `className` | string | `''` | Extra class(es) appended to the generated `.mts-grid` container (e.g. `mts-grid--gap-md`). |
| `style` | string \| object | `null` | Inline style for the container. A string is set via `cssText`; an object sets each key with `setProperty` (useful for CSS variables such as `--mts-rows`). |
| `items` | array | `[]` | Array of item descriptors (see below). |

### Item descriptor

Each entry in `items` produces one child element:

| Key | Type | Result |
|-----|------|--------|
| `tag` | string | Element tag name (default `div`). |
| `className` | string | Extra class(es) on the item. |
| `col` | number | Adds `mts-g-col-{col}`. |
| `row` | number | Adds `mts-g-row-{row}`. |
| `start` | number | Adds `mts-g-start-{start}`. |
| `rowStart` | number | Adds `mts-g-row-start-{rowStart}`. |
| `full` | boolean | Adds `mts-g-col-full`. |
| `auto` | boolean | Adds `mts-g-col-auto`. |
| `self` | string | Adds `mts-g-self-{self}` (`start` \| `center` \| `end` \| `stretch`). |
| `sm` \| `md` \| `lg` \| `xl` | number | Adds `mts-g-col-{bp}-{value}`. |
| `startSM` \| `startMD` \| `startLG` \| `startXL` | number | Adds `mts-g-start-{bp}-{value}`. |
| `style` | string \| object | Inline style for the item (same rules as the container `style`). |
| `html` | string | Sets `innerHTML` (sanitized via `MTS.Sanitize.html()` when available). |
| `text` | string | Sets `textContent`. Ignored if `html` is provided. |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `render()` | this | Clears the mount and rebuilds the grid from `options`. Called automatically by the constructor. |
| `setItems(items)` | this | Replaces `options.items` (non-arrays become `[]`) and re-renders. |
| `appendItem(item)` | this | Pushes one item and appends it to the existing grid without a full re-render. |
| `clear()` | this | Empties the mount element and drops the internal root reference. |
| `destroy()` | this | Alias for `clear()`. |

There are no events and no `getConfig()` / `getCode()` methods.

---

## CSS Classes

### Container

| Class | Description |
|-------|-------------|
| `mts-grid` | Main grid container (12 columns, 1 row, `1rem` gap by default). |
| `mts-grid--no-gap` | Removes the gap. |
| `mts-grid--gap-xs` / `--gap-sm` / `--gap-md` / `--gap-lg` / `--gap-xl` | Gap scale (4 / 8 / 16 / 24 / 32 px). |
| `mts-grid--center` / `--start` / `--end` / `--stretch` | `align-items` for all items. |
| `mts-grid--justify-center` / `--justify-end` | `justify-items` for all items. |

### Columns and rows

| Class | Description |
|-------|-------------|
| `mts-g-col-1` … `mts-g-col-12` | Column span (1–12). |
| `mts-g-col-full` | Full width (`1 / -1`). |
| `mts-g-col-auto` | Auto width. |
| `mts-g-row-1` … `mts-g-row-6` | Row span (1–6). |
| `mts-g-start-1` … `mts-g-start-12` | Start at a column line (1–12). |
| `mts-g-row-start-1` … `mts-g-row-start-4` | Start at a row line (1–4). |

### Item utilities

| Class | Description |
|-------|-------------|
| `mts-g-center` | Centers the item's content (flex center). |
| `mts-g-self-start` / `--center` / `--end` / `--stretch` | `align-self` on the cross axis. |

### Layout shortcuts

| Class | Description |
|-------|-------------|
| `mts-grid--2` / `--3` / `--4` | 2 / 3 / 4 equal columns. |
| `mts-grid--sidebar` | Sidebar (1/4) + content (3/4). |
| `mts-grid--sidebar-right` | Content (3/4) + sidebar (1/4). |
| `mts-grid--auto-fill` | `auto-fill` columns of `minmax(--mts-col-min, 1fr)`. |
| `mts-grid--auto-fit` | `auto-fit` columns of `minmax(--mts-col-min, 1fr)`. |

### Responsive prefixes

Each breakpoint adds `min-width` variants of the column-span and start classes.

| Breakpoint | Column span | Full width | Start |
|------------|-------------|------------|-------|
| `576px` | `mts-g-col-sm-1` … `-12` | `mts-g-col-sm-full` | `mts-g-start-sm-1` … `-6` |
| `768px` | `mts-g-col-md-1` … `-12` | `mts-g-col-md-full` | `mts-g-start-md-1` … `-8` |
| `992px` | `mts-g-col-lg-1` … `-12` | `mts-g-col-lg-full` | `mts-g-start-lg-1` … `-9` |
| `1200px` | `mts-g-col-xl-1` … `-12` | `mts-g-col-xl-full` | `mts-g-start-xl-1` … `-10` |

---

## CSS Variables

Set these on the `.mts-grid` container (via inline `style` or a class).

| Variable | Default | Description |
|----------|---------|-------------|
| `--mts-columns` | `12` | Number of columns. |
| `--mts-rows` | `1` | Number of rows (needed for `mts-g-row-*` spans). |
| `--mts-gap` | `1rem` | Horizontal and vertical gap. |
| `--mts-col-gap` | — | Horizontal gap only (overrides `--mts-gap`). |
| `--mts-row-gap` | — | Vertical gap only (overrides `--mts-gap`). |
| `--mts-col-min` | `200px` | Minimum column width for `--auto-fill` / `--auto-fit`. |

---

## i18n

`MTS.Grid` has **no localizable runtime strings**. It only builds layout containers from developer-supplied content, so nothing in `matios-ui-grid.js` is user-facing chrome.

The `matios-ui-grid-i18n.js` file registers the `MTS.Grid` namespace with `demo.*` keys (es / en / pt) that are used **only by `demo.html`** — they are not read by the component at runtime. No per-instance `locale` option exists; language is a global setting via `MTS.setLanguage()`.

---

## Notes

- Use `MTS.Grid` for general page layout. For forms, use `MTS.FormLayout`.
- Demos may use the dashed-outline helpers (`.demo-grid-outline`, `.demo-grid-outline--tall`) from `support/demo-shared.css` to visualize cell boundaries; these are not part of the grid API.
